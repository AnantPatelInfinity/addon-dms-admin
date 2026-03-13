import { ComWarrantyService } from "../../../services/company/comWarranty";
import {
    comWarrantyListRequest,
    comWarrantyListSuccess,
    comWarrantyListError,

    comAddWarrantyRequest,
    comAddWarrantySuccess,
    comAddWarrantyError,
    comAddWarrantyReset,

    comUpdateWarrantyRequest,
    comUpdateWarrantySuccess,
    comUpdateWarrantyError,
    comUpdateWarrantyReset,

    comDeleteWarrantyRequest,
    comDeleteWarrantySuccess,
    comDeleteWarrantyError,
    comDeleteWarrantyReset
} from "../../../slices/company/comWarranty.slice";


export const getWarrantyList = (payload) => {
    return (dispatch) => {
        dispatch(comWarrantyListRequest());
        ComWarrantyService.getAllWarrantyList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comWarrantyListSuccess({ data, message }));
                } else {
                    dispatch(comWarrantyListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comWarrantyListError({ data: [], message: error }));
            });
    }
}

export const addWarranty = (payload) => {
    return (dispatch) => {
        dispatch(comAddWarrantyRequest());
        ComWarrantyService.addWarranty(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comAddWarrantySuccess({ data, message }));
                } else {
                    dispatch(comAddWarrantyError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comAddWarrantyError({ data: [], message: error }));
            });
    }
}

export const updateWarranty = (payload, id) => {
    return (dispatch) => {
        dispatch(comUpdateWarrantyRequest());
        ComWarrantyService.editWarranty(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUpdateWarrantySuccess({ data, message }));
                } else {
                    dispatch(comUpdateWarrantyError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comUpdateWarrantyError({ data: [], message: error }));
            });
    }
}

export const deleteWarranty = (payload, id) => {
    return (dispatch) => {
        dispatch(comDeleteWarrantyRequest());
        ComWarrantyService.deleteWarranty(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDeleteWarrantySuccess({ data, message }));
                } else {
                    dispatch(comDeleteWarrantyError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDeleteWarrantyError({ data: [], message: error }));
            });
    }
}

export const resetAddWarranty = () => {
    return (dispatch) => {
        dispatch(comAddWarrantyReset());
    }
}

export const resetUpdateWarranty = () => {
    return (dispatch) => {
        dispatch(comUpdateWarrantyReset());
    }
}

export const resetDeleteWarranty = () => {
    return (dispatch) => {
        dispatch(comDeleteWarrantyReset());
    }
}