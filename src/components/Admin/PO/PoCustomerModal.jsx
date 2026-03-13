import React, { useEffect, useState } from 'react'
import ModalWrapper from '../../Modal/ModalWrapper'
import { State, City } from 'country-state-city';
import { useApi } from '../../../context/ApiContext';
import { toast } from 'react-toastify';
import { useDealerApi } from '../../../context/DealerApiContext';

const PoCustomerModal = ({ modal, isDealer, dealerStorage }) => {
    if (!isDealer) {
        var { post } = useApi()
    } else {
        var { post } = useDealerApi();
    }
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        conactPersonName: "",
        contactPersonPhone: "",
        address: "",
        addressTwo: "",
        addressThree: "",
        state: "",
        city: "",
        pincode: ""
    });
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        const indianStates = State.getStatesOfCountry("IN");
        setStateData(indianStates);
    }, []);

    useEffect(() => {
        if (customer.state) {
            const selectedState = stateData.find(state => state.name === customer.state);
            if (selectedState) {
                const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
                setCityData(cityList);
            } else {
                setCityData([]);
            }
        } else {
            setCityData([]);
        }
    }, [customer.state, stateData]);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const pincodeRegex = /^\d{6}$/;

        if (!customer.name.trim()) newErrors.name = 'Name is required';
        if (!customer.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(customer.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!customer.phone.trim()) {
            newErrors.phone = 'Mobile number is required';
        } else if (!phoneRegex.test(customer.phone)) {
            newErrors.phone = 'Enter a valid 10-digit mobile number';
        }
        if (customer.contactPersonPhone) {
            if (!customer.contactPersonPhone.trim()) {
                newErrors.contactPersonPhone = 'Contact person mobile is required';
            } else if (!phoneRegex.test(customer.contactPersonPhone)) {
                newErrors.contactPersonPhone = 'Enter a valid 10-digit contact number';
            }
        }
        if (!customer.address.trim()) newErrors.address = 'Address is required';
        if (!customer.state) newErrors.state = 'State is required';
        if (!customer.city) newErrors.city = 'City is required';
        if (!customer.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!pincodeRegex.test(customer.pincode)) {
            newErrors.pincode = 'Enter a valid 6-digit pincode';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                setDisable(true);
                const formData = new URLSearchParams();
                formData.append("name", customer.name);
                formData.append("email", customer.email);
                formData.append("phone", customer.phone);
                formData.append("conactPersonName", customer.conactPersonName);
                formData.append("contactPersonPhone", customer.contactPersonPhone);
                formData.append("address", customer.address);
                formData.append("addressTwo", customer.addressTwo);
                formData.append("addressThree", customer.addressThree);
                formData.append("state", customer.state);
                formData.append("city", customer.city);
                formData.append("pincode", customer.pincode);
                if (isDealer) {
                    formData.append("dealerId", dealerStorage?.DL_ID);
                }
                const url = isDealer ? "/dealer/manage-dealer-customer" : "/admin/manage-customer";
                const response = await post(url, formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
                const { message, success } = response;
                if (success) {
                    toast.success(message);
                    modal.hide();
                } else {
                    toast.error(message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Something went wrong");
            } finally {
                setDisable(false);
            }
        }
    };


    return (
        <>
            <ModalWrapper
                title="Customer Details"
                isShown={modal.isShown}
                hide={modal.hide}
                size={"xl"}
                footer={false}
            >
                <div className="row">
                    <div className="col-md-12">
                        <form>
                            <h5 className="card-title my-2">Customer Information</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={customer.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <small className="text-danger">{errors.name}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={customer.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <small className="text-danger">{errors.email}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mobile no. <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            name="phone"
                                            className="form-control"
                                            value={customer.phone}
                                            onChange={handleChange}
                                        />
                                        {errors.phone && (
                                            <small className="text-danger">{errors.phone}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Contact Person Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.conactPersonName}
                                            onChange={handleChange}
                                            name="conactPersonName"
                                        />
                                        {errors.conactPersonName && (
                                            <small className="text-danger">
                                                {errors.conactPersonName}
                                            </small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Contact Person Mobile no.
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={customer.contactPersonPhone}
                                            onChange={handleChange}
                                            name="contactPersonPhone"
                                        />
                                        {errors.contactPersonPhone && (
                                            <small className="text-danger">
                                                {errors.contactPersonPhone}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h5 className="card-title my-2">Postal Address</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Address <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.address}
                                            onChange={handleChange}
                                            name="address"
                                        />
                                        {errors.address && (
                                            <small className="text-danger">
                                                {errors.address}
                                            </small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address Two</label>
                                        <input type="text" className="form-control"
                                            value={customer.addressTwo}
                                            onChange={handleChange}
                                            name="addressTwo"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address Three</label>
                                        <input type="text" className="form-control"
                                            value={customer.addressThree}
                                            onChange={handleChange}
                                            name="addressThree"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">State <span className="text-danger">*</span></label>
                                        <select className="form-control"
                                            value={customer.state}
                                            onChange={handleChange}
                                            name="state"
                                        >
                                            <option value="">Select State</option>
                                            {stateData?.map((s) => (
                                                <option key={s.isoCode} value={s.name}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.state && (
                                            <small className="text-danger">
                                                {errors.state}
                                            </small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">City <span className="text-danger">*</span></label>
                                        <select className="form-control"
                                            value={customer.city}
                                            onChange={handleChange}
                                            name="city"
                                            disabled={!customer.state}
                                        >
                                            <option value="">Select City</option>
                                            {cityData?.map((c, idx) => (
                                                <option key={idx} value={c.name}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.city && (
                                            <small className="text-danger">
                                                {errors.city}
                                            </small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Pincode <span className="text-danger">*</span></label>
                                        <input type="number" className="form-control"
                                            value={customer.pincode}
                                            onChange={handleChange}
                                            name="pincode"
                                        />
                                        {errors.pincode && (
                                            <small className="text-danger">
                                                {errors.pincode}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={disable}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </ModalWrapper>
        </>
    );
}

export default PoCustomerModal