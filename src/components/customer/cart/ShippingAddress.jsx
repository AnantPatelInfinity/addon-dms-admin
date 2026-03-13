import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";

const ShippingAddress = ({ shipTo, setShipTo, errors, setErrors }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (shipTo.state) {
      const selectedState = states.find((state) => state.name === shipTo.state);
      if (selectedState) {
        const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
        setCities(cityList);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [shipTo.state, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "state") {
      setShipTo((prev) => ({ ...prev, state: value, city: "" }));
    } else if (name === "gstRegisterType") {
      setShipTo((prev) => ({
        ...prev,
        gstRegisterType: value,
        gstNo: value === "registered" ? prev.gstNo : "",
      }));
    } else {
      setShipTo((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card shadow-none">
          <div className="card-header bg-light">
            <h5 className="mb-0">Shipping / Billing Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Full Name */}
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="mailName"
                    className={`form-control ${errors?.mailName ? "is-invalid" : ""}`}
                    placeholder="Full Name"
                    value={shipTo.mailName}
                    onChange={handleChange}
                  />
                  <label>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  {errors?.mailName && (
                    <div className="invalid-feedback">{errors.mailName}</div>
                  )}
                </div>
              </div>

              {/* State */}
              <div className="col-lg-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    name="state"
                    className={`form-select ${errors?.state ? "is-invalid" : ""}`}
                    value={shipTo.state}
                    onChange={handleChange}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <label>
                    State <span className="text-danger">*</span>
                  </label>
                  {errors?.state && (
                    <div className="invalid-feedback">{errors.state}</div>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="col-lg-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    name="city"
                    className={`form-select ${errors?.city ? "is-invalid" : ""}`}
                    value={shipTo.city}
                    onChange={handleChange}
                    disabled={!shipTo.state}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <label>
                    City <span className="text-danger">*</span>
                  </label>
                  {errors?.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className="col-lg-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    name="pincode"
                    className={`form-control ${errors?.pincode ? "is-invalid" : ""}`}
                    placeholder="Pincode"
                    value={shipTo.pincode}
                    onChange={handleChange}
                  />
                  <label>
                    Pincode <span className="text-danger">*</span>
                  </label>
                  {errors?.pincode && (
                    <div className="invalid-feedback">{errors.pincode}</div>
                  )}
                </div>
              </div>

              {/* GST Register Type */}
              <div className="col-lg-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    name="gstRegisterType"
                    className={`form-select ${errors?.gstRegisterType ? "is-invalid" : ""}`}
                    value={shipTo.gstRegisterType}
                    onChange={handleChange}
                  >
                    <option value="">Select GST Type</option>
                    <option value="registered">Registered</option>
                    <option value="unregistered">Unregistered</option>
                  </select>
                  <label>GST Register Type</label>
                </div>
              </div>

              {/* GST Number (only if registered) */}
              {shipTo.gstRegisterType === "registered" && (
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      name="gstNo"
                      className={`form-control ${errors?.gstNo ? "is-invalid" : ""}`}
                      placeholder="GST Number"
                      value={shipTo.gstNo}
                      onChange={handleChange}
                    />
                    <label>
                      GST Number <span className="text-danger">*</span>
                    </label>
                    {errors?.gstNo && (
                      <div className="invalid-feedback">{errors.gstNo}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="address"
                    className={`form-control ${errors?.address ? "is-invalid" : ""}`}
                    placeholder="Delivery Address"
                    value={shipTo.address}
                    onChange={handleChange}
                  />
                  <label>
                    Delivery Address <span className="text-danger">*</span>
                  </label>
                  {errors?.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
