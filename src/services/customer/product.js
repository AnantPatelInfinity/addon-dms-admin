import { get, postFormData } from "..";
import { CUSTOMER_BASE_URL } from "../../config/routesFile/customer.routes";

const URI = CUSTOMER_BASE_URL;

const cuProductsListing = (payload) => {
    const URL = `${URI}/product-listing`;
    return postFormData(URL, payload);
};

const cuProductsDetailsById = (id) => {
    const URL = `${URI}/get-products/${id}`;
    return get(URL);
};


export const CustomerProductService = {
    cuProductsListing,
    cuProductsDetailsById,
}