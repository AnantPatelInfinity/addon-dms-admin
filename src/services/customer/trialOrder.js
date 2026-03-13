import { get, post } from "..";

const URI = "/customer"

const getCuTrial = (payload) => {
    const URL = `${URI}/get-trial-order`
    return post(URL, payload);
}

const viewCuTrial = (id) => {
    const URL = `${URI}/get-trial-order/${id}`
    return get(URL);
}

// customer trial order received
const cuTrialReceived = (id, payload) => {
    const URL = `${URI}/update-trial-order-status/${id}`
    return post(URL, payload);
}

// customer trial order return
const cuTrialReturn = (id, payload) => {
    const URL = `${URI}/update-trial-order-status/${id}`
    return post(URL, payload);
}

const downloadTrial = (id) => {
    const URL = `${URI}/trial-order-slip/${id}`
    return get(URL);
}

export const CustomerTrialService = {
    getCuTrial,
    viewCuTrial,
    cuTrialReceived,
    cuTrialReturn,
    downloadTrial
}