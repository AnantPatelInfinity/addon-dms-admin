import { postFormData, del } from ".";

const URI = "/dealer";

const proModelList = (payload) => {
    const URL = `${URI}/get-product-model`;
    return postFormData(URL, payload);
};

const oneProModelList = (payload) => {
    const URL = `${URI}/get-product-model/${payload.id}`;
    return postFormData(URL, payload);
};

const addProModel = (payload) => {
    const URL = `${URI}/manage-product-model`;
    return postFormData(URL, payload);
};

const editProModel = (payload) => {
    const URL = `${URI}/manage-product-model/${payload.id}`;
    return postFormData(URL, payload);
};

const deleteProModel = (payload) => {
    const URL = `${URI}/delete-product-model/${payload.id}`;
    return del(URL, payload);
};

export const ProModelService = {
    proModelList,
    oneProModelList,
    addProModel,
    editProModel,
    deleteProModel
}