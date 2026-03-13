import { postFormData, del, get } from "../";

const URI = "/company";

const getComSerialNo = (payload) => {
    const URL = `${URI}/get-serial-no`;
    return postFormData(URL, payload);
}

export const CompanySerialNoService = {
    getComSerialNo,
}