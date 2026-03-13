import { postFormData } from "..";

const URI = "/customer";

const getCuAmc = (payload) => {
    const URL = `${URI}/get-amc-warranty`;
    return postFormData(URL, payload);
};

export const CustomerAmcService = {
    getCuAmc,
}
