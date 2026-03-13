import { useEffect, useState } from "react";
import "./LoginPage.css";
import { useApi } from "../../../context/ApiContext";
import { toast } from "react-toastify";
import {
  decrypt,
  encrypt,
} from "../../../components/PasswordDecrypt/PasswordDecrypt";
import { Link, useNavigate } from "react-router";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import COMPANY_URLS from "../../../config/routesFile/company.routes";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";

const STORAGE_KEYS = {
  dealer: {
    email: "DX_DL_EMAIL",
    password: "DX_DL_PASS",
    remember: "DX_DL_REM",
    name: "DX_DL_NAME",
    token: "DX_DL_TOKEN",
    firmId: "DX_DL_FIRM_ID",
    firmName: "DX_DL_FIRM_NAME",
    firmShortName: "DX_DL_FIRM_SN",
    id: "DL_ID",
    image: "DX_DL_IMG",
  },
  company: {
    email: "DX_CO_EMAIL",
    password: "DX_CO_PASS",
    remember: "DX_CO_REM",
    name: "DX_CO_NAME",
    token: "DX_CO_TOKEN",
    firmId: "DX_CO_FIRM_ID",
    firmName: "DX_CO_FIRM_NAME",
    id: "CO_ID",
    image: "DX_CO_IMG",
  },
  user: {
    email: "DX_US_EMAIL",
    password: "DX_US_PASS",
    remember: "DX_US_REM",
    name: "DX_US_NAME",
    token: "DX_US_TOKEN",
    firmName: "DX_US_FIRM_NAME",
    id: "US_ID",
    image: "DX_US_IMG",
  },
  customer: {
    email: "DX_CU_EMAIL",
    password: "DX_CU_PASS",
    remember: "DX_CU_REM",
    name: "DX_CU_NAME",
    token: "DX_CU_TOKEN",
    firmId: "DX_CU_FIRM_ID",
    firmName: "DX_CU_FIRM_NAME",
    id: "CU_ID",
    image: "DX_CU_IMG",
  },
  common: {
    role: "DX_ROLE",
    lastActiveTab: "LAST_ACTIVE_TAB",
    companyFirmId: "DX_CO_FIRM_ID",
  },
};

const ROLES = {
  COMPANY: "company",
  DEALER: "dealer",
  CUSTOMER: "customer",
  USER_ROLES: ["GENERAL", "SERVICES", "ACCOUNTS", "INSTALLATIONS"],
};

