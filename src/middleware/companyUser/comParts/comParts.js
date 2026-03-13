import { ComPartsService } from "../../../services/company/comPart";
import {
    companyPartsListRequest,
    companyPartsListSuccess,
    companyPartsListError,

    addCompanyPartsRequest,
    addCompanyPartsSuccess,
    addCompanyPartsError,
    addCompanyPartsReset,

    removeCompanyPartsRequest,
    removeCompanyPartsSuccess,
    removeCompanyPartsError,
    removeCompanyPartsReset,

    updateCompanyPartsRequest,
    updateCompanyPartsSuccess,
    updateCompanyPartsError,
    updateCompanyPartsReset

} from "../../../slices/company/comPart.slice"

export const getComPartsList = (payload) => {
    return (dispatch) => {
        dispatch(companyPartsListRequest());
        ComPartsService.getAllPartsList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyPartsListSuccess({ data, message }));
                } else {
                    dispatch(companyPartsListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyPartsListError({ data: [], message: error }));
            })
    }
}

export const addComParts = (payload) => {
    return (dispatch) => {
        dispatch(addCompanyPartsRequest());
        ComPartsService.addParts(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addCompanyPartsSuccess({ data, message }));
                } else {
                    dispatch(addCompanyPartsError({ data, message }));
                }
            }).catch((error) => {
                dispatch(addCompanyPartsError({ data: {}, message: error }));
            })
    }
}

export const updateComParts = (payload, id) => {
    return (dispatch) => {
        dispatch(updateCompanyPartsRequest());
        ComPartsService.editParts(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(updateCompanyPartsSuccess({ data, message }));
                } else {
                    dispatch(updateCompanyPartsError({ data, message }));
                }
            }).catch((error) => {
                dispatch(updateCompanyPartsError({ data: {}, message: error }));
            })
    }
}

export const deleteComParts = (payload) => {
    return (dispatch) => {
        dispatch(removeCompanyPartsRequest());
        ComPartsService.deleteParts(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(removeCompanyPartsSuccess({ data, message }));
                } else {
                    dispatch(removeCompanyPartsError({ data, message }));
                }
            }).catch((error) => {
                dispatch(removeCompanyPartsError({ data: {}, message: error }));
            })
    }
}

export const resetComAddParts = () => {
    return (dispatch) => {
        dispatch(addCompanyPartsReset());
    }
}

export const resetComUpdateParts = () => {
    return (dispatch) => {
        dispatch(updateCompanyPartsReset());
    }
}

export const resetComRemoveParts = () => {
    return (dispatch) => {
        dispatch(removeCompanyPartsReset());
    }
}