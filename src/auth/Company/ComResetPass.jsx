import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useApi } from '../../context/ApiContext';
import { logos } from '../../config/DataFile';
import '../../pages/home/loginPages/LoginPage.css'; // Create this CSS file
import HOME_URLS from '../../config/routesFile/index.routes';

const ComResetPass = () => {
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
            const response = await post('/company/reset-password', {
                email,
                password: password.newPass,
            });
            const { success, message } = response;
            if (success) {
                navigate(HOME_URLS.HOME);
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

    const togglePasswordVisibility = (field) => {
        setPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

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
                        <img src={logos.LOGIN_LOGO} alt='login-logo' className="reset-logo" />
                    </div> */}

                    <h2>Reset Password</h2>
                    <p className="welcome-text">
                        Create a new password for your account
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="newPass">New Password <span className="required">*</span></label>
                            <div className="password-input-container">
                                <div className="input-with-icon">
                                    <i className="icon password-icon"></i>
                                    <input
                                        type={password.newShow ? "text" : "password"}
                                        id="newPass"
                                        value={password.newPass}
                                        onChange={(e) => setPassword({ ...password, newPass: e.target.value })}
                                        placeholder="Enter new password"
                                        className={error.newPass ? 'error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => togglePasswordVisibility('newShow')}
                                    >
                                        <i className={`icon ${password.newShow ? 'eye-off-icon' : 'eye-icon'}`}></i>
                                    </button>
                                </div>
                            </div>
                            {error.newPass && <span className="error-message">{error.newPass}</span>}
                            <div className="password-requirements">
                                <p>Password must contain:</p>
                                <ul>
                                    <li className={password.newPass.length >= 6 ? 'valid' : ''}>At least 6 characters</li>
                                    <li className={/^[A-Z]/.test(password.newPass) ? 'valid' : ''}>Start with capital letter</li>
                                    <li className={/\d/.test(password.newPass) ? 'valid' : ''}>At least one number</li>
                                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password.newPass) ? 'valid' : ''}>One special character</li>
                                </ul>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPass">Confirm Password <span className="required">*</span></label>
                            <div className="password-input-container">
                                <div className="input-with-icon">
                                    <i className="icon password-icon"></i>
                                    <input
                                        type={password.confirmShow ? "text" : "password"}
                                        id="confirmPass"
                                        value={password.confirmPass}
                                        onChange={(e) => setPassword({ ...password, confirmPass: e.target.value })}
                                        placeholder="Confirm new password"
                                        className={error.confirmPass ? 'error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => togglePasswordVisibility('confirmShow')}
                                    >
                                        <i className={`icon ${password.confirmShow ? 'eye-off-icon' : 'eye-icon'}`}></i>
                                    </button>
                                </div>
                            </div>
                            {error.confirmPass && <span className="error-message">{error.confirmPass}</span>}
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${disable ? 'loading' : ''}`}
                            disabled={disable}
                        >
                            {disable ? (
                                <>
                                    <span className="spinner"></span>
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
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

export default ComResetPass;