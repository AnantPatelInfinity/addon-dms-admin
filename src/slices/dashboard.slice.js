import { createSlice } from "@reduxjs/toolkit";
import { DASHBOARD } from "../helpers/slice.name";

export const dashboardSlice = createSlice({
    name: DASHBOARD,
    initialState: {
        dashboardLoading: false,
        dashboardData: {},
        dashboardMessage: "",
        dashboardError: "",
    },
    reducers: {
        dashboardRequest: (state) => {
            state.dashboardLoading = true;
            state.dashboardMessage = "";
            state.dashboardError = "";
        },
        dashboardSuccess: (state, action) => {
            state.dashboardLoading = false;
            state.dashboardData = action.payload.data;
            state.dashboardMessage = action.payload.message;
        },
        dashboardError: (state, action) => {
            state.dashboardLoading = false;
            state.dashboardError = action.payload.message;
        },
        resetDashboard: (state) => {
            state.dashboardLoading = false;
            state.dashboardData = {};
            state.dashboardMessage = "";
            state.dashboardError = "";
        }
    }
});

export const {
    dashboardRequest,
    dashboardSuccess,
    dashboardError,
    resetDashboard
} = dashboardSlice.actions;

export default dashboardSlice.reducer;