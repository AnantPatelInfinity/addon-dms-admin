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
} from "../../../slices/company/comSerReport.slice";

import { CompanyServiceReportServices } from "../../../services/company/comSerReport";

export const getServiceHistoryList = (payload) => {
    return (dispatch) => {
        dispatch(historyListRequest());
        CompanyServiceReportServices.getServiceHistory(payload)
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
        CompanyServiceReportServices.getCustomerReceive(payload)
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
        CompanyServiceReportServices.getCustomerPayment(payload)
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
        CompanyServiceReportServices.getCompanyReceive(payload)
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