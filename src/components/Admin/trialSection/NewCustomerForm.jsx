import React, { useEffect, useState } from 'react'
import { customerTitle } from '../../../config/DataFile'
import { State, City } from 'country-state-city';

const NewCustomerForm = ({ trial, errors, handleCustomerChange, newCustomer, setNewCustomer }) => {

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const indianStates = State.getStatesOfCountry("IN");
        setStates(indianStates);
    }, []);

    useEffect(() => {
        if (newCustomer.state) {
            const selectedState = states?.find(state => state.name === newCustomer.state);
            if (selectedState) {
                const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
                setCities(cityList);
            } else {
                setCities([]);
            }
        } else {
            setCities([]);
        }
    }, [newCustomer.state, states]);

    return (
        <>
            {trial.customerType === "new" && (
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <select
                                className={`form-control form-select ${errors.title ? "is-invalid" : ""}`}
                                name="title"
                                value={newCustomer.title}
                                onChange={handleCustomerChange}
                            >
                                <option value="">Select Title</option>
                                {customerTitle?.map((e, i) =>
                                    <option value={e?.label} key={i}>{e?.label}</option>
                                )}
                            </select>
                            <label>Title <span className="text-danger">*</span></label>
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                name="name"
                                value={newCustomer.name}
                                onChange={handleCustomerChange}
                                placeholder="First Name"
                            />
                            <label>First Name <span className="text-danger">*</span></label>
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                name="lastName"
                                value={newCustomer.lastName}
                                onChange={handleCustomerChange}
                                placeholder="Last Name"
                            />
                            <label>Last Name <span className="text-danger">*</span></label>
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                name="email"
                                value={newCustomer.email}
                                onChange={handleCustomerChange}
                                placeholder="Email"
                            />
                            <label>Email <span className="text-danger">*</span></label>
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                name="phone"
                                value={newCustomer.phone}
                                onChange={handleCustomerChange}
                                placeholder="Phone"
                            />
                            <label>Phone <span className="text-danger">*</span></label>
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.clinicName ? "is-invalid" : ""}`}
                                name="clinicName"
                                value={newCustomer.clinicName}
                                onChange={handleCustomerChange}
                                placeholder="Clinic Name"
                            />
                            <label>Clinic Name <span className="text-danger">*</span></label>
                            {errors.clinicName && <div className="invalid-feedback">{errors.clinicName}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                name="address"
                                value={newCustomer.address}
                                onChange={handleCustomerChange}
                                placeholder="Address Line 1"
                            />
                            <label>Address Line 1 <span className="text-danger">*</span></label>
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="addressTwo"
                                value={newCustomer.addressTwo}
                                onChange={handleCustomerChange}
                                placeholder="Address Line 2"
                            />
                            <label>Address Line 2</label>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="addressThree"
                                value={newCustomer.addressThree}
                                onChange={handleCustomerChange}
                                placeholder="Address Line 3"
                            />
                            <label>Address Line 3</label>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <select
                                className={`form-select ${errors.state ? "is-invalid" : ""}`}
                                name="state"
                                value={newCustomer.state}
                                onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value, city: "" })}
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
                                value={newCustomer.city}
                                onChange={handleCustomerChange}
                                disabled={!newCustomer.state}
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

                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                                name="pincode"
                                value={newCustomer.pincode}
                                onChange={handleCustomerChange}
                                placeholder="Pincode"
                            />
                            <label>Pincode <span className="text-danger">*</span></label>
                            {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewCustomerForm