import { postFormData, get, putFormData, post } from ".";

const URI = "/dealer"

const getDeTrial = (payload) => {
    const URL = `${URI}/get-trial-order`
    return post(URL, payload);
}

const viewDeTrial = (id) => {
    const URL = `${URI}/get-trial-order/${id}`
    return get(URL);
}

const addDeTrial = (payload) => {
    const URL = `${URI}/manage-trial-order`;
    return postFormData(URL, payload);
}

const updateDeTrial = (id, payload) => {
    const URL = `${URI}/manage-trial-order/${id}`;
    return putFormData(URL, payload)
}

const deleteDeTrial = (id) => {
    const URL = `${URI}/update-trial-order/${id}`
    return putFormData(URL)
}

const downloadTrial = (id) => {
    const URL = `${URI}/trial-order-slip/${id}`
    return get(URL);
}

const dispatchTrial = (id, payload) => {
    const URL = `${URI}/update-trial-order-status/${id}`
    return postFormData(URL, payload)
}

const returnTrial = (id, payload) => {
    const URL = `${URI}/update-trial-order-status/${id}`
    return postFormData(URL, payload)
}

export const DeTrialService = {
    getDeTrial,
    viewDeTrial,
    addDeTrial,
    updateDeTrial,
    deleteDeTrial,
    downloadTrial,
    dispatchTrial,
    returnTrial
}