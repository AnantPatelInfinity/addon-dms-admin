export const DEALER_BASE_URL = "/dealer";

const DEALER_URLS = {
    REGISTER: `${DEALER_BASE_URL}/register`,

    LOGIN: `${DEALER_BASE_URL}/login`,
    FORGET_PASS: `${DEALER_BASE_URL}/forget-password`,
    OTP_VERIFY: `${DEALER_BASE_URL}/otp-verify`,
    RESET_PASSWORD: `${DEALER_BASE_URL}/reset-password`,
    DASHBOARD: `${DEALER_BASE_URL}/dashboard`,

    PRODUCT_LIST: `${DEALER_BASE_URL}/product-list`,
    MANAGE_PRODUCT: `${DEALER_BASE_URL}/manage-product`,
    VIEW_PRODUCT: `${DEALER_BASE_URL}/view-product`,
    PO_LIST: `${DEALER_BASE_URL}/po-list`,
    MANAGE_PO: `${DEALER_BASE_URL}/manage-po`,

    VIEW_PO: `${DEALER_BASE_URL}/view-po`,

    CART_LIST: `${DEALER_BASE_URL}/cart-list`,
    CHECKOUT: `${DEALER_BASE_URL}/checkout`,

    DE_CUSTOMER_LIST: `${DEALER_BASE_URL}/dealer-customer-list`,
    MANAGE_DE_CUSTOMER: `${DEALER_BASE_URL}/manage-dealer-customer`,
    VIEW_DE_CUSTOMER: `${DEALER_BASE_URL}/view-dealer-customer`,

    DE_PROFILE: `${DEALER_BASE_URL}/profile`,

    INSTALL_LIST: `${DEALER_BASE_URL}/installation-list`,
    MANAGE_INSTALL: `${DEALER_BASE_URL}/manage-installation`,
    VIEW_INSTALL: `${DEALER_BASE_URL}/view-installation`,
    INSTALLATION_POST: `${DEALER_BASE_URL}/installation-post`,

    SERVICE_LIST: `${DEALER_BASE_URL}/service-list`,
    MANAGE_SERVICE: `${DEALER_BASE_URL}/manage-service`,
    VIEW_SERVICE: `${DEALER_BASE_URL}/view-service`,

    SERIALNO_LIST: `${DEALER_BASE_URL}/serial-no-list`,

    SERVICE_HISTORY: `${DEALER_BASE_URL}/service-history`,
    SERVICE_HISTORY_DETAILS: `${DEALER_BASE_URL}/service-history-details`,

    PENDING_COMPANY_RECEIVE: `${DEALER_BASE_URL}/pending-company-receive`,
    PENDING_CUSTOMER_RECEIVE: `${DEALER_BASE_URL}/pending-customer-receive`,
    PENDING_CUSTOMER_PAYMENT: `${DEALER_BASE_URL}/pending-customer-payment`,

    TRIAL_LIST: `${DEALER_BASE_URL}/trial-list`,
    MANAGE_TRIAL: `${DEALER_BASE_URL}/manage-trial`,
    VIEW_TRIAL: `${DEALER_BASE_URL}/view-trial`,

    OLD_PO_LIST: `${DEALER_BASE_URL}/old-po-list`,
    MANAGE_OLD_PO: `${DEALER_BASE_URL}/manage-old-po`,
    VIEW_OLD_PO: `${DEALER_BASE_URL}/view-old-po`,
}

export default DEALER_URLS;
