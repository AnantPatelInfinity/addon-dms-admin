import React, { useState } from 'react';
import ServiceDetails from './ServiceDetails';
import { Dropdown } from "primereact/dropdown";
import moment from 'moment';


const ServiceForm = ({
    service,
    handleChange,
    errors,
    dropdowns,
    handleComplainChange,
    complain,
}) => {

    return (
        <>
            <div className="container-fluid">
                {/* Main Form Section */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-gradient-primary text-white">
                        <h5 className="mb-0 fw-bold">
                            <i className="fas fa-tools me-2"></i>Service Information
                        </h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-3">
                            <div className="col-lg-4 col-md-6">
                                <div className="form-floating">
                                    <input
                                        type='date'
                                        className={`form-control ${errors.serviceDate ? "is-invalid" : ""}`}
                                        name="serviceDate"
                                        value={service.serviceDate}
                                        onChange={handleChange}
                                        max={moment().format("YYYY-MM-DD")}  
                                    />
                                    <label>Service Date <span className="text-danger">*</span></label>
                                    {errors.serviceDate && <div className="invalid-feedback">{errors.serviceDate}</div>}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-floating">
                                    {/* <select
                                        className={`form-control form-select ${errors.customerId ? "is-invalid" : ""}`}
                                        name="customerId"
                                        value={service.customerId}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Customer</option>
                                        {dropdowns?.customerData.map(customer => (
                                            <option key={customer._id} value={customer._id}>
                                                {customer.title}  {customer.name} {customer.lastName} ({customer.clinicName})
                                            </option>
                                        ))}
                                    </select> */}
                                    <Dropdown
                                        name="customerId"
                                        value={service.customerId}
                                        onChange={handleChange}
                                        options={dropdowns?.customerData}
                                        optionLabel={(e) => `${e?.title} ${e?.name} ${e?.lastName} ${e?.clinicName ? `(${e?.clinicName})` : ''}`}
                                        optionValue="_id"
                                        showClear
                                        filter
                                        placeholder="Select Customer"
                                        className={`w-100 ${errors.customerId ? 'is-invalid' : ''}`}
                                        pt={{
                                            root: { className: 'p-dropdown p-component form-select' },
                                            input: { className: 'p-dropdown-label p-inputtext' },
                                            panel: { className: 'p-dropdown-panel p-component' },
                                            item: { className: 'p-dropdown-item' }
                                        }}
                                        itemTemplate={(option) => (
                                            <div>
                                                <div>{option.title} {option.name} {option.lastName}</div>
                                                {option.clinicName && <div className="small text-muted">{option.clinicName}</div>}
                                            </div>
                                        )}
                                    />
                                    <label>Customer (Clinic / Hospital)<span className="text-danger">*</span></label>
                                    {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
                                </div>
                            </div>

                            {service.customerId && (
                                <div className="col-lg-4 col-md-6">
                                    <div className="form-floating">
                                        {/* <select
                                            className={`form-control form-select ${errors.serialNoId ? "is-invalid" : ""}`}
                                            name="serialNoId"
                                            value={service.serialNoId}
                                            onChange={handleChange}
                                        // disabled={!dropdowns.filteredSerialNoData?.length}
                                        >
                                            <option value="">Select Serial Number</option>
                                            {dropdowns.filteredSerialNoData?.map(serial => (
                                                <option key={serial._id} value={serial._id}>
                                                    {serial.companySerialNo}
                                                </option>
                                            ))}
                                        </select> */}
                                        <Dropdown
                                            name="serialNoId"
                                            value={service.serialNoId}
                                            onChange={handleChange}
                                            options={dropdowns?.filteredSerialNoData}
                                            optionLabel="companySerialNo"
                                            optionValue="_id"
                                            placeholder="Select Machine Serial No"
                                            filter
                                            showClear
                                            className={`w-100 ${errors.serialNoId ? 'is-invalid' : ''}`}
                                            pt={{
                                                root: { className: 'p-dropdown p-component form-select' },
                                                input: { className: 'p-dropdown-label p-inputtext' },
                                                panel: { className: 'p-dropdown-panel p-component' },
                                                item: { className: 'p-dropdown-item' },
                                                filterInput: { className: 'p-dropdown-filter p-inputtext p-component' }
                                            }}
                                        />
                                        <label>Serial Number <span className="text-danger">*</span></label>
                                        {errors.serialNoId && <div className="invalid-feedback">{errors.serialNoId}</div>}
                                    </div>
                                </div>
                            )}

                            <div className="col-lg-4 col-md-6">
                                <div className="form-floating">
                                    <select
                                        className={`form-control ${errors.requestBy ? "is-invalid" : ""}`}
                                        name="requestBy"
                                        value={service.requestBy}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Requested By</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="engineer">Engineer</option>
                                    </select>
                                    <label>Requested By <span className="text-danger">*</span></label>
                                    {errors.requestBy && <div className="invalid-feedback">{errors.requestBy}</div>}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-floating">
                                    <input
                                        type='text'
                                        className={`form-control ${errors.engineerName ? "is-invalid" : ""}`}
                                        name="engineerName"
                                        value={service.engineerName}
                                        onChange={handleChange}
                                        placeholder='Engineer'
                                    />
                                    <label>Name <span className="text-danger">*</span></label>
                                    {errors.engineerName && <div className="invalid-feedback">{errors.engineerName}</div>}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-floating">
                                    <div className={`border rounded px-3 pt-2 pb-3 h-100 ${errors.serviceProcessType ? 'is-invalid' : ''}`}>
                                        <label className="mb-2 d-block">
                                            Service Process Type <span className="text-danger">*</span>
                                        </label>

                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="serviceProcessType"
                                                id="proceedFurther"
                                                value="1"
                                                checked={service.serviceProcessType === "1" || service.serviceProcessType === 1}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="proceedFurther">
                                                Proceed Further
                                            </label>
                                        </div>

                                        <div className="form-check mt-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="serviceProcessType"
                                                id="resolved"
                                                value="2"
                                                checked={service.serviceProcessType === "2" || service.serviceProcessType === 2}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="resolved">
                                                Resolved
                                            </label>
                                        </div>
                                    </div>
                                    {/* Required for Bootstrap floating label layout even if empty */}
                                    <label className="invisible">Service Process Type</label>
                                    {errors.serviceProcessType && (
                                        <div className="invalid-feedback d-block">{errors.serviceProcessType}</div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-floating">
                                    <textarea
                                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        name="description"
                                        value={complain.description}
                                        onChange={handleComplainChange}
                                        style={{ height: "100px" }}
                                        placeholder="Describe the issue..."
                                    />
                                    <label>Nature Of Complain <span className="text-danger">*</span></label>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-floating">
                                    <textarea
                                        className={`form-control ${errors.engineerRemarks ? "is-invalid" : ""}`}
                                        name="engineerRemarks"
                                        value={service.engineerRemarks}
                                        onChange={handleChange}
                                        style={{ height: "100px" }}
                                        placeholder="Add your remarks..."
                                    />
                                    <label>Engineer Remarks <span className="text-danger">*</span></label>
                                    {errors.engineerRemarks && <div className="invalid-feedback">{errors.engineerRemarks}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Data Section */}
                <ServiceDetails service={service} dropdowns={dropdowns} />
            </div>
        </>
    )
}

export default ServiceForm