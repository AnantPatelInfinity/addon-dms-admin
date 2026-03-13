import { postFormData, put } from ".";

const URI = "/dealer";

const getDeAerbApplicationDetails = (payload) => {
    const URL = `${URI}/get-aerb-application-details`;
    return postFormData(URL, payload);
};

export const DealerAerbApplicationService = {
    getDeAerbApplicationDetails,
}