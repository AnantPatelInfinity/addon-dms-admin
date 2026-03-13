import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../../../context/ApiContext";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import { State, City } from "country-state-city";
import { statusList } from "../../../config/DataFile";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import ImageUpload from "../../../components/Admin/ImageUpload/ImageUpload";

const ManageDealer = () => {
  const { uploadImage, post } = useApi();
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const adminStorage = getAdminStorage();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [dealer, setDealer] = useState({
    name: "",
    dealerCompanyName: "",
    email: "",
    password: "",
    image: "",
    address: "",
    addressTwo: "",
    addressThree: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    status: "",
    gstNo: "",
    signature: null,
    stamp: null,
    drugLicenseOne: "",
    drugLicenseTwo: "",
    panNo: "",
  });

  useEffect(() => {
    if (data?._id) {
      setDealer({
        name: data?.name,
        dealerCompanyName: data?.dealerCompanyName,
        email: data?.email,
        password: "",
        image: data?.image,
        address: data?.address,
        addressTwo: data?.addressTwo || "",
        addressThree: data?.addressThree || "",
        city: data?.city,
        state: data?.state,
        pincode: data?.pincode,
        phone: data?.phone,
        gstNo: data?.gstNo || "",
        signature: data?.signature || null,
        stamp: data?.stamp || null,
        drugLicenseOne: data?.drugLicenseOne || "",
        drugLicenseTwo: data?.drugLicenseTwo || "",
        panNo: data?.panNo || "",
        status: data?.status,
      });
    }
  }, [data]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (dealer.state) {
      const selectedState = states?.find(
        (state) => state.name === dealer.state
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
  }, [dealer.state, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDealer({ ...dealer, [name]: value });

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
    if (!dealer.name) newErrors.name = "Name is required";
    if (!dealer.dealerCompanyName)
      newErrors.dealerCompanyName = "Dealer Company Name is required";
    if (!dealer.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dealer.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!dealer.phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(dealer.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!data?._id) {
      if (!dealer.password) {
        newErrors.password = "Password is required";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          dealer.password
        )
      ) {
        newErrors.password =
          "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters";
      }
    }
    ["state", "city", "pincode", "address"].forEach((field) => {
      if (!dealer[field])
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
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
      formData.append("name", dealer.name);
      formData.append("dealerCompanyName", dealer.dealerCompanyName);
      formData.append("email", dealer.email);
      formData.append("phone", dealer.phone);
      formData.append("address", dealer.address);
      formData.append("addressTwo", dealer.addressTwo || "");
      formData.append("addressThree", dealer.addressThree || "");
      formData.append("city", dealer.city);
      formData.append("state", dealer.state);
      formData.append("pincode", dealer.pincode);
      formData.append("status", dealer.status);
      formData.append("image", dealer.image);
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      formData.append("drugLicenseOne", dealer.drugLicenseOne);
      formData.append("drugLicenseTwo", dealer.drugLicenseTwo);
      formData.append("panNo", dealer.panNo);
      formData.append("gstNo", dealer.gstNo);
      if (dealer.signature) {
        formData.append("signature", dealer.signature);
      }
      // if (dealer.stamp) {
      //     formData.append("stamp", dealer.stamp);
      // }
      if (dealer.password) {
        formData.append("password", dealer.password);
      }
      const url = data?._id
        ? `/admin/manage-dealer/${data?._id}`
        : `/admin/manage-dealer`;
      const response = await post(url, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const { success, message } = response;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.DEALER_LIST);
        setDealer({});
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };

  const renderInput = (label, name, type = "text", required = false) => (
    <div className="col-lg-4 col-md-6 col-12">
      <div className="form-floating mb-3">
        <input
          type={type}
          className={`form-control ${errors[name] ? "is-invalid" : ""}`}
          name={name}
          value={dealer[name]}
          onChange={handleChange}
          placeholder={label}
        />
        <label>
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
        {errors[name + "_comma"] && (
            <div
              style={{ fontSize: "11px", color: "red", marginTop: "3px" }}
            >
              {errors[name + "_comma"]}
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
            { label: "Dealer List", to: ADMIN_URLS.DEALER_LIST },
            { label: `Dealer ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  Dealer {data?._id ? "Edit" : "Add"}
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              {renderInput("Dealer Full Name", "dealerCompanyName", "text", true)}
              {renderInput(
                "Dealer Company Name",
                "name",
                "text",
                true
              )}
              {renderInput("Email", "email", "email", true)}
              {renderInput("Password", "password", "password", !data?._id)}
              {renderInput("Mobile No.", "phone", "number", true)}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={dealer.status}
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


              {renderInput("Address 1", "address", "text", true)}
              {renderInput("Address 2", "addressTwo")}
              {renderInput("Landmark", "addressThree")}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${
                      errors.state ? "is-invalid" : ""
                    }`}
                    name="state"
                    value={dealer.state}
                    onChange={(e) =>
                      setDealer({ ...dealer, state: e.target.value, city: "" })
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
                    value={dealer.city}
                    onChange={handleChange}
                    disabled={!dealer.state}
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
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.pincode ? "is-invalid" : ""
                    }`}
                    name="pincode"
                    value={dealer.pincode}
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
                      style={{height: "80px"}}
                      value={[
                        dealer.address,
                        dealer.addressThree,
                        dealer.addressTwo,
                        dealer.city && dealer.pincode
                          ? `${dealer.city} - ${dealer.pincode}`
                          : dealer.city || dealer.pincode,
                        dealer.state,
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
              {renderInput("GST No.", "gstNo")}
              {renderInput("Pancard No.", "panNo")}
              {renderInput("Drug License No. (Form 20B)", "drugLicenseOne")}
              {renderInput("Drug License No. (Form 21B)", "drugLicenseTwo")}
            </div>
            <div className="row">
              <ImageUpload
                label="Logo"
                name="image"
                value={dealer.image}
                onChange={(k, v) => setDealer((p) => ({ ...p, [k]: v }))}
              />
              <ImageUpload
                label="Signature & Stamp"
                name="signature"
                value={dealer.signature}
                onChange={(k, v) => setDealer((p) => ({ ...p, [k]: v }))}
              />
              {/* <ImageUpload label="Stamp" name="stamp" value={dealer.stamp} onChange={(k, v) => setDealer(p => ({ ...p, [k]: v }))} /> */}
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

export default ManageDealer;
