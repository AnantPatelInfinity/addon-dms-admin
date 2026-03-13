import React from "react";
import { Dropdown } from "primereact/dropdown";

const BillToSection = ({
  currentBillTo,
  billToOptions,
  handleBillToFieldChange,
  states,
  billCities,
  updateBillToFields,
  validationErrors,
}) => {
  const handleBillToChange = (e) => {
    const selectedOption = billToOptions.find(
      (option) => option._id === e.value
    );
    if (selectedOption) {
      updateBillToFields(selectedOption, selectedOption.type);
    }
  };

  const stateOptions = states.map((state) => ({
    label: state.name,
    value: state.name,
    _id: state.isoCode,
  }));

  const cityOptions = billCities.map((city) => ({
    label: city.name,
    value: city.name,
    _id: city.name,
  }));

  return (
    <div className="col-md-6 ">
      <div className="form-group">
        <label className="required-field">Bill To (Customer/Dealer)</label>
        <Dropdown
          name="billParty"
          value={currentBillTo?.billId || null}
          options={billToOptions}
          optionLabel={(option) => `${option.displayName} (${option.type})`}
          optionValue="_id"
          filter
          placeholder="Select Bill To (Customer/Dealer)"
          className={`w-100 ${
            validationErrors["billTo.party"] ? "is-invalid" : ""
          }`}
          valueTemplate={(selectedOption) => (
            <div className="d-flex align-items-center justify-content-between w-100">
              <span>
                {selectedOption ? selectedOption.displayName : "Select Bill To"}
              </span>
              {selectedOption && (
                <button
                  type="button"
                  className="btn p-0"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    updateBillToFields({ billId: null, billName: "", type: "" }, "");
                  }}
                >
                  <i className="ti ti-x text-danger me-2"></i>
                </button>
              )}
            </div>
          )}
          pt={{
            root: { className: "p-dropdown p-component form-select" },
            input: { className: "p-dropdown-label p-inputtext" },
            panel: { className: "p-dropdown-panel p-component" },
            item: { className: "p-dropdown-item" },
          }}
          onChange={(e) => {
            if (!e.value) {
              updateBillToFields({ billId: null, billName: "", type: "" }, "");
            } else {
              const selectedOption = billToOptions.find(
                (opt) => opt._id === e.value
              );
              updateBillToFields(selectedOption, selectedOption.type);
            }
          }}
          itemTemplate={(option) => (
            <div className="d-flex align-items-center p-2">
              <span
                className={`pi ${
                  option.type === "Dealer" ? "pi-briefcase" : "pi-user"
                } me-2 text-muted`}
              ></span>
              <div className="flex-grow-1 fw-semibold text-dark">
                {option.displayName}
              </div>
              <span
                className={`badge ${
                  option.type === "Dealer" ? "bg-primary" : "bg-success"
                } ms-2`}
              >
                {option.type}
              </span>
            </div>
          )}
        />
        {validationErrors["billTo.party"] && (
          <div className="invalid-feedback d-block">
            {validationErrors["billTo.party"]}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="required-field">Mail Name</label>
        <input
          type="text"
          className={`form-control ${
            validationErrors["billTo.mailName"] ? "is-invalid" : ""
          }`}
          name="mailName"
          value={currentBillTo?.mailName || ""}
          onChange={handleBillToFieldChange}
          placeholder="Enter mail name"
        />
        {validationErrors["billTo.mailName"] && (
          <div className="invalid-feedback">
            {validationErrors["billTo.mailName"]}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="required-field">Address</label>
        <textarea
          className={`form-control ${
            validationErrors["billTo.address"] ? "is-invalid" : ""
          }`}
          name="address"
          value={currentBillTo.address}
          onChange={handleBillToFieldChange}
          rows="3"
          placeholder="Enter complete address"
        />
        {validationErrors["billTo.address"] && (
          <div className="invalid-feedback">
            {validationErrors["billTo.address"]}
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="required-field">State</label>
            <Dropdown
              name="state"
              value={currentBillTo.state}
              onChange={(e) => {
                const event = { target: { name: "state", value: e.value } };
                handleBillToFieldChange(event);
              }}
              options={stateOptions}
              optionLabel="label"
              optionValue="value"
              filter
              placeholder="Select State"
              className={`w-100 ${
                validationErrors["billTo.state"] ? "is-invalid" : ""
              }`}
              pt={{
                root: { className: "p-dropdown p-component form-select" },
                input: { className: "p-dropdown-label p-inputtext" },
                panel: { className: "p-dropdown-panel p-component" },
                item: { className: "p-dropdown-item" },
              }}
            />
            {validationErrors["billTo.state"] && (
              <div className="invalid-feedback d-block">
                {validationErrors["billTo.state"]}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="required-field">City</label>
            <Dropdown
              name="city"
              value={currentBillTo.city}
              onChange={(e) => {
                const event = { target: { name: "city", value: e.value } };
                handleBillToFieldChange(event);
              }}
              options={cityOptions}
              optionLabel="label"
              optionValue="value"
              filter
              disabled={!currentBillTo.state}
              placeholder="Select City"
              className={`w-100 ${
                validationErrors["billTo.city"] ? "is-invalid" : ""
              }`}
              pt={{
                root: { className: "p-dropdown p-component form-select" },
                input: { className: "p-dropdown-label p-inputtext" },
                panel: { className: "p-dropdown-panel p-component" },
                item: { className: "p-dropdown-item" },
              }}
            />
            {validationErrors["billTo.city"] && (
              <div className="invalid-feedback d-block">
                {validationErrors["billTo.city"]}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="required-field">Pincode</label>
        <input
          type="number"
          className={`form-control ${
            validationErrors["billTo.pincode"] ? "is-invalid" : ""
          }`}
          name="pincode"
          value={currentBillTo.pincode || ""}
          onChange={handleBillToFieldChange}
          placeholder="Enter 6-digit pincode"
          maxLength="6"
        />
        {validationErrors["billTo.pincode"] && (
          <div className="invalid-feedback">
            {validationErrors["billTo.pincode"]}
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>GST Registration Type</label>
            <select
              className="form-control form-select"
              name="gstRegisterType"
              value={currentBillTo.gstRegisterType}
              onChange={handleBillToFieldChange}
            >
              <option value="">Select</option>
              <option value="Registered">Registered</option>
              <option value="Unregistered">Unregistered</option>
            </select>
          </div>
        </div>
        {currentBillTo.gstRegisterType === "Registered" && (
          <div className="col-md-6">
            <div className="form-group">
              <label className="required-field">GST No</label>
              <input
                type="text"
                className={`form-control ${
                  validationErrors["billTo.gstNo"] ? "is-invalid" : ""
                }`}
                name="gstNo"
                value={currentBillTo.gstNo}
                onChange={handleBillToFieldChange}
                disabled={currentBillTo.gstRegisterType === "Unregistered"}
                placeholder="Enter GST number"
                style={{ textTransform: "uppercase" }}
              />
              {validationErrors["billTo.gstNo"] && (
                <div className="invalid-feedback">
                  {validationErrors["billTo.gstNo"]}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Place of Supply</label>
        <input
          type="text"
          className="form-control"
          name="placeOfSupply"
          value={currentBillTo.placeOfSupply || ""}
          onChange={handleBillToFieldChange}
          placeholder="Place of supply"
        />
      </div>
    </div>
  );
};

export default BillToSection;
