import { postFormData, get, del } from "../";

const URI = "/company"

const getAllProModelList = (payload) => {
    const URL = `${URI}/get-product-model`;
    return postFormData(URL, payload);
}

const addProModel = (payload) => {
    const URL = `${URI}/manage-product-model`;
    return postFormData(URL, payload);
}

const editProModel = (payload, id) => {
    const URL = `${URI}/manage-product-model/${id}`;
    return postFormData(URL, payload);
}

const deleteProModel = (id) => {
    const URL = `${URI}/delete-product-model/${id}`;
    return del(URL);
}

export const ComProModelService = {
    getAllProModelList,
    addProModel,
    editProModel,
    deleteProModel
}