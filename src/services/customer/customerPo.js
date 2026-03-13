import { postFormData, get } from "..";
const URI = "/customer";

const getCustomerPo = (payload) => {
    const URL = `${URI}/get-customer-po`;
    return postFormData(URL, payload);
};

const getCustomerOnePo = (payload, id) => {
    const URL = `${URI}/get-customer-po/${id}`;
    return postFormData(URL, payload);
};

const downloadCustomerPo = (id) => {
    const URL = `${URI}/download-customer-po/${id}`;
    return get(URL);
};

export const CustomerPoService = {
    getCustomerPo,
    getCustomerOnePo,
    downloadCustomerPo
}