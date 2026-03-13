import {
    historyListRequest,
    historyListSuccess,
    historyListError,

    customerReceiveListRequest,
    customerReceiveListSuccess,
    customerReceiveListError,

    customerPaymentListRequest,
    customerPaymentListSuccess,
    customerPaymentListError,

    companyReceiveListRequest,
    companyReceiveListSuccess,
    companyReceiveListError,
    downloadServiceHistoryPdfSuccess,
    downloadServiceHistoryPdfError,
    downloadServiceHistoryPdfReset,
    downloadServiceHistoryPdfRequest,
} from "../../slices/serviceReport.slice";

import { ServiceReportServices } from "../../services/serviceReport";

export const getServiceHistoryList = (payload) => {
    return (dispatch) => {
        dispatch(historyListRequest());
        ServiceReportServices.getServiceHistory(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(historyListSuccess({ data, message }))
                } else {
                    dispatch(historyListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(historyListError({ data: [], message: error }));
            })
    }
}

export const getCustomerReceiveList = (payload) => {
    return (dispatch) => {
        dispatch(customerReceiveListRequest());
        ServiceReportServices.getCustomerReceive(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(customerReceiveListSuccess({ data, message }))
                } else {
                    dispatch(customerReceiveListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerReceiveListError({ data: [], message: error }));
            })
    }
}

export const getCustomerPaymentList = (payload) => {
    return (dispatch) => {
        dispatch(customerPaymentListRequest());
        ServiceReportServices.getCustomerPayment(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(customerPaymentListSuccess({ data, message }))
                } else {
                    dispatch(customerPaymentListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(customerPaymentListError({ data: [], message: error }));
            })
    }
}

export const getCompanyReceiveList = (payload) => {
    return (dispatch) => {
        dispatch(companyReceiveListRequest());
        ServiceReportServices.getCompanyReceive(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(companyReceiveListSuccess({ data, message }))
                } else {
                    dispatch(companyReceiveListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyReceiveListError({ data: [], message: error }));
            })
    }
}


export const downloadDealerServiceHistory = (payload) => {
    return (dispatch) => {
        dispatch(downloadServiceHistoryPdfRequest());
        ServiceReportServices.downloadServiceHistoryPdf(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    dispatch(downloadServiceHistoryPdfSuccess({ data, message }))
                } else {
                    dispatch(downloadServiceHistoryPdfError({ data, message }));
                }
            }).catch((error) => {
                dispatch(downloadServiceHistoryPdfError({ data: {}, message: error }));
            })
    }
}

export const resetDownloaDealerServiceHistory = () => {
    return (dispatch) => {
        dispatch(downloadServiceHistoryPdfReset())   
    }
}