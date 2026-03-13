import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useApi } from '../../context/ApiContext';
import DEALER_URLS from '../../config/routesFile/dealer.routes';
import { toast } from 'react-toastify';
import { logos } from '../../config/DataFile';
import "../../pages/home/loginPages/LoginPage.css"
import HOME_URLS from '../../config/routesFile/index.routes';

const DealerForgetPassword = () => {
    const { post } = useApi();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (localStorage.getItem("de_otpExpiry")) {
            localStorage.removeItem("de_otpExpiry");
        }
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setDisable(true);
        try {
            const res = await post('/dealer/forget-password', { email });
            const { success, message } = res;
            if (success) {
                toast.success(message);
                navigate(DEALER_URLS.OTP_VERIFY, { state: email });
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
        <div className="login-container">
            <div className="background-animation">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="login-card">

                <div className="login-form">
                    <div className="logo-container">
                        {/* <div className="logo-placeholder"> */}
                        {/* <img src={logos.LOGIN_LOGO} alt='login-logo' /> */}
                        {/* </div> */}
                    </div>

                    <h2>Forgot Password</h2>
                    <p className="welcome-text">
                        Enter your email address and we'll send you a verification code to reset your password
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <i className="icon email-icon"></i>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    className={errors.email ? 'error' : ''}
                                />
                            </div>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${disable ? 'loading' : ''}`}
                            disabled={disable}
                        >
                            {disable ? (
                                <>
                                    <span className="spinner"></span>
                                    Sending Code...
                                </>
                            ) : (
                                'Send Verification Code'
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

export default DealerForgetPassword