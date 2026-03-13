import React, { useEffect, useState } from 'react'
import { State, City } from 'country-state-city';
import { useLocation, useNavigate } from 'react-router';
import { useApi } from '../../../context/ApiContext';
import { toast } from 'react-toastify';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import ImageUpload from '../../../components/Admin/ImageUpload/ImageUpload';

const ManageFirm = () => {
  const { post } = useApi();
  const [firm, setFirm] = useState({
    name: "",
    email: "",
    address: "",
    addressTwo: "",
    addressThree: "",
    state: "",
    city: "",
    pincode: "",
    mobileNo: " ",
    registerNo: "",
    image: null,
    gstNo: "",
    signature: null,
    stamp: null,
    drugLicenseOne: "",
    drugLicenseTwo: "",
    panNo: "",
    status: true,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const data = location.state;
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (data) {
      setFirm({
        ...data,
        status: typeof data.status === "boolean" ? data.status : true,
      });
    }
  }, [data]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (firm.state) {
      const selectedState = states?.find(state => state.name === firm.state);
      if (selectedState) {
        const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
        setCities(cityList);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [firm.state, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFirm({ ...firm, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!firm.name) newErrors.name = "Name is required";
    if (!firm.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(firm.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!firm.mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(firm.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    }
    if (!firm.address) newErrors.address = "Address is required";
    if (!firm.state) newErrors.state = "State is required";
    if (!firm.city) newErrors.city = "City is required";
    if (!firm.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(firm.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setDisable(true);
    try {
      const formData = new URLSearchParams();
      formData.append("name", firm.name);
      formData.append("email", firm.email);
      formData.append("address", firm.address);
      formData.append("addressTwo", firm.addressTwo);
      formData.append("addressThree", firm.addressThree);
      formData.append("state", firm.state);
      formData.append("city", firm.city);
      formData.append("pincode", firm.pincode);
      formData.append("mobileNo", firm.mobileNo);
      // formData.append("registerNo", firm.registerNo);
      formData.append("gstNo", firm.gstNo);
      formData.append("image", firm.image);
      formData.append("status", firm.status);

      if (firm.signature) {
        formData.append("signature", firm.signature);
      }
      // if (firm.stamp) {
      //   formData.append("stamp", firm.stamp);
      // }
      if (firm.drugLicenseOne) {
        formData.append("drugLicenseOne", firm.drugLicenseOne);
      }
      if (firm.drugLicenseTwo) {
        formData.append("drugLicenseTwo", firm.drugLicenseTwo);
      }
      if (firm.panNo) {
        formData.append("panNo", firm.panNo);
      }

      if (data?._id) {
        formData.append("id", data._id)
      }
      const response = await post("/admin/manage-firm", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const { message, success } = response;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.FIRM_LIST);
        setFirm({})
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };


  const renderInputs = (fields) =>
    fields.map(({ label, name, type = "text", required }) => (
      <div className="col-lg-4 col-md-6 col-12" key={name}>
        <div className="form-floating mb-3">
          <input
            type={type}
            name={name}
            id={name}
            placeholder={label}
            className={`form-control ${errors[name] ? "is-invalid" : ""}`}
            value={firm[name]}
            onChange={handleChange}
          />
          <label htmlFor={name}>{label} {required && <span className="text-danger">*</span>}</label>
          {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
        </div>
      </div>
    ));

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Firm List", to: ADMIN_URLS.FIRM_LIST },
            { label: `Firm ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Firm {data?._id ? "Edit" : "Add"}</h4>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {renderInputs([
                { label: "Name", name: "name", required: true },
                { label: "Email address", name: "email", type: "email", required: true },
                { label: "Mobile No.", name: "mobileNo", type: "number", required: true }
              ])}
            </div>
            <div className="row">
              {renderInputs([
                { label: "Address 1", name: "address", required: true },
                { label: "Address 2", name: "addressTwo" },
                { label: "Landmark", name: "addressThree" },
              ])}
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${errors.state ? "is-invalid" : ""}`}
                    name="state"
                    value={firm.state}
                    onChange={(e) => setFirm({ ...firm, state: e.target.value, city: "" })}
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
                    value={firm.city}
                    onChange={handleChange}
                    disabled={!firm.state}
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
                    value={firm.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                  />
                  <label>Pincode <span className="text-danger">*</span></label>
                  {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                </div>
              </div>
            </div>

            <div className='row'>
              {renderInputs([
                { label: "GST No.", name: "gstNo" },
                { label: "Pancard No.", name: "panNo" }
              ])}
            </div>

            <div className="row">
              {renderInputs([
                { label: "Drug License No. (Form 20B)", name: "drugLicenseOne" },
                { label: "Drug License No. (Form 21B)", name: "drugLicenseTwo" }
              ])}
            </div>

            <div className="row">
              <ImageUpload label="Logo" name="image" value={firm.image} onChange={(k, v) => setFirm(p => ({ ...p, [k]: v }))} />
              <ImageUpload label="Signature & Stamp" name="signature" value={firm.signature} onChange={(k, v) => setFirm(p => ({ ...p, [k]: v }))} />
              {/* <ImageUpload label="Stamp" name="stamp" value={firm.stamp} onChange={(k, v) => setFirm(p => ({ ...p, [k]: v }))} /> */}

              {data?._id && (
                <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
                  <h6 className="mb-3">Status</h6>
                  <div className="form-check form-check-md form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="switch-md"
                      checked={firm.status}
                      onChange={(e) => setFirm({ ...firm, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {firm.status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={disable}>
                {disable ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageFirm