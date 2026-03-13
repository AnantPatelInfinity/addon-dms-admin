import {
    dashboardRequest,
    dashboardSuccess,
    dashboardError,
    resetDashboard
} from "../../../slices/customer/dashboard.slice";

import { DashboardService } from "../../../services/customer/dashboard";

export const getCustomerDashboard = (payload) => {
    return (dispatch) => {
        dispatch(dashboardRequest());
        DashboardService.getCustomerDashboard(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dashboardSuccess({ data, message }));
                } else {
                    dispatch(dashboardError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dashboardError({ data: {}, message: error }));
            })
    }
}

export const resetDashboardData = () => {
    return (dispatch) => {
        dispatch(resetDashboard());
    }
}

