import { postFormData, get } from ".";

const URI = "/dealer";


const getDealerDashboard = (payload) => {
    let URL = `${URI}/get-dealer-dashboard?firmId=${payload.firmId}`;
    if (payload.dealerId) {
        URL += `&dealerId=${payload.dealerId}`;
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
    getDealerDashboard
}