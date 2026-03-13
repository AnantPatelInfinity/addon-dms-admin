import { Dropdown } from "primereact/dropdown";

const CustomerSection = ({
  trial,
  handleChange,
  errors,
  selectedCustomer,
  dealers,
  customers,
}) => {

  const handleTypeChange = (e) => {
    const { value } = e.target;
    handleChange({ target: { name: "partyType", value } });
    handleChange({ target: { name: "partyId", value: "" } });
  };

  return (
    <div className="mb-4">
      <h5 className="section-title mb-3 text-primary">Party Details</h5>

      <div className="row">
        {/* Select Dealer or Customer */}
        {/* <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <select
              className={`form-control form-select ${errors.partyType ? "is-invalid" : ""}`}
              name="partyType"
              value={trial.partyType || ""}
              onChange={handleTypeChange}
            >
              <option value="">Select Party Type</option>
              <option value="CUSTOMER">Customer</option>
              <option value="DEALER">Dealer</option>
            </select>
            <label>Type <span className="text-danger">*</span></label>
            {errors.partyType && <div className="invalid-feedback">{errors.partyType}</div>}
          </div>
        </div> */}

        {/* Dynamic dropdown depending on selected type */}
        {/* {trial.partyType && ( */}
        <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <Dropdown
              name="customerId"
              value={trial.customerId ? trial.customerId : null}
              onChange={handleChange}
              options={customers}
              optionLabel={(e) =>
                `${e?.title} ${e?.name} ${e?.lastName} ${e?.clinicName ? `(${e?.clinicName})` : ""}`
              }
              optionValue={(e) => e?._id}
              showClear
              filter
              placeholder={`Select Customer`}
              className={`w-100 ${errors.customerId ? "is-invalid" : ""}`}
              pt={{
                root: { className: "p-dropdown p-component form-select" },
                input: { className: "p-dropdown-label p-inputtext" },
                panel: { className: "p-dropdown-panel p-component" },
                item: { className: "p-dropdown-item" },
              }}
              itemTemplate={(option, index) => (
                <div key={option?._id || index}>
                  <div>{option.title} {option.name} {option.lastName}</div>
                  {option.clinicName && <div className="small text-muted">{option.clinicName}</div>}
                </div>
              )}
            />
            <label>
              Customer{" "}
              <span className="text-danger">*</span>
            </label>
            {errors.customerId && <div className="invalid-feedback d-block">{errors.customerId}</div>}
          </div>
        </div>
        {/* )} */}
      </div>

      {/* Selected info preview */}
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
                    <label className="text-muted small mb-1">Name</label>
                    <p className="mb-0 fw-bold">
                      {selectedCustomer?.title} {selectedCustomer?.name} {selectedCustomer?.lastName}
                    </p>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small mb-1">Phone</label>
                    <p className="mb-0 fw-bold">{selectedCustomer?.phone || ""}</p>
                  </div>
                  <div className="col-md-3">
                    <label className="text-muted small mb-1">Email</label>
                    <p className="mb-0 fw-bold">{selectedCustomer?.email || ""}</p>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="text-muted small mb-1">Address</label>
                    <p className="mb-0 fw-bold">
                      {selectedCustomer?.address}
                      {selectedCustomer?.addressTwo && `, ${selectedCustomer.addressTwo}`}
                      {selectedCustomer?.addressThree && `, ${selectedCustomer.addressThree}`}
                      {`, ${selectedCustomer?.city}, ${selectedCustomer?.state} ${selectedCustomer?.pincode}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSection;
