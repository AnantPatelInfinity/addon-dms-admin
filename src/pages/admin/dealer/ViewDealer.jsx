import React, { useEffect, useState } from 'react'
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { useLocation, useNavigate } from 'react-router';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { useApi } from '../../../context/ApiContext';
import Swal from 'sweetalert2';

const ViewDealer = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const dealer = state;
    const { post } = useApi();
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: '',
        altText: '',
        title: ''
    });

    const [currentStatus, setCurrentStatus] = useState(dealer?.status);

    const getValue = (...keys) => {
        for (const key of keys) {
            const value = dealer?.[key];
            if (value !== undefined && value !== null && value !== '') return value;
        }
        return undefined;
    };

    const getImageUrl = (...keys) => {
        const url = getValue(...keys);
        return typeof url === 'string' && url.length > 0 ? url : undefined;
    };

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

    useEffect(() => {
        if (!dealer) {
            navigate(ADMIN_URLS.DEALER_LIST);
        }
    }, [dealer, navigate]);

    const handleStatusUpdate = async (status) => {
        const actionLabel = status === 2 ? 'Approve' : status === 3 ? 'Reject' : 'Pending';
        const confirmButtonColor = status === 2 ? '#28a745' : status === 3 ? '#dc3545' : '#ffc107';
        const confirmResult = await Swal.fire({
            title: `${actionLabel} this dealer?`,
            text: `Are you sure you want to set ${dealer?.name} to ${actionLabel.toLowerCase()}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Yes, ${actionLabel}`,
        });

        if (confirmResult.isConfirmed) {
            try {
                const response = await post(`/admin/update-dealer-status/${dealer?._id}?status=${status}`);
                if (response.success) {
                    Swal.fire('Updated!', `${dealer?.name} status updated to ${actionLabel}.`, 'success');
                    setCurrentStatus(status);
                } else {
                    Swal.fire('Error!', response.message || 'Something went wrong.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong while updating status.', 'error');
            }
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs crumbs={[
                    { label: "dealer List", to: ADMIN_URLS.DEALER_LIST },
                    { label: `View dealer Details` },
                ]} />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12">
                                <h4 className="page-title">
                                    View dealer Details
                                </h4>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12 text-end">
                                {currentStatus === 1 ? (
                                    <span className="badge badge-pill badge-status bg-warning">Pending</span>
                                ) : currentStatus === 2 ? (
                                    <span className="badge badge-pill badge-status bg-success">Approved</span>
                                ) : currentStatus === 3 ? (
                                    <span className="badge badge-pill badge-status bg-danger">Rejected</span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="card-body py-3 px-4 mb-5">
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Dealer Name</strong></div>
                                <div className="text-muted">{getValue('dealerCompanyName') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Dealer Company Name</strong></div>
                                <div className="text-muted">{getValue('name') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Email</strong></div>
                                <div className="text-muted">{getValue('email') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Mobile No.</strong></div>
                                <div className="text-muted">{getValue('phone', 'mobile') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Pincode</strong></div>
                                <div className="text-muted">{getValue('pincode', 'pinCode') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Address 1</strong></div>
                                <div className="text-muted">{getValue('address', 'address') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Address 2</strong></div>
                                <div className="text-muted">{getValue('addressTwo') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Landmark</strong></div>
                                <div className="text-muted">{getValue('addressThree') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>City</strong></div>
                                <div className="text-muted">{getValue('city') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>State</strong></div>
                                <div className="text-muted">{getValue('state') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>GST No.</strong></div>
                                <div className="text-muted">{getValue('gstNo') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>PAN Card No.</strong></div>
                                <div className="text-muted">{getValue('panNo') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Drug License No. (Form 20B)</strong></div>
                                <div className="text-muted">{getValue('drugLicenseOne') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Drug License No. (Form 21B)</strong></div>
                                <div className="text-muted">{getValue('drugLicenseTwo') || 'N/A'}</div>
                            </div>

                            {/* Images */}
                            <div className="col-12"></div>
                            <div className="col-12">
                                <div className="row g-4">
                                    {getImageUrl('image') ? (
                                        <div className="col-12 col-md-6">
                                            <div className="mb-2"><strong>Logo</strong></div>
                                            <div className="d-flex align-items-center">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => openImageModal(
                                                        getImageUrl('image'),
                                                        'Dealer Logo',
                                                        'Dealer Logo'
                                                    )}
                                                >
                                                    View Logo
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-12 col-md-6">
                                            <div className="mb-2"><strong>Logo</strong></div>
                                            <div className="d-flex align-items-center">
                                                <span className="text-muted">N/A</span>
                                            </div>
                                        </div>
                                    )}

                                    {getImageUrl('signatureStamp', 'signature', 'stamp') ? (
                                        <div className="col-12 col-md-6">
                                            <div className="mb-2"><strong>Signature & Stamp</strong></div>
                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => openImageModal(
                                                        getImageUrl('signatureStamp', 'signature', 'stamp'),
                                                        'Signature & Stamp',
                                                        'Signature & Stamp'
                                                    )}
                                                >
                                                    View Signature
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-12 col-md-6">
                                            <div className="mb-2"><strong>Signature & Stamp</strong></div>
                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                <span className="text-muted">N/A</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status duplicate on small screens */}
                            <div className="col-12 d-md-none">
                                <div className="mb-2"><strong>Status</strong></div>
                                {currentStatus === 1 ? (
                                    <span className="badge badge-pill badge-status bg-warning">Pending</span>
                                ) : currentStatus === 2 ? (
                                    <span className="badge badge-pill badge-status bg-success">Approved</span>
                                ) : currentStatus === 3 ? (
                                    <span className="badge badge-pill badge-status bg-danger">Rejected</span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                {currentStatus === 1 && (
                                    <>
                                        <button className="btn btn-success" onClick={() => handleStatusUpdate(2)}>
                                            <i className="fe fe-check-circle me-2"></i> Approve
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleStatusUpdate(3)}>
                                            <i className="fa-solid fa-xmark me-2"></i> Reject
                                        </button>
                                    </>
                                )}
                            </div>
                            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                <i className="fas fa-arrow-left me-2"></i> Back to dealer List
                            </button>
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

export default ViewDealer