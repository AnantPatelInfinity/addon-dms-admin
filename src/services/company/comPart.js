import { postFormData, get, del } from "../";


const URI = "/company"

const getAllPartsList = (payload) => {
    let queryParams = [`status=${true}`];

    if (payload.firmId) {
        queryParams.push(`firmId=${payload.firmId}`);
    }

    if (payload.companyId) {
        queryParams.push(`companyId=${payload.companyId}`);
    }

    const URL = `${URI}/get-parts?${queryParams.join("&")}`;
    return get(URL);
};

const addParts = (payload) => {
    const URL = `${URI}/manage-parts`;
    return postFormData(URL, payload);
}

const editParts = (payload, id) => {
    const URL = `${URI}/manage-parts/${id}`;
    return postFormData(URL, payload);
}

const deleteParts = (id) => {
    const URL = `${URI}/delete-parts/${id}`;
    return del(URL);
}

export const ComPartsService = {
    getAllPartsList,
    addParts,
    editParts,
    deleteParts
}