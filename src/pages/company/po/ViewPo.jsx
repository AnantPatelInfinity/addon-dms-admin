import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import { getPoStatusBadge } from '../../../config/setup';
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { useDispatch, useSelector } from 'react-redux';
import { approveCompanyPo, downloadCompanyPo, getCompanyOnePoList, getCompanyPoItemsList, manageCompanyInvoice, resetCompanyPoDownload } from '../../../middleware/companyUser/companyPo/companyPo';
import DateTime from '../../../helpers/DateFormat/DateTime';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { DX_URL } from '../../../config/baseUrl';
import PoData from '../../../components/Company/Po/PoData';
import { toast } from 'react-toastify';
import axios from 'axios';
import { companyInvoiceReset, companyPoApproveReset } from '../../../slices/company/companyPo.slice';
import Swal from 'sweetalert2';

const ViewPo = () => {

  const companyStorage = getCompanyStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const [modalState, setModalState] = useState({
    isOpen: false,
    imageUrl: '',
    altText: '',
    title: ''
  });
  const [documents, setDocuments] = useState({
    companyInvoice: "",
    companyDispatchDetails: "",
  });
  const [disable, setDisable] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [hasSerialError, setHasSerialError] = useState(false);

  const openImageModal = (imageUrl, altText, title = 'Image Preview') => {
    setModalState({
      isOpen: true,
      imageUrl,
      altText,
      title
    });
  };

  const closeImageModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const {
    companyOnePoList,
    companyOnePoListError,
    companyOnePoListLoading,

    companyPoItemsList,
    companyPoItemsListError,
    companyPoItemsListLoading,

    companyInvoiceLoading,
    companyInvoiceMessage,
    companyInvoiceError,

    companyPoApproveMessage,
    companyPoApproveError,

    companyPoDownload,
    companyPoDownloadLoading,
    companyPoDownloadError,
    companyPoDownloadMessage,
  } = useSelector((state) => state?.companyPo);

  useEffect(() => {
    if (companyPoDownload?.file) {
      window.open(companyPoDownload.file, "_blank")
    }
    if (companyPoDownloadMessage) {
      toast.success(companyPoDownloadMessage);
      dispatch(resetCompanyPoDownload());
    }
    if (companyPoDownloadError) {
      toast.error(companyPoDownloadError);
      dispatch(resetCompanyPoDownload());
    }
  }, [companyPoDownload?.file, companyPoDownloadMessage, companyPoDownloadError]);

  useEffect(() => {
    if (companyPoApproveMessage) {
      Swal.fire('Success!', 'PO status updated successfully.', 'success');
      fetchData();
      fetchPoItems();
      dispatch(companyPoApproveReset());
    }
    if (companyPoApproveError) {
      Swal.fire('Error!', companyPoApproveError || 'Something went wrong.', 'error');
      dispatch(companyPoApproveReset());
    }
  }, [companyPoApproveMessage, companyPoApproveError]);

  useEffect(() => {
    if (companyInvoiceMessage) {
      toast.success(companyInvoiceMessage);
      fetchData();
      fetchPoItems();
      dispatch(companyInvoiceReset())
      setDocuments({
        companyInvoice: "",
        companyDispatchDetails: "",
      });
    }
    if (companyInvoiceError) {
      toast.error(companyInvoiceError);
      dispatch(companyInvoiceReset())
    }
  }, [companyInvoiceMessage, companyInvoiceError])

  useEffect(() => {
    if (companyPoItemsList?.length > 0) {
      setProductsData(companyPoItemsList || []);
    }
  }, [companyPoItemsList])

  useEffect(() => {
    fetchData();
    fetchPoItems();
  }, []);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    dispatch(getCompanyOnePoList(formData, data));
  }

  const fetchPoItems = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    formData.append("poId", data);
    dispatch(getCompanyPoItemsList(formData))
  }

  const handleImgChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload only images (JPEG, PNG) or PDF files');
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append("image", file);

    try {
      setDisable(true);
      const response = await axios.post(`${DX_URL}/upload-image`, uploadForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const { success, data: resData, message } = response?.data
      if (success) {
        const uploadedUrl = resData?.image || resData?.pdf || "";
        toast.success(message);
        setDocuments(prev => ({
          ...prev,
          [field]: uploadedUrl
        }));
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setDisable(false);
    }
  };

  const handleSubmit = () => {
    const hasMissingSerial = productsData?.some(
      (item) =>
        item?.companySerialNo === undefined ||
        item?.companySerialNo === null ||
        item?.companySerialNo?.toString().trim() === ""
    );
    setHasSerialError(hasMissingSerial);
    if (hasMissingSerial) {
      toast.error("Please enter Serial No. for all products before submitting.");
      return;
    }
    if (!companyOnePoList?.companyInvoice && !documents.companyInvoice) {
      toast.error("Please upload the Company Invoice before submitting.");
      return;
    }
    // if (!companyOnePoList?.companyDispatchDetails && !documents.companyDispatchDetails) {
    //   toast.error("Please upload the Dispatch Details Invoice before submitting.");
    //   return;
    // }
    
    const updatedProducts = productsData?.map((pro) => ({
      _id: pro?._id,
      companySerialNo: pro?.companySerialNo,
    }));
    
    const dynProducts = productsData.map((pro) => ({
      dongle: pro?.productAttributes?.dongle || "",        
      batterySNo: pro?.productAttributes?.batterySNo || [
        pro?.productAttributes?.["battery-s-no-1"] || "",
        pro?.productAttributes?.["battery-s-no-2"] || "",
      ],
      powerBox: pro?.productAttributes?.powerBox || "",
      dock: pro?.productAttributes?.dock || "",
      smps: pro?.productAttributes?.smps || "",
    }));

    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    formData.append("firmId", companyStorage.firmId);
    formData.append("companyInvoice", documents.companyInvoice || companyOnePoList?.companyInvoice);
    if (documents.companyDispatchDetails || companyOnePoList?.companyDispatchDetails) {
      formData.append("companyDispatchDetails", documents.companyDispatchDetails || companyOnePoList?.companyDispatchDetails);
    }
    formData.append("products", JSON.stringify(updatedProducts));
    formData.append("productAttributes", JSON.stringify(dynProducts));
    dispatch(manageCompanyInvoice(formData, data));
  }

  const renderDocumentPreview = (documentUrl, altText, title) => {
    if (!documentUrl) return null;
    const isPdf = documentUrl.toLowerCase().endsWith('.pdf');
    return isPdf ? (
      <div
        onClick={() => openImageModal(documentUrl, altText, title)}
        className="pdf-preview mb-2"
        style={{ cursor: 'pointer', maxHeight: '120px', overflow: 'hidden' }}
      >
        <i className="fas fa-file-pdf fa-4x text-danger"></i>
        <p className="text-muted mb-0">PDF Document</p>
      </div>
    ) : (
      <img
        onClick={() => openImageModal(documentUrl, altText, title)}
        src={documentUrl}
        alt={altText}
        className="img-fluid mb-2 img-show"
        style={{ maxHeight: '120px', cursor: 'pointer' }}
      />
    );
  };

  const handleDownload = (poId) => {
    dispatch(downloadCompanyPo(poId))
  }

  const handleStatusUpdate = async (status) => {
    if (status === 2) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to approve this PO?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
      });
      if (result.isConfirmed) {
        const formData = new URLSearchParams();
        formData.append("status", status);
        formData.append("rejectReason", "");
        dispatch(approveCompanyPo(formData, companyOnePoList?._id));
      }
    } else if (status === 3) {
      const { value: rejectReason } = await Swal.fire({
        title: 'Reject PO',
        input: 'textarea',
        inputLabel: 'Reason for Rejection',
        inputPlaceholder: 'Type the reason here...',
        inputAttributes: {
          'aria-label': 'Reason for rejection'
        },
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Rejection reason is required!';
          }
        }
      });

      if (rejectReason) {
        const formData = new URLSearchParams();
        formData.append("status", status);
        formData.append("rejectReason", rejectReason);
        dispatch(approveCompanyPo(formData, companyOnePoList?._id));
      }
    }
  };

  if (companyOnePoListLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Purchase Order details...</p>
      </div>
    );
  }

  if (companyOnePoListError) {
    return (
      <div className="row">
        <div className="col-md-12">
          <BreadCrumbs
            crumbs={[
              { label: "PO List", to: COMPANY_URLS.PO_LIST },
              { label: `View PO Details` },
            ]}
          />
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {companyOnePoListError}
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(COMPANY_URLS.PO_LIST)}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!companyOnePoList) {
    return (
      <div className="row">
        <div className="col-md-12">
          <BreadCrumbs
            crumbs={[
              { label: "Dealer PO List", to: COMPANY_URLS.PO_LIST },
              { label: `View Dealer PO Details` },
            ]}
          />
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            No Purchase Order data available
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(COMPANY_URLS.PO_LIST)}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <BreadCrumbs
            crumbs={[
              { label: "PO List", to: COMPANY_URLS.PO_LIST },
              { label: `View PO Details` },
            ]}
          />

          <div className="card shadow-sm border-0">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <h4 className="page-title">
                    View PO Details
                  </h4>
                </div>
                <div className="col-lg-8 col-md-6 col-12 text-end">
                  {/* <span className="badge bg-primary me-2">PO No: {proObj.poNo || 'N/A'}</span> */}
                  <span className="badge bg-success me-2">Order No: {companyOnePoList?.voucherNo || 'N/A'}</span>
                  {getPoStatusBadge(parseInt(companyOnePoList?.status))}
                </div>
              </div>
            </div>

            <div className="card-body">
              <PoData
                companyOnePoList={companyOnePoList}
                companyPoItemsListError={companyPoItemsListError}
                companyPoItemsListLoading={companyPoItemsListLoading}
                productsData={productsData}
                setProductsData={setProductsData}
                hasSerialError={hasSerialError}
              />

              <div className="row">
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-light-subtle">
                      <h6 className="mb-0 fw-semibold">Attatchment</h6>
                    </div>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                      {companyOnePoList?.signature ? (
                        <>
                          {renderDocumentPreview(
                            companyOnePoList.signature,
                            'Signature',
                            'Document Preview'
                          )}
                        </>
                      ) : (
                        <p className="text-muted mb-0">No attatchment available</p>
                      )}
                    </div>
                  </div>
                </div>

                {companyOnePoList?.adminInvoice && (
                  <>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-light-subtle">
                          <h6 className="mb-0 fw-semibold">Admin Invoice</h6>
                          <small className="text-muted">Original Invoice / E-Way Bill</small>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                          {renderDocumentPreview(
                            companyOnePoList.adminInvoice,
                            'Admin Invoice',
                            'Document Preview'
                          )}
                          <p className="text-muted mb-0 text-center small">
                            <DateTime value={companyOnePoList?.adminInvoiceDate} format='dateTime' />
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {[4, 5, 6, 7].includes(companyOnePoList?.status) && (
                  <>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-light-subtle">
                          <h6 className="mb-0 fw-semibold">Company Invoice</h6>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                          {companyOnePoList?.companyInvoice ? (
                            <>
                              {renderDocumentPreview(
                                companyOnePoList.companyInvoice,
                                'Company Invoice',
                                'Document Preview'
                              )}
                              <p className="text-muted mb-0 text-center small">
                                <DateTime value={companyOnePoList?.companyInvoiceDate} format='dateTime' />
                              </p>
                              <label className="btn btn-sm btn-outline-primary my-2" style={{ cursor: disable ? 'not-allowed' : 'pointer' }}>
                                Change File
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="d-none"
                                  onChange={(e) => handleImgChange(e, 'companyInvoice')}
                                  disabled={disable}
                                />
                              </label>
                              {documents.companyInvoice && renderDocumentPreview(documents.companyInvoice, 'Updated Company Invoice', 'Preview')}
                            </>
                          ) : (
                            <>
                              <p className="text-muted mb-2 small">No company invoice available</p>
                              <label className="btn btn-sm btn-outline-primary mb-2" style={{ cursor: disable ? 'not-allowed' : 'pointer' }}>
                                Choose File
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="d-none"
                                  onChange={(e) => handleImgChange(e, 'companyInvoice')}
                                  disabled={disable}
                                />
                              </label>
                              {documents.companyInvoice && renderDocumentPreview(documents.companyInvoice, 'Company Invoice', 'Preview')}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-light-subtle">
                          <h6 className="mb-0 fw-semibold">Dispatch Details</h6>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                          {companyOnePoList?.companyDispatchDetails ? (
                            <>
                              {renderDocumentPreview(
                                companyOnePoList.companyDispatchDetails,
                                'Dispatch Details',
                                'Document Preview'
                              )}
                              <label className="btn btn-sm btn-outline-primary my-2" style={{ cursor: disable ? 'not-allowed' : 'pointer' }}>
                                Change File
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="d-none"
                                  onChange={(e) => handleImgChange(e, 'companyDispatchDetails')}
                                  disabled={disable}
                                />
                              </label>
                              {documents.companyDispatchDetails && renderDocumentPreview(documents.companyDispatchDetails, 'Updated Dispatch Details', 'Preview')}
                            </>
                          ) : (
                            <>
                              <p className="text-muted mb-2 small">No dispatch details available</p>
                              <label className="btn btn-sm btn-outline-primary mb-2" style={{ cursor: disable ? 'not-allowed' : 'pointer' }}>
                                Choose File
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="d-none"
                                  onChange={(e) => handleImgChange(e, 'companyDispatchDetails')}
                                  disabled={disable}
                                />
                              </label>
                              {documents.companyDispatchDetails && renderDocumentPreview(documents.companyDispatchDetails, 'Dispatch Details', 'Preview')}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}


              </div>
            </div>

            <div className="card-footer">
              <div className="d-flex justify-content-between w-100">
                {/* LEFT SIDE BUTTONS */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleDownload(companyOnePoList._id)}
                  >
                    {companyPoDownloadLoading ? (
                      <>
                        <i className="ti ti-loader text-primary me-1" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-arrow-down text-primary me-1" />
                        Download PO
                      </>
                    )}
                  </button>

                  {companyOnePoList?.status === 1 && (
                    <>
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={() => handleStatusUpdate(2)}
                      >
                        <i className="fe fe-check-circle text-success" /> Approve
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => handleStatusUpdate(3)}
                      >
                        <i className="fa-solid fa-xmark text-danger" /> Reject
                      </button>
                    </>
                  )}
                </div>

                {/* RIGHT SIDE BUTTONS */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fas fa-arrow-left me-2"></i> Back to PO List
                  </button>

                  {companyOnePoList?.adminInvoiceDate && (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSubmit}
                      disabled={disable || companyInvoiceLoading}
                    >
                      {disable || companyInvoiceLoading ? (
                        <div
                          className="spinner-border spinner-border-sm text-light"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ImageModal
        isOpen={modalState.isOpen}
        imageUrl={modalState.imageUrl}
        altText={modalState.altText}
        title={modalState.title}
        onClose={closeImageModal}
      />
    </div>
  )
}

export default ViewPo