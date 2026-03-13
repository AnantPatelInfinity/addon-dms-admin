import { postFormData, get } from "../";
import { CUSTOMER_BASE_URL } from "../../config/routesFile/customer.routes";

const URI = CUSTOMER_BASE_URL;

const getAllService = (payload) => {
  const URL = `${URI}/get-service`;
  return postFormData(URL, payload);
};

const getOneServiceData = (payload, id) => {
  const URL = `${URI}/get-service/${id}`;
  return postFormData(URL, payload);
};

const addServiceData = (payload) => {
  const URL = `${URI}/manage-service`;
  return postFormData(URL, payload);
};

const updateServiceData = (payload, id) => {
  const URL = `${URI}/manage-service/${id}`;
  return postFormData(URL, payload);
};

const deleteServiceData = (id) => {
  const URL = `${URI}/delete-service/${id}`;
  return get(URL);
};

const downloadServiceReceipt = (payload, id) => {
  const URL = `${URI}/download-service-slip/${id}`;
  return postFormData(URL, payload);
};

const downloadServiceDispatch = (payload, id) => {
  const URL = `${URI}/download-courier-dispatch/${id}`;
  return postFormData(URL, payload);
};

const downloadServiceChallan = (id) => {
  const URL = `${URI}/download-service-challan/${id}`;
  return get(URL);
};


export const ServiceData = {
  getAllService,
  getOneServiceData,
  addServiceData,
  updateServiceData,
  deleteServiceData,

  downloadServiceReceipt,
  downloadServiceDispatch,

  downloadServiceChallan,
};