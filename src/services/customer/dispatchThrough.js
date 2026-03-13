import { postFormData, get } from "..";

const URI = "/customer";

const dispatchThroughList = (payload) => {
    const URL = `${URI}/get-dispatch-company?status=${true}`;
    return get(URL);
};

const cuAddDispatch = (payload) => {
    const URL = `${URI}/manage-dispatch-company`;
    return postFormData(URL, payload);
}

const cuEditDispatch = (payload, id) => {
    const URL = `${URI}/manage-dispatch-company/${id}`;
    return postFormData(URL, payload);
}

export const CustomerDispatchThroughService = {
    dispatchThroughList,
    cuAddDispatch,
    cuEditDispatch
}