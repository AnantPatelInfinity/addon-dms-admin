import { Dropdown } from 'primereact/dropdown'

const ShipToSection = ({
    currentShipTo,
    shipToOptions,
    states,
    shipCities,
    isIGST,
    handleShipToFieldChange,
    updateShipToFields,
    validationErrors
}) => {
    const handleShipToChange = (e) => {
        const selectedOption = shipToOptions.find(option => option._id === e.value);
        if (selectedOption) {
            updateShipToFields(selectedOption, selectedOption.type);
        }
    };

    const stateOptions = states.map(state => ({
        label: state.name,
        value: state.name,
        _id: state.isoCode
    }));

    const cityOptions = shipCities.map(city => ({
        label: city.name,
        value: city.name,
        _id: city.name
    }));

    return (
        <div className="col-md-6">
            <div className="form-group">
                <label className="required-field">Ship To (Customer/Dealer)</label>
                <Dropdown
                    name="shipParty"
                    value={currentShipTo.shipId || null}
                    options={shipToOptions}
                    onChange={handleShipToChange}
                    optionLabel={(option) => `${option.displayName} (${option.type})`}
                    optionValue="_id"
                    filter
                    valueTemplate={(selectedOption) => (
                        <div className="d-flex align-items-center justify-content-between w-100">
                        <span>
                            {selectedOption ? selectedOption.displayName : "Select Ship To"}
                        </span>
                        {selectedOption && (
                            <button
                            type="button"
                            className="btn p-0"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                updateShipToFields({ billId: null, billName: "", type: "" }, "");
                            }}
                            >
                            <i className="ti ti-x text-danger me-2"></i>
                            </button>
                        )}
                        </div>
                    )}
                    placeholder="Select Ship To (Customer/Dealer)"
                    className={`w-100 ${validationErrors['shipTo.party'] ? 'is-invalid' : ''}`}
                    pt={{
                        root: { className: 'p-dropdown p-component form-select' },
                        input: { className: 'p-dropdown-label p-inputtext' },
                        panel: { className: 'p-dropdown-panel p-component' },
                        item: { className: 'p-dropdown-item' }
                    }}
                    itemTemplate={(option) => (
                        <div className="d-flex align-items-center p-2">
                            <span className={`pi ${option.type === 'Dealer' ? 'pi-briefcase' : 'pi-user'} me-2 text-muted`}></span>
                            <div className="flex-grow-1">
                                <div className="fw-semibold text-dark">{option.displayName}</div>
                            </div>
                            <span className={`badge ${option.type === 'Dealer' ? 'bg-primary' : 'bg-success'} ms-2`}>
                                {option.type}
                            </span>
                        </div>
                    )}
                />
                {validationErrors['shipTo.party'] && (
                    <div className="invalid-feedback d-block">{validationErrors['shipTo.party']}</div>
                )}
            </div>

            <div className="form-group">
                <label className="required-field">Mail Name</label>
                <input
                    type="text"
                    className={`form-control ${validationErrors['shipTo.mailName'] ? 'is-invalid' : ''}`}
                    name="mailName"
                    value={currentShipTo.mailName || ""}
                    onChange={handleShipToFieldChange}
                    placeholder="Enter mail name"
                />
                {validationErrors['shipTo.mailName'] && (
                    <div className="invalid-feedback">{validationErrors['shipTo.mailName']}</div>
                )}
            </div>

            <div className="form-group">
                <label className="required-field">Address</label>
                <textarea
                    className={`form-control ${validationErrors['shipTo.address'] ? 'is-invalid' : ''}`}
                    name="address"
                    value={currentShipTo.address}
                    onChange={handleShipToFieldChange}
                    rows="3"
                    placeholder="Enter complete address"
                />
                {validationErrors['shipTo.address'] && (
                    <div className="invalid-feedback">{validationErrors['shipTo.address']}</div>
                )}
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="required-field">State</label>
                        <Dropdown
                            name="state"
                            value={currentShipTo.state}
                            onChange={(e) => {
                                const event = { target: { name: 'state', value: e.value } };
                                handleShipToFieldChange(event);
                            }}
                            options={stateOptions}
                            optionLabel="label"
                            optionValue="value"
                            filter
                            placeholder="Select State"
                            className={`w-100 ${validationErrors['shipTo.state'] ? 'is-invalid' : ''}`}
                            pt={{
                                root: { className: 'p-dropdown p-component form-select' },
                                input: { className: 'p-dropdown-label p-inputtext' },
                                panel: { className: 'p-dropdown-panel p-component' },
                                item: { className: 'p-dropdown-item' }
                            }}
                        />
                        {validationErrors['shipTo.state'] && (
                            <div className="invalid-feedback d-block">{validationErrors['shipTo.state']}</div>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="required-field">City</label>
                        <Dropdown
                            name="city"
                            value={currentShipTo.city}
                            onChange={(e) => {
                                const event = { target: { name: 'city', value: e.value } };
                                handleShipToFieldChange(event);
                            }}
                            options={cityOptions}
                            optionLabel="label"
                            optionValue="value"
                            filter
                            disabled={!currentShipTo.state}
                            placeholder="Select City"
                            className={`w-100 ${validationErrors['shipTo.city'] ? 'is-invalid' : ''}`}
                            pt={{
                                root: { className: 'p-dropdown p-component form-select' },
                                input: { className: 'p-dropdown-label p-inputtext' },
                                panel: { className: 'p-dropdown-panel p-component' },
                                item: { className: 'p-dropdown-item' }
                            }}
                        />
                        {validationErrors['shipTo.city'] && (
                            <div className="invalid-feedback d-block">{validationErrors['shipTo.city']}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="required-field">Pincode</label>
                <input
                    type="number"
                    className={`form-control ${validationErrors['shipTo.pincode'] ? 'is-invalid' : ''}`}
                    name="pincode"
                    value={currentShipTo.pincode || ""}
                    onChange={handleShipToFieldChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                />
                {validationErrors['shipTo.pincode'] && (
                    <div className="invalid-feedback">{validationErrors['shipTo.pincode']}</div>
                )}
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>GST Registration Type</label>
                        <select
                            className="form-control form-select"
                            name="gstRegisterType"
                            value={currentShipTo.gstRegisterType}
                            onChange={handleShipToFieldChange}
                        >
                            <option value="">Select</option>
                            <option value="Registered">Registered</option>
                            <option value="Unregistered">Unregistered</option>
                        </select>
                    </div>
                </div>
                {currentShipTo.gstRegisterType === "Registered" && (
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required-field">GST No</label>
                            <input
                                type="text"
                                className={`form-control ${validationErrors['shipTo.gstNo'] ? 'is-invalid' : ''}`}
                                name="gstNo"
                                value={currentShipTo.gstNo}
                                onChange={handleShipToFieldChange}
                                disabled={currentShipTo.gstRegisterType === 'Unregistered'}
                                placeholder="Enter GST number"
                                style={{ textTransform: 'uppercase' }}
                            />
                            {validationErrors['shipTo.gstNo'] && (
                                <div className="invalid-feedback">{validationErrors['shipTo.gstNo']}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="row mt-3">
                <div className="col-12 text-center">
                    <h5>
                        <span className={`igst-label ${isIGST ? 'igst-true' : 'igst-false'}`}>
                            {isIGST ? 'IGST Applicable' : 'CGST + SGST Applicable'}
                        </span>
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default ShipToSection