const validateCredentials = (email, password) => {
  const errors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

const isCompanyRole = (role) => role === ROLES.COMPANY;
const isDealerRole = (role) => role === ROLES.DEALER;
const isUserRole = (role) => ROLES.USER_ROLES.includes(role);
const isCustomerRole = (role) => role === ROLES.CUSTOMER;

const normalizeFirms = (firmData) => {
  if (!firmData) return [];

  if (Array.isArray(firmData) && firmData.length > 0) {
    return firmData.map((firm) => ({
      id: firm._id ?? firm.id,
      name: firm.name ?? firm.firmName ?? "Unnamed Firm",
      raw: firm,
    }));
  }

  if (typeof firmData === "string") {
    return [
      {
        id: firmData,
        name: "Default Firm",
        raw: null,
      },
    ];
  }

  return [];
};

const getStorageKeys = (userType) => STORAGE_KEYS[userType];
const getCommonKey = (key) => STORAGE_KEYS.common[key];

const saveDealerLogin = (data, password, rememberMe) => {
  const keys = getStorageKeys("dealer");

  localStorage.setItem(keys.name, data?.name || "");
  localStorage.setItem(keys.token, data?.token || "");
  localStorage.setItem(keys.email, data?.email || "");
  localStorage.setItem(keys.remember, rememberMe.toString());
  localStorage.setItem(keys.firmId, data?.firmId || "");
  localStorage.setItem(keys.firmName, data?.firmName || "");
  localStorage.setItem(keys.firmShortName, data?.firmShortName || "");
  localStorage.setItem(keys.id, data?.id || "");
  localStorage.setItem(keys.image, data?.image || "");
  localStorage.setItem(getCommonKey("role"), data?.role || "");

  if (rememberMe) {
    localStorage.setItem(keys.password, encrypt(password));
  } else {
    localStorage.removeItem(keys.password);
  }
};

const saveCustomerLogin = (data, password, rememberMe) => {
  const keys = getStorageKeys("customer");
  localStorage.setItem(keys.name, `${data?.title} ${data?.name} ${data?.lastName}`);
  localStorage.setItem(keys.token, data?.token || "");
  localStorage.setItem(keys.email, data?.email || "");
  localStorage.setItem(keys.remember, rememberMe.toString());
  localStorage.setItem(keys.firmId, data?.firmId || "");
  localStorage.setItem(keys.firmName, data?.firmName || "");
  localStorage.setItem(keys.id, data?.customerId || data?.id || "");
  localStorage.setItem(keys.image, data?.image || "");
  localStorage.setItem(getCommonKey("role"), data?.role || "");

  if (rememberMe) {
    localStorage.setItem(keys.password, encrypt(password));
  } else {
    localStorage.removeItem(keys.password);
  }
};

const saveCompanyLogin = (
  data,
  password,
  rememberMe,
  selectedFirm,
  firmName
) => {
  const role = data?.role;

  if (isCompanyRole(role)) {
    const keys = getStorageKeys("company");

    localStorage.setItem(keys.name, data?.name || "");
    localStorage.setItem(keys.email, data?.email || "");
    localStorage.setItem(keys.remember, rememberMe.toString());
    localStorage.setItem(keys.firmId, selectedFirm || "");
    localStorage.setItem(keys.firmName, firmName || "");
    localStorage.setItem(keys.id, data?.id || "");
    localStorage.setItem(keys.image, data?.image || "");
    localStorage.setItem(getCommonKey("role"), role || "");
    localStorage.setItem(keys.token, data?.token || "");

    localStorage.removeItem("DX_US_NAME");
    localStorage.removeItem("DX_US_EMAIL");
    localStorage.removeItem("US_ID");
    localStorage.removeItem("DX_US_IMG");
    localStorage.removeItem("DX_US_PASS");
    localStorage.removeItem("DX_US_REM");

    if (rememberMe) {
      localStorage.setItem(keys.password, encrypt(password));
    } 
  } else if (isUserRole(role)) {
    const userKeys = getStorageKeys("user");

    localStorage.setItem(userKeys.name, data?.name || "");
    localStorage.setItem(userKeys.token, data?.userToken || data?.token || "");
    localStorage.setItem(userKeys.email, data?.email || "");
    localStorage.setItem(userKeys.remember, rememberMe.toString());
    localStorage.setItem(getCommonKey("companyFirmId"), selectedFirm || "");
    localStorage.setItem(userKeys.firmName, firmName || "");
    localStorage.setItem(userKeys.id, data?.userId || data?.id || "");
    localStorage.setItem(userKeys.image, data?.image || "");
    localStorage.setItem(getCommonKey("role"), role || "");

    if (data?.companyToken) {
      localStorage.setItem("DX_CO_TOKEN", data.companyToken);
    }

    if (data?.companyId) {
      localStorage.setItem("CO_ID", data.companyId);
    }

    localStorage.removeItem("DX_CO_IMG");
    localStorage.removeItem("DX_CO_FIRM_NAME");
    localStorage.removeItem("DX_CO_PASS");
    localStorage.removeItem("DX_CO_REM");

    if (rememberMe) {
      localStorage.setItem(userKeys.password, encrypt(password));
    } else {
      localStorage.removeItem(userKeys.password);
    }
  }
};

const LoginPage = () => {
  const { post } = useApi();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem(getCommonKey("lastActiveTab")) || "dealer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [showFirmSelect, setShowFirmSelect] = useState(false);
  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState("");
  const [tempLoginData, setTempLoginData] = useState(null);

  useEffect(() => {
    if (activeTab === "dealer") {
      const keys = getStorageKeys("dealer");
      const savedEmail = localStorage.getItem(keys.email);
      const savedPassword = localStorage.getItem(keys.password);
      const savedRemember = localStorage.getItem(keys.remember) === "true";

      if (savedEmail && savedRemember && savedPassword) {
        setEmail(savedEmail);
        setPassword(decrypt(savedPassword));
        setRememberMe(true);
      } else {
        setEmail("");
        setPassword("");
        setRememberMe(false);
      }
    } else if (activeTab === "customer") {
      const keys = getStorageKeys("customer");
      const savedEmail = localStorage.getItem(keys.email);
      const savedPassword = localStorage.getItem(keys.password);
      const savedRemember = localStorage.getItem(keys.remember) === "true";

      if (savedEmail && savedRemember) {
        setEmail(savedEmail);
        setPassword(decrypt(savedPassword));
        setRememberMe(true);
      } else {
        setEmail("");
        setPassword("");
        setRememberMe(false);
      }
    } else {
      const companyKeys = getStorageKeys("company");
      const userKeys = getStorageKeys("user");

      const companyEmail = localStorage.getItem(companyKeys.email);
      const companyPassword = localStorage.getItem(companyKeys.password);
      const companyRemember =localStorage.getItem(companyKeys.remember) === "true";
      const userEmail = localStorage.getItem(userKeys.email);
      const userPassword = localStorage.getItem(userKeys.password);
      const userRemember = localStorage.getItem(userKeys.remember) === "true";

      if (companyEmail && companyRemember) {
        setEmail(companyEmail);
        setPassword(decrypt(companyPassword));
        setRememberMe(true);
      } else if (userEmail && userRemember) {
        setEmail(userEmail);
        setPassword(decrypt(userPassword));
        setRememberMe(true);
      } else {
        setEmail("");
        setPassword("");
        setRememberMe(false);
      }
    }

    setErrors({});
    setShowFirmSelect(false);
    setFirms([]);
    setSelectedFirm("");
    setTempLoginData(null);
  }, [activeTab]);

  const handleDealerLogin = async (email, password) => {
    const response = await post(`/dealer/login`, { email, password });
    const { success, data, message } = response;

    if (success && isDealerRole(data?.role)) {
      saveDealerLogin(data, password, rememberMe);
      navigate(DEALER_URLS.DASHBOARD);
      toast.success(message);
      return true;
    }

    toast.error(message || "Invalid user type for dealer login");
    return false;
  };

  const handleCustomerLogin = async (email, password) => {
    const response = await post(`/customer/login`, { email, password });
    const { success, data, message } = response;

    if (success && isCustomerRole(data?.role)) {
      saveCustomerLogin(data, password, rememberMe);
      navigate(CUSTOMER_URLS.DASHBOARD);
      toast.success(message);
      return true;
    }

    toast.error(message || "Invalid user type for customer login");
    return false;
  };

  const handleCompanyFirstStep = async (email, password) => {
    const response = await post(`/company/login`, { email, password });
    const { success, data, message } = response;

    if (success) {
      const role = data?.role;

      if (isCompanyRole(role) || isUserRole(role)) {
        const normalizedFirms = normalizeFirms(data?.firmId);
        setFirms(normalizedFirms);
        setTempLoginData(data);
        setShowFirmSelect(true);

        toast.success(
          message || "Credentials validated. Please select a firm to continue."
        );
        return true;
      }

      toast.error("Invalid user type for company login");
      return false;
    }

    toast.error(message);
    return false;
  };

  const handleCompanyFinalLogin = async () => {
    if (!selectedFirm) {
      setErrors({ firm: "Please select a firm" });
      return;
    }

    try {
      setIsLoading(true);

      let loginData = tempLoginData;
      if (!loginData) {
        const response = await post(`/company/login`, {
          email: email.trim(),
          password,
        });
        if (!response.success) {
          toast.error(response.message);
          return;
        }
        loginData = response.data;
      }

      const selectedFirmInfo = firms.find(
        (firm) => String(firm.id) === String(selectedFirm)
      );
      const firmName = selectedFirmInfo?.name || "Default Firm";

      saveCompanyLogin(loginData, password, rememberMe, selectedFirm, firmName);
      navigate(COMPANY_URLS.DASHBOARD);
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCredentials(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim();

      if (activeTab === "dealer") {
        await handleDealerLogin(trimmedEmail, password);
      } else if (activeTab === "customer") {
        await handleCustomerLogin(trimmedEmail, password);
      } else {
        if (!showFirmSelect) {
          await handleCompanyFirstStep(trimmedEmail, password);
        } else {
          await handleCompanyFinalLogin();
        }
      }
      localStorage.setItem(getCommonKey("lastActiveTab"), activeTab);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCredentialsForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <div className="input-with-icon">
          <i className="icon email-icon"></i>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-with-icon">
          <i className="icon password-icon"></i>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>
    </>
  );

  const renderFirmSelect = () => (
    <div className="form-group">
      <label htmlFor="firm">Select Firm</label>
      <select
        id="firm"
        className="form-select"
        value={selectedFirm}
        onChange={(e) => {
          setSelectedFirm(e.target.value);
          setErrors((prev) => ({ ...prev, firm: null }));
        }}
      >
        <option value="">Select a firm</option>
        {firms.map((firm) => (
          <option key={firm.id} value={firm.id}>
            {firm.name}
          </option>
        ))}
      </select>
      {errors.firm && <p className="error-text">{errors.firm}</p>}
    </div>
  );

  const getButtonText = () => {
    if (isLoading) return "Authenticating...";
    if (activeTab === "customer") return "Login";
    if (activeTab === "company" && !showFirmSelect) return "Continue";
    return "Login";
  };

  const getSubmitHandler = () => {
    if (activeTab === "company" && showFirmSelect) {
      return handleCompanyFinalLogin;
    }
    return handleSubmit;
  };

  return (
    <div className="login-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="tabs">
          <button
            className={`tab d-flex flex-column align-items-center  ${
              activeTab === "dealer" ? "active" : ""
            } text-nowrap`}
            onClick={() => setActiveTab("dealer")}
          >
            <i className="icon dealer-icon"></i>
            Dealer Login
          </button>
          <button
            className={`tab d-flex flex-column align-items-center  ${
              activeTab === "company" ? "active" : ""
            } text-nowrap`}
            onClick={() => setActiveTab("company")}
          >
            <i className="icon company-icon"></i>
            Company Login
          </button>
          <button
            className={`tab d-flex flex-column align-items-center  ${
              activeTab === "customer" ? "active" : ""
            } text-nowrap`}
            onClick={() => setActiveTab("customer")}
          >
            <i className="icon customer-icon"></i>
            Customer Login
          </button>
        </div>

        <div className="login-form">
          <div className="logo-container">{/* Logo placeholder */}</div>

          <h2>
            {activeTab === "dealer"
              ? "Dealer"
              : activeTab === "customer"
              ? "Customer"
              : "Company"}{" "}
            Portal
          </h2>
          <p className="welcome-text">
            Welcome back! Please login to your account.
          </p>

          <form onSubmit={handleSubmit}>
            {!(activeTab === "company" && showFirmSelect)
              ? renderCredentialsForm()
              : renderFirmSelect()}

            <div className="form-options">
              <label className="remember-me checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link
                to={
                  activeTab === "dealer"
                    ? DEALER_URLS.FORGET_PASS
                    : activeTab === "customer"
                    ? CUSTOMER_URLS.FORGET_PASS
                    : COMPANY_URLS.FORGET_PASS
                }
                className="forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type={
                activeTab === "company" && showFirmSelect ? "button" : "submit"
              }
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
              onClick={getSubmitHandler()}
            >
              {isLoading && <span className="spinner"></span>}
              {getButtonText()}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          {activeTab === "dealer" ? (
            <>
              <p className="signup-text">
                <span>
                  Are you an admin user?{" "}
                  <Link to={ADMIN_URLS.LOGIN}>Click here</Link>
                </span>
              </p>
              <p className="signup-text">
                <span>
                  Don't have an account?{" "}
                  <Link to={DEALER_URLS.REGISTER}>Register here</Link>
                </span>
              </p>
            </>
          ) : activeTab === "company" ? (
            <p className="signup-text">
              Don't have an account?{" "}
              <Link to={COMPANY_URLS.REGISTER}>Register here</Link>
            </p>
          ) : (
            <p className="signup-text">
              Don't have an account?{" "}
              <Link to={CUSTOMER_URLS.REGISTER}>Register here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
