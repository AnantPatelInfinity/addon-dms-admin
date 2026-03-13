import { DealerPoService } from "../../services/dealerPo";
import { DePoItemsService } from "../../services/poItems";
import {
    dealerPoListRequest,
    dealerPoListSuccess,
    dealerPoListError,

    dealerOnePoListRequest,
    dealerOnePoListSuccess,
    dealerOnePoListError,

    dePoDownloadRequest,
    dePoDownloadSuccess,
    dePoDownloadError,
    dePoDownloadReset,
} from "../../slices/dealerPo.slice";

export const getDealerPoList = (payload) => {
    return (dispatch) => {
        dispatch(dealerPoListRequest());
        DealerPoService.getDealerPo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dealerPoListSuccess({ data, message }));
                } else {
                    dispatch(dealerPoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dealerPoListError({ data: [], message: error }));
            });
    }
}

export const getDealerOnePoList = (payload, id) => {
    return (dispatch) => {
        dispatch(dealerOnePoListRequest());
        DealerPoService.getDealerOnePo(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dealerOnePoListSuccess({ data, message }));
                } else {
                    dispatch(dealerOnePoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dealerOnePoListError({ data: [], message: error }));
            });
    }
}
export const getDePoDownload = (id) => {
    return (dispatch) => {
        dispatch(dePoDownloadRequest());
        DealerPoService.downloadDealerPo(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dePoDownloadSuccess({ data, message }));
                } else {
                    dispatch(dePoDownloadError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dePoDownloadError({ data: {}, message: error }));
            });
    }
}

export const resetDePoDownload = () => {
    return (dispatch) => {
        dispatch(dePoDownloadReset());
    }
}