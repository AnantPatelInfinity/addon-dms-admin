import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../slices/products.slice";
import categorySlice from "../slices/category.slice";
import companySlice from "../slices/company.slice";
import dealerCartSlice from "../slices/cart.slice";
import productModelSlice from "../slices/productModel";

import dealerDispatchThroughSlice from "../slices/dispatchThrough.slice";
import customerSlice from "../slices/customer.slice";
import dealerCheckoutSlice from "../slices/checkout.slice";
import dealerPoSlice from "../slices/dealerPo.slice";
import dealerProfileSlice from "../slices/dealerProfile.slice"
import dealerInstallationSlice from "../slices/installation.slice";
import dealerWarrantySlice from "../slices/warranty.slice";
import dealerPoItemsSlice from "../slices/dePoItems.slices";
import dealerAmcSlice from "../slices/amc.slice";
import dashboardSlice from "../slices/dashboard.slice";
import serviceReportSlice from "../slices/serviceReport.slice";
import dealerTrialSlice from "../slices/dealerTrial.slice";
import dealerOldPoSlice from "../slices/dealerOldPo.slice";

// Company
import companyPoSlice from "../slices/company/companyPo.slice";
import companyInstallationSlice from "../slices/company/comInstallation.slice";
import companyDashboardSlice from "../slices/company/comDashboard.slice";
import comWarrantySlice from "../slices/company/comWarranty.slice";
import comUnitSlice from "../slices/company/comUnit.slice";
import comSupplyTypeSlice from "../slices/company/comSupplyType.slice";
import comProModelSlice from "../slices/company/comProModel.slice";
import comCategorySlice from "../slices/company/comCategory.slice";
import comPartSlice from "../slices/company/comPart.slice";
import comProductSlice from "../slices/company/comProduct.slice";
import comServiceSlice from "../slices/company/comService.slice";
import serviceSlice from "../slices/service.slice";
import comProfileSlice from "../slices/company/comProfile.slice";
import comSerReportSlice from "../slices/company/comSerReport.slice";
import comCustomerSlice from "../slices/company/comCustomer.slice";
import comDealerSlice from "../slices/company/comDealer.slice";
import comSerialNoSlice from "../slices/company/comSerialNo.slice";
import companyUserSlice from "../slices/company/comUser.slice";

//CUSTOMER
import customerServiceSlice from "../slices/customer/service.slice"
import customerProfileSlice from "../slices/customer/profile.slice";
import customerProductSlice from "../slices/customer/product.slice";
import CustomerCartSlice from "../slices/customer/cart.slice";
import customerInstallationSlice from "../slices/customer/installation.slice";
import customerPoSlice from "../slices/customer/customerPo.slice";
import customerCategorySlice from "../slices/customer/category.slice";
import customerCompanySlice from "../slices/customer/company.slice";
import customerCheckoutSlice from "../slices/customer/checkout.slice";
import customerDispatchThroughSlice from "../slices/customer/dispatchThrough.slice";
import customerPoItemsSlice from "../slices/customer/poItems.slice";
import customerAmcSlice from "../slices/customer/amc.slice";
import customerDashboardSlice from "../slices/customer/dashboard.slice";
import customerAerbApplicationSlice from "../slices/customer/aerbApplication.slice";
import customerTrialSlice from "../slices/customer/trialOrder.slice";
import dealerAerbApplicationSlice from "../slices/dealerAerbApplication.slice";

function configStore() {
    const currentEnv = "development";
    const store = configureStore({
        reducer: {
            // DEALER SLICES
            product: productSlice,
            category: categorySlice,
            company: companySlice,
            cart: dealerCartSlice,
            productModel: productModelSlice,
            dispatchThrough: dealerDispatchThroughSlice,
            customer: customerSlice,
            dealerCheckout: dealerCheckoutSlice,
            dealerPo: dealerPoSlice,
            dealerProfile: dealerProfileSlice,
            dealerInstallation: dealerInstallationSlice,
            dealerWarranty: dealerWarrantySlice,
            dealerPoItems: dealerPoItemsSlice,
            service: serviceSlice,
            dealerAmc: dealerAmcSlice,
            dealerDashboard: dashboardSlice,
            serviceReport: serviceReportSlice,
            dealerTrial: dealerTrialSlice,
            dealerOldPo: dealerOldPoSlice,
            dealerAerbApplication: dealerAerbApplicationSlice,

            // COMPANY SLICES
            companyPo: companyPoSlice,
            companyInstallation: companyInstallationSlice,
            companyDashboard: companyDashboardSlice,
            comWarranty: comWarrantySlice,
            comUnit: comUnitSlice,
            comSupplyType: comSupplyTypeSlice,
            comProModel: comProModelSlice,
            comCategory: comCategorySlice,
            comPart: comPartSlice,
            comProduct: comProductSlice,
            comService: comServiceSlice,
            comProfile: comProfileSlice,
            comSerReport: comSerReportSlice,
            comCustomer: comCustomerSlice,
            comDealer: comDealerSlice,
            comSerialNo: comSerialNoSlice,
            comUser: companyUserSlice,

            //CUSTOMER
            customerDashboard: customerDashboardSlice,
            customerService: customerServiceSlice,
            customerProfile: customerProfileSlice,
            customerProduct: customerProductSlice,
            customerCart: CustomerCartSlice,
            customerInstallation: customerInstallationSlice,
            customerPo: customerPoSlice,
            customerProductCategory: customerCategorySlice,
            customerCompany: customerCompanySlice,
            customerCheckout: customerCheckoutSlice,
            customerDispatchThrough: customerDispatchThroughSlice,
            customerPoItems: customerPoItemsSlice,
            customerAmc: customerAmcSlice,
            customerAerbApplication: customerAerbApplicationSlice,
            customerTrial: customerTrialSlice,

        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
        devTools: currentEnv,
    })
    return store;
}

export default configStore;