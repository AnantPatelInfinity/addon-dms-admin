import { postFormData, get } from "..";

const URI = "/customer";

const getPoSerialNo = (payload) => {
    const URL = `${URI}/po-order-history`;
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

export const CuPoItemsService = {
    getPoSerialNo,
    getInstallSerialNo,
    receivePoProduct
}
