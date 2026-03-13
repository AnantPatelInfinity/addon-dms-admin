import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "../../../context/ApiContext";
import { useLocation, useNavigate } from "react-router";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import { State, City } from "country-state-city";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import ImageUpload from "../../../components/Admin/ImageUpload/ImageUpload";
import {
  customerRegisterType,
  customerTitle,
  statusList,
} from "../../../config/DataFile";

const initialCustomerState = {
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
};

const ManageCustomer = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const adminStorage = getAdminStorage();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customer, setCustomer] = useState(initialCustomerState);

  const isEditMode = useMemo(() => !!data?._id, [data]);

  useEffect(() => {
    if (!data?._id) return;

    setCustomer({
      ...initialCustomerState,
      ...data,
      password: "",
      isRegistrationType: data?.isRegistrationType?.toString() || "",
    });
  }, [data]);

  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
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

  const validate = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!isEditMode) {
      if (!customer.title?.trim()) newErrors.title = "Title is required";
      if (!customer.name?.trim()) newErrors.name = "Name is required";
      if (!customer.lastName?.trim())
        newErrors.lastName = "Last Name is required";

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

      if (customer.password?.trim()) {
        if (!passwordRegex.test(customer.password)) {
          newErrors.password =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
        }
      }

      if (!customer.clinicName?.trim())
        newErrors.clinicName = "Clinic Name is required";

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
    }
    // Edit mode (update)
    else {
      if (
        customer.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
      ) {
        newErrors.email = "Invalid email format";
      }

      if (customer.phone && !/^[6-9]\d{9}$/.test(customer.phone)) {
        newErrors.phone = "Enter a valid 10-digit mobile number";
      }

      if (customer.password?.trim()) {
        if (!passwordRegex.test(customer.password)) {
          newErrors.password =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
        }
      }

      if (
        customer.isRegistrationType === "1" &&
        customer.gstNo &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          customer.gstNo
        )
      ) {
        newErrors.gstNo = "Invalid GST number format";
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
      formData.append("status", customer.status);
      formData.append("drugLicenseOne", customer.drugLicenseOne);
      formData.append("drugLicenseTwo", customer.drugLicenseTwo);
      formData.append("panNo", customer.panNo);
      formData.append("gstNo", customer.gstNo);
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      if (customer.image) {
        formData.append("image", customer.image);
      }
      formData.append("isRegistrationType", customer.isRegistrationType || "");
      if (customer.signature) {
        formData.append("signature", customer.signature);
      }
      // if (customer.stamp) {
      //     formData.append("stamp", customer.stamp);
      // }
      if (customer.password) {
        formData.append("password", customer.password);
      }
      const url = data?._id
        ? `/admin/manage-customer/${data?._id}`
        : `/admin/manage-customer`;
      const response = await post(url, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const { success, message } = response;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.CUSTOMER_LIST);
        setCustomer(initialCustomerState);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error, "EEORR");
      toast.error(error?.response?.data?.message || "Something went wrong");
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
            { label: "Customer List", to: ADMIN_URLS.CUSTOMER_LIST },
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
              {renderInput("Clinic Name", "clinicName", "text", true)}
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className="form-control form-select"
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
                  {/* {errors.status && (
                                        <div className="invalid-feedback">{errors.status}</div>
                                    )} */}
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
              {renderInput("Address 1", "address", "text", true)}
              {renderInput("Address 2", "addressTwo")}
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
                    <textarea
                      className="form-control"
                      disabled
                      style={{ height: "80px" }}
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
              {data?._id && (
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-floating mb-3">
                    <select
                      className="form-control form-select"
                      value={customer.status}
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
              )}
            </div>

            <div className="row">
              <ImageUpload
                label="Logo"
                name="image"
                value={customer.image}
                onChange={(k, v) => setCustomer((p) => ({ ...p, [k]: v }))}
              />
              <ImageUpload
                label="Signature & Stamp"
                name="signature"
                value={customer.signature}
                onChange={(k, v) => setCustomer((p) => ({ ...p, [k]: v }))}
              />
              {/* <ImageUpload label="Stamp" name="stamp" value={customer.stamp} onChange={(k, v) => setCustomer(p => ({ ...p, [k]: v }))} /> */}
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

export default ManageCustomer;