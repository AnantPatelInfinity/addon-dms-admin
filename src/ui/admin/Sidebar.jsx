import React, { useEffect, useState } from "react";
import ADMIN_URLS from "../../config/routesFile/admin.routes";
import { Link, useLocation } from "react-router";

const Sidebar = ({ adminStorage, toggleMobileSidebar }) => {
  const location = useLocation();
  const isCategoryActive = [
    ADMIN_URLS.PRODUCT_CAT,
    ADMIN_URLS.MANAGE_PRODUCT_CAT,
    ADMIN_URLS.PRO_UNIT_LIST,
    ADMIN_URLS.PRO_MANAGE_UNIT,
    ADMIN_URLS.PRO_PART_LIST,
    ADMIN_URLS.PRO_MANAGE_PART,
    ADMIN_URLS.PRO_MODEL_LIST,
    ADMIN_URLS.MANAGE_PRO_MODEL,
    ADMIN_URLS.SUPPLY_TYPE_LIST,
    ADMIN_URLS.MANAGE_SUPPLY_TYPE,
    ADMIN_URLS.DISPATCH_LIST,
    ADMIN_URLS.MANAGE_DISPATCH,
    ADMIN_URLS.WARRANTY_LIST,
    ADMIN_URLS.MANAGE_WARRANTY,
    ADMIN_URLS.AMC_LIST,
    ADMIN_URLS.MANAGE_AMC,
  ].includes(location.pathname);

  const isReportActive = [
    ADMIN_URLS.SERVICE_HISTORY,
    ADMIN_URLS.SERVICE_HISTORY_DETAILS,
    ADMIN_URLS.PENDING_COMPANY_RECEIVE,
    ADMIN_URLS.PENDING_CUSTOMER_RECEIVE,
    ADMIN_URLS.PENDING_CUSTOMER_PAYMENT,
  ].includes(location.pathname);

  const isPoActive =
    [
      ADMIN_URLS.PO_LIST,
      ADMIN_URLS.MANAGE_PO,
      ADMIN_URLS.DEALER_PO_LIST,
      ADMIN_URLS.CUSTOMER_PO_LIST,
    ].includes(location.pathname) ||
    location.pathname.startsWith(ADMIN_URLS.VIEW_DEALER_PO) ||
    location.pathname.startsWith(ADMIN_URLS.VIEW_CUSTOMER_PO) ||
    location.pathname.startsWith(ADMIN_URLS.VIEW_PO);
  const [openTrasaction, setOpenTrasaction] = useState(isPoActive);
  const [openSubMenu, setOpenSubMenu] = useState(isCategoryActive);
  const [openReport, setOpenReport] = useState(isReportActive);
  useEffect(() => {
    setOpenSubMenu(isCategoryActive);
    setOpenTrasaction(isPoActive);
    setOpenReport(isReportActive);
  }, [location.pathname]);

  const toggleSubMenu = () => {
    setOpenSubMenu((prev) => !prev);
  };
  const toggleTransaction = () => {
    setOpenTrasaction((prev) => !prev);
  };

  const toggleReport = () => {
    setOpenReport((prev) => !prev);
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      // Adjust breakpoint as needed
      toggleMobileSidebar();
    }
  };

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll sidebar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="clinicdropdown">
              <Link to={ADMIN_URLS.DASHBOARD}>
                {/* <img src="/assets/img/profiles/avatar-14.jpg" className="img-fluid" alt="Profile" /> */}
                <div className="user-names">
                  <h5>{adminStorage.DX_AD_NAME}</h5>
                  <h6>{adminStorage.DX_AD_FIRM_NAME}</h6>
                </div>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <h6 className="submenu-hdr">Main Menu</h6>
              <ul>
                <li>
                  <Link
                    to={ADMIN_URLS.DASHBOARD}
                    className={`subdrop ${location.pathname === ADMIN_URLS.DASHBOARD ? "active" : ""
                      }`}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-layout-2" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.FIRM_LIST}
                    className={`subdrop ${location.pathname === ADMIN_URLS.FIRM_LIST ||
                      location.pathname === ADMIN_URLS.MANAGE_FIRM ||
                      location.pathname === ADMIN_URLS.VIEW_FIRM
                      ? "active"
                      : ""
                      }`}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-building-community" />
                    <span>Firm</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.COMPANY_LIST}
                    className={`subdrop ${location.pathname === ADMIN_URLS.COMPANY_LIST ||
                      location.pathname === ADMIN_URLS.MANAGE_COMPANY ||
                      location.pathname === ADMIN_URLS.VIEW_COMPANY
                      ? "active"
                      : ""
                      }`}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-briefcase" />
                    <span>Company</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to={ADMIN_URLS.DEALER_LIST}
                    className={`subdrop ${location.pathname === ADMIN_URLS.DEALER_LIST ||
                      location.pathname === ADMIN_URLS.MANAGE_DEALER ||
                      location.pathname === ADMIN_URLS.VIEW_DEALER
                      ? "active"
                      : ""
                      }`}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-user-up" />
                    <span>Dealer</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to={ADMIN_URLS.CUSTOMER_LIST}
                    className={`subdrop ${location.pathname === ADMIN_URLS.CUSTOMER_LIST ||
                      location.pathname === ADMIN_URLS.MANAGE_CUSTOMER ||
                      location.pathname === ADMIN_URLS.VIEW_CUSTOMER
                      ? "active"
                      : ""
                      }`}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-users" />
                    <span>Customer</span>
                  </Link>
                </li>

                <li className={`submenu ${openSubMenu ? "open" : ""}`}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubMenu();
                    }}
                    className={`${openSubMenu ? "active subdrop" : ""}`}
                  >
                    <i className="ti ti-steam" />
                    <span>Master</span>
                    <span className="menu-arrow" />
                  </a>
                  <ul style={{ display: openSubMenu ? "block" : "none" }}>
                    <li>
                      <Link
                        to={ADMIN_URLS.PRODUCT_CAT}
                        className={
                          location.pathname === ADMIN_URLS.PRODUCT_CAT ||
                            location.pathname === ADMIN_URLS.MANAGE_PRODUCT_CAT
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Product Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.PRO_UNIT_LIST}
                        className={
                          location.pathname === ADMIN_URLS.PRO_UNIT_LIST ||
                            location.pathname === ADMIN_URLS.PRO_MANAGE_UNIT
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Units
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.PRO_PART_LIST}
                        className={
                          location.pathname === ADMIN_URLS.PRO_PART_LIST ||
                            location.pathname === ADMIN_URLS.PRO_MANAGE_PART
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Parts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.PRO_MODEL_LIST}
                        className={
                          location.pathname === ADMIN_URLS.PRO_MODEL_LIST ||
                            location.pathname === ADMIN_URLS.MANAGE_PRO_MODEL
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Product Models
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.SUPPLY_TYPE_LIST}
                        className={
                          location.pathname === ADMIN_URLS.SUPPLY_TYPE_LIST ||
                            location.pathname === ADMIN_URLS.MANAGE_SUPPLY_TYPE
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Supply Types
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.DISPATCH_LIST}
                        className={
                          location.pathname === ADMIN_URLS.DISPATCH_LIST ||
                            location.pathname === ADMIN_URLS.MANAGE_DISPATCH
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Dispatch Company
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.WARRANTY_LIST}
                        className={
                          location.pathname === ADMIN_URLS.WARRANTY_LIST ||
                            location.pathname === ADMIN_URLS.MANAGE_WARRANTY
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Warranty
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.AMC_LIST}
                        className={
                          location.pathname === ADMIN_URLS.AMC_LIST ||
                            location.pathname === ADMIN_URLS.MANAGE_AMC
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        AMC
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.PRODUCT}
                    className={`subdrop ${location.pathname === ADMIN_URLS.PRODUCT ||
                      location.pathname === ADMIN_URLS.MANAGE_PRODUCT
                      ? "active"
                      : ""
                      }`}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-package" />
                    <span>Product</span>
                  </Link>
                </li>
                <li className={`submenu ${openTrasaction ? "open" : ""}`}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTransaction();
                    }}
                    className={`${openTrasaction ? "active subdrop" : ""}`}
                  >
                    <i className="ti ti ti-report-money" />
                    <span>Transaction</span>
                    <span className="menu-arrow" />
                  </a>
                  <ul style={{ display: openTrasaction ? "block" : "none" }}>
                    <li>
                      <Link
                        to={ADMIN_URLS.PO_LIST}
                        className={
                          location.pathname === ADMIN_URLS.PO_LIST ||
                            location.pathname === ADMIN_URLS.MANAGE_PO ||
                            location.pathname.startsWith(ADMIN_URLS.VIEW_PO)
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        PO To Company
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.DEALER_PO_LIST}
                        className={
                          location.pathname === ADMIN_URLS.DEALER_PO_LIST ||
                            location.pathname.startsWith(
                              ADMIN_URLS.VIEW_DEALER_PO
                            )
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        PO From Dealer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.CUSTOMER_PO_LIST}
                        className={location.pathname === ADMIN_URLS.CUSTOMER_PO_LIST ||
                          location.pathname.startsWith(
                            ADMIN_URLS.VIEW_CUSTOMER_PO
                          )
                          ? "active"
                          : ""
                        }
                        onClick={handleMenuClick}
                      >
                        PO From Customer
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.TRIAL_LIST}
                    className={
                      location.pathname === ADMIN_URLS.TRIAL_LIST ||
                        location.pathname === ADMIN_URLS.VIEW_TRIAL ||
                        location.pathname === ADMIN_URLS.MANAGE_TRIAL
                        ? "active"
                        : ""
                    }
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-filter" />
                    <span>Demo Unit</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.INSTALL_LIST}
                    className={
                      location.pathname === ADMIN_URLS.INSTALL_LIST ||
                        location.pathname === ADMIN_URLS.VIEW_INSTALL ||
                        location.pathname === ADMIN_URLS.MANAGE_INSTALL
                        ? "active"
                        : ""
                    }
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-artboard" />
                    <span>Installations</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.INSTALLATION_POST}
                    className={
                      location.pathname === ADMIN_URLS.INSTALLATION_POST ? "active" : ""}
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-files" />
                    <span>Installation Post</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ADMIN_URLS.SERVICE_LIST}
                    className={
                      location.pathname === ADMIN_URLS.SERVICE_LIST ||
                        location.pathname === ADMIN_URLS.VIEW_SERVICE ||
                        location.pathname === ADMIN_URLS.MANAGE_SERVICE
                        ? "active"
                        : ""
                    }
                    onClick={handleMenuClick}
                  >
                    <i className="ti ti-settings" />
                    <span>Services</span>
                  </Link>
                </li>
                <li className={`submenu ${openReport ? "open" : ""}`} style={{ marginBottom: "60px" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleReport();
                    }}
                    className={`${openReport ? "active subdrop" : ""}`}
                  >
                    <i className="ti ti-file-analytics" />
                    <span>Reports</span>
                    <span className="menu-arrow" />
                  </a>
                  <ul style={{ display: openReport ? "block" : "none" }}>
                    <li>
                      <Link
                        to={ADMIN_URLS.SERVICE_HISTORY}
                        className={
                          location.pathname === ADMIN_URLS.SERVICE_HISTORY
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Full Service History
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.PENDING_COMPANY_RECEIVE}
                        className={
                          location.pathname ===
                            ADMIN_URLS.PENDING_COMPANY_RECEIVE
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Products Sent to Company (Not Yet Received)
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.PENDING_CUSTOMER_RECEIVE}
                        className={
                          location.pathname ===
                            ADMIN_URLS.PENDING_CUSTOMER_RECEIVE
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Products Sent to Customer (Not Yet Received)
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={ADMIN_URLS.PENDING_CUSTOMER_PAYMENT}
                        className={
                          location.pathname ===
                            ADMIN_URLS.PENDING_CUSTOMER_PAYMENT
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuClick}
                      >
                        Service Payment Pending By Customer/Dealer
                      </Link>
                    </li>
                  </ul>
                </li>

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
