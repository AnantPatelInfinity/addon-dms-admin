import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { State, City } from "country-state-city";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import {
  customerRegisterType,
  customerTitle,
  statusList,
} from "../../../config/DataFile";
import axios from "axios";
import { DX_URL } from "../../../config/baseUrl";
import { toast } from "react-toastify";
import { FileUpload } from "../../../components/FileUpload/FileUpload";

const ManageDealerCustomer = () => {
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const dealerStorage = getDealerStorage();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    lastName: "",
    title: "",
    clinicName: "",
    email: "",
    password: "",
    address: "",
    addressTwo: "",
    addressThree: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    status: "",
    gstNo: "",
    panNo: "",
    image: null,
    signature: null,
    stamp: null,
    drugLicenseOne: "",
    drugLicenseTwo: "",
    isRegistrationType: "",
  });

  useEffect(() => {
    if (data?._id) {
      setCustomer({
        name: data?.name,
        lastName: data?.lastName || "",
        title: data?.title || "",
        clinicName: data?.clinicName || "",
        email: data?.email,
        password: "",
        address: data?.address,
        addressTwo: data?.addressTwo || "",
        addressThree: data?.addressThree || "",
        city: data?.city,
        state: data?.state,
        pincode: data?.pincode,
        phone: data?.phone,
        gstNo: data?.gstNo || "",
        panNo: data?.panNo || "",
        image: data?.image || null,
        signature: data?.signature || null,
        stamp: data?.stamp || null,
        drugLicenseOne: data?.drugLicenseOne || "",
        drugLicenseTwo: data?.drugLicenseTwo || "",
        status: data?.status,
        isRegistrationType: data?.isRegistrationType?.toString(),
      });
    }
  }, [data]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (customer.state) {
      const selectedState = states?.find(
        (state) => state.name === customer.state
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
  }, [customer.state, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });

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

  const handleImgUpload = async (e, field, label) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCustomer((prev) => ({ ...prev, [field]: null }));
      return;
    }

    console.log(field, "FILED NAME");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setDisable(true);
      const response = await axios.post(`${DX_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { data, message, success } = response?.data;

      if (success) {
        const fileUrl = data?.image || data?.pdf;
        toast.success(`${label} uploaded successfully`);
        setCustomer((prev) => ({ ...prev, [field]: fileUrl }));
      } else {
        toast.error(message || `Upload failed`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Error uploading ${label}`);
    } finally {
      setDisable(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!customer.title) newErrors.title = "Title is required";
    if (!customer.name) newErrors.name = "Name is required";
    if (!customer.lastName) newErrors.lastName = "Last Name is required";
    if (!customer.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!customer.phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(customer.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!customer.clinicName || !customer?.clinicName?.trim())
      newErrors.clinicName = "Clinic name is required";

    if (customer.password?.trim()) {
      if (!passwordRegex.test(customer.password)) {
        newErrors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      }
    }

    if (customer.isRegistrationType === "1") {
      if (!customer.gstNo) {
        newErrors.gstNo = "GST number is required for Regular registration";
      } else if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          customer.gstNo
        )
      ) {
        newErrors.gstNo = "Invalid GST number format";
      }
    }
    ["state", "city", "pincode", "address"].forEach((field) => {
      if (!customer[field])
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors)?.length > 0) return;
    setDisable(true);
    try {
      const formData = new URLSearchParams();
      formData.append("name", customer.name);
      formData.append("lastName", customer.lastName || "");
      formData.append("title", customer.title || "");
      formData.append("clinicName", customer.clinicName || "");
      formData.append("email", customer.email);
      formData.append("phone", customer.phone);
      formData.append("address", customer.address);
      formData.append("addressTwo", customer.addressTwo || "");
      formData.append("addressThree", customer.addressThree || "");
      formData.append("city", customer.city);
      formData.append("state", customer.state);
      formData.append("pincode", customer.pincode);
      formData.append("status", 2);
      formData.append("image", customer.image);
      formData.append("drugLicenseOne", customer.drugLicenseOne);
      formData.append("drugLicenseTwo", customer.drugLicenseTwo);
      formData.append("panNo", customer.panNo);
      formData.append("gstNo", customer.gstNo);
      formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
      formData.append("dealerId", dealerStorage.DL_ID);
      formData.append("isRegistrationType", customer.isRegistrationType || "");

      if (customer.password) {
        formData.append("password", customer.password);
      }
      if (customer.signature) {
        formData.append("signature", customer.signature);
      }
      if (customer.stamp) {
        formData.append("stamp", customer.stamp);
      }
      const url = data?._id
        ? `${DX_URL}/dealer/manage-dealer-customer/${data?._id}`
        : `${DX_URL}/dealer/manage-dealer-customer`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${dealerStorage.DX_DL_TOKEN}`,
        },
      });
      const { success, message } = response?.data;
      if (success) {
        toast.success(message);
        // toastSuccess(message);
        navigate(DEALER_URLS.DE_CUSTOMER_LIST);
        setCustomer({});
      } else {
        toast.error(message);
        // toastError(message)
      }
    } catch (error) {
      console.log(error, "EEORR");
      toast.error(error?.response?.data?.message || "Something went wrong");
      // toastError(error?.response?.data?.message || "Something went wrong")
    } finally {
      setDisable(false);
    }
  };

  const renderInput = (label, name, type = "text", required = false, isPassword = false) => (
    <div className={`col-lg-4 col-md-6 col-12 ${isPassword ? "position-relative" : ""}`}>
      <div className="form-floating mb-3">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`form-control ${errors[name] ? "is-invalid" : ""} ${isPassword ? "pr-5" : ""}`}
          name={name}
          value={customer[name]}
          onChange={handleChange}
          placeholder={label}
        />
        <label>
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
        {errors[name + "_comma"] && (
          <div style={{ fontSize: "11px", color: "red", marginTop: "3px" }}>
            {errors[name + "_comma"]}
          </div>
        )}
        {isPassword && (
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            <i className={`ti toggle-password ${showPassword ? "ti-eye-off" : "ti-eye"}`} style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}></i>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Customer List", to: DEALER_URLS.DE_CUSTOMER_LIST },
            { label: `Customer ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  Customer {data?._id ? "Edit" : "Add"}
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-control form-select ${errors.title ? "is-invalid" : ""
                      }`}
                    value={customer.title}
                    name="title"
                    onChange={handleChange}
                  >
                    <option value="">Select Title</option>
                    {customerTitle?.map((state) => (
                      <option key={state.value} value={state.label}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  <label>
                    Title <span className="text-danger">*</span>
                  </label>
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>
              </div>
              {renderInput("First Name", "name", "text", true)}
              {renderInput("Last Name", "lastName", "text", true)}
              {renderInput("Email", "email", "email", true)}
              {renderInput("Mobile No.", "phone", "number", true)}
              {renderInput(
                "Clinic / Hospital Name",
                "clinicName",
                "text",
                true
              )}
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={customer.isRegistrationType}
                    name="isRegistrationType"
                    onChange={handleChange}
                  >
                    <option value="">Select Registration Type</option>
                    {customerRegisterType?.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  <label>Registration Type</label>
                </div>
              </div>
              {renderInput(
                "GST No.",
                "gstNo",
                "text",
                customer.isRegistrationType === "1"
              )}
              {renderInput("Pancard No.", "panNo")}
            </div>
            <div className="row">
              {renderInput("Address", "address", "text", true)}
              {renderInput("Address Two", "addressTwo")}
              {renderInput("Landmark", "addressThree")}
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${errors.state ? "is-invalid" : ""
                      }`}
                    name="state"
                    value={customer.state}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        state: e.target.value,
                        city: "",
                      })
                    }
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
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
                    value={customer.city}
                    onChange={handleChange}
                    disabled={!customer.state}
                  >
                    <option value="">Select City</option>
                    {cities.map((c, idx) => (
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
              {renderInput("Pincode", "pincode", "number", true)}
              <div className="row">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      disabled
                      value={[
                        customer.address,
                        customer.addressThree,
                        customer.addressTwo,
                        customer.city && customer.pincode
                          ? `${customer.city} - ${customer.pincode}`
                          : customer.city || customer.pincode,
                        customer.state,
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
              {renderInput("Drug License No. (Form 20B)", "drugLicenseOne")}
              {renderInput("Drug License No. (Form 21B)", "drugLicenseTwo")}
              {renderInput("Password", "password", "password", !data?._id, true)}
            </div>
            <div className="row">
              <FileUpload
                label="Logo"
                type="image"
                field="image"
                value={customer.image}
                onChange={handleImgUpload}
              />

              <FileUpload
                label="Signature & Stamp"
                type="signature"
                field="signature"
                value={customer.signature}
                onChange={handleImgUpload}
              />
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

export default ManageDealerCustomer;
