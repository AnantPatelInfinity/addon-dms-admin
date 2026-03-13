import React, { useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import { toast } from 'react-toastify';
import { DX_URL } from '../../../config/baseUrl';
import { getDealerStorage } from '../../LocalStorage/DealerStorage';
import { getAdminStorage } from '../../LocalStorage/AdminStorage';
import axios from 'axios';
import { getCustomerStorage } from '../../LocalStorage/CustomerStorage';

const CustomerReceive = ({ serviceId, serviceData, fetchServiceData, isDealer = false, isCustomer = false }) => {

    // const { post } = useApi();
    const [disable, setDisable] = useState(false);
    const [form, setForm] = useState({
        isReceive: null,
    });
    const [errors, setErrors] = useState({});
    const adminStorage = getAdminStorage();
    const dealerStorage = getDealerStorage();
    const customerStorage = getCustomerStorage()

    const validateForm = () => {
        const newErrors = {};
        if (form.isReceive === null) {
            newErrors.isReceive = "Received status is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleApprovalChange = (value) => {
        setForm(prev => ({ ...prev, isReceive: value }));
        if (errors.isReceive) {
            setErrors(prev => ({ ...prev, isReceive: "" }));
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            setDisable(true)

            const receiveData = {
                isReceive: form.isReceive,
                time: Date.now()
            }

            const formData = new URLSearchParams();
            formData.append("customerReceive", JSON.stringify(receiveData))

            let url = "";

            if (isDealer) {
                url = serviceData?.isFullProduct
                    ? `${DX_URL}/dealer/dealer-customer-receive/${serviceId}`
                    : `${DX_URL}/dealer/dealer-customer-parts-receive/${serviceId}`;
            }
            else if (isCustomer) {
                url = serviceData?.isFullProduct
                    ? `${DX_URL}/customer/customer-receive/${serviceId}`
                    : `${DX_URL}/customer/customer-parts-receive/${serviceId}`
            } else {
                url = serviceData?.isFullProduct
                    ? `${DX_URL}/admin/admin-customer-receive/${serviceId}`
                    : `${DX_URL}/admin/admin-customer-parts-receive/${serviceId}`;
            }

            const token = isDealer ? dealerStorage.DX_DL_TOKEN : isCustomer ? customerStorage?.DX_CU_TOKEN : adminStorage.DX_AD_TOKEN

            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                }
            })

            const { success, message } = response?.data;
            if (success) {
                toast.success(message)
                fetchServiceData();
                setForm({
                    isReceive: null,
                })
            } else {
                toast.error(message)
            }
        } catch (error) {
            console.log(error, 'Error');
            toast.error(error?.response?.data?.message)
        } finally {
            setDisable(false)
        }
    }

    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light border-0">
                <h5 className="card-title mb-0 text-primary">
                    <i className="fas fa-user-check me-2"></i>
                    Customer Received Details
                </h5>
            </div>

            <div className="card-body">
                <div className="row g-3">
                    <div className="col-12">
                        <div className="mb-3">
                            {/* <label className="form-label d-block">Approval Status <span className="text-danger">*</span></label> */}
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${errors.isReceive ? "is-invalid" : ""}`}
                                        type="radio"
                                        name="isReceive"
                                        id="approve"
                                        checked={form.isReceive === true}
                                        onChange={() => handleApprovalChange(true)}
                                    />
                                    <label className="form-check-label" htmlFor="approve">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${errors.isReceive ? "is-invalid" : ""}`}
                                        type="radio"
                                        name="isReceive"
                                        id="reject"
                                        checked={form.isReceive === false}
                                        onChange={() => handleApprovalChange(false)}
                                    />
                                    <label className="form-check-label" htmlFor="reject">
                                        No
                                    </label>
                                </div>
                            </div>
                            {errors.isReceive && <div className="invalid-feedback d-block">{errors.isReceive}</div>}
                        </div>
                    </div>

                    <div className="col-md-12 text-end">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={disable}>
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

export default CustomerReceive