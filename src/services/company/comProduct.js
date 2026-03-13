import { postFormData, del } from "../";

const URI = "/company";

const getComProduct = (payload) => {
    const URL = `${URI}/get-product`;
    return postFormData(URL, payload);
}

const getComProductById = (id) => {
    const URL = `${URI}/get-product/${id}`;
    return postFormData(URL);
}

const addComProduct = (payload) => {
    const URL = `${URI}/manage-product`;
    return postFormData(URL, payload);
}

const editComProduct = (payload, id) => {
    const URL = `${URI}/manage-product/${id}`;
    return postFormData(URL, payload);
}

const deleteComProduct = (payload, id) => {
    const URL = `${URI}/delete-product/${id}`;
    return del(URL)
}

export const CompanyProductService = {
    getComProduct,
    getComProductById,
    addComProduct,
    editComProduct,
    deleteComProduct
}