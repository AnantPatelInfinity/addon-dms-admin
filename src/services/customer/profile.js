import { postFormData, get } from "..";
import { CUSTOMER_BASE_URL } from "../../config/routesFile/customer.routes";

const URI = CUSTOMER_BASE_URL;

const getCustomerProfile = (payload) => {
  const URL = `${URI}/get-profile`;
  return get(URL, payload);
};

const updateCustomerProfile = (payload) => {
  const URL = `${URI}/update-profile`;
  return postFormData(URL, payload);
};

export const CustomerProfileService = {
  getCustomerProfile,
  updateCustomerProfile,
};