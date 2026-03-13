import React from 'react'
import { useLocation, useNavigate } from 'react-router';
import ADMIN_URLS, { ADMIN_BASE_URL } from '../config/routesFile/admin.routes';
import DEALER_URLS, { DEALER_BASE_URL } from '../config/routesFile/dealer.routes';
import COMPANY_URLS, { COMPANY_BASE_URL } from '../config/routesFile/company.routes';

const NotFound = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const getDashboardPath = () => {
        if (location.pathname.startsWith(ADMIN_BASE_URL)) return ADMIN_URLS.DASHBOARD;
        if (location.pathname.startsWith(DEALER_BASE_URL)) return DEALER_URLS.DASHBOARD;
        if (location.pathname.startsWith(COMPANY_BASE_URL)) return COMPANY_URLS.DASHBOARD;
        return '/';
    };

    const handleBack = () => {
        navigate(getDashboardPath());
    };

    return (
        <div className="main-wrapper">
            <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden">
                <div className="d-flex align-items-center justify-content-center flex-fill flex-column vh-100 overflow-auto">
                    <div className="error-img mb-4">
                        <img src="/assets/img/authentication/error-404.png" className="img-fluid" alt />
                    </div>
                    <div className="text-center">
                        <h3 className="fs-28 mb-3">Oops, something went wrong</h3>
                        <p className="fs-16">Error 404 Page not found. Sorry the page you looking for <br /> doesn’t exist or has
                            been moved</p>
                        <button onClick={handleBack} type='button' className="btn btn-primary">
                            <i className="ti ti-arrow-narrow-left me-1" /> Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound