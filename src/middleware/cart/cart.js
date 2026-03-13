import { DealerCartService } from "../../services/cart"
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
} from "../../slices/cart.slice"

export const getDealerCart = (payload) => {
    return (dispatch) => {
        dispatch(cartListRequest());
        DealerCartService.dealerCartList(payload)
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

export const addDealerCart = (payload) => {
    return (dispatch) => {
        dispatch(addCartRequest());
        DealerCartService.dealerCartAdd(payload)
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

export const removeDealerCart = (payload) => {
    return (dispatch) => {
        dispatch(removeCartRequest());
        DealerCartService.removeDealerCart(payload)
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

export const inDealerCartQty = (payload) => {
    return (dispatch) => {
        dispatch(inCartQtyRequest());
        DealerCartService.inDealerCartQty(payload)
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

export const outDealerCartQty = (payload) => {
    return (dispatch) => {
        dispatch(outCartQtyRequest());
        DealerCartService.outDealerCartQty(payload)
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