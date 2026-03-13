import { CompanyProfileService } from "../../../services/company/comProfile";
import {
    comProfileRequest,
    comProfileSuccess,
    comProfileError,
    comProfileReset,

    comProfileUpdateRequest,
    comProfileUpdateSuccess,
    comProfileUpdateError,
    comProfileUpdateReset,
} from "../../../slices/company/comProfile.slice";
import { comOneUserError, comOneUserRequest, comOneUserSuccess } from "../../../slices/company/comUser.slice";

export const getCompanyProfile = (payload) => {
    return (dispatch) => {
        dispatch(comProfileRequest())
        CompanyProfileService.getComProfile(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comProfileSuccess({ data, message }));
                } else {
                    dispatch(comProfileError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comProfileError({ data: {}, message: error }));
            })
    }
}

export const updateCompanyProfile = (payload) => {
    return (dispatch) => {
        dispatch(comProfileUpdateRequest());
        CompanyProfileService.updateComProfile(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comProfileUpdateSuccess({ data, message }));
                } else {
                    dispatch(comProfileUpdateError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comProfileUpdateError({ data: {}, message: error }));
            })
    }
}

export const resetCompanyProfile = () => {
    return (dispatch) => {
        dispatch(comProfileReset());
    }
}

export const resetUpdateProfile = () => {
    return (dispatch) => {
        dispatch(comProfileUpdateReset());
    }
}


export const getCompanyUserProfile = (id) => {
    return (dispatch) => {
        dispatch(comOneUserRequest())
        CompanyProfileService.getComUserProfile(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comOneUserSuccess({ data, message }));
                } else {
                    dispatch(comOneUserError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comOneUserError({ data: {}, message: error }));
            })
    }
}

