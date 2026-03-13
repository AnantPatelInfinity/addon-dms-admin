import {
    dashboardRequest,
    dashboardSuccess,
    dashboardError,
    resetDashboard
} from "../../slices/dashboard.slice";

import { DashboardService } from "../../services/dashboard";

export const getDealerDashboard = (payload) => {
    return (dispatch) => {
        dispatch(dashboardRequest());
        DashboardService.getDealerDashboard(payload)
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

