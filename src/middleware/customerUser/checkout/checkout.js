import { CustomerCheckoutService } from "../../../services/customer/checkout";
import {
    addCheckoutRequest,
    addCheckoutSuccess,
    addCheckoutError,
    addCheckoutReset,
} from "../../../slices/customer/checkout.slice";

export const addCustomerCheckoutPo = (payload) => {
    return (dispatch) => {
        dispatch(addCheckoutRequest());
        CustomerCheckoutService.addCheckout(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addCheckoutSuccess({ data, message }));
                } else {
                    dispatch(addCheckoutError({ data, message }));
                }
            }).catch((error) => {
                dispatch(addCheckoutError({ data: [], message: error }));
            });
    }
}