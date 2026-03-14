import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import FullScreen from '../../components/FullScreen/FullScreen';
import DarkMode from '../../components/DarkMode/DarkMode';
import { toast } from 'react-toastify';
import ADMIN_URLS from '../../config/routesFile/admin.routes';
import { ClearAdminStorage, getAdminStorage } from '../../components/LocalStorage/AdminStorage';
import { logos } from '../../config/DataFile';

const Header = ({ toggleMobileSidebar }) => {

    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const adminStorage = getAdminStorage();

    const toggleButton = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        ClearAdminStorage();
        navigate(ADMIN_URLS.LOGIN);
        toast.success("You’re now logged out.Have a great day!")
    }

    return (
        <div className="header">
            <div className={`header-left ${isSidebarOpen ? "active" : ""}`}>
                <Link to={ADMIN_URLS.DASHBOARD} className="logo logo-normal">
                    <img src={adminStorage.DX_AD_FIRM_SN === "DMP" ? logos.LOGIN_LOGO : logos.X_TECH_LOGO} alt="Logo" style={{ width: adminStorage.DX_AD_FIRM_SN !== "DMP" && "70px" }} />
                    <img
                        src="/assets/img/white-logo.svg"
                        className="white-logo"
                        alt="Logo"
                    />
                </Link>
                <Link to={ADMIN_URLS.DASHBOARD} className="logo-small">
                    <img src={adminStorage.DX_AD_FIRM_SN === "DMP" ? logos.SMALL_LOGO : logos.LOGIN_LOGO} alt="Logo" />
                </Link>
                <a id="toggle_btn" href="#" onClick={(e) => { e.preventDefault(); toggleButton(); }} className={`${isSidebarOpen ? "active" : ""}`}>
                    <i className="ti ti-arrow-bar-to-left" />
                </a>
            </div>
            <Link
                //  to="javascript:void(0);"
                className="mobile_btn"
                onClick={toggleMobileSidebar}>
                <span className="bar-icon">
                    <span />
                    <span />
                    <span />
                </span>
            </Link>
            <div className="header-user">
                <ul className="nav user-menu">
                    <li className="nav-item nav-list">
                        <ul className="nav">
                            <FullScreen />
                            <DarkMode />
                        </ul>
                    </li>
                    <li className="nav-item dropdown has-arrow main-drop">
                        <a
                            href="#"
                            className="nav-link userset"
                            data-bs-toggle="dropdown"
                        >
                            <span className="user-info">
                                <span className="user-letter">
                                    <img
                                        src={adminStorage.DX_AD_IMG || "/assets/img/default.jpg"}
                                        alt="Profile"
                                    />
                                </span>
                                <span className="badge badge-success rounded-pill" />
                            </span>
                        </a>
                        <div className="dropdown-menu menu-drop-user">
                            <div className="profilename">
                                <Link className="dropdown-item" to={ADMIN_URLS.PROFILE}>
                                    <i className="ti ti-user-pin" /> My Profile
                                </Link>
                                <button type="button" className="dropdown-item" onClick={handleLogout}>
                                    <i className="ti ti-lock" /> Logout
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="dropdown mobile-user-menu">
                <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="fa fa-ellipsis-v" />
                </a>
                <div className="dropdown-menu">
                    <Link className="dropdown-item" to={ADMIN_URLS.PROFILE}>
                        <i className="ti ti-user-pin" /> My Profile
                    </Link>
                    <Link
                        to="#"
                        className="dropdown-item"
                        onClick={e => { e.preventDefault(); handleLogout(); }}
                    >
                        <i className="ti ti-lock" /> Logout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header