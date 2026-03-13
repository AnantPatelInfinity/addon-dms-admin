import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import DEALER_URLS from '../../config/routesFile/dealer.routes';

const Sidebar = ({ dealerStorage, toggleMobileSidebar }) => {

    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            toggleMobileSidebar();
        }
    };

    const isReportActive = [
        DEALER_URLS.SERVICE_HISTORY,
        DEALER_URLS.SERVICE_HISTORY_DETAILS,
        DEALER_URLS.PENDING_COMPANY_RECEIVE,
        DEALER_URLS.PENDING_CUSTOMER_RECEIVE,
        DEALER_URLS.PENDING_CUSTOMER_PAYMENT
    ].includes(location.pathname);

    useEffect(() => {
        setOpenReport(isReportActive);
    }, [location.pathname]);

    const [openReport, setOpenReport] = useState(isReportActive);

    const toggleReport = () => {
        setOpenReport((prev) => !prev);
    }

    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li className="clinicdropdown">
                            <Link to={DEALER_URLS.DASHBOARD} className='dealer-logo-color'>
                                {/* <img src="/assets/img/profiles/avatar-14.jpg" className="img-fluid" alt="Profile" /> */}
                                <div className="user-names">
                                    <h5>{dealerStorage.DX_DL_NAME}</h5>
                                    <h6>{dealerStorage.DX_DL_FIRM_NAME}</h6>
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
                                        to={DEALER_URLS.DASHBOARD}
                                        className={`subdrop ${location.pathname === DEALER_URLS.DASHBOARD
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-layout-2" />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.PRODUCT_LIST} className={`subdrop ${location.pathname === DEALER_URLS.PRODUCT_LIST ||
                                        location.pathname.startsWith(DEALER_URLS.VIEW_PRODUCT)
                                        ? "active"
                                        : ""
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-package" />
                                        <span>Product (Order)</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.PO_LIST}
                                        className={`subdrop  ${location.pathname === DEALER_URLS.PO_LIST ||
                                            location.pathname === DEALER_URLS.MANAGE_PO || location.pathname === DEALER_URLS.VIEW_PO
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti ti-report-money" />
                                        <span>PO Transaction <br /> (PO To Company)</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.SERIALNO_LIST} className={`subdrop ${location.pathname === DEALER_URLS.SERIALNO_LIST
                                        ? "active"
                                        : ""
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti ti-hash" />
                                        <span>Order History</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.OLD_PO_LIST} className={`subdrop ${location.pathname === DEALER_URLS.OLD_PO_LIST || location.pathname === DEALER_URLS.MANAGE_OLD_PO || location.pathname === DEALER_URLS.VIEW_OLD_PO
                                        ? "active"
                                        : ""
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti ti-hash" />
                                        <span>Old PO</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.DE_CUSTOMER_LIST} className={`subdrop ${location.pathname === DEALER_URLS.DE_CUSTOMER_LIST ||
                                        location.pathname === DEALER_URLS.MANAGE_DE_CUSTOMER || location.pathname === DEALER_URLS.VIEW_DE_CUSTOMER
                                        ? "active"
                                        : ""
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-users" />
                                        <span>Customer</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={DEALER_URLS.TRIAL_LIST}
                                        className={
                                            location.pathname === DEALER_URLS.TRIAL_LIST ||
                                                location.pathname === DEALER_URLS.VIEW_TRIAL ||
                                                location.pathname === DEALER_URLS.MANAGE_TRIAL
                                                ? "active"
                                                : ""
                                        }
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-filter" />
                                        <span>Demo Unit</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.INSTALL_LIST} className={`subdrop ${location.pathname === DEALER_URLS.INSTALL_LIST ||
                                        location.pathname === DEALER_URLS.MANAGE_INSTALL || location.pathname === DEALER_URLS.VIEW_INSTALL
                                        ? "active" : ""}`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-artboard" />
                                        <span>Installations</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={DEALER_URLS.INSTALLATION_POST}
                                        className={
                                            location.pathname === DEALER_URLS.INSTALLATION_POST ? "active" : ""}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-files" />
                                        <span>Installation Post</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={DEALER_URLS.SERVICE_LIST}
                                        className={location.pathname === DEALER_URLS.SERVICE_LIST ||
                                            location.pathname === DEALER_URLS.VIEW_SERVICE || location.pathname === DEALER_URLS.MANAGE_SERVICE
                                            ? 'active' : ''}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-settings" />
                                        <span>Services</span>
                                    </Link>
                                </li>

                                <li className={`submenu ${openReport ? 'open' : ''}`}>
                                    <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleReport();
                                        }}
                                        className={`${openReport ? 'active subdrop' : ''}`}
                                    >
                                        <i className="ti ti-file-analytics" />
                                        <span>Reports</span>
                                        <span className="menu-arrow" />
                                    </a>
                                    <ul style={{ display: openReport ? 'block' : 'none' }}>
                                        <li>
                                            <Link
                                                to={DEALER_URLS.SERVICE_HISTORY}
                                                className={location.pathname === DEALER_URLS.SERVICE_HISTORY ? 'active' : ''}
                                                onClick={handleLinkClick}
                                            >
                                                Full Service History
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={DEALER_URLS.PENDING_COMPANY_RECEIVE}
                                                className={location.pathname === DEALER_URLS.PENDING_COMPANY_RECEIVE ? 'active' : ''}
                                                onClick={handleLinkClick}
                                            >
                                                Products Sent to Company (Not Yet Received)
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={DEALER_URLS.PENDING_CUSTOMER_RECEIVE}
                                                className={location.pathname === DEALER_URLS.PENDING_CUSTOMER_RECEIVE ? 'active' : ''}
                                                onClick={handleLinkClick}
                                            >
                                                Products Sent to Customer (Not Yet Received)
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={DEALER_URLS.PENDING_CUSTOMER_PAYMENT}
                                                className={location.pathname === DEALER_URLS.PENDING_CUSTOMER_PAYMENT ? 'active' : ''}
                                                onClick={handleLinkClick}
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
    )
}

export default Sidebar