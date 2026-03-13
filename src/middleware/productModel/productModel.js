import { ProModelService } from "../../services/productModel";
import { addProModelError, addProModelRequest, addProModelSuccess, deleteProModelError, deleteProModelRequest, deleteProModelSuccess, editProModelError, editProModelRequest, editProModelSuccess, proModelListError, proModelListRequest, proModelListSuccess } from "../../slices/productModel";


export const getProModalList = (payload) => {
    return (dispatch) => {
        dispatch(proModelListRequest());
        ProModelService.proModelList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(proModelListSuccess({ data, message }));
                } else {
                    dispatch(proModelListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(proModelListError({ data: [], message: error }));
            });
    }
}

export const addProModel = (payload) => {
    return (dispatch) => {
        dispatch(addProModelRequest());
        ProModelService.addProModel(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addProModelSuccess({ data, message }));
                } else {
                    dispatch(addProModelError({ data, message }));
                }
            }).catch((error) => {
                dispatch(addProModelError({ data: [], message: error }));
            });
    }
}

export const editProModel = (payload) => {
    return (dispatch) => {
        dispatch(editProModelRequest());
        ProModelService.editProModel(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(editProModelSuccess({ data, message }));
                } else {
                    dispatch(editProModelError({ data, message }));
                }
            }).catch((error) => {
                dispatch(editProModelError({ data: [], message: error }));
            });
    }
}

export const deleteProModel = (payload) => {
    return (dispatch) => {
        dispatch(deleteProModelRequest());
        ProModelService.deleteProModel(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(deleteProModelSuccess({ data, message }));
                } else {
                    dispatch(deleteProModelError({ data, message }));
                }
            }).catch((error) => {
                dispatch(deleteProModelError({ data: [], message: error }));
            });
    }
}