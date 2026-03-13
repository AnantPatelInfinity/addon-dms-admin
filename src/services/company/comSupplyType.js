import { postFormData, get, del } from "../";


const URI = "/company"

const getAllSupplyTypeList = (payload) => {
    const URL = `${URI}/get-supply-type?status=${true}`;
    return get(URL);
}

const addSupplyType = (payload) => {
    const URL = `${URI}/manage-supply-type`;
    return postFormData(URL, payload);
}

const editSupplyType = (payload, id) => {
    const URL = `${URI}/manage-supply-type/${id}`;
    return postFormData(URL, payload);
}

const deleteSupplyType = (id) => {
    const URL = `${URI}/delete-supply-type/${id}`;
    return del(URL);
}

export const ComSupplyTypeService = {
    getAllSupplyTypeList,
    addSupplyType,
    editSupplyType,
    deleteSupplyType
}
