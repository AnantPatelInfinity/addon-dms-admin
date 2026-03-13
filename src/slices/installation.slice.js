import { createSlice } from "@reduxjs/toolkit";
import { DE_INSTALL } from "../helpers/slice.name";

export const dealerInstallationSlice = createSlice({
    name: DE_INSTALL,
    initialState: {
        installationListLoading: false,
        installationList: [],
        installationListMessage: "",
        installationListError: "",

        installationOneLoading: false,
        installationOne: {},
        installationOneMessage: "",
        installationOneError: "",

        addInstallationLoading: false,
        addInstallation: {},
        addInstallationMessage: "",
        addInstallationError: "",

        editInstallationLoading: false,
        editInstallation: {},
        editInstallationMessage: "",
        editInstallationError: "",

        downloadInstallationLoading: false,
        downloadInstallation: {},
        downloadInstallationMessage: "",
        downloadInstallationError: "",
    },
    reducers: {
        installationListRequest: (state) => {
            state.installationListLoading = true;
            state.installationListMessage = "";
            state.installationListError = "";
        },
        installationListSuccess: (state, action) => {
            state.installationListLoading = false;
            state.installationList = action.payload.data;
            state.installationListMessage = action.payload.message;
        },
        installationListError: (state, action) => {
            state.installationListLoading = false;
            state.installationListError = action.payload.message;
        },
        installationListReset: (state) => {
            state.installationList = [];
            state.installationListMessage = "";
            state.installationListError = "";
        },

        installationOneRequest: (state, action) => {
            state.installationOneLoading = true;
            state.installationOneMessage = "";
            state.installationOneError = "";
        },
        installationOneSuccess: (state, action) => {
            state.installationOneLoading = false;
            state.installationOne = action.payload.data;
            state.installationOneMessage = action.payload.message;
        },
        installationOneError: (state, action) => {
            state.installationOneLoading = false;
            state.installationOneError = action.payload.message;
        },
        installtionOneReset: (state, action) => {
            state.installationOne = [];
            state.installationOneMessage = "";
            state.installationOneError = "";
        },

        addInstallationRequest: (state) => {
            state.addInstallationLoading = true;
            state.addInstallationMessage = "";
            state.addInstallationError = "";
        },
        addInstallationSuccess: (state, action) => {
            state.addInstallationLoading = false;
            state.addInstallation = action.payload.data;
            state.addInstallationMessage = action.payload.message;
        },
        addInstallationError: (state, action) => {
            state.addInstallationLoading = false;
            state.addInstallationError = action.payload.message;
        },
        addInstallationReset: (state) => {
            state.addInstallation = [];
            state.addInstallationMessage = "";
            state.addInstallationError = "";
        },

        editInstallationRequest: (state) => {
            state.editInstallationLoading = true;
            state.editInstallationMessage = "";
            state.editInstallationError = "";
        },
        editInstallationSuccess: (state, action) => {
            state.editInstallationLoading = false;
            state.editInstallation = action.payload.data;
            state.editInstallationMessage = action.payload.message;
        },
        editInstallationError: (state, action) => {
            state.editInstallationLoading = false;
            state.editInstallationError = action.payload.message;
        },
        editInstallationReset: (state) => {
            state.editInstallation = [];
            state.editInstallationMessage = "";
            state.editInstallationError = "";
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
            state.downloadInstallationLoading = false;
            state.downloadInstallation = {};
            state.downloadInstallationMessage = "";
            state.downloadInstallationError = "";
        }
    }
});

export const {
    installationListRequest,
    installationListSuccess,
    installationListError,
    installationListReset,

    installationOneRequest,
    installationOneSuccess,
    installationOneError,
    installtionOneReset,

    addInstallationRequest,
    addInstallationSuccess,
    addInstallationError,
    addInstallationReset,

    editInstallationRequest,
    editInstallationSuccess,
    editInstallationError,
    editInstallationReset,

    downloadInstallationRequest,
    downloadInstallationSuccess,
    downloadInstallationError,
    downloadInstallationReset
} = dealerInstallationSlice.actions;

export default dealerInstallationSlice.reducer;