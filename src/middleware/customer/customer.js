import { DealerCustomerService } from "../../services/customer";
import {
    customerListRequest,
    customerListSuccess,
    customerListError,

    addCustomerRequest,
    addCustomerSuccess,
    addCustomerError,
    resetAddCustomer
} from "../../slices/customer.slice";

export const getDealerCustomerList = (payload) => {
    return (dispatch) => {
        dispatch(customerListRequest());
        DealerCustomerService.dealerCustomerList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(customerListSuccess({ data, message }));
                } else {
                    dispatch(customerListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerListError({ data: [], message: error }));
            });
    }
}


export const addDeCustomer = (payload) => {
    return (dispatch) => {
        dispatch(addCustomerRequest());
        DealerCustomerService.addDealerCustomer(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addCustomerSuccess({ data, message }));
                } else {
                    dispatch(addCustomerError({ data, message }));
                }
            }).catch((error) => {
                dispatch(addCustomerError({ data: {}, message: error }));
            });
    }
}