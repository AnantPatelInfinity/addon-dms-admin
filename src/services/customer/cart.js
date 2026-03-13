import { postFormData, get, delPayload } from "..";
import { CUSTOMER_BASE_URL } from "../../config/routesFile/customer.routes";

const URI = CUSTOMER_BASE_URL;

const customerCartList = (payload) => {
  const URL = `${URI}/get-customer-cart`;
  return postFormData(URL, payload);
};

const customerCartAdd = (payload) => {
  const URL = `${URI}/manage-customer-cart`;
  return postFormData(URL, payload);
};

const removeCustomerCart = (payload) => {
  const URL = `${URI}/remove-customer-cart`;
  return delPayload(URL, payload);
};

const inCustomerCartQty = (payload) => {
  const URL = `${URI}/update-customer-cart-qty`;
  return postFormData(URL, payload);
};

const outCustomerCartQty = (payload) => {
  const URL = `${URI}/update-customer-cart-qty`;
  return postFormData(URL, payload);
};

export const CustomerCartService = {
  customerCartList,
  customerCartAdd,
  removeCustomerCart,
  inCustomerCartQty,
  outCustomerCartQty,
};
