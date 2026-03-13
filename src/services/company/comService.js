import { postFormData, get } from "../";


const URI = "/company";


const getAllService = (payload) => {
    const URL = `${URI}/get-service`;
    return postFormData(URL, payload);
};

const getOneService = (payload, id) => {
    const URL = `${URI}/get-service/${id}`;
    return postFormData(URL, payload);
}

const serviceActionTakeProduct = (payload, id) => {
    const URL = `${URI}/company-service-action/${id}`;
    return postFormData(URL, payload);
}

// full product service
const companyReceiveProduct = (payload, id) => {
    const URL = `${URI}/company-receive-status/${id}`;
    return postFormData(URL, payload);
}

const serviceActionTake = (payload, id) => {
    const URL = `${URI}/company-service-parts-action/${id}`;
    return postFormData(URL, payload);
}

// company parts service
const companyReceive = (payload, id) => {
    const URL = `${URI}/company-service-parts-receive/${id}`;
    return postFormData(URL, payload);
}

const companyFinalReceive = (payload, id) => {
    const URL = `${URI}/company-service-parts-receive-opt/${id}`;
    return postFormData(URL, payload);
}

const companyServiceEstimation = (payload, id) => {
    const URL = `${URI}/company-service-estimation/${id}`;
    return postFormData(URL, payload);
}


// company full product dispatch
const companyServiceDispatch = (payload, id) => {
    const URL = `${URI}/company-service-dispatch/${id}`;
    return postFormData(URL, payload);
}

// company parts dispatch
const companyServicePartsDispatch = (payload, id) => {
    const URL = `${URI}/company-service-parts-dispatch/${id}`;
    return postFormData(URL, payload);
}

const comServiceDispatchPdf = (payload, id) => {
    const URL = `${URI}/download-company-dispatch/${id}`;
    return postFormData(URL, payload);
}

const downloadServicePdf = (payload, id) => {
    const URL = `${URI}/download-service-receipt/${id}`;
    return postFormData(URL, payload);
}

const downloadServiceChallan = (id) => {
    const URL = `${URI}/download-service-challan/${id}`;
    return get(URL);
}

// complete service between entire process flow
const completeComService = (id, payload) => {
    const URL = `${URI}/company-service-midcomplete/${id}`;
    return postFormData(URL, payload);
}

export const CompanyService = {
    getAllService,
    getOneService,
    serviceActionTake,
    companyReceive,
    companyServiceEstimation,
    companyServiceDispatch,
    comServiceDispatchPdf,
    downloadServiceChallan,
    downloadServicePdf,

    serviceActionTakeProduct,
    companyReceiveProduct,
    companyFinalReceive,

    companyServicePartsDispatch,
    completeComService
}
