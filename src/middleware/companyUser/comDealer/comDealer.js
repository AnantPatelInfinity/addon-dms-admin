import {
    dealerListRequest,
    dealerListSuccess,
    dealerListError,
    dealerListReset,
} from "../../../slices/company/comDealer.slice";
import { CompanDealerService } from "../../../services/company/comDealer";

export const getComDealerList = (payload) => {
    return (dispatch) => {
        dispatch(dealerListRequest());
        CompanDealerService.getComDealer(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dealerListSuccess({ data, message }));
                } else {
                    dispatch(dealerListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dealerListError({ data: [], message: error }));
            })
    }
}

export const resetDealerList = () => {
    return (dispatch) => {
        dispatch(dealerListReset());
    }
}


