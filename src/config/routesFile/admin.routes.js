export const ADMIN_BASE_URL = "/admin";

const ADMIN_URLS = {
    LOGIN: `${ADMIN_BASE_URL}/login`,
    FORGET_PASS: `${ADMIN_BASE_URL}/forget-password`,
    OTP_VERIFY: `${ADMIN_BASE_URL}/otp-verify`,
    RESET_PASSWORD: `${ADMIN_BASE_URL}/reset-password`,
    DASHBOARD: `${ADMIN_BASE_URL}/dashboard`,

    PROFILE: `${ADMIN_BASE_URL}/profile`,

    FIRM_LIST: `${ADMIN_BASE_URL}/firm-list`,
    MANAGE_FIRM: `${ADMIN_BASE_URL}/manage-firm`,
    VIEW_FIRM: `${ADMIN_BASE_URL}/view-firm`,

    COMPANY_LIST: `${ADMIN_BASE_URL}/company-list`,
    MANAGE_COMPANY: `${ADMIN_BASE_URL}/manage-company`,
    VIEW_COMPANY: `${ADMIN_BASE_URL}/view-company`,


    DEALER_LIST: `${ADMIN_BASE_URL}/dealer-list`,
    MANAGE_DEALER: `${ADMIN_BASE_URL}/manage-dealer`,
    VIEW_DEALER: `${ADMIN_BASE_URL}/view-dealer`,
    PRODUCT_CAT: `${ADMIN_BASE_URL}/product-category-management`,
    MANAGE_PRODUCT_CAT: `${ADMIN_BASE_URL}/manage-product-category`,

    PRODUCT: `${ADMIN_BASE_URL}/product-list`,
    MANAGE_PRODUCT: `${ADMIN_BASE_URL}/manage-product`,

    PO_LIST: `${ADMIN_BASE_URL}/purchase-order-list`,
    MANAGE_PO: `${ADMIN_BASE_URL}/manage-purchase-order`,
    VIEW_PO: `${ADMIN_BASE_URL}/view-purchase-order`,

    PRO_UNIT_LIST: `${ADMIN_BASE_URL}/unit-list`,
    PRO_MANAGE_UNIT: `${ADMIN_BASE_URL}/manage-unit`,
    PRO_PART_LIST: `${ADMIN_BASE_URL}/parts-list`,
    PRO_MANAGE_PART: `${ADMIN_BASE_URL}/manage-part`,
    PRO_MODEL_LIST: `${ADMIN_BASE_URL}/product-model-list`,
    MANAGE_PRO_MODEL: `${ADMIN_BASE_URL}/manage-product-model`,
    SUPPLY_TYPE_LIST: `${ADMIN_BASE_URL}/supply-type-list`,
    MANAGE_SUPPLY_TYPE: `${ADMIN_BASE_URL}/manage-supply-type`,

    DEALER_PO_LIST: `${ADMIN_BASE_URL}/dealer-po-request-list`,
    VIEW_DEALER_PO: `${ADMIN_BASE_URL}/view-dealer-po`,

    CUSTOMER_LIST: `${ADMIN_BASE_URL}/customer-list`,
    MANAGE_CUSTOMER: `${ADMIN_BASE_URL}/manage-customer`,
    VIEW_CUSTOMER: `${ADMIN_BASE_URL}/view-customer`,

    DISPATCH_LIST: `${ADMIN_BASE_URL}/dispatch-company-list`,
    MANAGE_DISPATCH: `${ADMIN_BASE_URL}/manage-dispatch-company`,

    CUSTOMER_PO_LIST: `${ADMIN_BASE_URL}/customer-po-request-list`,
    VIEW_CUSTOMER_PO: `${ADMIN_BASE_URL}/view-customer-po`,

    INSTALL_LIST: `${ADMIN_BASE_URL}/installation-list`,
    MANAGE_INSTALL: `${ADMIN_BASE_URL}/manage-installation`,
    VIEW_INSTALL: `${ADMIN_BASE_URL}/view-installation`,

    INSTALLATION_POST: `${ADMIN_BASE_URL}/installation-post`,

    SERVICE_LIST: `${ADMIN_BASE_URL}/service-list`,
    MANAGE_SERVICE: `${ADMIN_BASE_URL}/manage-service`,
    VIEW_SERVICE: `${ADMIN_BASE_URL}/view-service`,

    WARRANTY_LIST: `${ADMIN_BASE_URL}/warranty-list`,
    MANAGE_WARRANTY: `${ADMIN_BASE_URL}/manage-warranty`,

    AMC_LIST: `${ADMIN_BASE_URL}/amc-list`,
    MANAGE_AMC: `${ADMIN_BASE_URL}/manage-amc`,
    VIEW_AMC: `${ADMIN_BASE_URL}/view-amc`,

    // Report
    SERVICE_HISTORY: `${ADMIN_BASE_URL}/service-history`,
    SERVICE_HISTORY_DETAILS: `${ADMIN_BASE_URL}/service-history-details`,
    
    PENDING_COMPANY_RECEIVE: `${ADMIN_BASE_URL}/pending-company-receive`,
    PENDING_CUSTOMER_RECEIVE: `${ADMIN_BASE_URL}/pending-customer-receive`,
    PENDING_CUSTOMER_PAYMENT: `${ADMIN_BASE_URL}/pending-customer-payment`,
    
    TRIAL_LIST: `${ADMIN_BASE_URL}/trial-list`,
    MANAGE_TRIAL: `${ADMIN_BASE_URL}/manage-trial`,
    VIEW_TRIAL: `${ADMIN_BASE_URL}/view-trial`,

};

export default ADMIN_URLS;