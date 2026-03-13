import { useEffect } from 'react';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { getStatusBadge } from '../../../config/setup';
import { useApi } from '../../../context/ApiContext';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import InstallSection from '../../../components/Company/InstallationSection/InstallSection';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { toast } from 'react-toastify';

const ViewInstallation = () => {
    const { post, get } = useApi();
    const navigate = useNavigate();
    const { state: data } = useLocation();
    const adminStorage = getAdminStorage();
    const [installObj, setInstallObj] = useState({});
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: '',
        altText: '',
        title: ''
    });
    const [isDownload, setIsDownload] = useState(false);

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
        getPoData();
    }, []);

    const getPoData = async () => {
        try {
            setLoading(true)
            const formData = new URLSearchParams();
            formData.append("firmId", adminStorage.DX_AD_FIRM);
            const response = await post(`/admin/get-installation/${data}`);
            const { data: resData, success } = response;
            if (success) {
                setInstallObj(resData);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleInstallationDownload = async (id, dealerId) => {
        try {
            setIsDownload(true)
            const response = await post(`/admin/download-installation-report/${id}`, {
                isDealer: !!dealerId  
            });
            const { data, success, message } = response;
            if (success) {
                window.open(data?.pdfUrl, '_blank');
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsDownload(false);
        }
    }


    if (loading) {
        return (
            <div className="container-fluid py-4">
                <LoadingSpinner text="" size='md' />
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <BreadCrumbs
                        crumbs={[
                            { label: "Installation List", to: ADMIN_URLS.INSTALL_LIST },
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
                                    <span className="badge bg-success me-2">Report No: {installObj?.reportNo || 'N/A'}</span>
                                    {getStatusBadge(parseInt(installObj?.status))}
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <InstallSection companyInstallationOneList={installObj} openImageModal={openImageModal} />
                        </div>

                        <div className="card-footer">
                            <div className="d-flex justify-content-between">
                                {/* Left side - Download button */}
                                <button
                                    className='btn btn-outline-primary'
                                    type='button'
                                    onClick={() => handleInstallationDownload(installObj._id, installObj?.dealerId)}
                                >
                                    {isDownload ? (
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

                                {/* Right side - Back button */}
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate(ADMIN_URLS.INSTALL_LIST)}
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

export default ViewInstallation