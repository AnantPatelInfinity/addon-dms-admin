import { CustomerProductService } from "../../../services/customer/product";
import {
  cuProductDetailsError,
  cuProductDetailsRequest,
  cuProductDetailsSuccess,
  cuProductListError,
  cuProductListRequest,
  cuProductListSuccess,
} from "../../../slices/customer/product.slice";

export const getCuProductList = (payload) => {
  return (dispatch) => {
    dispatch(cuProductListRequest());
    CustomerProductService.cuProductsListing(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(cuProductListSuccess({ data, message }));
        } else {
          dispatch(cuProductListError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(cuProductListError({ data: [], message: error }));
      });
  };
};

export const getCuProductById = (id) => {
  return (dispatch) => {
    dispatch(cuProductDetailsRequest());
    CustomerProductService.cuProductsDetailsById(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(cuProductDetailsSuccess({ data, message }));
        } else {
          dispatch(cuProductDetailsError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(cuProductDetailsError({ data: {}, message: error }));
      });
  };
};