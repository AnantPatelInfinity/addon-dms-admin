import { postFormData, get } from ".";

const URI = "/dealer";


const getDeInstall = (payload) => {
    const URL = `${URI}/get-installation`;
    return postFormData(URL, payload);
};

const getDeInstallOne = (payload, id) => {
    const URL = `${URI}/get-installation/${id}`;
    return postFormData(URL, payload);
};

const addDeInstall = (payload) => {
    const URL = `${URI}/manage-installation`;
    return postFormData(URL, payload);
};

const editDeInstall = (payload, id) => {
    const URL = `${URI}/manage-installation/${id}`;
    return postFormData(URL, payload);
};

const downloadInstallation = (payload, id) => {
    const URL = `${URI}/download-installation-report/${id}`;
    return postFormData(URL, payload);
};

export const DeInstallService = {
    getDeInstall,
    getDeInstallOne,
    addDeInstall,
    editDeInstall,
    downloadInstallation
}