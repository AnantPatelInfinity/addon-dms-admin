import { postFormData, get } from ".";

const URI = "/dealer";

const getDeAmc = (payload) => {
    const URL = `${URI}/get-amc-warranty`;
    return postFormData(URL, payload);
};

export const AmcService = {
    getDeAmc,
}
