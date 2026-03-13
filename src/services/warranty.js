import { postFormData, get } from ".";

const URI = "/dealer";


const getDeWarranty = (payload) => {
    const URL = `${URI}/get-warranty`;
    return get(URL);
};

const getDeTrueWarranty = (payload) => {
    const URL = `${URI}/get-warranty?status=${true}`;
    return get(URL);
};

export const WarrantyService = {
    getDeWarranty,
    getDeTrueWarranty,
}
