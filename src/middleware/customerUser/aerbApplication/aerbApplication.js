import { AerbApplicationService } from "../../../services/customer/aerbApplication";
import {
    aerbApplicationRequest,
    aerbApplicationSuccess,
    aerbApplicationError,
    aerbApplicationReset,

    addAerbApplicationRequest,
    addAerbApplicationSuccess,
    addAerbApplicationError,
    addAerbApplicationReset,

    editAerbApplicationRequest,
    editAerbApplicationSuccess,
    editAerbApplicationError,
    editAerbApplicationReset,

    deleteAerbApplicationRequest,
    deleteAerbApplicationSuccess,
    deleteAerbApplicationError,
    deleteAerbApplicationReset,
} from "../../../slices/customer/aerbApplication.slice";

export const getOneAerbApplicationData = (payload) => {
    return (dispatch) => {
        dispatch(aerbApplicationRequest());
        AerbApplicationService.getAerbApplicationDetails(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(aerbApplicationSuccess({ data, message }));
                } else {
                    dispatch(aerbApplicationError({ data, message }));
                }
            })
            .catch((error) => {
                dispatch(aerbApplicationError({ data: {}, message: error }));
            });
    }
}

export const addAerbApplicationData = (payload) => {
    return (dispatch) => {
        dispatch(addAerbApplicationRequest());
        AerbApplicationService.addAerbApplication(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addAerbApplicationSuccess({ data, message }));
                } else {
                    dispatch(addAerbApplicationError({ data, message }));
                }
            })
            .catch((error) => {
                dispatch(addAerbApplicationError({ data: {}, message: error }));
            });
    }
}

export const editAerbApplicationData = (payload, id) => {
    return (dispatch) => {
        dispatch(editAerbApplicationRequest());
        AerbApplicationService.editAerbApplication(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(editAerbApplicationSuccess({ data, message }));
                } else {
                    dispatch(editAerbApplicationError({ data, message }));
                }
            })
            .catch((error) => {
                dispatch(editAerbApplicationError({ data: {}, message: error }));
            });
    }
}

export const deleteAerbApplicationData = (id) => {
    return (dispatch) => {
        dispatch(deleteAerbApplicationRequest());
        AerbApplicationService.deleteAerbApplication(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(deleteAerbApplicationSuccess({ data, message }));
                } else {
                    dispatch(deleteAerbApplicationError({ data, message }));
                }
            })
            .catch((error) => {
                dispatch(deleteAerbApplicationError({ data: {}, message: error }));
            });
    }
}

export const resetOneAerbApplication = () => {
    return (dispatch) => {
        dispatch(aerbApplicationReset());
    }
}

export const resetAddAerbApplication = () => {
    return (dispatch) => {
        dispatch(addAerbApplicationReset());
    }
}

export const resetEditAerbApplication = () => {
    return (dispatch) => {
        dispatch(editAerbApplicationReset());
    }
}

export const resetDeleteAerbApplication = () => {
    return (dispatch) => {
        dispatch(deleteAerbApplicationReset());
    }
}