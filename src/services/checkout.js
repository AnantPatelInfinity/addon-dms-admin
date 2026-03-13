import { postFormData, get } from ".";

const URI = "/dealer";


const addCheckout = (payload) => {
    const URL = `${URI}/manage-dealer-po`;
    return postFormData(URL, payload);
};

export const DealerCheckoutService = {
    addCheckout
}
