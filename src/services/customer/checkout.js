import { postFormData } from "..";

const URI = "/customer";

const addCheckout = (payload) => {
    const URL = `${URI}/manage-customer-po`;
    return postFormData(URL, payload);
};

export const CustomerCheckoutService = {
    addCheckout
}
