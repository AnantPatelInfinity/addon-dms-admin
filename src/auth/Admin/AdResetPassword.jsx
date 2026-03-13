import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router';
import ADMIN_URLS from '../../config/routesFile/admin.routes';
import { useApi } from '../../context/ApiContext';
import { toast } from 'react-toastify';
import { logos } from '../../config/DataFile';

const AdResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state;

  const [password, setPassword] = useState({
    newPass: "",
    confirmPass: "",
    newShow: false,
    confirmShow: false,
  });
  const { post } = useApi();
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});

  const validatePassword = () => {
    const errors = {};
    if (!password.newPass || password.newPass.length < 6) {
      errors.newPass = "Password must be at least 6 characters long.";
    }
    if (!/^[A-Z]/.test(password.newPass)) {
      errors.newPass = "Password must start with a capital letter.";
    }
    if (!/\d/.test(password.newPass)) {
      errors.newPass = "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.newPass)) {
      errors.newPass = "Password must contain at least one special character.";
    }
    if (password.newPass !== password.confirmPass) {
      errors.confirmPass = "Passwords do not match.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setDisable(true);
    try {
      const response = await post('/admin/reset-password', {
        email,
        password: password.newPass,
      });
      // navigate(ADMIN_URLS.LOGIN);
      const { success, message } = response;
      if (success) {
        navigate(ADMIN_URLS.LOGIN);
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setDisable(false);
    }
  }

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-04">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
          <form onSubmit={handleSubmit} className="flex-fill">
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                {/* <img
                  src={logos.LOGIN_LOGO}
                  className="img-fluid"
                  alt="Logo"
                />
                <img
                  src={logos.X_TECH_LOGO}
                  className="img-fluid"
                  style={{ height: "51px" }}
                  alt="Logo"
                /> */}
                <img
                  src={logos.LOGIN_NEW}
                  className="img-fluid"
                  alt="Logo"
                  style={{ height: "150px" }}
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 fs-20">Reset Password?</h4>
                <p>Enter New Password &amp; Confirm Password to get inside</p>
              </div>

              <div className="mb-3">
                <label className="col-form-label">New Password</label>
                <div className="pass-group">
                  <input
                    type={password.newShow ? "text" : "password"}
                    className="pass-input-new form-control"
                    value={password.newPass}
                    onChange={(e) => setPassword({ ...password, newPass: e.target.value })}
                  />
                  <span
                    className={`ti toggle-passwords ${password.newShow ? "ti-eye-off" : "ti-eye"}`}
                    onClick={() => setPassword({ ...password, newShow: !password.newShow })}
                  ></span>
                </div>
                {error.newPass && <div className="text-danger">{error.newPass}</div>}
              </div>

              <div className="mb-3">
                <label className="col-form-label">Confirm Password</label>
                <div className="pass-group">
                  <input
                    type={password.confirmShow ? "text" : "password"}
                    className="pass-inputs form-control"
                    value={password.confirmPass}
                    onChange={(e) => setPassword({ ...password, confirmPass: e.target.value })}
                  />
                  <span
                    className={`ti toggle-passwords ${password.confirmShow ? "ti-eye-off" : "ti-eye"}`}
                    onClick={() => setPassword({ ...password, confirmShow: !password.confirmShow })}
                  ></span>
                </div>
                {error.confirmPass && <div className="text-danger">{error.confirmPass}</div>}
              </div>

              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={disable}
                >
                  {disable ? "Changing Password..." : "Change Password"}
                </button>
              </div>
              <div className="mb-3 text-center">
                <h6>
                  Return to{" "}
                  <Link
                    to={ADMIN_URLS.LOGIN}
                    className="text-purple link-hover"
                  >
                    {" "}
                    Login
                  </Link>
                </h6>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdResetPassword