import { postFormData, putFormData, del } from "..";

const URI = "/customer";

const getAerbApplicationDetails = (payload) => {
    const URL = `${URI}/get-aerb-application-details`;
    return postFormData(URL, payload);
};

const addAerbApplication = (payload) => {
    const URL = `${URI}/create-aerb-application`;
    return postFormData(URL, payload);
};

const editAerbApplication = (payload, id) => {
    const URL = `${URI}/update-aerb-application/${id}`;
    return putFormData(URL, payload);
};

const deleteAerbApplication = (id) => {
    const URL = `${URI}/delete-aerb-application/${id}`;
    return del(URL);
};

export const AerbApplicationService = {
    getAerbApplicationDetails,
    addAerbApplication,
    editAerbApplication,
    deleteAerbApplication,
}