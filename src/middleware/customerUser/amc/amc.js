import { CustomerAmcService } from "../../../services/customer/amc";
import {
  amcListRequest,
  amcListSuccess,
  amcListError,
} from "../../../slices/customer/amc.slice";

export const getCuAmcList = (payload) => {
  return (dispatch) => {
    dispatch(amcListRequest());
    CustomerAmcService.getCuAmc(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(amcListSuccess({ data, message }));
        } else {
          dispatch(amcListError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(amcListError({ data: [], message: error }));
      });
  };
};
