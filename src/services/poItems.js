import { postFormData, get } from ".";

const URI = "/dealer";

const getPoSerialNo = (payload) => {
    const URL = `${URI}/get-serial-no`;
    return postFormData(URL, payload);
};

const getInstallSerialNo = (payload) => {
    const URL = `${URI}/get-installation-serialno`;
    return postFormData(URL, payload);
}

const receivePoProduct = (poId) => {
    const URL = `${URI}/receive-po-product/${poId}`
    return postFormData(URL)
}

export const DePoItemsService = {
    getPoSerialNo,
    getInstallSerialNo,
    receivePoProduct
}
