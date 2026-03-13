import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import axios from "axios";
import { DX_URL } from "../../config/baseUrl";
import { Link } from "react-router";
import { toast } from "react-toastify";
import "../../pages/home/loginPages/LoginPage.css";

const CustomerRegister = () => {
  const initialFormData = {
    clinicName: "",
    firmId: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    address: "",
    addressTwo: "",
    addressThree: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    gstNo: "",
    drugLicenseOne: "",
    drugLicenseTwo: "",
    panNo: "",
    image: null,
    previewImage: "",
    signature: null,
    previewSignature: "",
    agreeTerms: false,
    signatureFileType: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firms, setFirms] = useState([]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);

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

  useEffect(() => {
    if (formData.state) {
      const selectedState = states?.find(
        (state) => state.name === formData.state
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
  }, [formData.state, states]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

  const handleFileChange = async (e, fieldName, allowPdf = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const validPdfType = "application/pdf";

    // Check file type based on whether PDF is allowed for this field
    const isValidType = allowPdf
      ? validImageTypes.includes(file.type) || file.type === validPdfType
      : validImageTypes.includes(file.type);

    if (!isValidType) {
      toast.error(
        allowPdf
          ? "Only JPG, PNG, JPEG images or PDF files are allowed"
          : "Only JPG, PNG, JPEG images are allowed"
      );
      return;
    }

    setIsSubmitting(true);
    const myurl = `${DX_URL}/upload-image`;
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);

    try {
      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
      });

      if (response.data.success) {
        const fileUrl =
          response?.data?.data?.image || response?.data?.data?.pdf;
        const previewKey = `preview${fieldName?.charAt(0).toUpperCase() + fieldName?.slice(1)
          }`;
        const previewUrl = validImageTypes.includes(file.type)
          ? URL.createObjectURL(file)
          : null;

        setFormData((prev) => ({
          ...prev,
          [fieldName]: fileUrl,
          [previewKey]: previewUrl,
          [`${fieldName}FileType`]: file.type,
        }));
      }
    } catch (error) {
      console.log(error, "!!");
      toast.error(error.response?.data?.message || "File upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letter
    if (/[a-z]/.test(password)) strength += 1; // Lowercase letter
    if (/\d/.test(password)) strength += 1; // Number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special char
    return Math.min(4, strength);
  };

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return "var(--error-color)";
    if (strength === 2) return "#FFA500"; // Orange
    if (strength === 3) return "#9ACD32"; // Yellow-green
    return "var(--success-color)";
  };

  const validate = () => {
    const newErrors = {};

    const requiredFields = {
      firmId: "Firm",
      clinicName: "Clinic name",
      email: "Email",
      name: "Full name",
      password: "Password",
      address: "Address",
      city: "City",
      state: "State",
      pincode: "Pincode",
      phone: "Phone",
      gstNo: "GST number",
      drugLicenseOne: "Drug license",
      panNo: "PAN number",
    };

    Object.entries(requiredFields).forEach(([field, name]) => {
      if (!formData[field]?.toString().trim())
        newErrors[field] = `${name} is required`;
    });

    // Specific validations
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Pincode must be 6 digits";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.image) newErrors.image = "Please upload an image";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const submitData = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "previewImage" &&
          key !== "confirmPassword" &&
          key !== "previewSignature"
        ) {
          submitData.append(key, value);
        }
      });

      try {
        const response = await axios.post(
          `${DX_URL}/customer/register`,
          submitData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const { message, success } = response?.data;

        if (success) {
          toast.success(message || "Registration successful!");
          setFormData(initialFormData);
          setCities([]);
          setErrors({});
        } else {
          toast.error(message || "Registration failed.");
        }
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error(error?.response?.data?.message || "Registration failed");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderFilePreview = (fieldName) => {
    const previewKey = `preview${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      }`;
    const fileType = formData[`${fieldName}FileType`];
    const isPdf = fileType === "application/pdf";

    if (formData[previewKey]) {
      return (
        <div className="image-preview">
          <img
            src={formData[previewKey]}
            alt="Preview"
            className="preview-image"
          />
          <button
            type="button"
            className="change-image-btn"
            onClick={() => document.getElementById(fieldName).click()}
          >
            Change Image
          </button>
        </div>
      );
    } else if (formData[fieldName] && isPdf) {
      return (
        <div className="pdf-preview">
          <i className="icon pdf-icon"></i>
          <p>PDF File Uploaded</p>
          <button
            type="button"
            className="change-image-btn"
            onClick={() => document.getElementById(fieldName).click()}
          >
            Change PDF
          </button>
        </div>
      );
    } else {
      return (
        <div
          className="upload-area"
          onClick={() => document.getElementById(fieldName).click()}
        >
          <i className="icon upload-icon"></i>
          <p>Click to upload {fieldName === "image" ? "image" : "file"}</p>
          <p className="file-types">
            {fieldName === "image"
              ? "(JPG, PNG up to 5MB)"
              : "(JPG, PNG, PDF up to 5MB)"}
          </p>
        </div>
      );
    }
  };

  const renderInput = (name, label, type = "text", options = {}) => (
    <div className={`form-group ${options.halfWidth ? "half-width" : ""}`}>
      <label htmlFor={name}>
        {label} {options.required && <span className="required">*</span>}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`${errors[name] ? "error" : ""}`}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <div className="image-upload-container">
          {renderFilePreview(name)}
          <input
            type="file"
            id={name}
            name={name}
            onChange={(e) => handleFileChange(e, name, options.allowPdf)}
            accept="image/*"
            className="hidden-input"
          />
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={errors[name] ? "error" : ""}
          maxLength={options.maxLength}
        />
      )}
      {errors[name] && <span className="error-message">{errors[name]}</span>}
      {errors[name + "_comma"] && (
        <div style={{ fontSize: "11px", color: "red", marginTop: "3px" }}>
          {errors[name + "_comma"]}
        </div>
      )}
      {options.isPass && passwordSection()}
    </div>
  );

  const passwordSection = () => (
    <div className="password-strength-container mt-2">
      <div className="password-strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="password-strength-bar"
            style={{
              backgroundColor:
                checkPasswordStrength(formData.password) >= level
                  ? getPasswordStrengthColor(
                    checkPasswordStrength(formData.password)
                  )
                  : "#eee",
            }}
          ></div>
        ))}
      </div>
      {formData.password && (
        <div
          className="password-strength-text"
          style={{
            color: getPasswordStrengthColor(
              checkPasswordStrength(formData.password)
            ),
          }}
        >
          {getPasswordStrengthText(checkPasswordStrength(formData.password))}
        </div>
      )}
      <div className="password-hint">
        Password must be at least 8 characters long with uppercase, lowercase,
        number, and special character
      </div>
    </div>
  );

  return (
    <div className="dealer-register-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="register-card">
        <div className="register-form">
          <h2>Customer Registration</h2>
          <p className="welcome-text">
            Create your customer account to get started
          </p>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-columns">
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                {renderInput("firmId", "Firm Name", "select", {
                  required: true,
                  options: firms.map((firm) => ({
                    value: firm._id,
                    label: firm.name,
                  })),
                })}
                <div className="form-row mb-0">
                  {renderInput("clinicName", "Clinic Name", "text", {
                    required: true,
                    halfWidth: true,
                  })}
                </div>
                <div className="form-row">
                  {renderInput("name", "Full Name", "text", {
                    required: true,
                    halfWidth: true,
                  })}
                  {renderInput("email", "Email", "email", {
                    required: true,
                    halfWidth: true,
                  })}
                </div>
                <div className="form-row mb-0">
                  {renderInput("password", "Password", "password", {
                    required: true,
                    halfWidth: true,
                    isPass: true,
                  })}
                  {renderInput(
                    "confirmPassword",
                    "Confirm Password",
                    "password",
                    { required: true, halfWidth: true }
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Address Information</h3>
                {renderInput("address", "Address Line 1", "text", {
                  required: true,
                })}
                {renderInput("addressTwo", "Address Line 2")}
                {renderInput("addressThree", "Landmark")}
                <div className="form-row">
                  {renderInput("state", "State", "select", {
                    required: true,
                    halfWidth: true,
                    options: states.map((s) => ({
                      value: s.name,
                      label: s.name,
                    })),
                  })}
                  {renderInput("city", "City", "select", {
                    required: true,
                    halfWidth: true,
                    options: cities.map((c, idx) => ({
                      value: c.name,
                      label: c.name,
                    })),
                  })}
                </div>
                <div className="form-row">
                  {renderInput("pincode", "Pincode", "number", {
                    required: true,
                    halfWidth: true,
                    maxLength: 6,
                  })}
                  {renderInput("phone", "Phone Number", "number", {
                    required: true,
                    halfWidth: true,
                    maxLength: 10,
                  })}
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <textarea
                        className="form-control"
                        style={{ height: "100px" }}
                        disabled
                        value={[
                          formData.address,
                          formData.addressThree,
                          formData.addressTwo,
                          formData.city && formData.pincode
                            ? `${formData.city} - ${formData.pincode}`
                            : formData.city || formData.pincode,
                          formData.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                      <label style={{ fontSize: "12px" }}>
                        Address Preview
                      </label>
                    </div>
                  </div>
                </div>

              </div>
              <div className="form-column">
                <div className="form-section">
                  <h3 className="section-title">Business Information</h3>
                  <div className="form-row">
                    {renderInput("gstNo", "GST Number", "text", {
                      required: true,
                      halfWidth: true,
                    })}
                    {renderInput("panNo", "PAN Number", "text", {
                      required: true,
                      halfWidth: true,
                    })}
                  </div>
                  <div className="form-row">
                    {renderInput("drugLicenseOne", "Drug License 1", "text", {
                      required: true,
                      halfWidth: true,
                    })}
                    {renderInput("drugLicenseTwo", "Drug License 2", "text", {
                      halfWidth: true,
                    })}
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Documents</h3>
                  {renderInput("image", "Upload Logo Image", "file", {
                    required: true,
                  })}
                  {renderInput(
                    "signature",
                    "Upload Signature & Stamp",
                    "file",
                    {
                      // required: true,
                      allowPdf: true,
                    }
                  )}
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>I agree to the{" "}
                    <a href="/terms">Terms</a> and{" "}
                    <a href="/privacy">Privacy Policy</a>
                  </label>
                  {errors.agreeTerms && (
                    <span className="error-message">{errors.agreeTerms}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className={`submit-btn ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span> Registering...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="login-link">
                  Already have an account? <Link to="/">Log in</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
