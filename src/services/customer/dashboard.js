import { get } from "..";

const URI = "/customer";

const getCustomerDashboard = (payload) => {
    let URL = `${URI}/get-customer-dashboard?firmId=${payload.firmId}`;
    if (payload.customerId) {
        URL += `&customerId=${payload.customerId}`;
    }
    if (payload.startDate) {
        URL += `&startDate=${payload.startDate}`;
    }
    if (payload.endDate) {
        URL += `&endDate=${payload.endDate}`;
    }
    return get(URL);
}

export const DashboardService = {
    getCustomerDashboard
}