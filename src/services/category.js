import { postFormData, get } from ".";

const URI = "/dealer";


const categoryList = (payload) => {
    const URL = `${URI}/get-product-category`;
    return get(URL);
};

export const CategoryService = {
    categoryList,
}