import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router';
import Header from '../../../ui/admin/Header';
import Sidebar from '../../../ui/admin/Sidebar';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';
import { ClearAdminStorage, getAdminStorage } from '../../../components/LocalStorage/AdminStorage';

const AdminLayout = () => {

  const navigate = useNavigate();
  const adminStorage = getAdminStorage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('DX_AD_TOKEN');
    if (!token) {
      ClearAdminStorage();
      toast.error("Please login first", {
        onClose: () => navigate(ADMIN_URLS.LOGIN),
        autoClose: 1500
      });
    }
  }, [navigate]);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <div className={`main-wrapper ${isMobileOpen ? 'slide-nav' : ''}`}>
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <Sidebar adminStorage={adminStorage} toggleMobileSidebar={toggleMobileSidebar} />
        <Outlet />
      </div >
    </>
  )
}

export default AdminLayout