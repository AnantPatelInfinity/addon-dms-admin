import { DealerCheckoutService } from "../../services/checkout";
import {
    addCheckoutRequest,
    addCheckoutSuccess,
    addCheckoutError,
    addCheckoutReset,
} from "../../slices/checkout.slice";

export const addDealerCheckoutPo = (payload) => {
    return (dispatch) => {
        dispatch(addCheckoutRequest());
        DealerCheckoutService.addCheckout(payload)
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