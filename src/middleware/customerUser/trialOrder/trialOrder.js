import {
    trialListRequest,
    trialListSuccess,
    trialListError,
    trialListReset,
    trialOneRequest,
    trialOneSuccess,
    trialOneError,
    downloadTrialRequest,
    downloadTrialReset,
    downloadTrialSuccess,
    downloadTrialError,
    cuTrialReceivedRequest,
    cuTrialReceivedSuccess,
    cuTrialReceivedError,
    cuTrialReceivedReset,
    cuTrialReturnRequest,
    cuTrialReturnSuccess,
    cuTrialReturnError,
    cuTrialReturnReset,
} from "../../../slices/customer/trialOrder.slice";
import { CustomerTrialService } from "../../../services/customer/trialOrder";

export const getCuTrialData = (payload) => {
    return (dispatch) => {
        dispatch(trialListRequest());
        CustomerTrialService.getCuTrial(payload)
            .then((response) => {
                const { success, message } = response?.data;
                const { data } = response?.data;
                if (success === true) {
                    dispatch(trialListSuccess({ data, message }));
                } else {
                    dispatch(trialListError({ data, message }));
                }
            })
            .catch((error) => {
                dispatch(trialListError({ data: [], message: error }));
            });
    };
};

export const viewCuTrialData = (id) => {
    return (dispatch) => {
        dispatch(trialOneRequest());
        CustomerTrialService.viewCuTrial(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(trialOneSuccess({ data, message }));
                } else {
                    dispatch(trialOneError({ data, message }));
                }
            })
            .catch((err) => {
                dispatch(trialOneError({ data: {}, message: err }));
            });
    };
};

export const downloadCuTrial = (id) => {
    return (dispatch) => {
        downloadTrialRequest();
        CustomerTrialService.downloadTrial(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(downloadTrialSuccess({ data, message }));
                } else {
                    dispatch(downloadTrialError({ data, message }));
                }
            })
            .catch((err) => {
                dispatch(downloadTrialError({ data: {}, message: err }));
            });
    };
};

export const cuTrialReceivedData = (id, payload) => {
    return (dispatch) => {
        dispatch(cuTrialReceivedRequest());
        CustomerTrialService.cuTrialReceived(id, payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(cuTrialReceivedSuccess({ data, message }));
                } else {
                    dispatch(cuTrialReceivedError({ data, message }));
                }
            })
            .catch((err) => {
                dispatch(cuTrialReceivedError({ data: {}, message: err }));
            });
    };
};

export const cuTrialReturnData = (id, payload) => {
    return (dispatch) => {
        dispatch(cuTrialReturnRequest());
        CustomerTrialService.cuTrialReturn(id, payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(cuTrialReturnSuccess({ data, message }));
                } else {
                    dispatch(cuTrialReturnError({ data, message }));
                }
            })
            .catch((err) => {
                dispatch(cuTrialReturnError({ data: {}, message: err }));
            });
    };
};

export const resetDeTrialData = () => {
    return (dispatch) => {
        dispatch(trialListReset());
    };
};

export const resetCuTrialReceived = () => {
    return (dispatch) => {
        dispatch(cuTrialReceivedReset());
    };
};

export const resetCuTrialReturn = () => {
    return (dispatch) => {
        dispatch(cuTrialReturnReset());
    };
};

export const resetDeDownloadTrial = () => {
    return (dispatch) => {
        dispatch(downloadTrialReset())
    }
}