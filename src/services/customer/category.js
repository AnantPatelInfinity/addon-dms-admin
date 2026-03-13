import { get } from "..";

const URI = "/customer";

const categoryList = (payload) => {
    const URL = `${URI}/get-product-category`;
    return get(URL);
};

export const CuCategoryService = {
    categoryList,
}