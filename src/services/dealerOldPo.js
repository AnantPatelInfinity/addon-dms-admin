import { postFormData, get } from ".";

const URI = "/dealer";


const getDealerOldPo = (payload) => {
    const URL = `${URI}/get-old-po`;
    return postFormData(URL, payload);
}

const createDealerOldPo = (payload) => {
    const URL = `${URI}/create-dealer-old-po`;
    return postFormData(URL, payload);
}

export const DealerOldPoService = {
    getDealerOldPo,
    createDealerOldPo
}