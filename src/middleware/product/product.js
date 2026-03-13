import { ProductService } from "../../services/product";
import {
    productListError,
    productListRequest,
    productListSuccess,


    productDropdownRequest,
    productDropdownSuccess,
    productDropdownError,
    productDropdownReset
} from "../../slices/products.slice"


export const getProductList = (payload) => {
    return (dispatch) => {
        dispatch(productListRequest());
        ProductService.productsListing(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(productListSuccess({ data, message }));
                } else {
                    dispatch(productListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(productListError({ data: [], message: error }));
            });
    }
}

export const getProductDropdown = (payload) => {
    return (dispatch) => {
        dispatch(productDropdownRequest());
        ProductService.productsDropdown(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(productDropdownSuccess({ data, message }));
                } else {
                    dispatch(productDropdownError({ data, message }));
                }
            }).catch((error) => {
                dispatch(productDropdownError({ data: [], message: error }));
            });
    }
}

export const resetProductDropdown = () => {
    return (dispatch) => {
        dispatch(productDropdownReset());
    }
}