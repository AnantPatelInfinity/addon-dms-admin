import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_INSTALL } from "../../helpers/slice.name";


export const companyInstallationSlice = createSlice({
    name: COMPANY_INSTALL,
    initialState: {
        companyInstallationListLoading: false,
        companyInstallationList: [],
        companyInstallationListMessage: "",
        companyInstallationListError: "",

        companyInstallationOneListLoading: false,
        companyInstallationOneList: {},
        companyInstallationOneListMessage: "",
        companyInstallationOneListError: "",

        companyInstallationApproveLoading: false,
        companyInstallationApproveMessage: "",
        companyInstallationApproveError: "",

        downloadInstallationLoading: false,
        downloadInstallation: {},
        downloadInstallationMessage: "",
        downloadInstallationError: "",
    },
    reducers: {
        companyInstallationListRequest: (state) => {
            state.companyInstallationListLoading = true;
            state.companyInstallationListMessage = "";
            state.companyInstallationListError = "";
        },
        companyInstallationListSuccess: (state, action) => {
            state.companyInstallationListLoading = false;
            state.companyInstallationList = action.payload.data;
            state.companyInstallationListMessage = action.payload.message;
        },
        companyInstallationListError: (state, action) => {
            state.companyInstallationListLoading = false;
            state.companyInstallationListError = action.payload.message;
        },

        companyInstallationOneListRequest: (state) => {
            state.companyInstallationOneListLoading = true;
            state.companyInstallationOneListMessage = "";
            state.companyInstallationOneListError = "";
        },
        companyInstallationOneListSuccess: (state, action) => {
            state.companyInstallationOneListLoading = false;
            state.companyInstallationOneList = action.payload.data;
            state.companyInstallationOneListMessage = action.payload.message;
        },
        companyInstallationOneListError: (state, action) => {
            state.companyInstallationOneListLoading = false;
            state.companyInstallationOneListError = action.payload.message;
        },

        companyInstallationApproveRequest: (state) => {
            state.companyInstallationApproveLoading = true;
            state.companyInstallationApproveMessage = "";
            state.companyInstallationApproveError = "";
        },
        companyInstallationApproveSuccess: (state, action) => {
            state.companyInstallationApproveLoading = false;
            state.companyInstallationApproveMessage = action.payload.message;
        },
        companyInstallationApproveError: (state, action) => {
            state.companyInstallationApproveLoading = false;
            state.companyInstallationApproveError = action.payload.message;
        },
        companyInstallationApproveReset: (state) => {
            state.companyInstallationApproveLoading = false;
            state.companyInstallationApproveMessage = "";
            state.companyInstallationApproveError = "";
        },


        downloadInstallationRequest: (state) => {
            state.downloadInstallationLoading = true;
            state.downloadInstallationMessage = "";
            state.downloadInstallationError = "";
        },
        downloadInstallationSuccess: (state, action) => {
            state.downloadInstallationLoading = false;
            state.downloadInstallation = action.payload.data;
            state.downloadInstallationMessage = action.payload.message;
        },
        downloadInstallationError: (state, action) => {
            state.downloadInstallationLoading = false;
            state.downloadInstallationError = action.payload.message;
        },
        downloadInstallationReset: (state) => {
            state.companyInstallationApproveLoading = false;
            state.downloadInstallation = {};
            state.downloadInstallationMessage = "";
            state.downloadInstallationError = "";
        }
    }
});

export const {
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

} = companyInstallationSlice.actions;

export default companyInstallationSlice.reducer;
