import { postFormData, get, del } from "../";


const URI = "/company"


const getAllUnitList = (payload) => {
    const URL = `${URI}/get-unit?status=${true}`;
    return get(URL);
}

const addUnit = (payload) => {
    const URL = `${URI}/manage-unit`;
    return postFormData(URL, payload);
}

const editUnit = (payload, id) => {
    const URL = `${URI}/manage-unit/${id}`;
    return postFormData(URL, payload);
}

const deleteUnit = (id) => {
    const URL = `${URI}/delete-unit/${id}`;
    return del(URL);
}

export const ComUnitService = {
    getAllUnitList,
    addUnit,
    editUnit,
    deleteUnit
}
