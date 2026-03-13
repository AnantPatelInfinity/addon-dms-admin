import React, { useEffect, useState } from 'react'
import { State, City } from 'country-state-city';
import { useNavigate } from 'react-router';
import { customerRegisterType, customerTitle } from '../../../config/DataFile';
import { toast } from 'react-toastify';
import { getDealerStorage } from '../../LocalStorage/DealerStorage';
import { useDispatch, useSelector } from 'react-redux';
import { addDeCustomer, getDealerCustomerList } from '../../../middleware/customer/customer';
import axios from 'axios';
import { DX_URL } from '../../../config/baseUrl';
import { FileUpload } from '../../FileUpload/FileUpload';
import { resetAddCustomer } from '../../../slices/customer.slice';


const CustomerForm = ({ closeModal }) => {

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dealerStorage = getDealerStorage();
    const [customer, setCustomer] = useState({
        name: "",
        lastName: "",
        title: "",
        clinicName: "",
        email: "",
        password: "",
        address: "",
        addressTwo: "",
        addressThree: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        status: "",
        gstNo: "",
        panNo: "",
        image: null,
        signature: null,
        stamp: null,
        drugLicenseOne: "",
        drugLicenseTwo: "",
        isRegistrationType: "",
    });

    const { addCustomerLoading, addCustomerError, addCustomerMessage } = useSelector((state) => state.customer);

    useEffect(() => {
        if (addCustomerError) {
            toast.error(addCustomerError);
            dispatch(resetAddCustomer())
        }

        if (addCustomerMessage) {
            toast.success(addCustomerMessage);
            closeModal();
            dispatch(resetAddCustomer())
            dispatch(getDealerCustomerList(dealerStorage.DL_ID));
        }
    }, [addCustomerError, addCustomerMessage]);

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"));
    }, []);

    useEffect(() => {
        if (customer.state) {
            const selectedState = states.find((s) => s.name === customer.state);
            if (selectedState) {
                setCities(City.getCitiesOfState("IN", selectedState.isoCode));
            }
        } else {
            setCities([]);
        }
    }, [customer.state, states]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleImgUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            setDisable(true);
            const response = await axios.post(`${DX_URL}/upload-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const { data, message, success } = response.data;
            if (success) {
                const fileUrl = data?.image || data?.pdf;
                toast.success(`${field} uploaded successfully`);
                setCustomer(prev => ({ ...prev, [field]: fileUrl }));
            } else {
                toast.error(message || `Upload failed for ${field}`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || `Error uploading ${field}`);
        } finally {
            setDisable(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!customer.title) newErrors.title = "Title is required";
        if (!customer.name) newErrors.name = "Name is required";
        if (!customer.lastName) newErrors.lastName = "Last Name is required";
        if (!customer.email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) newErrors.email = "Invalid email";

        if (!customer.phone) newErrors.phone = "Mobile number is required";
        else if (!/^[6-9]\d{9}$/.test(customer.phone)) newErrors.phone = "Invalid mobile number";

        if (customer.isRegistrationType === "1") {
            if (!customer.gstNo) newErrors.gstNo = "GST No. is required";
            else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(customer.gstNo))
                newErrors.gstNo = "Invalid GST format";
        }

        ["state", "city", "pincode", "address"].forEach((f) => {
            if (!customer[f]) newErrors[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`;
        });

        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        try {
            const formData = new URLSearchParams();
            formData.append("name", customer.name);
            formData.append("lastName", customer.lastName || "");
            formData.append("title", customer.title || "");
            formData.append("clinicName", customer.clinicName || "");
            formData.append("email", customer.email);
            formData.append("phone", customer.phone);
            formData.append("address", customer.address);
            formData.append("addressTwo", customer.addressTwo || "");
            formData.append("addressThree", customer.addressThree || "");
            formData.append("city", customer.city);
            formData.append("state", customer.state);
            formData.append("pincode", customer.pincode);
            formData.append("status", customer.status);
            formData.append("image", customer.image);
            formData.append("drugLicenseOne", customer.drugLicenseOne);
            formData.append("drugLicenseTwo", customer.drugLicenseTwo);
            formData.append("panNo", customer.panNo);
            formData.append("gstNo", customer.gstNo);
            formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
            formData.append("dealerId", dealerStorage.DL_ID);
            formData.append("isRegistrationType", customer.isRegistrationType);
            if (customer.signature) {
                formData.append("signature", customer.signature);
            }
            if (customer.stamp) {
                formData.append("stamp", customer.stamp);
            }

            dispatch(addDeCustomer(formData));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Submission failed");
        }
    }

    const renderInput = (label, name, type = "text", required = false) => (
        <div className="col-lg-4 col-md-6 col-12">
            <div className="form-floating mb-3">
                <input
                    type={type}
                    className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    name={name}
                    value={customer[name]}
                    onChange={handleChange}
                    placeholder={label}
                />
                <label>
                    {label} {required && <span className="text-danger">*</span>}
                </label>
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
            </div>
        </div>
    );

    return (
        <>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-control form-select ${errors.title ? "is-invalid" : ""}`}
                            value={customer.title} name='title' onChange={handleChange}>
                            <option value="">Select Title</option>
                            {customerTitle?.map((state) => (
                                <option key={state.value} value={state.label}>
                                    {state.label}
                                </option>
                            ))}
                        </select>
                        <label>Title  <span className="text-danger">*</span></label>
                        {errors.title && (
                            <div className="invalid-feedback">{errors.title}</div>
                        )}
                    </div>
                </div>
                {renderInput("Name", "name", "text", true)}
                {renderInput("Last Name", "lastName", "text", true)}
                {renderInput("Email", "email", "email", true)}
                {renderInput("Mobile No.", "phone", "number", true)}
            </div>
            <div className='row'>
                {renderInput("Clinic Name", "clinicName")}
                {renderInput("GST No.", "gstNo", "text", customer.isRegistrationType === "1")}
                {renderInput("Pancard No.", "panNo")}
            </div >
            <div className="row">
                {renderInput("Address", "address", "text", true)}
                {renderInput("Address Two", "addressTwo")}
                {renderInput("Landmark", "addressThree")}
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-select ${errors.state ? "is-invalid" : ""}`}
                            name="state"
                            value={customer.state}
                            onChange={(e) =>
                                setCustomer({ ...customer, state: e.target.value, city: "" })
                            }
                        >
                            <option value="">Select State</option>
                            {states.map((s) => (
                                <option key={s.isoCode} value={s.name}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        <label>State <span className="text-danger">*</span></label>
                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-select ${errors.city ? "is-invalid" : ""}`}
                            name="city"
                            value={customer.city}
                            onChange={handleChange}
                            disabled={!customer.state}
                        >
                            <option value="">Select City</option>
                            {cities.map((c, idx) => (
                                <option key={idx} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <label>City <span className="text-danger">*</span></label>
                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                </div>
                {renderInput("Pincode", "pincode", "number", true)}
            </div>
            <div className="row">
                {renderInput("Drug License No. (Form 20B)", "drugLicenseOne")}
                {renderInput("Drug License No. (Form 21B)", "drugLicenseTwo")}
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className="form-control"
                            value={customer.isRegistrationType}
                            name="isRegistrationType"
                            onChange={handleChange}
                        >
                            <option value="">Select Registration Type</option>
                            {customerRegisterType?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <label>Registration Type</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <FileUpload
                    label="Logo"
                    type="image"
                    field="image"
                    value={customer.image}
                    onChange={handleImgUpload}
                />

                <FileUpload
                    label="Signature & Stamp"
                    type="signature"
                    field="signature"
                    value={customer.signature}
                    onChange={handleImgUpload}
                />

                {/* <FileUpload
                    label="Stamp"
                    type="stamp"
                    value={customer.stamp}
                    onChange={handleImgUpload}
                /> */}
            </div>

            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-light me-2" onClick={closeModal || (() => navigate(-1))}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={disable || addCustomerLoading}>
                    {disable ? "Saving..." : "Create"}
                </button>
            </div>
        </>
    )
}

export default CustomerForm