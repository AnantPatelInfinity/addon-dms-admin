import {
    dealerOldPoListRequest,
    dealerOldPoListSuccess,
    dealerOldPoListError,
    resetDealerOldPoList,

    createDealerOldPoRequest,
    createDealerOldPoSuccess,
    createDealerOldPoError,
    resetCreateDealerOldPo
} from "../../slices/dealerOldPo.slice";

import { DealerOldPoService } from "../../services/dealerOldPo";

export const getDealerOldPoData = (payload) => {
    return (dispatch) => {
        dispatch(dealerOldPoListRequest());
        DealerOldPoService.getDealerOldPo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dealerOldPoListSuccess({ data, message }));
                } else {
                    dispatch(dealerOldPoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dealerOldPoListError({ data: [], message: error }));
            });
    }
}

export const createDealerOldPoData = (payload) => {
    return (dispatch) => {
        dispatch(createDealerOldPoRequest());
        DealerOldPoService.createDealerOldPo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(createDealerOldPoSuccess({ data, message }));
                } else {
                    dispatch(createDealerOldPoError({ data, message }));
                }
            }).catch((error) => {
                dispatch(createDealerOldPoError({ data: {}, message: error }));
            });
    };
}

export const resetDeOldPoList = () => {
    return (dispatch) => {
        dispatch(resetDealerOldPoList());
    };
}

export const resetCreateDeOldPo = () => {
    return (dispatch) => {
        dispatch(resetCreateDealerOldPo());
    };
}