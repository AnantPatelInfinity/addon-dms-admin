import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_TRIAL } from "../../helpers/slice.name";

export const customerTrialSlice = createSlice({
    name: CUSTOMER_TRIAL,
    initialState: {
        trialListLoading: false,
        trialList: [],
        trialListMessage: "",
        trialListError: "",

        trialOneLoading: false,
        trialOne: {},
        trialOneMessage: "",
        trialOneError: "",

        downloadTrialLoading: false,
        downloadTrial: {},
        downloadTrialMessage: "",
        downloadTrialError: "",

        // customer receive
        cuTrialReceivedLoading: false,
        cuTrialReceived: {},
        cuTrialReceivedMessage: "",
        cuTrialReceivedError: "",

        // customer return
        cuTrialReturnLoading: false,
        cuTrialReturn: {},
        cuTrialReturnMessage: "",
        cuTrialReturnError: "",
    },

    reducers: {
        trialListRequest: (state) => {
            state.trialListLoading = true;
            state.trialListMessage = "";
            state.trialListError = "";
        },
        trialListSuccess: (state, action) => {
            state.trialListLoading = false;
            state.trialList = action.payload.data;
            state.trialListMessage = action.payload.message;
        },
        trialListError: (state, action) => {
            state.trialListLoading = false;
            state.trialListError = action.payload.message;
        },
        trialListReset: (state) => {
            state.trialList = [];
            state.trialListMessage = "";
            state.trialListError = "";
        },

        trialOneRequest: (state) => {
            state.trialOneLoading = true;
            state.trialOneMessage = "";
            state.trialOneError = "";
        },
        trialOneSuccess: (state, action) => {
            state.trialOneLoading = false;
            state.trialOne = action.payload.data;
            state.trialOneMessage = action.payload.message;
        },
        trialOneError: (state, action) => {
            state.trialOneLoading = false;
            state.trialOneError = action.payload.message;
        },
        trialOneReset: (state) => {
            state.trialOne = {};
            state.trialOneMessage = "";
            state.trialOneError = "";
        },

        cuTrialReceivedRequest: (state) => {
            state.cuTrialReceivedLoading = true;
            state.cuTrialReceivedMessage = "";
            state.cuTrialReceivedError = "";
        },
        cuTrialReceivedSuccess: (state, action) => {
            state.cuTrialReceivedLoading = false;
            state.cuTrialReceived = action.payload.data;
            state.cuTrialReceivedMessage = action.payload.message;
        },
        cuTrialReceivedError: (state, action) => {
            state.cuTrialReceivedLoading = false;
            state.cuTrialReceivedError = action.payload.message;
        },
        cuTrialReceivedReset: (state) => {
            state.cuTrialReceived = {};
            state.cuTrialReceivedMessage = "";
            state.cuTrialReceivedError = "";
        },

        cuTrialReturnRequest: (state) => {
            state.cuTrialReturnLoading = true;
            state.cuTrialReturnMessage = "";
            state.cuTrialReturnError = "";
        },
        cuTrialReturnSuccess: (state, action) => {
            state.cuTrialReturnLoading = false;
            state.cuTrialReturn = action.payload.data;
            state.cuTrialReturnMessage = action.payload.message;
        },
        cuTrialReturnError: (state, action) => {
            state.cuTrialReturnLoading = false;
            state.cuTrialReturnError = action.payload.message;
        },
        cuTrialReturnReset: (state) => {
            state.cuTrialReturn = {};
            state.cuTrialReturnMessage = "";
            state.cuTrialReturnError = "";
        },

        downloadTrialRequest: (state) => {
            state.downloadTrialLoading = true;
            state.downloadTrialMessage = "";
            state.downloadTrialError = "";
        },
        downloadTrialSuccess: (state, action) => {
            state.downloadTrialLoading = true;
            state.downloadTrial = action.payload.data;
            state.downloadTrialMessage = action.payload.message;
        },
        downloadTrialError: (state, action) => {
            state.downloadTrialLoading = true;
            state.downloadTrialError = action.payload.message;
        },
        downloadTrialReset: (state) => {
            state.downloadTrialLoading = false;
            state.downloadTrial = {};
            state.downloadTrialMessage = "";
            state.downloadTrialError = "";
        }
    }
})

export const {
    trialListRequest,
    trialListSuccess,
    trialListError,
    trialListReset,

    trialOneRequest,
    trialOneSuccess,
    trialOneError,
    trialOneReset,

    cuTrialReceivedRequest,
    cuTrialReceivedSuccess,
    cuTrialReceivedError,
    cuTrialReceivedReset,

    cuTrialReturnRequest,
    cuTrialReturnSuccess,
    cuTrialReturnError,
    cuTrialReturnReset,

    downloadTrialRequest,
    downloadTrialSuccess,
    downloadTrialError,
    downloadTrialReset

} = customerTrialSlice.actions
export default customerTrialSlice.reducer;