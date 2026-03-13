import { postFormData, get, del } from "../";

const URI = "/company"

const getAllWarrantyList = (payload) => {
    const URL = `${URI}/get-warranty?status=${true}`;
    return get(URL);
}

const addWarranty = (payload) => {
    const URL = `${URI}/manage-warranty`;
    return postFormData(URL, payload);
}

const editWarranty = (payload, id) => {
    const URL = `${URI}/manage-warranty/${id}`;
    return postFormData(URL, payload);
}

const deleteWarranty = (id) => {
    const URL = `${URI}/delete-warranty/${id}`;
    return del(URL);
}

export const ComWarrantyService = {
    getAllWarrantyList,
    addWarranty,
    editWarranty,
    deleteWarranty
}
