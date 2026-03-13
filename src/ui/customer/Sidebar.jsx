import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import CUSTOMER_URLS from '../../config/routesFile/customer.routes';

const Sidebar = ({ customerStorage, toggleMobileSidebar }) => {

    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            toggleMobileSidebar();
        }
    };

    const isReportActive = [
        CUSTOMER_URLS.SERVICE_HISTORY,
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
                            <Link to={CUSTOMER_URLS.DASHBOARD} className='dealer-logo-color'>
                                {/* <img src="/assets/img/profiles/avatar-14.jpg" className="img-fluid" alt="Profile" /> */}
                                <div className="user-names">
                                    <h5>{customerStorage.DX_CU_NAME}</h5>
                                    <h6>{customerStorage.DX_CU_FIRM_NAME}</h6>
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
                                        to={CUSTOMER_URLS.DASHBOARD}
                                        className={`subdrop ${location.pathname === CUSTOMER_URLS.DASHBOARD
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
                                    <Link to={CUSTOMER_URLS.PRODUCT_LIST} className={`subdrop ${location.pathname === CUSTOMER_URLS.PRODUCT_LIST ||
                                        location.pathname.startsWith(CUSTOMER_URLS.VIEW_PRODUCT)
                                        ? "active"
                                        : ""
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-package" />
                                        <span>Store (Buy Product)</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={CUSTOMER_URLS.PO_LIST} className={`subdrop ${location.pathname === CUSTOMER_URLS.PO_LIST ||
                                        location.pathname === CUSTOMER_URLS.MANAGE_PO || location.pathname === CUSTOMER_URLS.VIEW_PO
                                        ? "active"
                                        : ""
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti ti-report-money" />
                                        <span>PO Transactions</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to={CUSTOMER_URLS.SERIALNO_LIST}
                                        className={`subdrop ${location.pathname === CUSTOMER_URLS.SERIALNO_LIST
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti ti-hash" />
                                        <span>My Invoices</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to={CUSTOMER_URLS.INSTALLATION_LIST}
                                        className={`subdrop ${location.pathname === CUSTOMER_URLS.INSTALLATION_LIST
                                            || location.pathname === CUSTOMER_URLS.VIEW_INSTALLATION
                                            ? "active" : ""}`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-artboard" />
                                        <span>Extended Warranty</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={CUSTOMER_URLS.SERVICE_LIST}
                                        className={location.pathname === CUSTOMER_URLS.SERVICE_LIST ||
                                            location.pathname === CUSTOMER_URLS.VIEW_SERVICE || location.pathname === CUSTOMER_URLS.MANAGE_SERVICE
                                            ? 'active' : ''}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-settings" />
                                        <span>Track Complaint</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to={CUSTOMER_URLS.TRIAL_LIST}
                                        className={`subdrop ${location.pathname === CUSTOMER_URLS.TRIAL_LIST
                                            || location.pathname === CUSTOMER_URLS.VIEW_TRIAL
                                            ? "active" : ""}`}
                                        onClick={handleLinkClick}
                                    >
                                        <i className="ti ti-filter" />
                                        <span>Demo Unit</span>
                                    </Link>
                                </li>

                                {/* <li className={`submenu ${openReport ? 'open' : ''}`}>
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
                                                to={CUSTOMER_URLS.SERVICE_HISTORY}
                                                className={location.pathname === CUSTOMER_URLS.SERVICE_HISTORY ? 'active' : ''}
                                                onClick={handleLinkClick}
                                            >
                                                Full Service History
                                            </Link>
                                        </li>
                                    </ul>
                                </li> */}

                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar