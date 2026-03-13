import { Dropdown } from "primereact/dropdown";
// import NewCustomerForm from "./NewCustomerForm";

const CustomerSection = ({
    trial,
    handleChange,
    errors,
    customerList,
    selectedCustomer,
    setNewCustomer,
    newCustomer,
}) => {

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="mb-4">
            <h5 className="section-title mb-3 text-primary">Customer Details</h5>
            <div className="row">

                {/* <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-control form-select ${errors.customerType ? "is-invalid" : ""}`}
                            name="customerType"
                            value={trial.customerType}
                            onChange={handleChange}
                        >
                            <option value="">Select Customer Type</option>
                            <option value="new">New Customer</option>
                            <option value="existing">Existing Customer</option>
                        </select>
                        <label>Customer Type <span className="text-danger">*</span></label>
                        {errors.customerType && <div className="invalid-feedback">{errors.customerType}</div>}
                    </div>
                </div> */}

                {/* {trial.partyType && ( */}
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <Dropdown
                            name="customerId"
                            value={trial.customerId ? trial.customerId : null}
                            onChange={handleChange}
                            options={customerList}
                            optionLabel={(e) => `${e?.title} ${e?.name} ${e?.lastName} ${e?.clinicName ? `(${e?.clinicName})` : ''}`}
                            optionValue={(e) => e?._id || `${e.email}-${e.phone}-${e.name}`}
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
                            itemTemplate={(option, index) => (
                                <div key={option?._id || index}>
                                    <div>{option.title} {option.name} {option.lastName}</div>
                                    {option.clinicName && <div className="small text-muted">{option.clinicName}</div>}
                                </div>
                            )}
                        />
                        <label>Customer (Clinic / Hospital) <span className="text-danger">*</span></label>
                        {errors.customerId && <div className="invalid-feedback d-block">{errors.customerId}</div>}
                    </div>
                </div>
                {/* )} */}
            </div>

            {selectedCustomer && (
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="card border-primary">
                            <div className="card-header text-white">
                                <h6 className="mb-0">Customer Information</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="mb-2">
                                            <label className="text-muted small mb-1">Name</label>
                                            <p className="mb-0 fw-bold">{selectedCustomer.title} {selectedCustomer.name} {selectedCustomer.lastName} </p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="mb-2">
                                            <label className="text-muted small mb-1">Clinic Name</label>
                                            <p className="mb-0 fw-bold">{selectedCustomer.clinicName || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="mb-2">
                                            <label className="text-muted small mb-1">Phone</label>
                                            <p className="mb-0 fw-bold">{selectedCustomer.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <label className="text-muted small mb-1">Email</label>
                                            <p className="mb-0 fw-bold">{selectedCustomer.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <label className="text-muted smasll mb-1">Address</label>
                                            <p className="mb-0 fw-bold">
                                                {selectedCustomer.address}
                                                {selectedCustomer?.addressTwo && `, ${selectedCustomer.addressTwo}`}
                                                {selectedCustomer?.addressThree && `, ${selectedCustomer.addressThree}`}
                                                {`, ${selectedCustomer.city}, ${selectedCustomer.state} ${selectedCustomer.pincode}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <NewCustomerForm
                trial={trial}
                newCustomer={newCustomer}
                setNewCustomer={setNewCustomer}
                handleCustomerChange={handleCustomerChange}
                errors={errors}
            /> */}
        </div>
    )
}

export default CustomerSection
