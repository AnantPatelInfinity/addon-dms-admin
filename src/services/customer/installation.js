import { postFormData, get } from "..";

const URI = "/customer";

const getCuInstall = (payload) => {
    const URL = `${URI}/get-installation`;
    return postFormData(URL, payload);
};

const getCuInstallOne = (payload, id) => {
    const URL = `${URI}/get-installation/${id}`;
    return postFormData(URL, payload);
};

const addCuInstall = (payload) => {
    const URL = `${URI}/manage-installation`;
    return postFormData(URL, payload);
};

const editCuInstall = (payload, id) => {
    const URL = `${URI}/manage-installation/${id}`;
    return postFormData(URL, payload);
};

const downloadInstallation = (payload, id) => {
    const URL = `${URI}/download-installation-report/${id}`;
    return postFormData(URL, payload);
};

export const customerInstallService = {
    getCuInstall,
    getCuInstallOne,
    addCuInstall,
    editCuInstall,
    downloadInstallation
}