import React, { useEffect, useState } from 'react'
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs'
import ADMIN_URLS from '../../../../config/routesFile/admin.routes'
import { useApi } from '../../../../context/ApiContext';
import { useNavigate, useParams } from 'react-router';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import { getPoStatusBadge, getStatusBadge } from '../../../../config/setup';
import DateTime from '../../../../helpers/DateFormat/DateTime';
import ImageModal from '../../../../components/ImageModal/ImageModal';
import ImageUpload from '../../../../components/Admin/ImageUpload/ImageUpload';
import { toast } from 'react-toastify';
import FileViewerModal from '../../../../components/ImageModal/FileViewerModal';
import BillToPart from '../../../../components/Admin/PO/ViewPoPages/BillToPart';
import PoItems from '../../../../components/Admin/PO/ViewPoPages/PoItems';
import CompanyInvoice from '../../../../components/Admin/PO/ViewPoPages/CompanyInvoice';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import Swal from 'sweetalert2';

const ViewPo = () => {

    const { get, post } = useApi();
    const navigate = useNavigate();
    const { id } = useParams();
    const [proObj, setProObj] = useState(null);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const adminStorage = getAdminStorage();
    const [modalState, setModalState] = useState({
        isOpen: false,
        fileUrl: '',
        altText: '',
        title: '',
        isPdf: false
    });
    const [documents, setDocuments] = useState({
        invoiceOriginal: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [showChangeForm, setShowChangeForm] = useState(false);
    const [isDownload, setIsDownload] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);

    const openFileModal = (fileUrl, altText, title = 'File Preview', isPdf = false) => {
        setModalState({
            isOpen: true,
            fileUrl,
            altText,
            title,
            isPdf
        });
    };

    const closeFileModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const isPdfFile = (url) => {
        return url?.toLowerCase().endsWith('.pdf');
    };

    const renderFilePreview = (fileUrl, altText, title, className = '', style = {}) => {
        if (isPdfFile(fileUrl)) {
            return (
                <div
                    className={`pdf-preview ${className}`}
                    style={style}
                    onClick={() => openFileModal(fileUrl, altText, title, true)}
                >
                    <i className="far fa-file-pdf fa-3x text-danger"></i>
                    <div className="mt-2">View PDF</div>
                </div>
            );
        } else {
            return (
                <img
                    onClick={() => openFileModal(fileUrl, altText, title)}
                    src={fileUrl}
                    alt={altText}
                    className={`img-thumbnail img-show ${className}`}
                    style={style}
                />
            );
        }
    };

    useEffect(() => {
        if (loading === true) {
            getPoData();
            getItemsData();
        }
    }, [loading]);

    const getPoData = async () => {
        try {
            setLoading(true)
            const response = await get(`/admin/get-po/${id}?firmId=${adminStorage.DX_AD_FIRM}&isDealer=${false}`);
            const { data, success } = response;
            if (success) {
                setProObj(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getItemsData = async () => {
        try {
            const url = `/admin/get-po-items?poId=${id}`
            const result = await get(url);
            const { success, data } = result
            if (success) {
                setItems(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDocumentChange = (field, value) => {
        setDocuments(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitDocuments = async () => {
        if (!documents.invoiceOriginal) {
            toast.warning('Please upload the document');
            return;
        }
        try {
            setSubmitting(true);
            const payload = {
                adminInvoice: documents.invoiceOriginal,
            };

            const response = await post(`/admin/po-invoice-upload/${id}`, payload);
            if (response.success) {
                toast.success('Documents uploaded successfully');
                getPoData();
                setShowChangeForm(false);
            } else {
                toast.error(response.message || 'Failed to upload documents');
            }
        } catch (error) {
            console.error('Error submitting documents:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePoDownload = async () => {
        try {
            setIsDownload(true);
            const response = await get(`/admin/download-po-invoice/${id}`);
            const { data, success, message } = response
            if (success) {
                window.open(data?.file, "_blank")
                toast.success(message)
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsDownload(false);
        }
    }

    const handleDownload = async () => {
        let toastId;
        try {
            setDownloadingId(id);
            toastId = toast.loading('Downloading invoice summary...');
            const response = await get(`/admin/download-invoice-summary/${id}`);
            const { url } = response?.data
            if (url) {
                toast.update(toastId, {
                    render: 'Download started successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000
                });
                window.open(url, '_blank');
            } else {
                throw new Error('Download URL not found in response');
            }
        } catch (error) {
            console.error('Download error:', error);
            if (toastId) {
                toast.dismiss(toastId);
            }
            toast.error(error?.response?.data?.message || 'Failed to download invoice summary');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleReceiveProduct = async () => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to receive ${proObj.voucherNo}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, receive it!"
        });
        if (confirmResult.isConfirmed) {
            try {
                const response = await post(`/admin/receive-po-product/${proObj?._id}`)
                if (response.success) {
                    Swal.fire("Received!", `${proObj.voucherNo} has been received.`, "success");
                    setLoading(true)
                } else {
                    Swal.fire("Error!", response.message || "Failed to delete customer.", "error");
                }
            } catch (error) {
                Swal.fire("Error!", error?.response?.data?.message || "Something went wrong while receiving.", "error");
            }
        }
    }

    const handleChangeInvoice = () => {
        setShowChangeForm(true);
        setDocuments({ invoiceOriginal: '' }); // Reset the document field
    };

    const handleCancelChange = () => {
        setShowChangeForm(false);
        setDocuments({ invoiceOriginal: '' }); // Reset the document field
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs crumbs={[
                    { label: "PO List", to: ADMIN_URLS.PO_LIST },
                    { label: `View PO Details` },
                ]} />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-12">
                                <h4 className="page-title">
                                    View PO Details
                                </h4>
                            </div>
                            <div className="col-lg-8 col-md-8 col-12 text-end">
                                <span className="badge bg-primary me-2">PO No: {proObj?.poNo || 'N/A'}</span>
                                <span className="badge bg-success me-2">Order No: {proObj?.voucherNo || 'N/A'}</span>
                                {proObj && getPoStatusBadge(parseInt(proObj?.status))}
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <div className="text-center">
                                <LoadingSpinner text='' size='md' />
                            </div>
                        ) : (
                            <>
                                <BillToPart proObj={proObj} renderFilePreview={renderFilePreview} />

                                {proObj?.status !== 1 && (
                                    <div className='card mb-4'>
                                        {/* CUSTOMER AND DEALER ID TIME ADMIN INVOICE SHOW, ADMIN TIME HIDE AND DIRECT COMPANY INVOICE */}
                                        {!proObj?.shipTo?.is_admin_dealer && (
                                            <>
                                                <div className="card-header bg-light">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="card-title mb-0">Admin (Invoice Original And E-Way Bill)</h5>
                                                        {!proObj?.companyInvoice && (
                                                            <>
                                                                {proObj?.adminInvoice && !showChangeForm && (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={handleChangeInvoice}
                                                                    >
                                                                        Change Invoice
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="card-body">
                                                    <div className="card-body">
                                                        {proObj?.adminInvoice && !showChangeForm ? (
                                                            <div className="">
                                                                <div className="mb-3">
                                                                    <p className="mb-1"><strong>Uploaded On: </strong>
                                                                        {proObj?.adminInvoiceDate ? (
                                                                            <DateTime value={proObj.adminInvoiceDate} format="dateTime" />
                                                                        ) : 'N/A'}
                                                                    </p>
                                                                </div>
                                                                {renderFilePreview(
                                                                    proObj.adminInvoice,
                                                                    'Invoice',
                                                                    'Invoice Preview',
                                                                    '',
                                                                    { maxWidth: '250px', maxHeight: "250px" }
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <ImageUpload
                                                                    label="Invoice Original"
                                                                    name="invoiceOriginal"
                                                                    value={documents.invoiceOriginal}
                                                                    onChange={handleDocumentChange}
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    allowPdf={true}
                                                                />
                                                                <div className="text-end mt-3">
                                                                    <button
                                                                        className="btn btn-outline-secondary me-2"
                                                                        onClick={showChangeForm ? handleCancelChange : () => navigate(-1)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={handleSubmitDocuments}
                                                                        disabled={submitting}
                                                                    >
                                                                        {submitting ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                                Submitting...
                                                                            </>
                                                                        ) : (
                                                                            showChangeForm ? 'Update Invoice' : 'Submit Documents'
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                <CompanyInvoice proObj={proObj} renderFilePreview={renderFilePreview} />
                                <PoItems items={items} proObj={proObj} />
                            </>
                        )}
                    </div>

                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            {/* Left Side - Back Button */}
                            <div className="d-flex gap-2">
                                <button className='btn btn-outline-primary' type='button' onClick={handlePoDownload} disabled={isDownload}>
                                    {isDownload ? (
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

                                <button className='btn btn-outline-primary' type='button' onClick={() => handleDownload()}
                                    disabled={downloadingId === id}>
                                    {downloadingId === id ? (
                                        <>
                                            <i className="ti ti-loader text-primary me-1" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ti ti-arrow-down text-primary me-1" />
                                            Download Invoice Summary
                                        </>
                                    )}
                                </button>

                                {proObj?.status === 6 && (
                                    <button className='btn btn-outline-warning' type='button' onClick={handleReceiveProduct}>
                                        <i className="ti ti-check text-warning me-1" />
                                        Receive Product
                                    </button>
                                )}
                            </div>

                            {/* Right Side - Other Buttons */}
                            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                <i className="fas fa-arrow-left me-2"></i> Back to PO List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {modalState?.isPdf ? (
                <FileViewerModal
                    isOpen={modalState.isOpen}
                    fileUrl={modalState.fileUrl}
                    title={modalState.title}
                    onClose={closeFileModal}
                />
            ) : (
                <ImageModal
                    isOpen={modalState.isOpen}
                    imageUrl={modalState.fileUrl}
                    altText={modalState.altText}
                    title={modalState.title}
                    onClose={closeFileModal}
                />
            )}
        </div>
    )
}

export default ViewPo