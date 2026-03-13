import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import { getStatusBadge } from '../../../config/setup';
import { downloadInstallationReport, getOneInstallation, resetDownloadInstallation } from '../../../middleware/installation/installation';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import InstallSection from '../../../components/Company/InstallationSection/InstallSection';
import ImageModal from '../../../components/ImageModal/ImageModal';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert/ErrorAlert';
import { toast } from 'react-toastify';

const ViewInstallation = () => {
    const dealerStorage = getDealerStorage();
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
        installationOne,
        installationOneError,
        installationOneLoading,

        downloadInstallationLoading,
        downloadInstallation,
        downloadInstallationMessage,
        downloadInstallationError,
    } = useSelector((state) => state?.dealerInstallation);

    useEffect(() => {
        if (downloadInstallationMessage) {
            toast.success(downloadInstallationMessage)
            window.open(downloadInstallation?.pdfUrl, '_blank');
            dispatch(resetDownloadInstallation())
        }
        if (downloadInstallationError) {
            toast.error(downloadInstallationError)
            dispatch(resetDownloadInstallation())
        }
    }, [downloadInstallationMessage, downloadInstallationError])

    useEffect(() => {
        if (!data) {
            navigate(DEALER_URLS.INSTALL_LIST);
        }
    }, [data])

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const formData = new URLSearchParams();
        formData.append("dealerId", dealerStorage?.DL_ID);
        dispatch(getOneInstallation(formData, data));
    }

    const handleDownload = (id) => {
        dispatch(downloadInstallationReport({ isDealer: true }, id))
    }

    if (installationOneLoading) {
        return (
            <div className="container-fluid py-4">
                <LoadingSpinner text="" size='md' />
            </div>
        );
    }

    if (installationOneError) {
        return (
            <div className="container-fluid py-4">
                <ErrorAlert
                    message={installationOneError || "Failed to load installation details"}
                    onRetry={() => {
                        fetchData()
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
                            { label: "Installation List", to: DEALER_URLS.INSTALL_LIST },
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
                                    <span className="badge bg-success me-2">Report No: {installationOne?.reportNo || 'N/A'}</span>
                                    {getStatusBadge(parseInt(installationOne?.status))}
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <InstallSection isDealer={true} companyInstallationOneList={installationOne} openImageModal={openImageModal} />
                        </div>
                        <div className="card-footer bg-white border-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleDownload(installationOne?._id)}
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

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate(DEALER_URLS.INSTALL_LIST)}
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