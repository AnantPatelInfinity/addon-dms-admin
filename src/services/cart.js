import { postFormData, get, delPayload } from ".";

const URI = "/dealer";


const dealerCartList = (payload) => {
    const URL = `${URI}/get-dealer-cart`;
    return postFormData(URL, payload);
};

const dealerCartAdd = (payload) => {
    const URL = `${URI}/manage-dealer-cart`;
    return postFormData(URL, payload);
};

const removeDealerCart = (payload) => {
    const URL = `${URI}/remove-dealer-cart`;
    return delPayload(URL, payload);
};

const inDealerCartQty = (payload) => {
    const URL = `${URI}/update-dealer-cart-qty`;
    return postFormData(URL, payload);
};

const outDealerCartQty = (payload) => {
    const URL = `${URI}/update-dealer-cart-qty`;
    return postFormData(URL, payload);
};

export const DealerCartService = {
    dealerCartList,
    dealerCartAdd,
    removeDealerCart,
    inDealerCartQty,
    outDealerCartQty
}