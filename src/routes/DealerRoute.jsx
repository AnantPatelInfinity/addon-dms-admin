import { Route, Routes } from 'react-router'
import DEALER_URLS, { DEALER_BASE_URL } from '../config/routesFile/dealer.routes'
import DealerForgetPassword from '../auth/Dealer/DealerForgetPassword'
import DeOtpVerify from '../auth/Dealer/DeOtpVerify'
import DeResetPassword from '../auth/Dealer/DeResetPassword'
import DealerRegister from '../auth/Dealer/DealerRegister'
import DealerLayout from './Layout/Dealer/DealerLayout'
import DeDashboard from '../pages/dealer/dashboard/DeDashboard'
import PageLayout from './Layout/PageLayout'
import ViewProduct from '../pages/dealer/product/ViewProduct'
import PoList from '../pages/dealer/transaction/po/PoList'
import ManagePo from '../pages/dealer/transaction/po/ManagePo'
import ProductGrid from '../pages/dealer/product/ProductGrid'

import DealerCart from '../pages/dealer/cart/DealerCart'
import Checkout from '../pages/dealer/cart/Checkout'
import DealerCustomer from '../pages/dealer/customer/DealerCustomer'
import ViewPo from '../pages/dealer/transaction/po/ViewPo'
import Profile from '../pages/dealer/profile/Profile'
import ManageDealerCustomer from '../pages/dealer/customer/ManageDealerCustomer'
import InstallationList from '../pages/dealer/installation/InstallationList'
import ManageInstallation from '../pages/dealer/installation/ManageInstallation'
import ViewInstallation from '../pages/dealer/installation/ViewInstallation'
import ProductSerialList from '../pages/dealer/serialno/ProductSerialList'
import NotFound from '../pages/NotFound'
import ServiceList from '../pages/dealer/service/ServiceList'
import ManageService from '../pages/dealer/service/ManageService'
import ViewService from '../pages/dealer/service/ViewService'
import ServiceHistory from '../pages/dealer/report/ServiceHistory'
import CompanyReceiveList from '../pages/dealer/report/CompanyReceiveList'
import CustomerReceiveList from '../pages/dealer/report/CustomerReceiveList'
import CustomerPaymentList from '../pages/dealer/report/CustomerPaymentList'
import InstallationPost from '../pages/dealer/installationPost/InstallationPost'

import TrialList from "../pages/dealer/trialSection/TrialList"
import ManageTrial from "../pages/dealer/trialSection/ManageTrial"
import ViewTrial from "../pages/dealer/trialSection/ViewTrial"
import ManageOldPo from '../pages/dealer/transaction/oldPo/ManageOldPo'
import OldPoList from '../pages/dealer/transaction/oldPo/OldPoList'
import ViewOldPo from '../pages/dealer/transaction/oldPo/ViewOldPo'
import ViewDealerCustomer from '../pages/dealer/customer/ViewDealerCustomer'

const DealerRoute = () => {
    return (
        <>
            <Routes>
                <Route path={DEALER_URLS.FORGET_PASS} element={<DealerForgetPassword />} />
                <Route path={DEALER_URLS.OTP_VERIFY} element={<DeOtpVerify />} />
                <Route path={DEALER_URLS.RESET_PASSWORD} element={<DeResetPassword />} />

                <Route path={DEALER_URLS.REGISTER} element={<DealerRegister />} />

                <Route path={DEALER_BASE_URL} element={<DealerLayout />}>
                    <Route path={DEALER_BASE_URL} element={<PageLayout />} >
                        <Route path={DEALER_URLS.DASHBOARD} element={<DeDashboard />} />

                        <Route path={DEALER_URLS.PRODUCT_LIST} element={<ProductGrid />} />
                        <Route path={`${DEALER_URLS.VIEW_PRODUCT}/:id`} element={<ViewProduct />} />

                        <Route path={DEALER_URLS.PO_LIST} element={<PoList />} />
                        <Route path={DEALER_URLS.MANAGE_PO} element={<ManagePo />} />
                        <Route path={DEALER_URLS.VIEW_PO} element={<ViewPo />} />

                        <Route path={DEALER_URLS.CART_LIST} element={<DealerCart />} />
                        <Route path={DEALER_URLS.CHECKOUT} element={<Checkout />} />

                        <Route path={DEALER_URLS.DE_CUSTOMER_LIST} element={<DealerCustomer />} />
                        <Route path={DEALER_URLS.VIEW_DE_CUSTOMER} element={<ViewDealerCustomer />} />
                        <Route path={DEALER_URLS.MANAGE_DE_CUSTOMER} element={<ManageDealerCustomer />} />

                        <Route path={DEALER_URLS.DE_PROFILE} element={<Profile />} />

                        <Route path={DEALER_URLS.INSTALL_LIST} element={<InstallationList />} />
                        <Route path={DEALER_URLS.MANAGE_INSTALL} element={<ManageInstallation />} />
                        <Route path={DEALER_URLS.VIEW_INSTALL} element={<ViewInstallation />} />
                        <Route path={DEALER_URLS.INSTALLATION_POST} element={<InstallationPost />} />

                        <Route path={DEALER_URLS.SERVICE_LIST} element={<ServiceList />} />
                        <Route path={DEALER_URLS.MANAGE_SERVICE} element={<ManageService />} />
                        <Route path={DEALER_URLS.VIEW_SERVICE} element={<ViewService />} />

                        <Route path={DEALER_URLS.SERIALNO_LIST} element={<ProductSerialList />} />

                        <Route path={DEALER_URLS.SERVICE_HISTORY} element={<ServiceHistory />} />
                        <Route path={DEALER_URLS.PENDING_COMPANY_RECEIVE} element={<CompanyReceiveList />} />
                        <Route path={DEALER_URLS.PENDING_CUSTOMER_RECEIVE} element={<CustomerReceiveList />} />
                        <Route path={DEALER_URLS.PENDING_CUSTOMER_PAYMENT} element={<CustomerPaymentList />} />

                        <Route path={DEALER_URLS.TRIAL_LIST} element={<TrialList />} />
                        <Route path={DEALER_URLS.MANAGE_TRIAL} element={<ManageTrial />} />
                        <Route path={DEALER_URLS.VIEW_TRIAL} element={<ViewTrial />} />

                        <Route path={DEALER_URLS.MANAGE_OLD_PO} element={<ManageOldPo />} />
                        <Route path={DEALER_URLS.OLD_PO_LIST} element={<OldPoList />} />
                        <Route path={DEALER_URLS.VIEW_OLD_PO} element={<ViewOldPo />} />
                    </Route>
                </Route>

                <Route path={`${DEALER_BASE_URL}/*`} element={<NotFound />} />
            </Routes>
        </>
    )
}

export default DealerRoute