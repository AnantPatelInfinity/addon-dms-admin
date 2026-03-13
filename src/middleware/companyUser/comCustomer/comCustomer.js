import {
    customerListRequest,
    customerListSuccess,
    customerListError,
    customerListReset,
} from "../../../slices/company/comCustomer.slice";
import { CompanyCustomerService } from "../../../services/company/comCustomer"

export const getComCustomer = (payload) => {
    return (dispatch) => {
        dispatch(customerListRequest());
        CompanyCustomerService.getComCustomer(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(customerListSuccess({ data, message }))
                } else {
                    dispatch(customerListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerListError({ data: [], message: error }));
            })
    }
}

export const resetComCustomer = () => {
    return (dispatch) => {
        dispatch(customerListReset());
    }
}