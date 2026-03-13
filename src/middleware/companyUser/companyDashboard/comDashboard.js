import { CompanyDashboardService } from "../../../services/company/companyDashboard"
import {
    companyDashboardListRequest,
    companyDashboardListSuccess,
    companyDashboardListError,

    comDashCountRequest,
    comDashCountSuccess,
    comDashCountError,

    comDashboardDataRequest,
    comDashboardDataSuccess,
    comDashboardDataError,
    comDashboardDataReset,
} from "../../../slices/company/comDashboard.slice";

export const getComDashboardCount = (payload) => {
    return (dispatch) => {
        dispatch(comDashCountRequest());
        CompanyDashboardService.getCompanyDashboard(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDashCountSuccess({ data, message }));
                } else {
                    dispatch(comDashCountError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDashCountError({ data: {}, message: error }));
            })
    }
}

export const getComDashboardData = (payload) => {
    return (dispatch) => {
        dispatch(comDashboardDataRequest());
        CompanyDashboardService.getCompanyDashboardData(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDashboardDataSuccess({ data, message }));
                } else {
                    dispatch(comDashboardDataError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDashboardDataError({ data: {}, message: error }));
            })
    }
}

