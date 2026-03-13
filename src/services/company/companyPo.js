import { postFormData, get } from "../";

const URI = "/company";

const getCompanyPo = (payload) => {
    const URL = `${URI}/get-po`;
    return postFormData(URL, payload);
};

const getCompanyOnePo = (payload, id) => {
    const URL = `${URI}/get-po/${id}`;
    return postFormData(URL, payload);
};

const getCompanyPoItems = (payload) => {
    const URL = `${URI}/get-po-items`;
    return postFormData(URL, payload);
};

const verifyCompanyPo = (payload, id) => {
    const URL = `${URI}/verify-po/${id}`;
    return postFormData(URL, payload);
};

const manageCompanyInvoice = (payload, id) => {
    const URL = `${URI}/po-company-invoice/${id}`;
    return postFormData(URL, payload);
};

const downloadCompanyPo = (id) => {
    const URL = `${URI}/download-po/${id}`;
    return get(URL);
}

export const CompanyPoService = {
    getCompanyPo,
    getCompanyOnePo,
    getCompanyPoItems,
    verifyCompanyPo,
    manageCompanyInvoice,
    downloadCompanyPo
}