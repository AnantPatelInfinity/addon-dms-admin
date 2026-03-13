import { ComProModelService } from "../../../services/company/comProModel";
import {
    comProModelListRequest,
    comProModelListSuccess,
    comProModelListError,

    comAddProModelRequest,
    comAddProModelSuccess,
    comAddProModelError,
    comAddProModelReset,

    comUpdateProModelRequest,
    comUpdateProModelSuccess,
    comUpdateProModelError,
    comUpdateProModelReset,

    comDeleteProModelRequest,
    comDeleteProModelSuccess,
    comDeleteProModelError,
    comDeleteProModelReset

} from "../../../slices/company/comProModel.slice";

export const comAllProModelList = (payload) => {
    return (dispatch) => {
        dispatch(comProModelListRequest());
        ComProModelService.getAllProModelList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comProModelListSuccess({ data, message }));
                } else {
                    dispatch(comProModelListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comProModelListError({ data: [], message: error }));
            })
    }
}

export const addProModel = (payload) => {
    return (dispatch) => {
        dispatch(comAddProModelRequest());
        ComProModelService.addProModel(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comAddProModelSuccess({ data, message }));
                } else {
                    dispatch(comAddProModelError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comAddProModelError({ data: {}, message: error }));
            })
    }
}

export const updateProModel = (payload, id) => {
    return (dispatch) => {
        dispatch(comUpdateProModelRequest());
        ComProModelService.editProModel(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUpdateProModelSuccess({ data, message }));
                } else {
                    dispatch(comUpdateProModelError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comUpdateProModelError({ data: {}, message: error }));
            })
    }
}

export const deleteProModel = (payload) => {
    return (dispatch) => {
        dispatch(comDeleteProModelRequest());
        ComProModelService.deleteProModel(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDeleteProModelSuccess({ data, message }));
                } else {
                    dispatch(comDeleteProModelError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDeleteProModelError({ data: {}, message: error }));
            })
    }
}

export const resetAddProModel = () => {
    return (dispatch) => {
        dispatch(comAddProModelReset());
    }
}

export const resetUpdateProModel = () => {
    return (dispatch) => {
        dispatch(comUpdateProModelReset());
    }
}

export const resetDeleteProModel = () => {
    return (dispatch) => {
        dispatch(comDeleteProModelReset());
    }
}