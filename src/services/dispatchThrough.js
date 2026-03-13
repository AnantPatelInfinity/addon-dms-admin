import { postFormData, get } from ".";

const URI = "/dealer";

const dispatchThroughList = (payload) => {
    const URL = `${URI}/get-dispatch-company?status=${true}`;
    return get(URL);
};

const deAddDispatch = (payload) => {
    const URL = `${URI}/manage-dispatch-company`;
    return postFormData(URL, payload);
}

const deEditDispatch = (payload, id) => {
    const URL = `${URI}/manage-dispatch-company/${id}`;
    return postFormData(URL, payload);
}

export const dispatchThroughService = {
    dispatchThroughList,
    deAddDispatch,
    deEditDispatch
}