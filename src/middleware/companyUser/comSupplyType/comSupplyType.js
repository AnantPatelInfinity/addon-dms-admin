import { ComSupplyTypeService } from "../../../services/company/comSupplyType";
import {
    comSupplyTypeListRequest,
    comSupplyTypeListSuccess,
    comSupplyTypeListError,

    comAddSupplyTypeRequest,
    comAddSupplyTypeSuccess,
    comAddSupplyTypeError,
    comAddSupplyTypeReset,

    comUpdateSupplyTypeRequest,
    comUpdateSupplyTypeSuccess,
    comUpdateSupplyTypeError,
    comUpdateSupplyTypeReset,

    comDeleteSupplyTypeRequest,
    comDeleteSupplyTypeSuccess,
    comDeleteSupplyTypeError,
    comDeleteSupplyTypeReset,
} from "../../../slices/company/comSupplyType.slice";

export const comAllSupplyTypeList = (payload) => {
    return (dispatch) => {
        dispatch(comSupplyTypeListRequest());
        ComSupplyTypeService.getAllSupplyTypeList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comSupplyTypeListSuccess({ data, message }));
                } else {
                    dispatch(comSupplyTypeListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comSupplyTypeListError({ data: [], message: error }));
            })
    }
}

export const addSupplyType = (payload) => {
    return (dispatch) => {
        dispatch(comAddSupplyTypeRequest());
        ComSupplyTypeService.addSupplyType(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comAddSupplyTypeSuccess({ data, message }));
                } else {
                    dispatch(comAddSupplyTypeError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comAddSupplyTypeError({ data: {}, message: error }));
            })
    }
}

export const updateSupplyType = (payload, id) => {
    return (dispatch) => {
        dispatch(comUpdateSupplyTypeRequest());
        ComSupplyTypeService.editSupplyType(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUpdateSupplyTypeSuccess({ data, message }));
                } else {
                    dispatch(comUpdateSupplyTypeError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comUpdateSupplyTypeError({ data: {}, message: error }));
            })
    }
}

export const deleteSupplyType = (payload) => {
    return (dispatch) => {
        dispatch(comDeleteSupplyTypeRequest());
        ComSupplyTypeService.deleteSupplyType(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDeleteSupplyTypeSuccess({ data, message }));
                } else {
                    dispatch(comDeleteSupplyTypeError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDeleteSupplyTypeError({ data: {}, message: error }));
            })
    }
}


export const resetAddSupplyType = () => {
    return (dispatch) => {
        dispatch(comAddSupplyTypeReset());
    }
}

export const resetUpdateSupplyType = () => {
    return (dispatch) => {
        dispatch(comUpdateSupplyTypeReset());
    }
}

export const resetDeleteSupplyType = () => {
    return (dispatch) => {
        dispatch(comDeleteSupplyTypeReset());
    }
}
