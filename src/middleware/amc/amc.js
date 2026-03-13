import { AmcService } from "../../services/amc";
import {
    amcListRequest,
    amcListSuccess,
    amcListError,
} from "../../slices/amc.slice";

export const getDeAmcList = (payload) => {
    return (dispatch) => {
        dispatch(amcListRequest());
        AmcService.getDeAmc(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(amcListSuccess({ data, message }));
                } else {
                    dispatch(amcListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(amcListError({ data: [], message: error }));
            });
    }
}