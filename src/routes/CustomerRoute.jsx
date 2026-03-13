import { Route, Routes } from "react-router";
import CUSTOMER_URLS, { CUSTOMER_BASE_URL, } from "../config/routesFile/customer.routes";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/customer/dashboard/Dashboard";
import CustomerLayout from "./Layout/Customer/CustomerLayout";
import PageLayout from "./Layout/PageLayout";
import Profile from "../pages/customer/profile/Profile";
import CustomerForgetPassword from "../auth/Customer/CustomerForgetPassword";
import CustomerOtpVerify from "../auth/Customer/CustomerOtpVerify";
import CustomerResetPassword from "../auth/Customer/CustomerResetPassword";
import ServiceList from "../pages/customer/service/ServiceList";
import ViewService from "../pages/customer/service/ViewService";
import ManageService from "../pages/customer/service/ManageService";
import ProductGrid from "../pages/customer/product/ProductGrid";
import CustomerCart from "../pages/customer/cart/CustomerCart";
import Checkout from "../pages/customer/cart/Checkout"
import InstallationList from "../pages/customer/installation/InstallationList";
import ViewInstallation from "../pages/customer/installation/ViewInstallation";
import CustomerRegister from "../auth/Customer/CustomerRegister";
import ViewProduct from "../pages/customer/product/ViewProduct";
import PoList from "../pages/customer/PO/PoList"
import ViewPo from "../pages/customer/PO/ViewPo"
import ProductSerialList from "../pages/customer/serialno/ProductSerialList";
import ManageAerbApplication from "../pages/customer/AerbApplication/ManageAerbApplication";
import TrialList from "../pages/customer/TrialSection/TrialList";
import ViewTrial from "../pages/customer/TrialSection/ViewTrial";
import ViewAerbApplication from "../pages/customer/AerbApplication/ViewAerbApplication";

const CustomerRoute = () => {
  return (
    <>
      <Routes>
        <Route
          path={CUSTOMER_URLS.FORGET_PASS}
          element={<CustomerForgetPassword />}
        />
        <Route
          path={CUSTOMER_URLS.OTP_VERIFY}
          element={<CustomerOtpVerify />}
        />
        <Route
          path={CUSTOMER_URLS.RESET_PASSWORD}
          element={<CustomerResetPassword />}
        />
        <Route
          path={CUSTOMER_URLS.REGISTER}
          element={<CustomerRegister />}
        />

        <Route path={CUSTOMER_BASE_URL} element={<CustomerLayout />}>
          <Route path={CUSTOMER_BASE_URL} element={<PageLayout />}>
            <Route path={CUSTOMER_URLS.DASHBOARD} element={<Dashboard />} />
            <Route path={CUSTOMER_URLS.CU_PROFILE} element={<Profile />} />

            <Route path={CUSTOMER_URLS.PRODUCT_LIST} element={<ProductGrid />} />
            <Route path={`${CUSTOMER_URLS.VIEW_PRODUCT}/:id`} element={<ViewProduct />} />

            <Route path={CUSTOMER_URLS.CART_LIST} element={<CustomerCart />} />
            <Route path={CUSTOMER_URLS.CHECKOUT} element={<Checkout />} />

            <Route path={CUSTOMER_URLS.INSTALLATION_LIST} element={<InstallationList />} />
            <Route path={CUSTOMER_URLS.VIEW_INSTALLATION} element={<ViewInstallation />} />

            <Route path={CUSTOMER_URLS.PO_LIST} element={<PoList />} />
            <Route path={CUSTOMER_URLS.VIEW_PO} element={<ViewPo />} />

            <Route path={CUSTOMER_URLS.SERIALNO_LIST} element={<ProductSerialList />} />

            <Route path={CUSTOMER_URLS.TRIAL_LIST} element={<TrialList />} />
            <Route path={CUSTOMER_URLS.VIEW_TRIAL} element={<ViewTrial />} />


            <Route
              path={CUSTOMER_URLS.SERVICE_LIST}
              element={<ServiceList />}
            />
            <Route
              path={CUSTOMER_URLS.MANAGE_SERVICE}
              element={<ManageService />}
            />
            <Route
              path={CUSTOMER_URLS.VIEW_SERVICE}
              element={<ViewService />}
            />
            <Route path={CUSTOMER_URLS.AERB_REGISTRATION} element={<ManageAerbApplication />} />
            <Route path={CUSTOMER_URLS.VIEW_AERB_APPLICATION} element={<ViewAerbApplication />} />
          </Route>


        </Route>

        <Route path={`${CUSTOMER_BASE_URL}/*}`} element={<NotFound />} />
      </Routes>
    </>
  );
};

export default CustomerRoute;