import { postFormData, get } from ".";

const URI = "/dealer";

const productsListing = (payload) => {
    const URL = `${URI}/product-listing`;
    return postFormData(URL, payload);
};

const productsDetailsById = (payload) => {
    const URL = `${URI}/product-details`;
    return postFormData(URL, payload);
};

const productsDropdown = (payload) => {
    const URL = `${URI}/get-products?status=${payload.status}&firmId=${payload.firmId}&companyId=${payload.companyId}`;
    return get(URL);
};

export const ProductService = {
    productsListing,
    productsDetailsById,
    productsDropdown
}