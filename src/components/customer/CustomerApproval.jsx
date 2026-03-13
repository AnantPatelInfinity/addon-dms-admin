import React, { useEffect, useState } from 'react'
import ImageUpload from '../Admin/ImageUpload/ImageUpload';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DX_URL } from '../../config/baseUrl';
import { getCustomerStorage } from '../LocalStorage/CustomerStorage';

const CustomerApproval = ({ serviceId, fetchServiceData, serviceObj }) => {

    const [form, setForm] = useState({
        isApprove: serviceObj?.customerApproval?.isApprove || "",
        pdf: serviceObj?.customerApproval?.pdf || "",
        dealerAmount: serviceObj.serviceEstimate.dealerAmount || "",
        customerAmount: serviceObj.serviceEstimate.customerAmount || "",
        paymentStatus: null,
    });
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const customerStorage = getCustomerStorage();

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            dealerAmount: serviceObj.serviceEstimate.dealerAmount,
            customerAmount: serviceObj.serviceEstimate.customerAmount,
            isApprove: serviceObj?.customerApproval?.isApprove,
            paymentStatus: serviceObj?.customerApproval?.paymentStatus,
        }));
    }, [serviceObj]);

    const validateForm = () => {
        const newErrors = {};

        if (form.isApprove === null) {
            newErrors.isApprove = "Approval status is required";
        }

        if (form.paymentStatus === null) {
            newErrors.paymentStatus = "Payment status is required";
        }

        if (!form.customerAmount) {
            newErrors.customerAmount = "Amount is required";
        } else if (isNaN(form.customerAmount)) {
            newErrors.customerAmount = "Amount must be a number";
        } else if (parseFloat(form.amount) <= 0) {
            newErrors.customerAmount = "Amount must be greater than 0";
        }

        if (form.paymentStatus === 1) {
            if (!form.pdf) {
                newErrors.pdf = "Document is required";
            }
        }

        if (form.paymentStatus === 2) {
            if (form.pdf) {
                newErrors.paymentStatus =
                    "Cannot have a document with 'Without Payment' status";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleApprovalChange = (value) => {
        setForm((prev) => ({ ...prev, isApprove: value }));
        if (errors.isApprove) {
            setErrors((prev) => ({ ...prev, isApprove: "" }));
        }
    };

    const handlePaymentStatusChange = (value) => {
        setForm((prev) => ({ ...prev, paymentStatus: value }));
        if (errors.paymentStatus) {
            setErrors((prev) => ({ ...prev, paymentStatus: "" }));
        }
    };


    const getApiUrl = () => {
        return serviceObj?.isParts === true
            ? `${DX_URL}/customer/customer-part-approval/${serviceId}`
            : `${DX_URL}/customer/customer-approval/${serviceId}`;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setDisable(true)
            const url = getApiUrl()
            const approvalData = {
                isApprove: form.isApprove,
                paymentStatus: form.paymentStatus,
                pdf: form.pdf,
                dealerAmount: form.dealerAmount,
                customerAmount: form.customerAmount,
                time: Date.now(),
            };

            const formData = new URLSearchParams();
            formData.append("customerApproval", JSON.stringify(approvalData));
            formData.append("status", serviceObj.status);
            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${customerStorage?.DX_CU_TOKEN}`
                }
            });

            const { success, message } = response?.data;
            if (success) {
                toast.success(message);
                setForm({
                    isApprove: null,
                    pdf: "",
                    dealerAmount: "",
                    customerAmount: "",
                    paymentStatus: null,
                });
                setErrors({});
            } else {
                toast.error(message)
            }
        } catch (error) {
            console.log(error, 'Error')
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setDisable(false)
            fetchServiceData();
        }
    }

    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light border-0">
                <h5 className="card-title mb-0 text-primary">
                    <i className="fas fa-user-check me-2"></i>
                    Customer Approval Details
                </h5>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-12">
                        <div className="mb-3">
                            <label className="form-label d-block">
                                Approval Status <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${errors.isApprove ? "is-invalid" : ""
                                            }`}
                                        type="radio"
                                        name="isApprove"
                                        id="approve"
                                        checked={form.isApprove === true}
                                        onChange={() => handleApprovalChange(true)}
                                        disabled={serviceObj?.customerApproval.isApprove === true}
                                    />
                                    <label className="form-check-label" htmlFor="approve">
                                        Approve
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${errors.isApprove ? "is-invalid" : ""
                                            }`}
                                        type="radio"
                                        name="isApprove"
                                        id="reject"
                                        checked={form.isApprove === false}
                                        onChange={() => handleApprovalChange(false)}
                                        disabled={serviceObj?.customerApproval.isApprove === true}
                                    />
                                    <label className="form-check-label" htmlFor="reject">
                                        Reject
                                    </label>
                                </div>
                            </div>
                            {errors.isApprove && (
                                <div className="invalid-feedback d-block">
                                    {errors.isApprove}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="mb-3">
                            <label className="form-label d-block">
                                Payment Status <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${errors.paymentStatus ? "is-invalid" : ""
                                            }`}
                                        type="radio"
                                        name="paymentStatus"
                                        id="withPayment"
                                        checked={form.paymentStatus === 1}
                                        onChange={() => handlePaymentStatusChange(1)}
                                    />
                                    <label className="form-check-label" htmlFor="withPayment">
                                        With Payment
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${errors.paymentStatus ? "is-invalid" : ""
                                            }`}
                                        type="radio"
                                        name="paymentStatus"
                                        id="withoutPayment"
                                        checked={form.paymentStatus === 2}
                                        onChange={() => handlePaymentStatusChange(2)}
                                    />
                                    <label className="form-check-label" htmlFor="withoutPayment">
                                        Without Payment
                                    </label>
                                </div>
                            </div>
                            {errors.paymentStatus && (
                                <div className="invalid-feedback d-block">
                                    {errors.paymentStatus}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                name="customerAmount"
                                value={form.customerAmount}
                                onChange={handleChange}
                                className={`form-control ${errors.customerAmount ? "is-invalid" : ""}`}
                                placeholder="Enter Amount"
                                step="0.01"
                                min="0"
                            // disabled={isPaymentStatus2}
                            />
                            <label>
                                Amount <span className="text-danger">*</span>
                            </label>
                            {errors.customerAmount && (
                                <div className="invalid-feedback">{errors.customerAmount}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-12">
                        <ImageUpload
                            label="Document"
                            name="pdf"
                            value={form.pdf}
                            onChange={(k, v) => {
                                setForm((prev) => ({ ...prev, [k]: v }));
                                if (errors.pdf) {
                                    setErrors((prev) => ({ ...prev, pdf: "" }));
                                }
                            }}
                            allowPdf={true}
                            error={errors.pdf}
                        />
                        {errors.pdf && (
                            <div className="invalid-feedback d-block">{errors.pdf}</div>
                        )}
                    </div>

                    <div className="col-md-12 text-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={disable}
                        >
                            {disable ? (
                                "Loading..."
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Submit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerApproval