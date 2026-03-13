import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "../../../ui/customer/Header";
import {
  ClearCustomerStorage,
  getCustomerStorage,
} from "../../../components/LocalStorage/CustomerStorage";
import Sidebar from "../../../ui/customer/Sidebar";
import HOME_URLS from "../../../config/routesFile/index.routes";
import { toast } from "react-toastify";
import { ROLES } from "../../../config/DataFile";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const {
      DX_CU_TOKEN: token,
      CU_ID: customerId,
      DX_ROLE: role,
    } = getCustomerStorage();

    if (!token || !customerId) {
      ClearCustomerStorage();
      toast.error("Your session has expired. Please login again.", {
        autoClose: 2000,
        onClose: () => navigate(HOME_URLS.HOME),
      });
      return;
    }

    if (role !== ROLES.CUSTOMER) {
      ClearCustomerStorage();
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
    <div className={`main-wrapper ${isMobileOpen ? "slide-nav" : ""}`}> 
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <Sidebar
        customerStorage={getCustomerStorage()}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      <Outlet />
    </div>
  );
};

export default CustomerLayout;