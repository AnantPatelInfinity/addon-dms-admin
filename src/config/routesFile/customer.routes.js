export const CUSTOMER_BASE_URL = "/customer";

const CUSTOMER_URLS = {
  LOGIN: `${CUSTOMER_BASE_URL}/login`,
  REGISTER: `${CUSTOMER_BASE_URL}/register`,
  FORGET_PASS: `${CUSTOMER_BASE_URL}/forget-password`,
  OTP_VERIFY: `${CUSTOMER_BASE_URL}/otp-verify`,
  RESET_PASSWORD: `${CUSTOMER_BASE_URL}/reset-password`,

  DASHBOARD: `${CUSTOMER_BASE_URL}/dashboard`,
  CU_PROFILE: `${CUSTOMER_BASE_URL}/profile`,
  AERB_REGISTRATION: `${CUSTOMER_BASE_URL}/aerb-registration`,
  VIEW_AERB_APPLICATION: `${CUSTOMER_BASE_URL}/view-aerb-application`,

  CART_LIST: `${CUSTOMER_BASE_URL}/cart-list`,
  CHECKOUT: `${CUSTOMER_BASE_URL}/checkout`,

  PRODUCT_LIST: `${CUSTOMER_BASE_URL}/product-list`,
  VIEW_PRODUCT: `${CUSTOMER_BASE_URL}/view-product`,

  SERVICE_LIST: `${CUSTOMER_BASE_URL}/service-list`,
  MANAGE_SERVICE: `${CUSTOMER_BASE_URL}/manage-service`,
  VIEW_SERVICE: `${CUSTOMER_BASE_URL}/view-service`,

  INSTALLATION_LIST: `${CUSTOMER_BASE_URL}/installation-list`,
  VIEW_INSTALLATION: `${CUSTOMER_BASE_URL}/view-installation`,

  SERIALNO_LIST: `${CUSTOMER_BASE_URL}/serial-no-list`,

  PO_LIST: `${CUSTOMER_BASE_URL}/po-list`,
  MANAGE_PO: `${CUSTOMER_BASE_URL}/manage-po`,
  VIEW_PO: `${CUSTOMER_BASE_URL}/view-po`,

  SERVICE_HISTORY: `${CUSTOMER_BASE_URL}/service-history`,

  TRIAL_LIST: `${CUSTOMER_BASE_URL}/trial-list`,
  VIEW_TRIAL: `${CUSTOMER_BASE_URL}/view-trial`,
};

export default CUSTOMER_URLS;