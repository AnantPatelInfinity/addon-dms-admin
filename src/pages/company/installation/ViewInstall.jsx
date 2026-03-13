import React, { useState, useEffect } from 'react'
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import { getStatusBadge } from '../../../config/setup';
import { downloadCompanyInstallation, getComOneInstallationList, resetCompanyInstallationApprove, resetDownloadInstallation, verifyCompanyInstallation } from '../../../middleware/companyUser/comInstallation/comInstallation';
import ImageModal from '../../../components/ImageModal/ImageModal';
import InstallSection from '../../../components/Company/InstallationSection/InstallSection';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert/ErrorAlert';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ViewInstall = () => {

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
    companyInstallationOneList,
    companyInstallationOneListError,
    companyInstallationOneListLoading,

    companyInstallationApproveError,
    companyInstallationApproveMessage,

    downloadInstallation,
    downloadInstallationLoading,
    downloadInstallationError,
    downloadInstallationMessage,
  } = useSelector((state) => state?.companyInstallation);

  useEffect(() => {
    if (companyInstallationApproveMessage) {
      toast.success(companyInstallationApproveMessage);
      dispatch(resetCompanyInstallationApprove());
      fetchData();
    }
    if (companyInstallationApproveError) {
      toast.error(companyInstallationApproveError);
      dispatch(resetCompanyInstallationApprove());
    }
  }, [companyInstallationApproveError, companyInstallationApproveMessage]);

  useEffect(() => {
    if (downloadInstallation?.pdfUrl) {
      window.open(downloadInstallation.pdfUrl, '_blank');
    }
    if (downloadInstallationMessage) {
      toast.success(downloadInstallationMessage);
      dispatch(resetDownloadInstallation());
    }
    if (downloadInstallationError) {
      toast.error(downloadInstallationError);
      dispatch(resetDownloadInstallation());
    }
  }, [downloadInstallation?.pdfUrl, downloadInstallationMessage, downloadInstallationError]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    dispatch(getComOneInstallationList(formData, data));
  }

  const handleDownload = (installId, dealerId) => {
    dispatch(downloadCompanyInstallation({ isDealer: !!dealerId }, installId))
  }

  const handleStatusUpdate = async (elem, status) => {
    if (status === 2) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to approve this Installation?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const formData = new URLSearchParams();
        formData.append("status", status);
        formData.append("rejectReason", "");
        dispatch(verifyCompanyInstallation(formData, elem?._id));
      }
    } else if (status === 3) {
      const { value: rejectReason } = await Swal.fire({
        title: 'Reject Installation',
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
        dispatch(verifyCompanyInstallation(formData, elem?._id));
      }
    }
  }

  if (companyInstallationOneListLoading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner text="" size='md' />
      </div>
    );
  }

  if (companyInstallationOneListError) {
    return (
      <div className="container-fluid py-4">
        <ErrorAlert
          message={companyInstallationOneListError || "Failed to load installation details"}
          onRetry={() => {
            const formData = new URLSearchParams();
            formData.append("companyId", companyStorage?.comId);
            dispatch(getComOneInstallationList(formData, data));
          }}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <BreadCrumbs
            crumbs={[
              { label: "Installation List", to: COMPANY_URLS.INSTALL_LIST },
              { label: `View Installation Details` },
            ]}
          />

          <div className="card shadow-sm border-0">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <h4 className="page-title">
                    View Installation Details
                  </h4>
                </div>
                <div className="col-lg-8 col-md-6 col-12 text-end">
                  <span className="badge bg-success me-2">Report No: {companyInstallationOneList?.reportNo || 'N/A'}</span>
                  {getStatusBadge(parseInt(companyInstallationOneList?.status))}
                </div>
              </div>
            </div>

            <div className="card-body">
              <InstallSection companyInstallationOneList={companyInstallationOneList} openImageModal={openImageModal} />
            </div>

            <div className="card-footer bg-white border-top">
              <div className="d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => handleDownload(companyInstallationOneList._id, companyInstallationOneList?.dealerId)}
                  >
                    {downloadInstallationLoading ? (
                      <>
                        <i className="ti ti-loader text-primary me-1" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-arrow-down text-primary me-1" />
                        Download Installation
                      </>
                    )}
                  </button>
                  {companyInstallationOneList?.status === 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => handleStatusUpdate(companyInstallationOneList, 2)}
                    >
                      <i className="fe fe-check-circle text-success" /> Approve
                    </button>
                  )}
                  {companyInstallationOneList?.status === 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleStatusUpdate(companyInstallationOneList, 3)}
                    >
                      <i className="fa-solid fa-xmark text-danger" /> Rejected
                    </button>
                  )}
                </div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  <i className="fas fa-arrow-left me-2"></i> Back to Installation List
                </button>
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

export default ViewInstall