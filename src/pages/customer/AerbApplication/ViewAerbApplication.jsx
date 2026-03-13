import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import {
    FileText,
    CheckCircle,
    Download,
    Eye,
    CornerUpLeft,
    Shield,
    FileCheck,
    CreditCard,
    Stethoscope,
    FileSignature,
    UserCheck,
    Calendar,
    MessageSquare,
    User,
    Trash2
} from 'lucide-react'
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs'
import CUSTOMER_URLS from '../../../config/routesFile/customer.routes'
import { deleteAerbApplicationData, getOneAerbApplicationData } from '../../../middleware/customerUser/aerbApplication/aerbApplication'
import { getCustomerStorage } from '../../../components/LocalStorage/CustomerStorage'
import ImageModal from '../../../components/ImageModal/ImageModal'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import moment from 'moment'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2'

const ViewAerbApplication = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const customerId = getCustomerStorage()?.CU_ID

    const { aerbApplication, aerbApplicationLoading } = useSelector((state) => state.customerAerbApplication)

    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: '',
        altText: '',
        title: ''
    })

    useEffect(() => {
        if (customerId) {
            dispatch(getOneAerbApplicationData({ customerId }))
        }
    }, [dispatch, customerId])

    const openImageModal = (imageUrl, altText, title = 'Document Preview') => {
        setModalState({
            isOpen: true,
            imageUrl: imageUrl || '',
            altText: altText || 'Document',
            title: title
        })
    }

    const closeImageModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }))
    }

    const handleDownload = (url, fileName) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document';
        document.body.appendChild(link);
        link.target = '_blank';
        document.body.removeChild(link);
    }

    if (aerbApplicationLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <LoadingSpinner />
            </div>
        )
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure? AERB Registration",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteAerbApplicationData(id));
                navigate(CUSTOMER_URLS.DASHBOARD);
            }
        });
    }

    const DocumentCard = ({ title, icon: Icon, fileUrl, bgColor = 'primary', textColor = "black" }) => (
        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className={`card-body p-4 bg-white`}>
                <div className="d-flex align-items-center mb-3">
                    <div style={{ padding: "10px 10px" }} className={`bg-${bgColor} bg-opacity-10 rounded-3 me-3 text-${textColor}`}>
                        <Icon size={20} className={`text-${textColor}`} />
                    </div>
                    <h6 className="mb-0 fw-bold text-dark">{title}</h6>
                </div>
                {fileUrl ? (
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 border-0 transition-all"
                            onClick={() => openImageModal(fileUrl, title, title)}
                            style={{ borderRadius: '10px' }}
                        >
                            <Eye size={19} />
                            <span>Preview</span>
                        </button>
                    </div>
                ) : (
                    <div className="text-muted small italic p-2 bg-light rounded text-center">
                        No document uploaded
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="container-fluid pb-5">
            <BreadCrumbs
                crumbs={[
                    { label: `View Application` },
                ]}
            />

            {/* Header Section */}
            <div className="row mb-3 align-items-center">
                <div className="col-md-8">
                    <div className="d-flex align-items-center gap-3 mt-2">
                        <h4 className=" fw-bold">AERB Registration Review</h4>
                    </div>
                </div>
                <div className="col-md-4 text-md-end mt-2 mt-md-0">
                    <div className="d-inline-flex align-items-center bg-success bg-opacity-10 text-black px-3 py-2 rounded-pill border border-success border-opacity-25">
                        <CheckCircle size={15} className={`me-2 text-success`} />
                        <span style={{ fontSize: "12px" }} className={`fw-bold text-success`}>{aerbApplication?.status === "COMPLETED" ? "Approved" : "Rejected"}</span>
                    </div>
                </div>
            </div>

            <div className="row g-4 h-100">
                {/* Info Card */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px' }}>
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <FileText size={20} className="text-primary" />
                                Application Info
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="text-muted small fw-semibold text-uppercase mb-2 d-flex align-items-center gap-2">
                                    <MessageSquare size={14} />
                                    Customer Remarks
                                </label>
                                <div className="p-2 bg-light rounded-4 text-dark border">
                                    {aerbApplication?.remarks || 'No remarks provided'}
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border bg-white">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <div className="small text-muted"> {aerbApplication?.status === "COMPLETED" ? "Approval" : "Rejected"} Date</div>
                                        <div className="fw-bold text-dark">
                                            {aerbApplication.completedAt ? moment(aerbApplication.completedAt).format('DD MMM YYYY') : "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border bg-white">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div className="small text-muted">Username</div>
                                        <div className="fw-bold text-dark">
                                            {aerbApplication.aerbUserName || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="col-lg-8 ">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <DocumentCard
                                title="PAN Card"
                                icon={CreditCard}
                                fileUrl={aerbApplication?.documents?.panCard}
                                bgColor="info"
                                textColor="info"
                            />
                        </div>
                        <div className="col-md-6">
                            <DocumentCard
                                title="Clinic Declaration"
                                icon={Stethoscope}
                                fileUrl={aerbApplication?.documents?.clinicDeclaration}
                                bgColor="primary"
                                textColor="primary"
                            />
                        </div>
                        <div className="col-md-6">
                            <DocumentCard
                                title="Undertaking"
                                icon={FileSignature}
                                fileUrl={aerbApplication?.documents?.undertaking}
                                bgColor="warning"
                                textColor='warning'
                            />
                        </div>
                        <div className="col-md-6">
                            <DocumentCard
                                title="Self Declaration"
                                icon={FileCheck}
                                fileUrl={aerbApplication?.documents?.selfDeclaration}
                                bgColor="success"
                                textColor='success'
                            />
                        </div>

                        {/* Aadhar Cards Section */}
                        <div className="col-12">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                                <div className="card-header bg-white border-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                        <UserCheck size={20} className="text-danger" />
                                        Aadhar Cards
                                    </h5>
                                </div>
                                <div className="card-body p-4">
                                    {aerbApplication?.documents?.aadharCards?.length > 0 ? (
                                        <div className="row g-3">
                                            {aerbApplication?.documents?.aadharCards?.map((item, index) => (
                                                <div key={index} className="col-sm-6 col-md-4">
                                                    <div className="position-relative role-item rounded-4 overflow-hidden border group" style={{ height: '140px' }}>
                                                        <img
                                                            src={item.file}
                                                            alt={`Aadhar ${index + 1}`}
                                                            className="w-100 h-100 object-fit-cover transition-all"
                                                        />
                                                        <div className="position-absolute inset-0 bg-dark bg-opacity-40 d-flex align-items-center justify-content-center opacity-0 group-hover-opacity-100 transition-all gap-2">
                                                            <button
                                                                className="btn btn-light btn-sm rounded-circle py-2 px-2"
                                                                onClick={() => openImageModal(item.file, `Aadhar Card ${index + 1}`, `Aadhar Card ${index + 1}`)}
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            {/* <button
                                                                className="btn btn-light btn-sm rounded-circle p-2"
                                                                onClick={() => handleDownload(item.file, `Aadhar_Card_${index + 1}`)}
                                                            >
                                                                <Download size={16} />
                                                            </button> */}
                                                        </div>
                                                        <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-black bg-opacity-50 text-white small text-center">
                                                            Card {index + 1}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 bg-light rounded-4">
                                            <p className="text-muted mb-0">No Aadhar cards found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-footer bg-white border-0 pb-4 px-4 mt-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <Button
                        variant="outline-primary"
                        className='px-4 gap-1 d-flex align-items-center mb-2 text-nowrap'
                        style={{ borderRadius: "5px" }}
                        onClick={() => handleDelete(aerbApplication?._id)}
                    >
                        <Trash2 size={15} />
                        <span className=''>
                            Delete AERB Application
                        </span>
                    </Button>
                    <Button
                        variant="outline-secondary"
                        className='px-4 gap-1 d-flex align-items-center mb-2 text-nowrap'
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left me-2"></i> Back to customer List
                    </Button>
                </div>
            </div>

            <ImageModal
                isOpen={modalState.isOpen}
                imageUrl={modalState.imageUrl}
                altText={modalState.altText}
                title={modalState.title}
                onClose={closeImageModal}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-shadow:hover {
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                    transform: translateY(-4px);
                }
                .transition-all {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .group-hover-opacity-100 {
                    opacity: 1 !important;
                }
                .btn-light-primary {
                    background-color: #f0f7ff;
                    color: #0d6efd;
                }
                .btn-light-primary:hover {
                    background-color: #0d6efd;
                    color: white;
                }
                .inset-0 {
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }
            `}} />
        </div>
    )
}

export default ViewAerbApplication
