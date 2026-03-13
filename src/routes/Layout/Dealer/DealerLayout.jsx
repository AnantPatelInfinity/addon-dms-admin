import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router';
import Header from '../../../ui/dealer/Header';
import { ClearDealerStorage, getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import Sidebar from '../../../ui/dealer/Sidebar';
import HOME_URLS from '../../../config/routesFile/index.routes';
import { toast } from 'react-toastify';
import { ROLES } from '../../../config/DataFile';

const DealerLayout = () => {
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const { DX_DL_TOKEN: token, DL_ID: dealerId, DX_ROLE: role } = getDealerStorage();

        if (!token || !dealerId) {
            ClearDealerStorage();
            toast.error("Your session has expired. Please login again.", {
                autoClose: 2000,
                onClose: () => navigate(HOME_URLS.HOME),
            });
            return;
        }

        if (role !== ROLES.DEALER) {
            ClearDealerStorage();
            toast.error("You don't have permission to access this page.", {
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
            <Sidebar dealerStorage={getDealerStorage()} toggleMobileSidebar={toggleMobileSidebar} />
            <Outlet />
        </div>
    )
}

export default DealerLayout