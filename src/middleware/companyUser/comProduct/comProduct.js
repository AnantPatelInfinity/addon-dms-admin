import { CompanyProductService } from "../../../services/company/comProduct";
import {
    comProductListRequest,
    comProductListSuccess,
    comProductListError,

    comOneProductRequest,
    comOneProductSuccess,
    comOneProductError,

    comAddProductRequest,
    comAddProductSuccess,
    comAddProductError,
    comResetAddProduct,

    comUpdateProductRequest,
    comUpdateProductSuccess,
    comUpdateProductError,
    comResetUpdateProduct,

    comDeleteProductRequest,
    comDeleteProductSuccess,
    comDeleteProductError,
    comResetDeleteProduct
} from "../../../slices/company/comProduct.slice";

export const getComProductList = (payload) => {
    return (dispatch) => {
        dispatch(comProductListRequest());
        CompanyProductService.getComProduct(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comProductListSuccess({ data, message }));
                } else {
                    dispatch(comProductListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comProductListError({ data: [], message: error }));
            })
    }
}

export const getComOneProduct = (id) => {
    return (dispatch) => {
        dispatch(comOneProductRequest());
        CompanyProductService.getComProductById(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comOneProductSuccess({ data, message }));
                } else {
                    dispatch(comOneProductError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comOneProductError({ data: {}, message: error }));
            })
    }
}

export const addComProduct = (payload) => {
    return (dispatch) => {
        dispatch(comAddProductRequest());
        CompanyProductService.addComProduct(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comAddProductSuccess({ data, message }));
                } else {
                    dispatch(comAddProductError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comAddProductError({ data: {}, message: error }));
            })
    }
}

export const updateComProduct = (payload, id) => {
    return (dispatch) => {
        dispatch(comUpdateProductRequest());
        CompanyProductService.editComProduct(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUpdateProductSuccess({ data, message }));
                } else {
                    dispatch(comUpdateProductError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comUpdateProductError({ data: {}, message: error }));
            })
    }
}


export const deleteComProduct = (payload, id) => {
    return (dispatch) => {
        dispatch(comDeleteProductRequest());
        CompanyProductService.deleteComProduct(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDeleteProductSuccess({ data, message }));
                } else {
                    dispatch(comDeleteProductError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDeleteProductError({ data: {}, message: error }));
            })
    }
}

export const resetComAddProduct = () => {
    return (dispatch) => {
        dispatch(comResetAddProduct());
    }
}

export const resetComUpdateProduct = () => {
    return (dispatch) => {
        dispatch(comResetUpdateProduct());
    }
}

export const resetComDeleteProduct = () => {
    return (dispatch) => {
        dispatch(comResetDeleteProduct());
    }
}