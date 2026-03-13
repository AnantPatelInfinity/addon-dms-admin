import { postFormData, get, del } from "../";


const URI = "/company"

const getAllCategoryList = (payload) => {
    const URL = `${URI}/get-product-category?status=${true}`;
    return get(URL);
}

const addCategory = (payload) => {
    const URL = `${URI}/manage-product-category`;
    return postFormData(URL, payload);
}

const editCategory = (payload, id) => {
    const URL = `${URI}/manage-product-category/${id}`;
    return postFormData(URL, payload);
}

const deleteCategory = (id) => {
    const URL = `${URI}/delete-product-category/${id}`;
    return del(URL);
}

export const ComCategoryService = {
    getAllCategoryList,
    addCategory,
    editCategory,
    deleteCategory
}