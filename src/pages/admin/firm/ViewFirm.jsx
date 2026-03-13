import React, { useEffect, useState } from 'react'
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { useLocation, useNavigate } from 'react-router';
import ImageModal from '../../../components/ImageModal/ImageModal';

const ViewFirm = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const firm = state;
    
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: '',
        altText: '',
        title: ''
    });

    const getValue = (...keys) => {
        for (const key of keys) {
            const value = firm?.[key];
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
        if (!firm) {
            navigate(ADMIN_URLS.FIRM_LIST);
        }
    }, [firm, navigate]);

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs crumbs={[
                    { label: "Firm List", to: ADMIN_URLS.FIRM_LIST },
                    { label: `View Firm Details` },
                ]} />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12">
                                <h4 className="page-title">
                                    View Firm Details
                                </h4>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12 text-end">
                                <span className={`badge ${firm?.status ? 'bg-success' : 'bg-danger'}`}>
                                    {firm?.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card-body py-3 px-4">
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Name</strong></div>
                                <div className="text-muted">{getValue('name') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Email</strong></div>
                                <div className="text-muted">{getValue('email') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Mobile No.</strong></div>
                                <div className="text-muted">{getValue('mobileNo', 'mobile') || 'N/A'}</div>
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
                                <div className="text-muted">{getValue('gstNo', 'gst', 'gst_number') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>PAN Card No.</strong></div>
                                <div className="text-muted">{getValue('panCardNo', 'pan', 'panNo') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Drug License No. (Form 20B)</strong></div>
                                <div className="text-muted">{getValue('drugLicenseOne', 'drug20B', 'form20B') || 'N/A'}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="mb-2"><strong>Drug License No. (Form 21B)</strong></div>
                                <div className="text-muted">{getValue('drugLicenseTwo', 'drug21B', 'form21B') || 'N/A'}</div>
                            </div>

                            {/* Images */}
                            <div className="col-12"></div>
                            <div className="col-12">
                                <div className="row g-4">
                                    {getImageUrl('image', 'logoUrl', 'logoImage') ? (
                                        <div className="col-12 col-md-6">
                                            <div className="mb-2"><strong>Logo</strong></div>
                                            <div className="d-flex align-items-center">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => openImageModal(
                                                        getImageUrl('image', 'logoUrl', 'logoImage'),
                                                        'Firm Logo',
                                                        'Firm Logo'
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
                                <span className={`badge ${firm?.status ? 'bg-success' : 'bg-danger'}`}>
                                    {firm?.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <div />
                            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                <i className="fas fa-arrow-left me-2"></i> Back to Firm List
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

export default ViewFirm