import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import ImageModal from '../../../components/ImageModal/ImageModal';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { getOneDealerAerbApplicationData } from '../../../middleware/dealerAerbApplication/dealerAerbApplication';
import { AERB_STATUS_OPTIONS } from '../../../config/DataFile';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { DX_URL } from '../../../config/baseUrl';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import { ShieldCheck } from 'lucide-react';

const ViewDealerCustomer = () => {

    const navigate = useNavigate();

    const { state } = useLocation();
    const customer = state;

    const dispatch = useDispatch();

    useEffect(() => {
        fetchAerbApplication();
    }, [dispatch, customer?._id])

    const fetchAerbApplication = () => {
        dispatch(getOneDealerAerbApplicationData({ customerId: customer?._id }))
    }

    const { deAerbApplication } = useSelector((state) => state.dealerAerbApplication);

    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: '',
        altText: '',
        title: ''
    });

    const getValue = (...keys) => {
        for (const key of keys) {
            const value = customer?.[key];
            if (value !== undefined && value !== null && value !== "") return value;
        }
        return undefined;
    };

    const getImageUrl = (...keys) => {
        const url = getValue(...keys);
        return typeof url === "string" && url.length > 0 ? url : undefined;
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

    const getFullName = () => {
        const parts = [];
        const title = getValue("title");
        const firstName = getValue("name", "firstName");
        const lastName = getValue("lastName", "surname");
        if (title) parts.push(String(title).trim());
        if (firstName) parts.push(String(firstName).trim());
        if (lastName) parts.push(String(lastName).trim());
        return parts.join(" ").trim();
    };

    useEffect(() => {
        if (!customer) {
            navigate(DEALER_URLS.DE_CUSTOMER_LIST);
        }
    }, [customer, navigate]);

    const handleVerifyAerb = async () => {
        if (!deAerbApplication?._id) return;

        if (deAerbApplication?.status === "PENDING") {
            const { isConfirmed } = await Swal.fire({
                title: "Mark as Under Process?",
                text: "This application will be moved to Under Process.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Under Process",
                confirmButtonColor: "#10d2fc",
                cancelButtonText: "Cancel",
            });

            if (isConfirmed) {
                try {
                    const response = await axios.put(
                        `${DX_URL}/dealer/update-process-aerb/${deAerbApplication._id}`,
                        {
                            status: "UNDER_PROCESS",
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${getDealerStorage().DX_DL_TOKEN}`,
                            },
                        }
                    );
                    if (response?.data?.success) {
                        Swal.fire(
                            "Updated!",
                            "Application moved to Under Process.",
                            "success"
                        );
                        fetchAerbApplication();
                    }
                } catch (error) {
                    Swal.fire("Error!", "Something went wrong.", "error");
                }
            }

            return;
        } else {
            const { value: action } = await Swal.fire({
                title: "Verify AERB Application",
                text: "Choose an action",
                icon: "question",
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: "Approve",
                denyButtonText: "Reject",
                confirmButtonColor: "#28a745",
                denyButtonColor: "#dc3545",
                cancelButtonText: "Cancel",
            });

            if (action === true) {
                const { value: approveData } = await Swal.fire({
                    title: "Approve AERB Application",
                    html: `
                        <input type="text" id="swal-username" class="swal2-input" placeholder="Username">
                        <input type="password" id="swal-password" class="swal2-input" placeholder="Password">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Submit",
                    confirmButtonColor: "#28a745",
                    preConfirm: () => {
                        const username = document.getElementById("swal-username").value;
                        const password = document.getElementById("swal-password").value;

                        if (!username || !password) {
                            Swal.showValidationMessage("Both Username and Password are required");
                            return false;
                        }

                        return { username, password };
                    },
                });

                if (approveData) {
                    try {
                        const response = await axios.put(
                            `${DX_URL}/dealer/approve-aerb-application/${deAerbApplication._id}`,
                            {
                                username: approveData.username,
                                password: approveData.password,
                                status: "COMPLETED",
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${getDealerStorage().DX_DL_TOKEN}`,
                                },
                            }
                        );

                        if (response?.data?.success) {
                            Swal.fire(
                                "Approved!",
                                "AERB application approved successfully.",
                                "success"
                            );
                            fetchAerbApplication();
                        }
                    } catch (error) {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    }
                }
            }

            else if (action === false) {
                const { value: rejectReason } = await Swal.fire({
                    title: "Reject AERB Application",
                    input: "textarea",
                    inputLabel: "Rejection Reason",
                    inputPlaceholder: "Enter reason for rejection...",
                    showCancelButton: true,
                    confirmButtonText: "Reject",
                    confirmButtonColor: "#dc3545",
                    inputValidator: (value) => {
                        if (!value) {
                            return "Rejection reason is required";
                        }
                    },
                });

                if (rejectReason) {
                    try {
                        const response = await axios.put(
                            `${DX_URL}/dealer/approve-aerb-application/${deAerbApplication._id}`,
                            {
                                rejectedReason: rejectReason,
                                status: "REJECTED",
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${getDealerStorage().DX_DL_TOKEN}`,
                                },
                            }
                        );

                        if (response?.data?.success) {
                            Swal.fire(
                                "Rejected!",
                                "AERB application rejected successfully.",
                                "success"
                            );
                            fetchAerbApplication();
                        }
                    } catch (error) {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    }
                }
            }
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <BreadCrumbs
                        crumbs={[
                            { label: "customer List", to: DEALER_URLS.DE_CUSTOMER_LIST },
                            { label: `View customer Details` },
                        ]}
                    />

                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-12">
                                    <h4 className="page-title">View customer Details</h4>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12 text-end">
                                    {customer?.status === 1 ? (
                                        <span className="badge badge-pill badge-status bg-warning">Pending</span>
                                    ) : customer?.status === 2 ? (
                                        <span className="badge badge-pill badge-status bg-success">Approved</span>
                                    ) : customer?.status === 3 ? (
                                        <span className="badge badge-pill badge-status bg-danger">Rejected</span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="card-body py-3 px-4 mb-5">
                            <div className="row g-4">
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Name</strong>
                                    </div>
                                    <div className="text-muted">{getFullName() || "N/A"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Email</strong>
                                    </div>
                                    <div className="text-muted">{getValue("email") || "N/A"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Clinic Name</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("clinicName") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Mobile No.</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("phone", "mobile") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Pincode</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("pincode", "pinCode") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Address 1</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("address", "address") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Address 2</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("addressTwo") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Landmark</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("addressThree") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>City</strong>
                                    </div>
                                    <div className="text-muted">{getValue("city") || "N/A"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>State</strong>
                                    </div>
                                    <div className="text-muted">{getValue("state") || "N/A"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>GST No.</strong>
                                    </div>
                                    <div className="text-muted">{getValue("gstNo") || "N/A"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>PAN Card No.</strong>
                                    </div>
                                    <div className="text-muted">{getValue("panNo") || "N/A"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Drug License No. (Form 20B)</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("drugLicenseOne") || "N/A"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-2">
                                        <strong>Drug License No. (Form 21B)</strong>
                                    </div>
                                    <div className="text-muted">
                                        {getValue("drugLicenseTwo") || "N/A"}
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="col-12"></div>
                                <div className="col-12">
                                    <div className="row g-4">
                                        {getImageUrl("image") ? (
                                            <div className="col-12 col-md-6">
                                                <div className="mb-2">
                                                    <strong>Logo</strong>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => openImageModal(
                                                            getImageUrl("image"),
                                                            'Customer Logo',
                                                            'Customer Logo'
                                                        )}
                                                    >
                                                        View Logo
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="col-12 col-md-6">
                                                <div className="mb-2">
                                                    <strong>Logo</strong>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="text-muted">N/A</span>
                                                </div>
                                            </div>
                                        )}

                                        {getImageUrl("signatureStamp", "signature", "stamp") ? (
                                            <div className="col-12 col-md-6">
                                                <div className="mb-2">
                                                    <strong>Signature & Stamp</strong>
                                                </div>
                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => openImageModal(
                                                            getImageUrl("signatureStamp", "signature", "stamp"),
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
                                                <div className="mb-2">
                                                    <strong>Signature & Stamp</strong>
                                                </div>
                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                    <span className="text-muted">N/A</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 d-md-none">
                                    <div className="mb-2">
                                        <strong>Status</strong>
                                    </div>
                                    {customer?.status === 1 ? (
                                        <span className="badge badge-pill badge-status bg-warning">Pending</span>
                                    ) : customer?.status === 2 ? (
                                        <span className="badge badge-pill badge-status bg-success">Approved</span>
                                    ) : customer?.status === 3 ? (
                                        <span className="badge badge-pill badge-status bg-danger">Rejected</span>
                                    ) : null}
                                </div>

                                {deAerbApplication && Object.keys(deAerbApplication).length > 0 && (
                                    <div className="col-12">
                                        <hr className="my-4" />
                                        <h4 className="mb-4">AERB Registration Details</h4>
                                        <div className="row g-4">
                                            <div className="col-12 ">
                                                <div className="mb-2">
                                                    <strong>Remarks</strong>
                                                </div>
                                                <div className="text-muted">{deAerbApplication.remarks || "N/A"}</div>
                                            </div>
                                            <div className="col-12 ">
                                                <div className="mb-2">
                                                    <strong>AERB Status</strong>
                                                </div>
                                                <div className="d-flex gap-3 align-items-center">
                                                    <span className={`${AERB_STATUS_OPTIONS.find((option) => option.value === deAerbApplication.status)?.bg}`}>
                                                        {AERB_STATUS_OPTIONS.find((option) => option.value === deAerbApplication.status)?.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="row g-4">
                                                    {deAerbApplication.documents?.panCard && (
                                                        <div className="col-12 col-md-4">
                                                            <div className="mb-2">
                                                                <strong>Pan Card</strong>
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => openImageModal(deAerbApplication.documents.panCard, 'Pan Card', 'Pan Card')}
                                                            >
                                                                View Pan Card
                                                            </button>
                                                        </div>
                                                    )}
                                                    {deAerbApplication.documents?.clinicDeclaration && (
                                                        <div className="col-12 col-md-4">
                                                            <div className="mb-2">
                                                                <strong>Clinic Declaration</strong>
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => openImageModal(deAerbApplication.documents.clinicDeclaration, 'Clinic Declaration', 'Clinic Declaration')}
                                                            >
                                                                View Declaration
                                                            </button>
                                                        </div>
                                                    )}
                                                    {deAerbApplication.documents?.undertaking && (
                                                        <div className="col-12 col-md-4">
                                                            <div className="mb-2">
                                                                <strong>Undertaking</strong>
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => openImageModal(deAerbApplication.documents.undertaking, 'Undertaking', 'Undertaking')}
                                                            >
                                                                View Undertaking
                                                            </button>
                                                        </div>
                                                    )}
                                                    {deAerbApplication.documents?.selfDeclaration && (
                                                        <div className="col-12 col-md-4">
                                                            <div className="mb-2">
                                                                <strong>Self Declaration</strong>
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => openImageModal(deAerbApplication.documents.selfDeclaration, 'Self Declaration', 'Self Declaration')}
                                                            >
                                                                View Self Declaration
                                                            </button>
                                                        </div>
                                                    )}

                                                    {deAerbApplication.documents?.aadharCards?.length > 0 && (
                                                        <div className="col-12">
                                                            <div className="mb-2">
                                                                <strong>Aadhar Cards</strong>
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {deAerbApplication.documents.aadharCards.map((doc, index) => (
                                                                    <button
                                                                        key={index}
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => openImageModal(doc.file, `Aadhar Card ${index + 1}`, `Aadhar Card ${index + 1}`)}
                                                                    >
                                                                        View Aadhar {index + 1}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="card-footer">
                            <div className={`d-flex align-items-center ${(deAerbApplication?.status === "PENDING" || deAerbApplication?.status === "UNDER_PROCESS") ? "justify-content-between" : "justify-content-end"}`}>
                                {deAerbApplication?._id && (deAerbApplication?.status === "PENDING" || deAerbApplication?.status === "UNDER_PROCESS") && (
                                    <Button
                                        variant="outline-primary"
                                        className='d-flex gap-2 align-items-center'
                                        onClick={() => handleVerifyAerb(deAerbApplication?._id)}
                                    >
                                        <ShieldCheck size={16} />
                                        Verify AERB Application
                                    </Button>
                                )}
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="fas fa-arrow-left me-2"></i> Back to customer List
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
        </>
    )
}

export default ViewDealerCustomer