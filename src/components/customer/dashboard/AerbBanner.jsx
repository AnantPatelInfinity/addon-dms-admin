import React, { useState, useEffect } from "react";
import { ShieldCheck, Clock, XCircle, X } from "lucide-react";
import Swal from "sweetalert2";

const AerbBanner = ({ aerbApplication }) => {
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem("aerb_banner_dismissed");
        if (dismissed === "true") {
            setIsDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will permanently remove the status banner from your screen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem("aerb_banner_dismissed", "true");
                setIsDismissed(true);
                Swal.fire({
                    title: "Removed!",
                    text: "The banner has been removed.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    if (isDismissed) return null;


    if (aerbApplication.status === "COMPLETED") {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="card rounded-3 py-1 px-1 shadow-md bg-success bg-opacity-10 position-relative">
                            <button
                                onClick={handleDismiss}
                                className="btn position-absolute top-0 end-0 p-2 text-success border-0 bg-transparent"
                                style={{ zIndex: 1 }}
                            >
                                <X size={20} />
                            </button>
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="aerb-icon">
                                    <ShieldCheck size={26} className="text-success" />
                                </div>
                                <div className="pe-4">
                                    <h6 className="mb-1 fw-bold text-success">AERB Application Approved</h6>
                                    <p className="mb-0 small text-black">
                                        Your AERB application has been successfully approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (aerbApplication.status === "PENDING" || aerbApplication.status === "UNDER_PROCESS") {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="card rounded-3 py-1 px-1 shadow-md bg-warning bg-opacity-10 position-relative">
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="aerb-icon">
                                    <Clock size={26} className="text-warning" />
                                </div>
                                <div className="pe-4">
                                    <h5 className="mb-1 text-warning">AERB Application Under Review</h5>
                                    <p className="mb-0 small text-black">
                                        Your AERB application is currently being reviewed by the authority.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (aerbApplication.status === "REJECTED") {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="card rounded-3 py-1 px-1 shadow-md bg-danger bg-opacity-10 position-relative">
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="aerb-icon">
                                    <XCircle size={26} className="text-danger" />
                                </div>
                                <div className="pe-4">
                                    <h6 className="mb-1 fw-bold text-danger">AERB Application Rejected</h6>
                                    <p className="mb-0 small text-black">
                                        Reject Reason : {aerbApplication?.rejectedReason || "Your AERB application has been rejected."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return null;
};

export default AerbBanner;