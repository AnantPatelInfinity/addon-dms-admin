import { Route, Routes } from 'react-router'
import CompanyRegister from '../auth/Company/CompanyRegister'
import COMPANY_URLS, { COMPANY_BASE_URL } from '../config/routesFile/company.routes'
import Dashboard from '../pages/company/dashboard/Dashboard'
import CompanyLayout from './Layout/Company/CompanyLayout'
import PageLayout from './Layout/PageLayout'
import Profile from '../pages/company/profile/Profile'
import ComPoList from '../pages/company/po/ComPoList'
import ViewPo from '../pages/company/po/ViewPo'
import CompanyForgotPass from '../auth/Company/CompanyForgotPass'
import ComOtpVerify from '../auth/Company/ComOtpVerify'
import ComResetPass from '../auth/Company/ComResetPass'
import InstallationList from '../pages/company/installation/InstallationList'
import ViewInstall from '../pages/company/installation/ViewInstall'
import NotFound from '../pages/NotFound'
import ProductList from '../pages/company/product/ProductList'
import ManageProduct from '../pages/company/product/ManageProduct'
import ViewProduct from '../pages/company/product/ViewProduct'
import PartsList from '../pages/company/master/parts/PartsList'
import ManageParts from '../pages/company/master/parts/ManageParts'
import ProductCategoryList from '../pages/company/master/productCategory/ProductCategoryList'
import ManageProductCategory from '../pages/company/master/productCategory/ManageProductCategory'
import ProductModel from '../pages/company/master/productModel/ProductModel'
import ManageProductModel from '../pages/company/master/productModel/ManageProductModel'
import SupplyType from '../pages/company/master/supplyType/SupplyType'
import ManageSupplyType from '../pages/company/master/supplyType/ManageSupplyType'
import UnitList from '../pages/company/master/unit/UnitList'
import ManageUnit from '../pages/company/master/unit/ManageUnit'
import WarrantyList from '../pages/company/master/warranty/WarrantyList'
import ManageWarranty from '../pages/company/master/warranty/ManageWarranty'
import ServiceList from '../pages/company/service/ServiceList'
import ViewService from '../pages/company/service/ViewService'
import CompanyReceiveList from '../pages/company/report/CompanyReceiveList'
import CustomerReceiveList from '../pages/company/report/CustomerReceiveList'
import CustomerPaymentList from '../pages/company/report/CustomerPaymentList'
import ServiceHistory from '../pages/company/report/ServiceHistory'
import UserList from '../pages/company/users/UserList'
import ManageUser from '../pages/company/users/ManageUser'
import ViewUser from '../pages/company/users/ViewUser'

const CompanyRoute = () => {
    return (
        <>
            <Routes>
                <Route path={COMPANY_URLS.REGISTER} element={<CompanyRegister />} />
                <Route path={COMPANY_URLS.FORGET_PASS} element={<CompanyForgotPass />} />
                <Route path={COMPANY_URLS.OTP_VERIFY} element={<ComOtpVerify />} />
                <Route path={COMPANY_URLS.RESET_PASSWORD} element={<ComResetPass />} />

                <Route path={COMPANY_BASE_URL} element={<CompanyLayout />}>
                    <Route path={COMPANY_BASE_URL} element={<PageLayout />} >
                        <Route path={COMPANY_URLS.DASHBOARD} element={<Dashboard />} />
                        <Route path={COMPANY_URLS.PROFILE} element={<Profile />} />

                        <Route path={COMPANY_URLS.PO_LIST} element={<ComPoList />} />
                        <Route path={COMPANY_URLS.VIEW_PO} element={<ViewPo />} />

                        <Route path={COMPANY_URLS.INSTALL_LIST} element={<InstallationList />} />
                        <Route path={COMPANY_URLS.VIEW_INSTALL} element={<ViewInstall />} />

                        <Route path={COMPANY_URLS.PRODUCT_LIST} element={<ProductList />} />
                        <Route path={COMPANY_URLS.MANAGE_PRODUCT} element={<ManageProduct />} />
                        <Route path={COMPANY_URLS.VIEW_PRODUCT} element={<ViewProduct />} />

                        <Route path={COMPANY_URLS.PART_LIST} element={<PartsList />} />
                        <Route path={COMPANY_URLS.MANAGE_PART} element={<ManageParts />} />

                        <Route path={COMPANY_URLS.CATEGORY_LIST} element={<ProductCategoryList />} />
                        <Route path={COMPANY_URLS.MANAGE_CATEGORY} element={<ManageProductCategory />} />

                        <Route path={COMPANY_URLS.MODEL_LIST} element={<ProductModel />} />
                        <Route path={COMPANY_URLS.MANAGE_MODEL} element={<ManageProductModel />} />

                        <Route path={COMPANY_URLS.SUPPLY_TYPE_LIST} element={<SupplyType />} />
                        <Route path={COMPANY_URLS.MANAGE_SUPPLY_TYPE} element={<ManageSupplyType />} />

                        <Route path={COMPANY_URLS.UNIT_LIST} element={<UnitList />} />
                        <Route path={COMPANY_URLS.MANAGE_UNIT} element={<ManageUnit />} />

                        <Route path={COMPANY_URLS.WARRANTY_LIST} element={<WarrantyList />} />
                        <Route path={COMPANY_URLS.MANAGE_WARRANTY} element={<ManageWarranty />} />

                        <Route path={COMPANY_URLS.SERVICE_LIST} element={<ServiceList />} />
                        <Route path={COMPANY_URLS.VIEW_SERVICE} element={<ViewService />} />

                        <Route path={COMPANY_URLS.USERS} element={<UserList />} />
                        <Route path={COMPANY_URLS.MANAGE_USERS} element={<ManageUser />} />
                        <Route path={COMPANY_URLS.VIEW_USER} element={<ViewUser />} />

                        <Route path={COMPANY_URLS.SERVICE_HISTORY} element={<ServiceHistory />} />
                        <Route path={COMPANY_URLS.PENDING_COMPANY_RECEIVE} element={<CompanyReceiveList />} />
                        <Route path={COMPANY_URLS.PENDING_CUSTOMER_RECEIVE} element={<CustomerReceiveList />} />
                        <Route path={COMPANY_URLS.PENDING_CUSTOMER_PAYMENT} element={<CustomerPaymentList />} />
                    </Route>
                </Route>

                <Route path={`${COMPANY_BASE_URL}/*`} element={<NotFound />} />
            </Routes>
        </>
    )
}

export default CompanyRoute