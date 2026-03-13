import { CustomerPoService } from "../../../services/customer/customerPo";
import {
    customerPoListRequest,
    customerPoListSuccess,
    customerPoListError,
  
    customerOnePoListRequest,
    customerOnePoListSuccess,
    customerOnePoListError,
  
    customerPoDownloadRequest,
    customerPoDownloadSuccess,
    customerPoDownloadError,
    customerPoDownloadReset,
} from "../../../slices/customer/customerPo.slice";

export const getCustomerPoList = (payload) => {
    return (dispatch) => {
        dispatch(customerPoListRequest());
        CustomerPoService.getCustomerPo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(customerPoListSuccess({ data, message }));
                } else {
                    dispatch(customerPoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerPoListError({ data: [], message: error }));
            });
    }
}

export const getCustomerOnePoList = (payload, id) => {
    return (dispatch) => {
        dispatch(customerOnePoListRequest());
        CustomerPoService.getCustomerOnePo(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(customerOnePoListSuccess({ data, message }));
                } else {
                    dispatch(customerOnePoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerOnePoListError({ data: {}, message: error }));
            });
    }
}

export const getCustomerPoDownload = (id) => {
    return (dispatch) => {
        dispatch(customerPoDownloadRequest());
        CustomerPoService.downloadCustomerPo(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(customerPoDownloadSuccess({ data, message }));
                } else {
                    dispatch(customerPoDownloadError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerPoDownloadError({ data: {}, message: error }));
            });
    }
}

export const resetCuPoDownload = () => {
    return (dispatch) => {
        dispatch(customerPoDownloadReset());
    }
}