import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_DASHBOARD } from "../../helpers/slice.name";


export const companyDashboardSlice = createSlice({
    name: COMAPNY_DASHBOARD,
    initialState: {
        companyDashboardListLoading: false,
        companyDashboardList: {},
        companyDashboardListMessage: "",
        companyDashboardListError: "",

        comDashCountLoading: false,
        comDashCount: {},
        comDashCountMessage: "",
        comDashCountError: "",

        comDashboardDataLoading: false,
        comDashboardData: {},
        comDashboardDataMessage: "",
        comDashboardDataError: "",
    },
    reducers: {
        companyDashboardListRequest: (state) => {
            state.companyDashboardListLoading = true;
            state.companyDashboardListMessage = "";
            state.companyDashboardListError = "";
        },
        companyDashboardListSuccess: (state, action) => {
            state.companyDashboardListLoading = false;
            state.companyDashboardList = action.payload.data;
            state.companyDashboardListMessage = action.payload.message;
        },
        companyDashboardListError: (state, action) => {
            state.companyDashboardListLoading = false;
            state.companyDashboardListError = action.payload.message;
        },
        companyDashboardListReset: (state) => {
            state.companyDashboardListLoading = false;
            state.companyDashboardListMessage = "";
            state.companyDashboardListError = "";
        },

        comDashCountRequest: (state) => {
            state.comDashCountLoading = true;
            state.comDashCountMessage = "";
            state.comDashCountError = "";
        },
        comDashCountSuccess: (state, action) => {
            state.comDashCountLoading = false;
            state.comDashCount = action.payload.data;
            state.comDashCountMessage = action.payload.message;
        },
        comDashCountError: (state, action) => {
            state.comDashCountLoading = false;
            state.comDashCountError = action.payload.message;
        },
        comDashCountReset: (state) => {
            state.comDashCountLoading = false;
            state.comDashCountMessage = "";
            state.comDashCountError = "";
        },

        comDashboardDataRequest: (state) => {
            state.comDashboardDataLoading = true;
            state.comDashboardDataMessage = "";
            state.comDashboardDataError = "";
        },
        comDashboardDataSuccess: (state, action) => {
            state.comDashboardDataLoading = false;
            state.comDashboardData = action.payload.data;
            state.comDashboardDataMessage = action.payload.message;
        },
        comDashboardDataError: (state, action) => {
            state.comDashboardDataLoading = false;
            state.comDashboardDataError = action.payload.message;
        },
        comDashboardDataReset: (state) => {
            state.comDashboardDataLoading = false;
            state.comDashboardData = {};
            state.comDashboardDataMessage = "";
            state.comDashboardDataError = "";
        }
    }
});

export const {
    companyDashboardListRequest,
    companyDashboardListSuccess,
    companyDashboardListError,
    companyDashboardListReset,

    comDashCountRequest,
    comDashCountSuccess,
    comDashCountError,
    comDashCountReset,

    comDashboardDataRequest,
    comDashboardDataSuccess,
    comDashboardDataError,
    comDashboardDataReset
} = companyDashboardSlice.actions;

export default companyDashboardSlice.reducer;