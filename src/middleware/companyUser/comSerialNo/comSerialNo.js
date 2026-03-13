import {
    serialNoListRequest,
    serialNoListSuccess,
    serialNoListError,
    serialNoListReset,
} from "../../../slices/company/comSerialNo.slice";
import { CompanySerialNoService } from "../../../services/company/comSerialNo";

export const getComSerialNo = (payload) => {
    return (dispatch) => {
        dispatch(serialNoListRequest());
        CompanySerialNoService.getComSerialNo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(serialNoListSuccess({ data, message }))
                } else {
                    dispatch(serialNoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(serialNoListError({ data: [], message: error }));
            })
    }
}

export const getComSerialNoReset = () => {
    return (dispatch) => {
        dispatch(serialNoListReset());
    }
}