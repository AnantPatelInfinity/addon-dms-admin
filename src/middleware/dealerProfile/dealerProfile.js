import { DealerProfileService } from "../../services/dealerProfile";
import {
    dealerProfileRequest,
    dealerProfileSuccess,
    dealerProfileError,

    dealerProfileUpdateRequest,
    dealerProfileUpdateSuccess,
    dealerProfileUpdateError,
    dealerProfileUpdateReset
} from "../../slices/dealerProfile.slice";

export const getDeProfile = (payload) => {
    return (dispatch) => {
        dispatch(dealerProfileRequest());
        DealerProfileService.getDealerProfile(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dealerProfileSuccess({ data, message }));
                } else {
                    dispatch(dealerProfileError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dealerProfileError({ data: [], message: error }));
            });
    }
}

export const updateDeProfile = (payload) => {
    return (dispatch) => {
        dispatch(dealerProfileUpdateRequest());
        DealerProfileService.updateDealerProfile(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dealerProfileUpdateSuccess({ data, message }));
                } else {
                    dispatch(dealerProfileUpdateError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dealerProfileUpdateError({ data: [], message: error }));
            });
    }
}