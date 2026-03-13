import { ComUnitService } from "../../../services/company/comUnit";
import {
    comUnitListRequest,
    comUnitListSuccess,
    comUnitListError,

    comAddUnitRequest,
    comAddUnitSuccess,
    comAddUnitError,
    comAddUnitReset,

    comUpdateUnitRequest,
    comUpdateUnitSuccess,
    comUpdateUnitError,
    comUpdateUnitReset,
} from "../../../slices/company/comUnit.slice";

export const getUnitList = (payload) => {
    return (dispatch) => {
        dispatch(comUnitListRequest());
        ComUnitService.getAllUnitList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUnitListSuccess({ data, message }));
                } else {
                    dispatch(comUnitListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comUnitListError({ data: [], message: error }));
            });
    }
}

export const addUnitData = (payload) => {
    return (dispatch) => {
        dispatch(comAddUnitRequest());
        ComUnitService.addUnit(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comAddUnitSuccess({ data, message }));
                } else {
                    dispatch(comAddUnitError({ data, message: error }));
                }
            }).catch((error) => {
                dispatch(comAddUnitError({ data: {}, message: error }));
            });
    }
}

export const editUnitData = (payload, id) => {
    return (dispatch) => {
        dispatch(comUpdateUnitRequest());
        ComUnitService.editUnit(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUpdateUnitSuccess({ data, message }));
                } else {
                    dispatch(comUpdateUnitError({ data, message: error }));
                }
            }).catch((error) => {
                dispatch(comUpdateUnitError({ data: {}, message: error }));
            });
    }
}

export const resetAddUnit = () => {
    return (dispatch) => {
        dispatch(comAddUnitReset());
    }
}

export const resetUpdateUnit = () => {
    return (dispatch) => {
        dispatch(comUpdateUnitReset());
    }
}