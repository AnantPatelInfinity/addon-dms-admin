import { postFormData, get } from "../";

const URI = "/company"

const getCompanyInstall = (payload) => {
    const URL = `${URI}/get-installation`;
    return postFormData(URL, payload);
};

const getCompanyInstallOne = (payload, id) => {
    const URL = `${URI}/get-installation/${id}`;
    return postFormData(URL, payload);
};

const verifyComInstall = (payload, id) => {
    const URL = `${URI}/verify-installation/${id}`;
    return postFormData(URL, payload);
};

const downloadInstallation = (payload, id) => {
    const URL = `${URI}/download-installation/${id}`;
    return postFormData(URL, payload);
}

export const CompanyInstallService = {
    getCompanyInstall,
    getCompanyInstallOne,
    verifyComInstall,
    downloadInstallation
}