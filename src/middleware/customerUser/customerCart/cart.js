import { CustomerCartService } from "../../../services/customer/cart"
import {
    addCartError,
    addCartRequest,
    addCartSuccess,

    cartListError,
    cartListRequest,
    cartListSuccess,

    removeCartError,
    removeCartRequest,
    removeCartSuccess,

    inCartQtyRequest,
    inCartQtySuccess,
    inCartQtyError,
    inCartQtyReset,

    outCartQtyRequest,
    outCartQtySuccess,
    outCartQtyError,
    outCartQtyReset
} from "../../../slices/customer/cart.slice"

export const getCustomerCart = (payload) => {
    return (dispatch) => {
        dispatch(cartListRequest());
        CustomerCartService.customerCartList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(cartListSuccess({ data, message }));
                } else {
                    dispatch(cartListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(cartListError({ data: [], message: error }));
            })
    }
}

export const addCustomerCart = (payload) => {
    return (dispatch) => {
        dispatch(addCartRequest());
        CustomerCartService.customerCartAdd(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addCartSuccess({ data, message }));
                } else {
                    dispatch(addCartError({ data, message }));
                }
            }).catch((error) => {
                dispatch(addCartError({ data: {}, message: error }));
            })
    }
}

export const removeCustomerCart = (payload) => {
    return (dispatch) => {
        dispatch(removeCartRequest());
        CustomerCartService.removeCustomerCart(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(removeCartSuccess({ data, message }));
                } else {
                    dispatch(removeCartError({ data, message }));
                }
            }).catch((error) => {
                dispatch(removeCartError({ data: {}, message: error }));
            })
    }
}

export const inCustomerCartQty = (payload) => {
    return (dispatch) => {
        dispatch(inCartQtyRequest());
        CustomerCartService.inCustomerCartQty(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(inCartQtySuccess({ data, message }));
                } else {
                    dispatch(inCartQtyError({ data, message }));
                }
            }).catch((error) => {
                dispatch(inCartQtyError({ data: {}, message: error }));
            })
    }
}

export const outCustomerCartQty = (payload) => {
    return (dispatch) => {
        dispatch(outCartQtyRequest());
        CustomerCartService.outCustomerCartQty(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(outCartQtySuccess({ data, message }));
                } else {
                    dispatch(outCartQtyError({ data, message }));
                }
            }).catch((error) => {
                dispatch(outCartQtyError({ data: {}, message: error }));
            })
    }
}