import { CustomerProfileService } from "../../../services/customer/profile";
import {
  customerProfileRequest,
  customerProfileSuccess,
  customerProfileError,
  customerProfileUpdateRequest,
  customerProfileUpdateSuccess,
  customerProfileUpdateError,
  customerProfileUpdateReset,
  customerProfileReset,
} from "../../../slices/customer/profile.slice";

export const getCuProfile = (payload) => {
  return (dispatch) => {
    dispatch(customerProfileRequest());
    CustomerProfileService.getCustomerProfile(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(customerProfileSuccess({ data, message }));
        } else {
          dispatch(customerProfileError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(customerProfileError({ data: [], message: error }));
      });
  };
};

export const updateCuProfile = (payload) => {
  return (dispatch) => {
    dispatch(customerProfileUpdateRequest());
    CustomerProfileService.updateCustomerProfile(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(customerProfileUpdateSuccess({ data, message }));
        } else {
          dispatch(customerProfileUpdateError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(customerProfileUpdateError({ data: [], message: error }));
      });
  };
};

export const resetCustomerProfile = () => {
  return (dispatch) => {
    dispatch(customerProfileReset())
  }
}

export const resetUpdateCuProfile = () => {
    return (dispatch) => {
        dispatch(customerProfileUpdateReset())
    }
}