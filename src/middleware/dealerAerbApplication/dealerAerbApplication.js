import { DealerAerbApplicationService } from "../../services/dealerAerbApplication";
import {
    deAerbApplicationSuccess, deAerbApplicationError, deAerbApplicationRequest, deAerbApplicationReset,
} from "../../slices/dealerAerbApplication.slice";

export const getOneDealerAerbApplicationData = (payload) => {
    return (dispatch) => {
        dispatch(deAerbApplicationRequest());
        DealerAerbApplicationService.getDeAerbApplicationDetails(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(deAerbApplicationSuccess({ data, message }));
                } else {
                    dispatch(deAerbApplicationError({ data, message }));
                }
            })
            .catch((error) => {
                dispatch(deAerbApplicationError({ data: {}, message: error }));
            });
    }
}


export const resetOneDealerAerbApplication = () => {
    return (dispatch) => {
        dispatch(deAerbApplicationReset());
    }
}


