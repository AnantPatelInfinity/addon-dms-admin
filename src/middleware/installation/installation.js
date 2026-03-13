import { DeInstallService } from "../../services/installation";
import {
    installationListRequest,
    installationListSuccess,
    installationListError,
    installationListReset,

    installationOneRequest,
    installationOneSuccess,
    installationOneError,
    installtionOneReset,

    addInstallationRequest,
    addInstallationSuccess,
    addInstallationError,
    addInstallationReset,

    editInstallationRequest,
    editInstallationSuccess,
    editInstallationError,
    editInstallationReset,

    downloadInstallationRequest,
    downloadInstallationSuccess,
    downloadInstallationError,
    downloadInstallationReset
} from "../../slices/installation.slice";


export const getAllInstallation = (payload) => {
    return (dispatch) => {
        dispatch(installationListRequest());
        DeInstallService.getDeInstall(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(installationListSuccess({ data, message }));
                } else {
                    dispatch(installationListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(installationListError({ data: [], message: error }));
            });
    };
}

export const getOneInstallation = (payload, id) => {
    return (dispatch) => {
        dispatch(installationOneRequest());
        DeInstallService.getDeInstallOne(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(installationOneSuccess({ data, message }));
                } else {
                    dispatch(installationOneError({ data, message }));
                }
            }).catch((error) => {
                dispatch(installationOneError({ data: {}, message: error }));
            });
    };
}

export const addInstallation = (payload) => {
    return (dispatch) => {
        dispatch(addInstallationRequest());
        DeInstallService.addDeInstall(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(addInstallationSuccess({ data, message }));
                } else {
                    dispatch(addInstallationError({ data, message }));
                }
            }).catch((error) => {
                dispatch(addInstallationError({ data: {}, message: error }));
            });
    };
}

export const editInstallation = (payload) => {
    return (dispatch) => {
        dispatch(editInstallationRequest());
        DeInstallService.editDeInstall(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(editInstallationSuccess({ data, message }));
                } else {
                    dispatch(editInstallationError({ data, message }));
                }
            }).catch((error) => {
                dispatch(editInstallationError({ data: {}, message: error }));
            });
    };
}

export const downloadInstallationReport = (paylod, id) => {
    return (dispatch) => {
        dispatch(downloadInstallationRequest());
        DeInstallService.downloadInstallation(paylod, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(downloadInstallationSuccess({ data, message }));
                } else {
                    dispatch(downloadInstallationError({ data, message }));
                }
            }).catch((error) => {
                dispatch(downloadInstallationError({ data: {}, message: error }));
            });
    };
}

export const resetInstallationList = () => {
    return (dispatch) => {
        dispatch(installationListReset());
    };
}

export const resetInstallationOne = () => {
    return (dispatch) => {
        dispatch(installtionOneReset());
    };
}

export const resetAddInstallation = () => {
    return (dispatch) => {
        dispatch(addInstallationReset());
    };
}

export const resetEditInstallation = () => {
    return (dispatch) => {
        dispatch(editInstallationReset());
    };
}

export const resetDownloadInstallation = () => {
    return (dispatch) => {
        dispatch(downloadInstallationReset());
    };
}


