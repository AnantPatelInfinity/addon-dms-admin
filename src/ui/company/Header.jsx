import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  ClearCompanyStorage,
  getCompanyStorage,
} from "../../components/LocalStorage/CompanyStorage";
import HOME_URLS from "../../config/routesFile/index.routes";
import { toast } from "react-toastify";
import COMPANY_URLS from "../../config/routesFile/company.routes";
import { COMPANY_LOGOS } from "../../config/DataFile";
import DefaultImage from "../../../public/assets/img/default.jpg"

const Header = ({ toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const companyStorage = getCompanyStorage();

  const toggleButton = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const US_ID = localStorage.getItem("US_ID")
  const US_IMG = localStorage.getItem("DX_US_IMG")

  const handleLogout = () => {
    ClearCompanyStorage();
    navigate(HOME_URLS.HOME);
    toast.success("You’re now logged out.Have a great day!");
  };

  return (
    <div className="header">
      <div className={`header-left ${isSidebarOpen ? "active" : ""}`}>
        <Link to={COMPANY_URLS.DASHBOARD} className="logo logo-normal ">
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src={ US_ID ? US_IMG : companyStorage.image || DefaultImage}
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </Link>
        <Link to={COMPANY_URLS.DASHBOARD} className="logo-small">
          <img src="/assets/img/alerio_logo.svg" alt="Logo" />
        </Link>
        <a
          id="toggle_btn"
          href="javascript:void(0);"
          onClick={toggleButton}
          className={`${isSidebarOpen ? "active" : ""}`}
        >
          <i className="ti ti-arrow-bar-to-left" />
        </a>
      </div>
      <Link
        //  id="mobile_btn"
        className="mobile_btn"
        onClick={toggleMobileSidebar}
        //  href="#sidebar"
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>
      <div className="header-user">
        <ul className="nav user-menu">
          <li className="nav-item dropdown has-arrow main-drop">
            <a
              href="javascript:void(0);"
              className="nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-letter">
                  <img
                    src={US_ID ? US_IMG : companyStorage.image || DefaultImage}
                    alt="Profile"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "9px",
                      objectFit: "contain",
                    }}
                  />
                </span>
                <span className="badge badge-success rounded-pill" />
              </span>
            </a>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <Link className="dropdown-item" to={COMPANY_URLS.PROFILE}>
                  <i className="ti ti-user-pin" /> My Profile
                </Link>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <i className="ti ti-lock" /> Logout
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="dropdown mobile-user-menu">
        <a
          href="javascript:void(0);"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </a>
        <div className="dropdown-menu">
          <Link className="dropdown-item" to={COMPANY_URLS.PROFILE}>
            <i className="ti ti-user-pin" /> My Profile
          </Link>
          <Link
            to="#"
            className="dropdown-item"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <i className="ti ti-lock" /> Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
