import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import { useApi } from '../../context/ApiContext';
import { Link, useLocation, useNavigate } from 'react-router';
import HOME_URLS from '../../config/routesFile/index.routes';
import { logos } from '../../config/DataFile';
import "../../pages/home/loginPages/LoginPage.css";
import DEALER_URLS from '../../config/routesFile/dealer.routes';

const DeOtpVerify = () => {
    const { post } = useApi();
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const email = location.state;
    const [timeLeft, setTimeLeft] = useState(120);  // Changed to 2 minutes (120 seconds)
    const [resendEnabled, setResendEnabled] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

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
        const storedExpiry = localStorage.getItem('de_otpExpiry');
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
            localStorage.setItem('de_otpExpiry', expiry.toString());
            setTimeLeft(120); // Changed to 2 minutes (120 seconds)
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
            const res = await post('/dealer/verify-otp', { email, otp });
            localStorage.removeItem('de_otpExpiry');
            const { success, message } = res;
            if (success) {
                toast.success(message);
                navigate(DEALER_URLS.RESET_PASSWORD, { state: email });
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
            setResendLoading(true);
            const res = await post('/dealer/forget-password', { email });
            const { success, message } = res;
            if (success) {
                toast.success(message);
                setResendEnabled(false);
                const newExpiry = Date.now() + 120000; // Changed to 2 minutes (120000 ms)
                localStorage.setItem('de_otpExpiry', newExpiry.toString());
                setTimeLeft(120);  // Changed to 2 minutes (120 seconds)
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setResendLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="background-animation">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="login-card">
                <div className="login-form">
                    {/* <div className="logo-container">
                        <img src={logos.LOGIN_LOGO} alt='login-logo' className="otp-logo" />
                    </div> */}

                    <h2>OTP Verification</h2>
                    <p className="welcome-text">
                        We've sent a 4-digit verification code to <span className="email-highlight">{email}</span>
                    </p>

                    <form onSubmit={handleVerify}>
                        <div className="form-group otp-input-container">
                            <label>Enter Verification Code</label>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={4}
                                renderInput={(props) => <input {...props} />}
                                containerStyle="otp-input-wrapper"
                                inputStyle="otp-input"
                                focusStyle="otp-input-focus"
                                shouldAutoFocus
                            />
                        </div>

                        <div className="timer-container">
                            {!resendEnabled ? (
                                <p className="timer-text">Code expires in: <span>{formatTime()}</span></p>
                            ) : (
                                <p className="resend-text">Didn't receive code?</p>
                            )}
                            <button
                                type="button"
                                className={`resend-button ${resendEnabled ? '' : 'disabled'}`}
                                onClick={handleResendOtp}
                                disabled={!resendEnabled || resendLoading}
                            >
                                {resendLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Resending...
                                    </>
                                ) : (
                                    'Resend Code'
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${loading ? 'loading' : ''}`}
                            disabled={loading || otp.length !== 4}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </form>

                    <div className="back-to-login">
                        <Link to={HOME_URLS.HOME} className="back-link">
                            <i className="icon back-icon"></i>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeOtpVerify