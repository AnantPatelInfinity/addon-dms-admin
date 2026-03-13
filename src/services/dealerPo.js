import { postFormData, get } from ".";
const URI = "/dealer";

const getDealerPo = (payload) => {
    const URL = `${URI}/get-dealer-po`;
    return postFormData(URL, payload);
};

const getDealerOnePo = (payload, id) => {
    const URL = `${URI}/get-dealer-po/${id}`;
    return postFormData(URL, payload);
};

const downloadDealerPo = (id) => {
    const URL = `${URI}/download-dealer-po/${id}`;
    return get(URL);
};

export const DealerPoService = {
    getDealerPo,
    getDealerOnePo,
    downloadDealerPo
}