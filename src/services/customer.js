import { postFormData, get } from ".";
import { getDealerStorage } from "../components/LocalStorage/DealerStorage";

const URI = "/dealer";
const dealerStorage = getDealerStorage();

const dealerCustomerList = (payload) => {
    const URL = `${URI}/get-dealer-customer?status=${2}&dealerId=${payload}`;
    return get(URL);
};

const addDealerCustomer = (payload) => {
    const URL = `${URI}/manage-dealer-customer`;
    return postFormData(URL, payload);
}

const editDealerCustomer = (payload) => {
    const URL = `${URI}/manage-dealer-customer/${''}`;
    return postFormData(URL, payload);
}

export const DealerCustomerService = {
    dealerCustomerList,
    addDealerCustomer,
    editDealerCustomer
}
