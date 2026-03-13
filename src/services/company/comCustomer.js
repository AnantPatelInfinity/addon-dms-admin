import { postFormData, del, get } from "../";

const URI = "/company";

const getComCustomer = (payload) => {
    const URL = `${URI}/get-customer`;
    return postFormData(URL, payload);
}

export const CompanyCustomerService = {
    getComCustomer,
}