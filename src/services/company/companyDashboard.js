import { postFormData, get } from "../";

const URI = "/company"

const getCompanyDashboard = (payload) => {
    const URL = `${URI}/get-dashboard-count`;
    return get(URL);
};

const getCompanyDashboardData = (payload) => {
    const URL = `${URI}/get-company-dashboard`;
    return postFormData(URL, payload);
};

export const CompanyDashboardService = {
    getCompanyDashboard,
    getCompanyDashboardData
}