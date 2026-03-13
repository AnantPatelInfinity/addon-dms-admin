import { postFormData, del } from ".";

const URI = "/dealer";

const getServiceHistory = (payload) => {
    const URL = `${URI}/get-service-history`;
    return postFormData(URL, payload);
};

const getCustomerReceive = (payload) => {
    const URL = `${URI}/customer-receive-report`;
    return postFormData(URL, payload);
};

const getCompanyReceive = (payload) => {
    const URL = `${URI}/company-receive-report`;
    return postFormData(URL, payload);
};

const getCustomerPayment = (payload) => {
    const URL = `${URI}/get-customer-pending-payment`;
    return postFormData(URL, payload);
};

const downloadServiceHistoryPdf = (payload) => {
    const URL = `${URI}/download-service-history-pdf`
    return postFormData(URL, payload)
}

export const ServiceReportServices = {
    getServiceHistory,
    getCustomerReceive,
    getCompanyReceive,
    getCustomerPayment,
    downloadServiceHistoryPdf
}