import { CompanyInstallService } from "../../../services/company/companyInstallation";
import {
    companyInstallationListRequest,
    companyInstallationListSuccess,
    companyInstallationListError,

    companyInstallationOneListRequest,
    companyInstallationOneListSuccess,
    companyInstallationOneListError,

    companyInstallationApproveRequest,
    companyInstallationApproveSuccess,
    companyInstallationApproveError,
    companyInstallationApproveReset,

    downloadInstallationRequest,
    downloadInstallationSuccess,
    downloadInstallationError,
    downloadInstallationReset,
} from "../../../slices/company/comInstallation.slice";

export const getComAllInstallationList = (payload) => {
    return (dispatch) => {
        dispatch(companyInstallationListRequest());
        CompanyInstallService.getCompanyInstall(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyInstallationListSuccess({ data, message }));
                } else {
                    dispatch(companyInstallationListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyInstallationListError({ data: [], message: error }));
            });
    }
}

export const getComOneInstallationList = (payload, id) => {
    return (dispatch) => {
        dispatch(companyInstallationOneListRequest());
        CompanyInstallService.getCompanyInstallOne(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyInstallationOneListSuccess({ data, message }));
                } else {
                    dispatch(companyInstallationOneListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyInstallationOneListError({ data: [], message: error }));
            });
    }
}

export const verifyCompanyInstallation = (payload, id) => {
    return (dispatch) => {
        dispatch(companyInstallationApproveRequest());
        CompanyInstallService.verifyComInstall(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyInstallationApproveSuccess({ data, message }));
                } else {
                    dispatch(companyInstallationApproveError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyInstallationApproveError({ data: [], message: error }));
            });
    }
}

export const downloadCompanyInstallation = (payload, id) => {
    return (dispatch) => {
        dispatch(downloadInstallationRequest());
        CompanyInstallService.downloadInstallation(payload, id)
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
    }
}

export const resetCompanyInstallationApprove = () => {
    return (dispatch) => {
        dispatch(companyInstallationApproveReset());
    }
}


export const resetDownloadInstallation = () => {
    return (dispatch) => {
        dispatch(downloadInstallationReset());
    }
}