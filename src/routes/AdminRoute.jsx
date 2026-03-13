import { Navigate, Route, Routes } from 'react-router'
import ADMIN_URLS, { ADMIN_BASE_URL } from '../config/routesFile/admin.routes'
import AdminLayout from './Layout/Admin/AdminLayout'
import AdminLoginLayout from './Layout/Admin/AdminLoginLayout'
import AdminLogin from '../auth/Admin/AdminLogin'
import AdForgetPassword from '../auth/Admin/AdForgetPassword'
import AdOtpVerify from '../auth/Admin/AdOtpVerify'
import AdResetPassword from '../auth/Admin/AdResetPassword'
import Dashboard from '../pages/admin/dashboard/Dashboard'
import PageLayout from './Layout/PageLayout'
import FirmList from '../pages/admin/firm/FirmList'
import ManageFirm from '../pages/admin/firm/ManageFirm'
import CompanyList from '../pages/admin/company/CompanyList'
import ManageCompany from '../pages/admin/company/ManageCompany'
import DealerList from '../pages/admin/dealer/DealerList'
import ManageDealer from '../pages/admin/dealer/ManageDealer'
import ProductCategoryList from '../pages/admin/master/productCategory/ProductCategoryList'
import ManageProductCategory from '../pages/admin/master/productCategory/ManageProductCategory'
import ProductList from '../pages/admin/product/ProductList'
import ManageProduct from '../pages/admin/product/ManageProduct'
import PoList from '../pages/admin/transaction/po/PoList'
import ManagePo from '../pages/admin/transaction/po/ManagePo'
import UnitList from '../pages/admin/master/unit/UnitList'
import ManageUnit from '../pages/admin/master/unit/ManageUnit'
import PartsList from '../pages/admin/master/parts/PartsList'
import ManageParts from '../pages/admin/master/parts/ManageParts'
import DealerPoList from '../pages/admin/transaction/dealerPo/DealerPoList'
import ViewDealerPo from '../pages/admin/transaction/dealerPo/ViewDealerPo'
import ProductModel from '../pages/admin/master/productModel/ProductModel'
import ManageProductModel from '../pages/admin/master/productModel/ManageProductModel'
import SupplyType from '../pages/admin/master/supplyType/SupplyType'
import ManageSupplyType from '../pages/admin/master/supplyType/ManageSupplyType'
import Customer from '../pages/admin/customer/Customer'
import ManageCustomer from '../pages/admin/customer/ManageCustomer'
import DispatchCompany from '../pages/admin/master/dispatchCompany/DispatchCompany'
import ManageDispatchCompany from '../pages/admin/master/dispatchCompany/ManageDispatchCompany'
import ViewPo from '../pages/admin/transaction/po/ViewPo'
import Installation from '../pages/admin/installation/Installation'
import ViewInstallation from '../pages/admin/installation/ViewInstallation'
import ManageInstallation from '../pages/admin/installation/ManageInstallation'
import NotFound from '../pages/NotFound'
import WarrantyList from '../pages/admin/master/warranty/WarrantyList'
import ManageWarranty from '../pages/admin/master/warranty/ManageWarranty'
import ServiceList from '../pages/admin/service/ServiceList'
import ManageService from '../pages/admin/service/ManageService'
import ViewService from '../pages/admin/service/ViewService'
import Profile from '../pages/admin/profile/Profile'
import AmcList from '../pages/admin/master/amc/AmcList'
import ManageAmc from '../pages/admin/master/amc/ManageAmc'
import ServiceHistory from '../pages/admin/report/ServiceHistory'
import CompanyReceiveList from '../pages/admin/report/CompanyReceiveList'
import CustomerReceiveList from '../pages/admin/report/CustomerReceiveList'
import CustomerPaymentList from '../pages/admin/report/CustomerPaymentList'
import ViewFirm from '../pages/admin/firm/ViewFirm'
import ViewCompany from '../pages/admin/company/ViewCompany'
import ViewDealer from '../pages/admin/dealer/ViewDealer'
import ViewCustomer from '../pages/admin/customer/ViewCustomer'
import ServicePost from '../pages/admin/installationPost/InstallationPost'
import TrialList from "../pages/admin/trialSection/TrialList"
import ViewTrial from "../pages/admin/trialSection/ViewTrial"
import ManageTrial from "../pages/admin/trialSection/ManageTrial"
import CustomerPoList from "../pages/admin/transaction/customerPo/CustomerPoList"
import ViewCustomerPo from "../pages/admin/transaction/customerPo/ViewCustomerPo"

