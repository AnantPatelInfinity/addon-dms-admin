import { createSlice } from "@reduxjs/toolkit";
import { DEALER_TRIAL } from "../helpers/slice.name";

export const dealerTrialSlice = createSlice({
    name: DEALER_TRIAL,
    initialState: {
        trialListLoading: false,
        trialList: [],
        trialListMessage: "",
        trialListError: "",

        trialOneLoading: false,
        trialOne: {},
        trialOneMessage: "",
        trialOneError: "",

        addTrialLoading: false,
        addTrial: {},
        addTrialMessage: "",
        addTrialError: "",

        editTrialLoading: false,
        editTrial: {},
        editTrialMessage: "",
        editTrialError: "",

        deleteTrialLoading: false,
        deleteTrial: {},
        deleteTrialMessage: "",
        deleteTrialError: "",

        downloadTrialLoading: false,
        downloadTrial: {},
        downloadTrialMessage: "",
        downloadTrialError: "",

        dispatchTrialLoading: false,
        dispatchTrial: {},
        dispatchTrialMessage: "",
        dispatchTrialError: "",

        returnTrialLoading: false,
        returnTrial: {},
        returnTrialMessage: "",
        returnTrialError: "",
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
            state.trialListLoading = false;
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
            state.trialOneLoading = false;
            state.trialOne = {};
            state.trialOneMessage = "";
            state.trialOneError = "";
        },

        addTrialRequest: (state) => {
            state.addTrialLoading = true;
            state.addTrialMessage = "";
            state.addTrialError = "";
        },
        addTrialSuccess: (state, action) => {
            state.addTrialLoading = false;
            state.addTrial = action.payload.data;
            state.addTrialMessage = action.payload.message;
        },
        addTrialError: (state, action) => {
            state.addTrialLoading = false;
            state.addTrialError = action.payload.message;
        },
        addTrialReset: (state) => {
            state.addTrialLoading = false;
            state.addTrial = {};
            state.addTrialMessage = "";
            state.addTrialError = "";
        },

        editTrialRequest: (state) => {
            state.editTrialLoading = true;
            state.editTrialMessage = "";
            state.editTrialError = "";
        },
        editTrialSuccess: (state, action) => {
            state.editTrialLoading = false;
            state.editTrial = action.payload.data;
            state.editTrialMessage = action.payload.message;
        },
        editTrialError: (state, action) => {
            state.editTrialLoading = false;
            state.editTrialError = action.payload.message;
        },
        editTrialReset: (state) => {
            state.editTrialLoading = false;
            state.editTrial = {};
            state.editTrialMessage = "";
            state.editTrialError = "";
        },

        deleteTrialRequest: (state) => {
            state.deleteTrialLoading = true;
            state.deleteTrialMessage = "";
            state.deleteTrialError = "";
        },
        deleteTrialSuccess: (state, action) => {
            state.deleteTrialLoading = false;
            state.deleteTrial = action.payload.data;
            state.deleteTrialMessage = action.payload.message;
        },
        deleteTrialError: (state, action) => {
            state.deleteTrialLoading = false;
            state.deleteTrialError = action.payload.message;
        },
        deleteTrialReset: (state) => {
            state.deleteTrialLoading = false;
            state.deleteTrial = {};
            state.deleteTrialMessage = "";
            state.deleteTrialError = "";
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
        },

        dispatchTrialRequest: (state) => {
            state.dispatchTrialLoading = true;
            state.dispatchTrialMessage = "";
            state.dispatchTrialError = "";
        },
        dispatchTrialSuccess: (state, action) => {
            state.dispatchTrialLoading = false;
            state.dispatchTrial = action.payload.data;
            state.dispatchTrialMessage = action.payload.message;
        },
        dispatchTrialError: (state, action) => {
            state.dispatchTrialLoading = false;
            state.dispatchTrialError = action.payload.message;
        },
        dispatchTrialReset: (state) => {
            state.dispatchTrialLoading = false;
            state.dispatchTrial = {};
            state.dispatchTrialMessage = "";
            state.dispatchTrialError = "";
        },

        returnTrialRequest: (state) => {
            state.returnTrialLoading = true;
            state.returnTrialMessage = "";
            state.returnTrialError = "";
        },
        returnTrialSuccess: (state, action) => {
            state.returnTrialLoading = false;
            state.returnTrial = action.payload.data;
            state.returnTrialMessage = action.payload.message;
        },
        returnTrialError: (state, action) => {
            state.returnTrialLoading = false;
            state.returnTrialError = action.payload.message;
        },
        returnTrialReset: (state) => {
            state.returnTrialLoading = false;
            state.returnTrial = {};
            state.returnTrialMessage = "";
            state.returnTrialError = "";
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

    addTrialRequest,
    addTrialSuccess,
    addTrialError,
    addTrialReset,

    editTrialRequest,
    editTrialSuccess,
    editTrialError,
    editTrialReset,

    deleteTrialRequest,
    deleteTrialSuccess,
    deleteTrialError,
    deleteTrialReset,

    downloadTrialRequest,
    downloadTrialSuccess,
    downloadTrialError,
    downloadTrialReset,

    dispatchTrialRequest,
    dispatchTrialSuccess,
    dispatchTrialError,
    dispatchTrialReset,

    returnTrialRequest,
    returnTrialSuccess,
    returnTrialError,
    returnTrialReset

} = dealerTrialSlice.actions
export default dealerTrialSlice.reducer;