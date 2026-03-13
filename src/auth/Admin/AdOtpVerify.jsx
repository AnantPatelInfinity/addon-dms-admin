import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { useApi } from '../../context/ApiContext';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import ADMIN_URLS from '../../config/routesFile/admin.routes';
import { logos } from '../../config/DataFile';

const AdOtpVerify = () => {
  const { post } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const email = location.state;
  const [timeLeft, setTimeLeft] = useState(120); // Changed to 2 minutes (120 seconds)
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setResendEnabled(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    const storedExpiry = localStorage.getItem('otpExpiry');
    const now = Date.now();

    if (storedExpiry) {
      const remainingTime = Math.floor((parseInt(storedExpiry) - now) / 1000);
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setResendEnabled(false);
      } else {
        setTimeLeft(0);
        setResendEnabled(true);
      }
    } else {
      const expiry = now + 120000; // Changed to 2 minutes (120000 ms)
      localStorage.setItem('otpExpiry', expiry.toString());
      setTimeLeft(120);  // Changed to 2 minutes (120 seconds)
      setResendEnabled(false);
    }
  }, []);

  const formatTime = () => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    return `${minutes} : ${seconds}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("Please enter a 4-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await post('/admin/verify-otp', { email, otp });
      localStorage.removeItem('otpExpiry');
      const { success, message } = res;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.RESET_PASSWORD, { state: email });
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const handleResendOtp = async () => {
    try {
      const res = await post('/admin/forget-password', { email });
      const { success, message } = res;
      if (success) {
        toast.success(message);
        setResendEnabled(false);
        const newExpiry = Date.now() + 120000; // Changed to 2 minutes (120000 ms)
        localStorage.setItem('otpExpiry', newExpiry.toString());
        setTimeLeft(120); // Changed to 2 minutes (120 seconds)
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  }

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-04">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
          <form
            onSubmit={handleVerify}
            className="digit-group login-form-control"
          >
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
                <h4 className="mb-2 fs-20">OTP Verification</h4>
                <p>
                  We sent a verification code to <b>{email}</b>. Enter the code
                  below:
                </p>
              </div>
              <div className="d-flex align-items-center mb-4 justify-content-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  isInputNum
                  renderInput={(props, index) => (
                    <input
                      {...props}
                      type="number"
                    />
                  )}
                  inputStyle={{
                    width: "4rem",
                    height: "4rem",
                    margin: "0 0.5rem",
                    fontSize: "1.5rem",
                    borderRadius: 8,
                    border: "1px solid #ced4da",
                    textAlign: "center",
                  }}
                />
              </div>
              {/* <div className="text-center mb-3">
                <p className="badge badge-soft-purple shadow-none">
                  Otp will expire in 09 :10
                </p>
              </div> */}
              <div className="text-center mb-3">
                {!resendEnabled ? (
                  <p className="badge badge-soft-purple shadow-none">
                    OTP will expire in {formatTime()}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link text-primary p-0"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdOtpVerify