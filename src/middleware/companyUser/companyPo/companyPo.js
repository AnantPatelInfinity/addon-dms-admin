import { CompanyPoService } from "../../../services/company/companyPo";
import {
    companyPoListRequest,
    companyPoListSuccess,
    companyPoListError,

    companyOnePoListRequest,
    companyOnePoListSuccess,
    companyOnePoListError,

    companyPoItemsListRequest,
    companyPoItemsListSuccess,
    companyPoItemsListError,

    companyPoApproveRequest,
    companyPoApproveSuccess,
    companyPoApproveError,

    companyInvoiceRequest,
    companyIncoiceSuccess,
    companyIncoiceError,

    companyPoDownloadRequest,
    companyPoDownloadSuccess,
    companyPoDownloadError,
    companyPoDownloadReset,
} from "../../../slices/company/companyPo.slice";

export const getCompanyPoList = (payload) => {
    return (dispatch) => {
        dispatch(companyPoListRequest());
        CompanyPoService.getCompanyPo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyPoListSuccess({ data, message }));
                } else {
                    dispatch(companyPoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyPoListError({ data: [], message: error }));
            });
    }
}

export const getCompanyOnePoList = (payload, id) => {
    return (dispatch) => {
        dispatch(companyOnePoListRequest());
        CompanyPoService.getCompanyOnePo(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyOnePoListSuccess({ data, message }));
                } else {
                    dispatch(companyOnePoListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyOnePoListError({ data: [], message: error }));
            });
    }
}

export const getCompanyPoItemsList = (payload) => {
    return (dispatch) => {
        dispatch(companyPoItemsListRequest());
        CompanyPoService.getCompanyPoItems(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyPoItemsListSuccess({ data, message }));
                } else {
                    dispatch(companyPoItemsListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyPoItemsListError({ data: [], message: error }));
            });
    }
}

export const approveCompanyPo = (payload, id) => {
    return (dispatch) => {
        dispatch(companyPoApproveRequest());
        CompanyPoService.verifyCompanyPo(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyPoApproveSuccess({ data, message }));
                } else {
                    dispatch(companyPoApproveError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyPoApproveError({ data: [], message: error }));
            });
    }
}

export const manageCompanyInvoice = (payload, id) => {
    return (dispatch) => {
        dispatch(companyInvoiceRequest());
        CompanyPoService.manageCompanyInvoice(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyIncoiceSuccess({ data, message }));
                } else {
                    dispatch(companyIncoiceError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyIncoiceError({ data: [], message: error }));
            });
    }
}

export const downloadCompanyPo = (id) => {
    return (dispatch) => {
        dispatch(companyPoDownloadRequest());
        CompanyPoService.downloadCompanyPo(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyPoDownloadSuccess({ data, message }));
                } else {
                    dispatch(companyPoDownloadError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyPoDownloadError({ data: {}, message: error }));
            });
    }
}

export const resetCompanyPoDownload = () => {
    return (dispatch) => {
        dispatch(companyPoDownloadReset());
    }
}

