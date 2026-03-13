import React, { useEffect, useState } from 'react'
import { useApi } from '../../context/ApiContext';
import { Link, useNavigate } from 'react-router';
import ADMIN_URLS from '../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';
import { logos } from '../../config/DataFile';

const AdForgetPassword = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("otpExpiry")) {
      localStorage.removeItem("otpExpiry");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const res = await post('/admin/forget-password', { email });
      const { success, message } = res;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.OTP_VERIFY, { state: email });
        setEmail('');
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setDisable(false);
    }
  }

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-03">
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
                <h4 className="mb-2 fs-20">Forgot Password?</h4>
                <p>
                  If you forgot your password, well, then we’ll email you
                  instructions to reset your password.
                </p>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Email Address</label>
                <div className="position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-mail" />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={disable}
                  />
                </div>
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary w-100">
                  {disable ? "Submitting..." : "Submit"}
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

export default AdForgetPassword