const AdminRoute = () => {
    return (
        <>
            <Routes>
                <Route path={ADMIN_BASE_URL} element={<AdminLoginLayout />}>
                    <Route path={ADMIN_URLS.LOGIN} element={<AdminLogin />} />
                    <Route
                        path={ADMIN_URLS.FORGET_PASS}
                        element={<AdForgetPassword />}
                    />
                    <Route path={ADMIN_URLS.OTP_VERIFY} element={<AdOtpVerify />} />
                    <Route
                        path={ADMIN_URLS.RESET_PASSWORD}
                        element={<AdResetPassword />}
                    />
                </Route>

                <Route path={ADMIN_BASE_URL} element={<AdminLayout />}>
                    <Route path={ADMIN_BASE_URL} element={<PageLayout />} >
                        <Route path={ADMIN_URLS.DASHBOARD} element={<Dashboard />} />

                        <Route path={ADMIN_URLS.PROFILE} element={<Profile />} />

                        <Route path={ADMIN_URLS.FIRM_LIST} element={<FirmList />} />
                        <Route path={ADMIN_URLS.MANAGE_FIRM} element={<ManageFirm />} />
                        <Route path={ADMIN_URLS.VIEW_FIRM} element={<ViewFirm />} />


                        <Route path={ADMIN_URLS.COMPANY_LIST} element={<CompanyList />} />
                        <Route path={ADMIN_URLS.MANAGE_COMPANY} element={<ManageCompany />} />
                        <Route path={ADMIN_URLS.VIEW_COMPANY} element={<ViewCompany />} />


                        <Route path={ADMIN_URLS.DEALER_LIST} element={<DealerList />} />
                        <Route path={ADMIN_URLS.VIEW_DEALER} element={<ViewDealer />} />
                        <Route path={ADMIN_URLS.MANAGE_DEALER} element={<ManageDealer />} />
                        <Route path={ADMIN_URLS.PRODUCT_CAT} element={<ProductCategoryList />} />
                        <Route path={ADMIN_URLS.MANAGE_PRODUCT_CAT} element={<ManageProductCategory />} />
                        <Route path={ADMIN_URLS.PRODUCT} element={<ProductList />} />
                        <Route path={ADMIN_URLS.MANAGE_PRODUCT} element={<ManageProduct />} />

                        <Route path={ADMIN_URLS.PO_LIST} element={<PoList />} />
                        <Route path={ADMIN_URLS.MANAGE_PO} element={<ManagePo />} />
                        <Route path={`${ADMIN_URLS.VIEW_PO}/:id`} element={<ViewPo />} />

                        <Route path={ADMIN_URLS.PRO_UNIT_LIST} element={<UnitList />} />
                        <Route path={ADMIN_URLS.PRO_MANAGE_UNIT} element={<ManageUnit />} />
                        <Route path={ADMIN_URLS.PRO_PART_LIST} element={<PartsList />} />
                        <Route path={ADMIN_URLS.PRO_MANAGE_PART} element={<ManageParts />} />
                        <Route path={ADMIN_URLS.PRO_MODEL_LIST} element={<ProductModel />} />
                        <Route path={ADMIN_URLS.MANAGE_PRO_MODEL} element={<ManageProductModel />} />
                        <Route path={ADMIN_URLS.SUPPLY_TYPE_LIST} element={<SupplyType />} />
                        <Route path={ADMIN_URLS.MANAGE_SUPPLY_TYPE} element={<ManageSupplyType />} />
                        <Route path={ADMIN_URLS.DISPATCH_LIST} element={<DispatchCompany />} />
                        <Route path={ADMIN_URLS.MANAGE_DISPATCH} element={<ManageDispatchCompany />} />
                        <Route path={ADMIN_URLS.WARRANTY_LIST} element={<WarrantyList />} />
                        <Route path={ADMIN_URLS.MANAGE_WARRANTY} element={<ManageWarranty />} />
                        <Route path={ADMIN_URLS.AMC_LIST} element={<AmcList />} />
                        <Route path={ADMIN_URLS.MANAGE_AMC} element={<ManageAmc />} />

                        <Route path={ADMIN_URLS.CUSTOMER_LIST} element={<Customer />} />
                        <Route path={ADMIN_URLS.MANAGE_CUSTOMER} element={<ManageCustomer />} />
                        <Route path={ADMIN_URLS.VIEW_CUSTOMER} element={<ViewCustomer />} />

                        <Route path={ADMIN_URLS.DEALER_PO_LIST} element={<DealerPoList />} />
                        <Route path={`${ADMIN_URLS.VIEW_DEALER_PO}/:id`} element={<ViewDealerPo />} />

                        <Route path={ADMIN_URLS.CUSTOMER_PO_LIST} element={<CustomerPoList />} />
                        <Route path={`${ADMIN_URLS.VIEW_CUSTOMER_PO}/:id`} element={<ViewCustomerPo />} />

                        <Route path={ADMIN_URLS.INSTALL_LIST} element={<Installation />} />
                        <Route path={ADMIN_URLS.MANAGE_INSTALL} element={<ManageInstallation />} />
                        <Route path={ADMIN_URLS.VIEW_INSTALL} element={<ViewInstallation />} />

                        <Route path={ADMIN_URLS.SERVICE_LIST} element={<ServiceList />} />
                        <Route path={ADMIN_URLS.MANAGE_SERVICE} element={<ManageService />} />
                        <Route path={ADMIN_URLS.VIEW_SERVICE} element={<ViewService />} />

                        {/* Report */}
                        <Route path={ADMIN_URLS.SERVICE_HISTORY} element={<ServiceHistory />} />
                        <Route path={ADMIN_URLS.PENDING_COMPANY_RECEIVE} element={<CompanyReceiveList />} />
                        <Route path={ADMIN_URLS.PENDING_CUSTOMER_RECEIVE} element={<CustomerReceiveList />} />
                        <Route path={ADMIN_URLS.PENDING_CUSTOMER_PAYMENT} element={<CustomerPaymentList />} />

                        <Route path={ADMIN_URLS.INSTALLATION_POST} element={<ServicePost />} />

                        <Route path={ADMIN_URLS.TRIAL_LIST} element={<TrialList />} />
                        <Route path={ADMIN_URLS.VIEW_TRIAL} element={<ViewTrial />} />
                        <Route path={ADMIN_URLS.MANAGE_TRIAL} element={<ManageTrial />} />

                    </Route>

                </Route>

                <Route path={`${ADMIN_BASE_URL}/*`} element={<NotFound />} />
            </Routes>
        </>
    );
}

export default AdminRoute