import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router';
import { ClearCompanyStorage, getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { toast } from 'react-toastify';
import HOME_URLS from '../../../config/routesFile/index.routes';
import Header from '../../../ui/company/Header';
import Sidebar from '../../../ui/company/Sidebar';
import { companyRoleOptions } from '../../../config/DataFile';

const CompanyLayout = () => {
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    useEffect(() => {
        const { token, comId, role } = getCompanyStorage();
        
         if (!token || !comId) {
            ClearCompanyStorage();
            toast.error("Your session has expired. Please login again.", {
                autoClose: 2000,
                onClose: () => navigate(HOME_URLS.HOME),
            });
            return;
        }

        const companyUserRoles = companyRoleOptions.map(option => option.value);
        const allowedRoles = ["company", ...companyUserRoles];

        if (!allowedRoles.includes(role)) {
            ClearCompanyStorage();
            toast.error("You don't have company access privileges. Please login with a company account.", {
                autoClose: 2000,
                onClose: () => navigate(HOME_URLS.HOME),
            });
            return;
        }

    }, [navigate]);


    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };
    return (
        <div className={`main-wrapper ${isMobileOpen ? 'slide-nav' : ''}`}>
            <Header toggleMobileSidebar={toggleMobileSidebar} />
            <Sidebar companyStorage={getCompanyStorage()} toggleMobileSidebar={toggleMobileSidebar} />
            <Outlet />
        </div>
    )
}

export default CompanyLayout