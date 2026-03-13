import { WarrantyService } from "../../services/warranty";
import {
    warrantyListRequest,
    warrantyListSuccess,
    warrantyListError,
} from "../../slices/warranty.slice";


export const getAllWarranty = (payload) => {
    return (dispatch) => {
        dispatch(warrantyListRequest());
        WarrantyService.getDeWarranty(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(warrantyListSuccess({ data, message }));
                } else {
                    dispatch(warrantyListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(warrantyListError({ data: [], message: error }));
            });
    }
}

export const getTrueWarranty = (payload) => {
    return (dispatch) => {
        dispatch(warrantyListRequest());
        WarrantyService.getDeTrueWarranty(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(warrantyListSuccess({ data, message }));
                } else {
                    dispatch(warrantyListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(warrantyListError({ data: [], message: error }));
            });
    }
}