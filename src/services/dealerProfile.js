import { postFormData, get } from ".";


const URI = "/dealer";


const getDealerProfile = (payload) => {
    const URL = `${URI}/get-profile`;
    return get(URL, payload);
};

const updateDealerProfile = (payload) => {
    const URL = `${URI}/update-profile`;
    return postFormData(URL, payload);
};

export const DealerProfileService = {
    getDealerProfile,
    updateDealerProfile
}