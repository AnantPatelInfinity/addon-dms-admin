import { postFormData, del, get } from "../";

const URI = "/company";

const getComDealer = (payload) => {
    const URL = `${URI}/get-dealer`;
    return postFormData(URL, payload);
}

export const CompanDealerService = {
    getComDealer,
}