import { postFormData, del,get } from "../";


const URI = "/company";


const getComProfile = (payload) => {
    const URL = `${URI}/get-profile`;
    return get(URL);
}

const updateComProfile = (payload) => {
    const URL = `${URI}/update-profile`;
    return postFormData(URL, payload);
}


const getComUserProfile = (id) => {
    const URL = `${URI}/user/view/${id}`;
    return get(URL);
}

export const CompanyProfileService = {
    getComProfile,
    updateComProfile,
    getComUserProfile
}