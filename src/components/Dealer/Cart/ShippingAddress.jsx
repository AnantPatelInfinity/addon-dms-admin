import React, { useEffect, useState } from 'react'
import { State, City } from 'country-state-city';
import { useDispatch, useSelector } from 'react-redux';
import { getDeProfile } from '../../../middleware/dealerProfile/DealerProfile';

const ShippingAddress = ({ billTo, setBillTo, setShipTo, shipTo, errors, setErrors, setPo }) => {

    const dispatch = useDispatch()
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [customerCities, setCustomerCities] = useState([]);
    const { customerList } = useSelector((state) => state?.customer);
    const { dealerProfile } = useSelector((state) => state?.dealerProfile);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        if (selectedCustomer) {
            setPo((prev) => ({ ...prev, customerId: selectedCustomer?._id }))
        }
    }, [selectedCustomer])

    useEffect(() => {
        dispatch(getDeProfile());
        const indianStates = State.getStatesOfCountry("IN");
        setStates(indianStates);
    }, []);

    useEffect(() => {
        if (customerList && selectedCustomerId) {
            const findCustomer = customerList?.find((cu) => cu?._id === selectedCustomerId);
            setSelectedCustomer(findCustomer);

            if (findCustomer) {
                setShipTo(prev => ({
                    ...prev,
                    shipTo: "customer",
                    mailName: `${findCustomer?.title} ${findCustomer?.name} ${findCustomer?.lastName}` || "",
                    address: findCustomer?.address || "",
                    state: findCustomer?.state || "",
                    city: findCustomer?.city || "",
                    pincode: findCustomer?.pincode || "",
                    gstRegisterType: findCustomer?.gstRegisterType || "",
                    gstNo: findCustomer?.gstNo || ""
                }));
            }
        } else {
            setSelectedCustomer(null);
            if (dealerProfile) {
                setShipTo(prev => ({
                    ...prev,
                    shipTo: "dealer",
                    mailName: dealerProfile?.name || "",
                    address: dealerProfile?.address || "",
                    state: dealerProfile?.state || "",
                    city: dealerProfile?.city || "",
                    pincode: dealerProfile?.pincode || "",
                    gstRegisterType: dealerProfile?.gstRegisterType || "",
                    gstNo: dealerProfile?.gstNo || ""
                }));
            }
        }
    }, [selectedCustomerId, customerList, dealerProfile]);

    useEffect(() => {
        if (dealerProfile) {
            setBillTo({
                mailName: dealerProfile?.name || "",
                address: dealerProfile?.address || "",
                state: dealerProfile?.state || "",
                city: dealerProfile?.city || "",
                pincode: dealerProfile?.pincode || "",
                country: "India",
                gstRegisterType: dealerProfile?.gstRegisterType || "",
                gstNo: dealerProfile?.gstNo || ""
            });

            if (!selectedCustomerId) {
                setShipTo(prev => ({
                    ...prev,
                    shipTo: "dealer",
                    mailName: dealerProfile?.name || "",
                    address: dealerProfile?.address || "",
                    state: dealerProfile?.state || "",
                    city: dealerProfile?.city || "",
                    pincode: dealerProfile?.pincode || "",
                    country: "India",
                    gstRegisterType: dealerProfile?.gstRegisterType || "",
                    gstNo: dealerProfile?.gstNo || ""
                }));
            }
        }
    }, [dealerProfile]);

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        setSelectedCustomerId(customerId);
    };

    const handleShipToChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        if (name === "state") {
            setShipTo(prev => ({
                ...prev,
                [name]: value,
                city: ""
            }));
        } else if (name === "shipTo") {
            if (value === "dealer" && shipTo.shipTo === "customer") {
                setSelectedCustomerId("");
            }
            setShipTo(prev => ({
                ...prev,
                [name]: value
            }));
        } else if (name === "gstRegisterType") {
            // Clear GST number when register type is changed to "" or "unregistered"
            setShipTo(prev => ({
                ...prev,
                [name]: value,
                gstNo: (value === "registered") ? prev.gstNo : ""
            }));
        } else {
            setShipTo(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleBillToChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        if (name === "state") {
            setBillTo(prev => ({
                ...prev,
                [name]: value,
                city: ""
            }));
        } else if (name === "gstRegisterType") {
            // Clear GST number when register type is changed to "" or "unregistered"
            setBillTo(prev => ({
                ...prev,
                [name]: value,
                gstNo: (value === "registered") ? prev.gstNo : ""
            }));
        } else {
            setBillTo(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        if (billTo.state) {
            const selectedState = states?.find(state => state.name === billTo.state);
            if (selectedState) {
                const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
                setCities(cityList);
            } else {
                setCities([]);
            }
        } else {
            setCities([]);
        }
    }, [billTo.state, states]);

    useEffect(() => {
        if (shipTo.state) {
            const selectedState = states?.find(state => state.name === shipTo.state);
            if (selectedState) {
                const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
                setCustomerCities(cityList);
            } else {
                setCustomerCities([]);
            }
        } else {
            setCustomerCities([]);
        }
    }, [shipTo.state, states]);

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="page-title">Bill To</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="mailName"
                                        className={`form-control ${errors?.billMailName ? "is-invalid" : ""}`}
                                        placeholder="Mail Name"
                                        value={billTo.mailName}
                                        onChange={handleBillToChange}
                                    />
                                    <label>Mail Name <span className="text-danger">*</span></label>
                                    {errors?.billMailName && <div className="invalid-feedback">{errors?.billMailName}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="state"
                                        className={`form-select ${errors?.billState ? "is-invalid" : ""}`}
                                        value={billTo.state}
                                        onChange={handleBillToChange}
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state.isoCode} value={state.name}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>State <span className="text-danger">*</span></label>
                                    {errors?.billState && <div className="invalid-feedback">{errors?.billState}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="city"
                                        className={`form-select ${errors?.billCity ? "is-invalid" : ""}`}
                                        value={billTo.city}
                                        onChange={handleBillToChange}
                                        disabled={!billTo.state}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>City <span className="text-danger">*</span></label>
                                    {errors?.billCity && <div className="invalid-feedback">{errors?.billCity}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="number"
                                        name="pincode"
                                        className={`form-control ${errors?.billPincode ? "is-invalid" : ""}`}
                                        placeholder="Pincode"
                                        value={billTo.pincode}
                                        onChange={handleBillToChange}
                                    />
                                    <label>Pincode <span className="text-danger">*</span></label>
                                    {errors?.billPincode && <div className="invalid-feedback">{errors?.billPincode}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="gstRegisterType"
                                        className="form-select"
                                        value={billTo.gstRegisterType}
                                        onChange={handleBillToChange}
                                    >
                                        <option value="">Select GST Type</option>
                                        <option value="registered">Registered</option>
                                        <option value="unregistered">Unregistered</option>
                                    </select>
                                    <label>GST Register Type</label>
                                </div>
                            </div>

                            {billTo.gstRegisterType === "registered" && (
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            name="gstNo"
                                            className={`form-control ${errors?.billGstNo ? "is-invalid" : ""}`}
                                            placeholder="GST Number"
                                            value={billTo.gstNo}
                                            onChange={handleBillToChange}
                                        />
                                        <label>GST Number <span className="text-danger">*</span></label>
                                        {errors?.billGstNo && <div className="invalid-feedback">{errors?.billGstNo}</div>}
                                    </div>
                                </div>
                            )}

                            <div className="col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="address"
                                        className={`form-control ${errors?.billAddress ? "is-invalid" : ""}`}
                                        placeholder="Billing Address"
                                        value={billTo.address}
                                        onChange={handleBillToChange}
                                    />
                                    <label>Billing Address <span className="text-danger">*</span></label>
                                    {errors?.billAddress && <div className="invalid-feedback">{errors?.billAddress}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="page-title">Ship To</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        value={selectedCustomerId}
                                        onChange={handleCustomerChange}
                                    >
                                        <option value="">Select Customer</option>
                                        {customerList?.map(customer => (
                                            <option key={customer._id} value={customer._id}>
                                                {customer?.title} {customer.name} {customer?.lastName} ({customer?.clinicName})
                                            </option>
                                        ))}
                                    </select>
                                    <label>Customer (Clinic / Hospital)<span className="text-danger">*</span></label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="shipTo"
                                        onChange={handleShipToChange}
                                        value={shipTo.shipTo}
                                        className={`form-select ${errors?.shipTo ? "is-invalid" : ""}`}
                                        disabled={!selectedCustomerId}
                                    >
                                        <option value="dealer">Dealer</option>
                                        <option value="customer">Customer</option>
                                    </select>
                                    <label>Ship To <span className="text-danger">*</span></label>
                                    {errors?.shipTo && <div className="invalid-feedback">{errors?.shipTo}</div>}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="mailName"
                                        className={`form-control ${errors?.mailName ? "is-invalid" : ""}`}
                                        placeholder="Name"
                                        value={shipTo.mailName}
                                        onChange={handleShipToChange}
                                    />
                                    <label>Mail Name <span className="text-danger">*</span></label>
                                    {errors?.mailName && <div className="invalid-feedback">{errors?.mailName}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="state"
                                        className={`form-select ${errors?.state ? "is-invalid" : ""}`}
                                        value={shipTo.state}
                                        onChange={handleShipToChange}
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state.isoCode} value={state.name}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>State <span className="text-danger">*</span></label>
                                    {errors?.state && <div className="invalid-feedback">{errors?.state}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="city"
                                        className={`form-select ${errors?.city ? "is-invalid" : ""}`}
                                        value={shipTo.city}
                                        onChange={handleShipToChange}
                                        disabled={!shipTo.state}
                                    >
                                        <option value="">Select City</option>
                                        {customerCities.map(city => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>City <span className="text-danger">*</span></label>
                                    {errors?.city && <div className="invalid-feedback">{errors?.city}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="number"
                                        name="pincode"
                                        className={`form-control ${errors?.pincode ? "is-invalid" : ""}`}
                                        placeholder="Pincode"
                                        value={shipTo.pincode}
                                        onChange={handleShipToChange}
                                    />
                                    <label>Pincode <span className="text-danger">*</span></label>
                                    {errors?.pincode && <div className="invalid-feedback">{errors?.pincode}</div>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="form-floating mb-3">
                                    <select
                                        name="gstRegisterType"
                                        className={`form-select ${errors?.gstRegisterType ? "is-invalid" : ""}`}
                                        value={shipTo.gstRegisterType}
                                        onChange={handleShipToChange}
                                    >
                                        <option value="">Select GST Type</option>
                                        <option value="registered">Registered</option>
                                        <option value="unregistered">Unregistered</option>
                                    </select>
                                    <label>GST Register Type</label>
                                </div>
                            </div>

                            {shipTo.gstRegisterType === "registered" && (
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            name="gstNo"
                                            className={`form-control ${errors?.gstNo ? "is-invalid" : ""}`}
                                            placeholder="GST Number"
                                            value={shipTo.gstNo}
                                            onChange={handleShipToChange}
                                        />
                                        <label>GST Number <span className="text-danger">*</span></label>
                                        {errors?.gstNo && <div className="invalid-feedback">{errors?.gstNo}</div>}
                                    </div>
                                </div>
                            )}

                            <div className="col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        name="address"
                                        className={`form-control ${errors?.address ? "is-invalid" : ""}`}
                                        placeholder="Delivery Address"
                                        value={shipTo.address}
                                        onChange={handleShipToChange}
                                    />
                                    <label>Delivery Address <span className="text-danger">*</span></label>
                                    {errors?.address && <div className="invalid-feedback">{errors?.address}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingAddress