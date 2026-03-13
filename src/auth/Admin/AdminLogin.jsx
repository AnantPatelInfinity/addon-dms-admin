import React, { useEffect, useState } from "react";
import { useApi } from "../../context/ApiContext";
import { toast } from "react-toastify";
import {
  decrypt,
  encrypt,
} from "../../components/PasswordDecrypt/PasswordDecrypt";
import { Link, useNavigate } from "react-router";
import ADMIN_URLS from "../../config/routesFile/admin.routes";
import { features, logos } from "../../config/DataFile";

const AdminLogin = () => {
  const { post, get } = useApi();
  const [login, setLogin] = useState({
    email: "",
    password: "",
    firmId: "",
    remember: false,
    showPass: false,
  });
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const naviagate = useNavigate();
  const [firms, setFirms] = useState([]);
  const [activeQuote, setActiveQuote] = useState(0);

  useEffect(() => {
    const savedEmail = localStorage.getItem("DX_AD_EMAIL");
    const savedPassword = localStorage.getItem("REM_AD_PASS");
    const savedRemember = localStorage.getItem("REM_AD_CHECKED") === "true";
    if (savedEmail && savedPassword && savedRemember) {
      setLogin((prev) => ({
        ...prev,
        email: savedEmail,
        password: decrypt(savedPassword),
        remember: true,
      }));
    }
    getFirmData();

    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getFirmData = async () => {
    try {
      const response = await get("/admin/get-login-firm");
      const { data, success } = response;
      if (success) {
        setFirms(data);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setDisable(true);
    try {
      const res = await post("/admin/login", {
        email: login.email,
        password: login.password,
      });

      const { success, data, message } = res;

      if (success) {
        localStorage.setItem("DX_AD_TOKEN", data.token);
        localStorage.setItem("DX_AD_NAME", data.name);
        localStorage.setItem("DX_AD_EMAIL", data.email);
        localStorage.setItem("REM_AD_CHECKED", login.remember);
        localStorage.setItem("DX_AD_FIRM", login.firmId);
        localStorage.setItem("DX_AD_ROLE", data.role);
        localStorage.setItem("DX_AD_IMG", data.image || "");
        localStorage.setItem("AD_ID", data._id || "");
        const findFirm = firms.find((firm) => firm._id === login.firmId);
        localStorage.setItem("DX_AD_FIRM_NAME", findFirm?.name);
        localStorage.setItem("DX_AD_FIRM_SN", findFirm.shortName);
        if (login.remember) {
          localStorage.setItem("REM_AD_PASS", encrypt(login.password));
        } else {
          localStorage.removeItem("REM_AD_PASS");
        }
        toast.success(message);
        naviagate(ADMIN_URLS.DASHBOARD);
        setLogin({
          email: "",
          password: "",
          remember: false,
          showPass: false,
        });
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setDisable(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!login.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(login.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!login.password) {
      newErrors.password = "Password is required";
    }
    if (!login.firmId) {
      newErrors.firmId = "Firm is required";
    }
    return newErrors;
  };

  return (
    <div className="account-content">
      <div className="d-flex flex-column flex-lg-row w-100 min-vh-100 ">
        {/* LEFT SIDE - Login Form */}
        <div className="col-12 col-lg-6 order-1 order-lg-1 d-flex align-items-center justify-content-center p-3 p-md-4 p-lg-4 bg-backdrop position-relative 
        ">
          {/* Floating shapes */}

          <form onSubmit={handleLogin} className="flex-fill w-100">
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <img
                  src={logos.LOGIN_NEW}
                  className="img-fluid"
                  alt="Logo"
                  style={{ height: "150px", maxWidth: "100%" }}
                />
              </div>

              {/* QUOTE SECTION */}
              <p
                className="mb-4 text-center"
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  padding: "16px 24px",
                  borderRadius: "15px",
                  color: "#c12033",
                  backgroundColor: "#fcfcfc",
                  borderLeft: "2px solid #c12033",
                  borderRight: "2px solid #c12033",
                  lineHeight: "1.8",
                  fontStyle: "italic",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                "Quality in Every Services <br /> Reliability in Every Services,
                After Sales"
              </p>

              <div className="mb-4">
                <h4 className="mb-2 fs-20">Sign In</h4>
                <p>Access the ADMIN panel using your email and passcode.</p>
              </div>

              {/* FIRMS */}
              <div className="mb-3">
                <label className="col-form-label">Firms</label>
                <div className="position-relative">
                  {!errors?.firmId && (
                    <span className="input-icon-addon">
                      <i className="ti ti-briefcase" />
                    </span>
                  )}
                  <select
                    className={`form-control ${errors.firmId ? "is-invalid" : ""
                      }`}
                    name="firmId"
                    value={login.firmId}
                    onChange={handleChange}
                  >
                    <option>Select Firm</option>
                    {firms?.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {errors.firmId && (
                    <div className="invalid-feedback">{errors.firmId}</div>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="col-form-label">Email Address</label>
                <div className="position-relative">
                  {!errors?.email && (
                    <span className="input-icon-addon">
                      <i className="ti ti-mail" />
                    </span>
                  )}
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                    name="email"
                    value={login.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="col-form-label">Password</label>
                <div className="pass-group">
                  <input
                    type={login.showPass ? "text" : "password"}
                    className={`pass-input form-control ${errors.password ? "is-invalid" : ""
                      }`}
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  {!errors?.password && (
                    <span
                      className={`ti toggle-password ${login.showPass ? "ti-eye-off" : "ti-eye"
                        }`}
                      onClick={() =>
                        setLogin((prev) => ({
                          ...prev,
                          showPass: !prev.showPass,
                        }))
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>

              {/* REMEMBER + FORGOT */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check form-check-md d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkebox-md"
                    name="remember"
                    checked={login.remember}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="checkebox-md">
                    Remember Me
                  </label>
                </div>
                <div className="text-end">
                  <Link
                    to={ADMIN_URLS.FORGET_PASS}
                    className="text-primary fw-medium link-hover"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={disable}
                >
                  {disable ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - Features */}
        <div
          className="d-none d-lg-flex col-12 col-lg-6 order-2 order-lg-2 d-flex align-items-center justify-content-center p-3 p-md-4 p-lg-5 position-relative"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            minHeight: "auto",
          }}
        >
          <div
            className="floating-shape"
            style={{
              width: "clamp(150px, 40vw, 400px)",
              height: "clamp(150px, 40vw, 400px)",
              top: "-15%",
              left: "0%",
              animationDelay: "0s",
              overflow: "hidden",
            }}
          ></div>

          <div
            className="floating-shape"
            style={{
              width: "clamp(100px, 30vw, 200px)",
              height: "clamp(100px, 30vw, 200px)",
              top: "40%",
              right: "10%",
              animationDelay: "4s",
              overflow: "hidden",
            }}
          ></div>

          <div
            className="position-relative w-100"
            style={{ zIndex: 2, maxWidth: "600px" }}
          >
            <div
              className="d-flex flex-column align-items-center justify-content-center gap-3 gap-md-4"
              style={{ zIndex: 2 }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-3 p-md-4 position-relative w-100"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    maxWidth: "480px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 30px 50px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="icon-wrapper me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "15px",
                        background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 10px 25px ${feature.color}40`,
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className={`${feature.icon} text-white`}
                        style={{ fontSize: "25px" }}
                      ></i>
                    </div>
                    <h3
                      className="mb-0 fw-bold"
                      style={{
                        fontSize: "clamp(18px, 4vw, 22px)",
                        color: "#e5251b",
                        wordBreak: "break-word",
                      }}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      color: "black",
                      fontWeight: "400",
                      lineHeight: "1.5",
                      fontSize: "clamp(14px, 2.5vw, 14px)",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
