import { Link, useLocation } from 'react-router'
import COMPANY_URLS from '../../config/routesFile/company.routes';
import { useEffect, useState } from 'react';
import { getRoleFlags } from '../../config/DataFile';

const Sidebar = ({ companyStorage, toggleMobileSidebar }) => {

  const location = useLocation();

  const hasUserId = localStorage.getItem('US_ID'); 
  const userRole = localStorage.getItem('DX_ROLE');
  const userName = localStorage.getItem('DX_US_NAME')
  const userFirmName = localStorage.getItem("DX_US_FIRM_NAME")

  const isMasterActive = [
    COMPANY_URLS.CATEGORY_LIST,
    COMPANY_URLS.MANAGE_CATEGORY,
    COMPANY_URLS.UNIT_LIST,
    COMPANY_URLS.MANAGE_UNIT,
    COMPANY_URLS.PART_LIST,
    COMPANY_URLS.MANAGE_PART,
    COMPANY_URLS.MODEL_LIST,
    COMPANY_URLS.MANAGE_MODEL,
    COMPANY_URLS.SUPPLY_TYPE_LIST,
    COMPANY_URLS.MANAGE_SUPPLY_TYPE,
    COMPANY_URLS.WARRANTY_LIST,
    COMPANY_URLS.MANAGE_WARRANTY,
  ].includes(location.pathname);

  const isReportActive = [
    COMPANY_URLS.SERVICE_HISTORY,
    COMPANY_URLS.SERVICE_HISTORY_DETAILS,
    COMPANY_URLS.PENDING_COMPANY_RECEIVE,
    COMPANY_URLS.PENDING_CUSTOMER_RECEIVE,
    COMPANY_URLS.PENDING_CUSTOMER_PAYMENT
  ].includes(location.pathname);

  const [openReport, setOpenReport] = useState(isReportActive);
  const [openSubMenu, setOpenSubMenu] = useState(isMasterActive);

  useEffect(() => {
    setOpenSubMenu(isMasterActive);
    setOpenReport(isReportActive);
  }, [location.pathname]);

  const toggleSubMenu = () => setOpenSubMenu(prev => !prev);
  const toggleReport = () => setOpenReport(prev => !prev);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      toggleMobileSidebar();
    }
  };

  const roleFlags = getRoleFlags(userRole);
  const { isCompany, isGeneral, isServices, isAccounts, isInstallations } = roleFlags;

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="clinicdropdown">
              <Link to={COMPANY_URLS.DASHBOARD} className='company-logo-color'>
                <div className="user-names">
                  <h5>{ hasUserId ? userName : companyStorage.name}</h5>
                  <h6>{ hasUserId ? userFirmName : companyStorage.firmName}</h6>
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
                    to={COMPANY_URLS.DASHBOARD}
                    className={`subdrop ${location.pathname === COMPANY_URLS.DASHBOARD ? "active" : ""}`}
                    onClick={handleLinkClick}
                  >
                    <i className="ti ti-layout-2" />
                    <span>Dashboard</span>
                  </Link>
                </li>

                {(isCompany || isGeneral) && (
                  <li>
                    <Link
                      to={COMPANY_URLS.USERS}
                      className={location.pathname === COMPANY_URLS.USERS || location.pathname === COMPANY_URLS.MANAGE_USERS
                        || location.pathname === COMPANY_URLS.VIEW_USER ? 'active' : ''}
                      onClick={handleLinkClick}
                    >
                      <i className="ti ti-user-pin" />
                      <span>Company Users</span>
                    </Link>
                  </li>
                )}

                {(isCompany || isGeneral) && (
                  <li className={`submenu ${openSubMenu ? 'open' : ''}`}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubMenu();
                      }}
                      className={`${openSubMenu ? 'active subdrop' : ''}`}
                    >
                      <i className="ti ti-steam" />
                      <span>Master</span>        
                      <span className="menu-arrow" />
                    </a>
                    <ul style={{ display: openSubMenu ? 'block' : 'none' }}>
                      <li>
                        <Link
                          to={COMPANY_URLS.CATEGORY_LIST}
                          className={location.pathname === COMPANY_URLS.CATEGORY_LIST || location.pathname === COMPANY_URLS.MANAGE_CATEGORY ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.UNIT_LIST}
                          className={location.pathname === COMPANY_URLS.UNIT_LIST || location.pathname === COMPANY_URLS.MANAGE_UNIT ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Units
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.PART_LIST}
                          className={location.pathname === COMPANY_URLS.PART_LIST || location.pathname === COMPANY_URLS.MANAGE_PART ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Parts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.MODEL_LIST}
                          className={location.pathname === COMPANY_URLS.MODEL_LIST ? 'active' : ''}
                        >
                          Product Models
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.SUPPLY_TYPE_LIST}
                          className={location.pathname === COMPANY_URLS.SUPPLY_TYPE_LIST || location.pathname === COMPANY_URLS.MANAGE_SUPPLY_TYPE ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Supply Types
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.WARRANTY_LIST}
                          className={location.pathname === COMPANY_URLS.WARRANTY_LIST || location.pathname === COMPANY_URLS.MANAGE_WARRANTY ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Warranty
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                {(isCompany || isGeneral) && (
                  <>
                    <li>
                      <Link
                        to={COMPANY_URLS.PRODUCT_LIST}
                        className={`subdrop ${location.pathname === COMPANY_URLS.PRODUCT_LIST || location.pathname === COMPANY_URLS.MANAGE_PRODUCT ? "active" : ""}`}
                        onClick={handleLinkClick}
                      >
                        <i className="ti ti-package" />
                        <span>Product</span>
                      </Link>
                    </li>
                   
                  </>
                )}

                {(isCompany || isGeneral || isAccounts) && 
                  <li>
                      <Link
                        to={COMPANY_URLS.PO_LIST}
                        className={`subdrop ${location.pathname === COMPANY_URLS.PO_LIST || location.pathname === COMPANY_URLS.VIEW_PO ? "active" : ""}`}
                        onClick={handleLinkClick}
                      >
                        <i className="ti ti-report-money" />
                        <span>PO Transaction</span>
                      </Link>
                  </li>
                }

                {(isCompany || isGeneral || isInstallations) && (
                  <li>
                    <Link
                      to={COMPANY_URLS.INSTALL_LIST}
                      className={`subdrop ${location.pathname === COMPANY_URLS.INSTALL_LIST || location.pathname === COMPANY_URLS.VIEW_INSTALL ? "active" : ""}`}
                      onClick={handleLinkClick}
                    >
                      <i className="ti ti-artboard" />
                      <span>Installations</span>
                    </Link>
                  </li>
                )}

                {(isCompany || isGeneral || isServices) && (
                  <li>
                    <Link
                      to={COMPANY_URLS.SERVICE_LIST}
                      className={location.pathname === COMPANY_URLS.SERVICE_LIST || location.pathname === COMPANY_URLS.VIEW_SERVICE ? 'active' : ''}
                      onClick={handleLinkClick}
                    >
                      <i className="ti ti-settings" />
                      <span>Services</span>
                    </Link>
                  </li>
                )}

                {(isCompany || isGeneral || isServices) && (
                  <li className={`submenu ${openReport ? 'open' : ''}`}>
                    <a
                      href="#"
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
                          to={COMPANY_URLS.SERVICE_HISTORY}
                          className={location.pathname === COMPANY_URLS.SERVICE_HISTORY ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Full Service History
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.PENDING_COMPANY_RECEIVE}
                          className={location.pathname === COMPANY_URLS.PENDING_COMPANY_RECEIVE ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Products Sent to Company (Not Yet Received)
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.PENDING_CUSTOMER_RECEIVE}
                          className={location.pathname === COMPANY_URLS.PENDING_CUSTOMER_RECEIVE ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Products Sent to Customer (Not Yet Received)
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={COMPANY_URLS.PENDING_CUSTOMER_PAYMENT}
                          className={location.pathname === COMPANY_URLS.PENDING_CUSTOMER_PAYMENT ? 'active' : ''}
                          onClick={handleLinkClick}
                        >
                          Service Payment Pending By Customer/Dealer
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
