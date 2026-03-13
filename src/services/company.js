import { postFormData, get } from ".";

const URI = "/dealer";

const companyList = (payload) => {
    const URL = `${URI}/get-company?status=${2}&firmId=${payload?.firmId}`;
    return get(URL);
};

const companyById = (id) => {
    const URL =  `${URI}/view-company/${id}`
    return get(URL)
}

export const CompanyService = {
    companyList,
    companyById
}