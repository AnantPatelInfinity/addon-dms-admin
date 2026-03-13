import React, { useEffect, useState } from "react";
import { useApi } from "../../../context/ApiContext";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import ImageUpload from "../../../components/Admin/ImageUpload/ImageUpload";
import { State, City } from "country-state-city";
import { statusList } from "../../../config/DataFile";
import { MultiSelect } from "primereact/multiselect";
import { DX_URL } from "../../../config/baseUrl";
import axios from "axios";

const ManageCompany = () => {
  const { post } = useApi();
  const [company, setCompany] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    phone: "",
    panNo: "",
    gstNo: "",
    signature: null,
    stamp: null,
    drugLicenseOne: "",
    drugLicenseTwo: "",
    address: "",
    addressTwo: "",
    addressThree: "",
    state: "",
    city: "",
    pincode: "",
    status: 2,
    firmId: [],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const adminStorage = getAdminStorage();
  const [errors, setErrors] = useState({});

  const [firms, setFirms] = useState([]);

  useEffect(() => {
    const fetchFirmData = async () => {
      try {
        const response = await axios.get(`${DX_URL}/admin/get-login-firm`);
        const { data, success } = response?.data;
        if (success) {
          setFirms(data);
        }
      } catch (error) {
        console.error("Failed to fetch firm data:", error);
      }
    };
    fetchFirmData();
  }, []);

  const data = location.state;
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    if (data) {
      setCompany({
        name: data?.name,
        email: data?.email,
        image: data?.image,
        phone: data?.phone,
        panNo: data?.panNo || "",
        gstNo: data?.gstNo || "",
        signature: data?.signature,
        stamp: data?.stamp,
        drugLicenseOne: data?.drugLicenseOne,
        drugLicenseTwo: data?.drugLicenseTwo,
        status: data.status,
        address: data?.address,
        addressTwo: data?.addressTwo || "",
        addressThree: data?.addressThree || "",
        state: data?.state,
        city: data?.city,
        pincode: data?.pincode,
        password: "",
        firmId: data?.firmId?.map((firm) => firm?._id) || [],
      });
    }
  }, [data]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (company.state) {
      const selectedState = states?.find(
        (state) => state.name === company.state
      );
      if (selectedState) {
        const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
        setCities(cityList);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [company.state, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));

    if (["address", "addressTwo", "addressThree"].includes(name)) {
      if (value.trim().endsWith(",")) {
        setErrors((prev) => ({
          ...prev,
          [name + "_comma"]: "Comma not allowed at end",
        }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name + "_comma"];
          return updated;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!company.name) newErrors.name = "Name is required";
    if (!company.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!company.phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(company.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!company.address) newErrors.address = "Address is required";
    if (!company.state) newErrors.state = "State is required";
    if (!company.city) newErrors.city = "City is required";
    if (!company.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(company.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }
    if (company?.firmId?.length === 0) {
      newErrors.firmId = "Firm is required";
    }
    if (!data?._id) {
      if (!company.password) {
        newErrors.password = "Password is required";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          company.password
        )
      ) {
        newErrors.password =
          "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters";
      }
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors)?.length > 0) return;
    setDisable(true);
    try {
      const formData = new URLSearchParams();
      formData.append("name", company.name);
      formData.append("email", company.email);
      formData.append("phone", company.phone);
      formData.append("status", company.status);
      formData.append("panNo", company.panNo);
      formData.append("gstNo", company.gstNo);
      formData.append("image", company.image);
      formData.append("drugLicenseOne", company.drugLicenseOne);
      formData.append("drugLicenseTwo", company.drugLicenseTwo);
      formData.append("address", company.address);
      formData.append("addressTwo", company.addressTwo);
      formData.append("addressThree", company.addressThree);
      formData.append("state", company.state);
      formData.append("city", company.city);
      formData.append("pincode", company.pincode);
      formData.append("firmId", JSON.stringify(company.firmId));
      if (company.signature) {
        formData.append("signature", company.signature);
      }
      // if (company.stamp) {
      //     formData.append("stamp", company.stamp);
      // }
      if (company.password) {
        formData.append("password", company.password);
      }

      const url = data?._id
        ? `/admin/manage-company/${data._id}`
        : `/admin/manage-company`;

      const response = await post(url, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const { success, message } = response;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.COMPANY_LIST);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
            value={company[name]}
            onChange={handleChange}
          />
          <label htmlFor={name}>
            {label} {required && <span className="text-danger">*</span>}
          </label>
          {errors[name] && (
            <div className="invalid-feedback">{errors[name]}</div>
          )}
          {errors[name + "_comma"] && (
            <div
              style={{ fontSize: "11px", color: "red", marginTop: "3px" }}
            >
              {errors[name + "_comma"]}
            </div>
          )}
        </div>
      </div>
    ));

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Company List", to: ADMIN_URLS.COMPANY_LIST },
            { label: `Company ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  Company {data?._id ? "Edit" : "Add"}
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""
                      }`}
                    name="name"
                    value={company.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <label>
                    Name <span className="text-danger">*</span>
                  </label>
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                    name="email"
                    value={company.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <label>
                    Email address <span className="text-danger">*</span>
                  </label>
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""
                      }`}
                    name="password"
                    value={company.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  <label>
                    Password <span className="text-danger">*</span>
                  </label>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              {renderInputs([
                {
                  label: "Mobile No.",
                  name: "phone",
                  type: "number",
                  required: true,
                },
                { label: "GST No.", name: "gstNo" },
                { label: "Pancard No.", name: "panNo" },
                { label: "Address 1", name: "address", required: true },
                { label: "Address 2", name: "addressTwo" },
                { label: "Landmark", name: "addressThree" },
              ])}
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${errors.state ? "is-invalid" : ""
                      }`}
                    name="state"
                    value={company.state}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        state: e.target.value,
                        city: "",
                      })
                    }
                  >
                    <option value="">Select State</option>
                    {states?.map((s) => (
                      <option key={s.isoCode} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <label>
                    State <span className="text-danger">*</span>
                  </label>
                  {errors.state && (
                    <div className="invalid-feedback">{errors.state}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${errors.city ? "is-invalid" : ""}`}
                    name="city"
                    value={company.city}
                    onChange={handleChange}
                    disabled={!company.state}
                  >
                    <option value="">Select City</option>
                    {cities?.map((c, idx) => (
                      <option key={idx} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label>
                    City <span className="text-danger">*</span>
                  </label>
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className={`form-control ${errors.pincode ? "is-invalid" : ""
                      }`}
                    name="pincode"
                    value={company.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                  />
                  <label>
                    Pincode <span className="text-danger">*</span>
                  </label>
                  {errors.pincode && (
                    <div className="invalid-feedback">{errors.pincode}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      disabled
                      style={{ height: "80px" }}
                      value={[
                        company.address,
                        company.addressThree,
                        company.addressTwo,
                        company.city && company.pincode
                          ? `${company.city} - ${company.pincode}`
                          : company.city || company.pincode,
                        company.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <label style={{ fontSize: "12px" }}>Address Preview</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {renderInputs([
                {
                  label: "Drug License No. (Form 20B)",
                  name: "drugLicenseOne",
                },
                {
                  label: "Drug License No. (Form 21B)",
                  name: "drugLicenseTwo",
                },
              ])}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={company.status}
                    name="status"
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    {statusList?.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  <label>Status</label>
                  {errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4">
                <div className="form-floating mb-3">
                  <MultiSelect
                    value={company.firmId}
                    options={firms.map((firm) => ({
                      label: firm.name,
                      value: firm._id,
                    }))}
                    onChange={(e) =>
                      setCompany((prev) => ({ ...prev, firmId: e.value }))
                    }
                    filter
                    maxSelectedLabels={3}
                    className={`w-100 form-select ${errors.firmId ? "border border-danger rounded" : ""}`}
                    optionLabel="label"
                    placeholder="Select Firms"
                  />
                  <label>Select Firm <span className="text-danger">*</span></label>
                  {errors.firmId && (
                    <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.firmId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <ImageUpload
                label="Logo"
                name="image"
                value={company.image}
                onChange={(k, v) => setCompany((p) => ({ ...p, [k]: v }))}
              />
              <ImageUpload
                label="Signature & Stamp"
                name="signature"
                value={company.signature}
                onChange={(k, v) => setCompany((p) => ({ ...p, [k]: v }))}
              />
              {/* <ImageUpload label="Stamp" name="stamp" value={company.stamp} onChange={(k, v) => setCompany(p => ({ ...p, [k]: v }))} /> */}
            </div>

            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="btn btn-light me-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={disable}
              >
                {disable ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompany;
