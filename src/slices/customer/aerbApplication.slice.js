import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_AERB_APPLICATION } from "../../helpers/slice.name";

export const customerAerbApplicationSlice = createSlice({
    name: CUSTOMER_AERB_APPLICATION,
    initialState: {
        aerbApplicationLoading: false,
        aerbApplication: {},
        aerbApplicationMessage: "",
        aerbApplicationError: "",

        addAerbApplicationLoading: false,
        addAerbApplication: {},
        addAerbApplicationMessage: "",
        addAerbApplicationError: "",

        editAerbApplicationLoading: false,
        editAerbApplication: {},
        editAerbApplicationMessage: "",
        editAerbApplicationError: "",

        deleteAerbApplicationLoading: false,
        deleteAerbApplication: {},
        deleteAerbApplicationMessage: "",
        deleteAerbApplicationError: "",
    },
    reducers: {
        aerbApplicationRequest: (state) => {
            state.aerbApplicationLoading = true;
            state.aerbApplicationMessage = "";
            state.aerbApplicationError = "";
        },
        aerbApplicationSuccess: (state, action) => {
            state.aerbApplicationLoading = false;
            state.aerbApplication = action.payload.data;
            state.aerbApplicationMessage = action.payload.message;
        },
        aerbApplicationError: (state, action) => {
            state.aerbApplicationLoading = false;
            state.aerbApplicationError = action.payload.message;
        },
        aerbApplicationReset: (state) => {
            state.aerbApplicationLoading = false;
            state.aerbApplication = {};
            state.aerbApplicationMessage = "";
            state.aerbApplicationError = "";
        },


        addAerbApplicationRequest: (state) => {
            state.addAerbApplicationLoading = true;
            state.addAerbApplicationMessage = "";
            state.addAerbApplicationError = "";
        },
        addAerbApplicationSuccess: (state, action) => {
            state.addAerbApplicationLoading = false;
            state.addAerbApplication = action.payload.data;
            state.addAerbApplicationMessage = action.payload.message;
        },
        addAerbApplicationError: (state, action) => {
            state.addAerbApplicationLoading = false;
            state.addAerbApplicationError = action.payload.message;
        },
        addAerbApplicationReset: (state) => {
            state.addAerbApplicationLoading = false;
            state.addAerbApplication = {};
            state.addAerbApplicationMessage = "";
            state.addAerbApplicationError = "";
        },

        editAerbApplicationRequest: (state) => {
            state.editAerbApplicationLoading = true;
            state.editAerbApplicationMessage = "";
            state.editAerbApplicationError = "";
        },
        editAerbApplicationSuccess: (state, action) => {
            state.editAerbApplicationLoading = false;
            state.editAerbApplication = action.payload.data;
            state.editAerbApplicationMessage = action.payload.message;
        },
        editAerbApplicationError: (state, action) => {
            state.editAerbApplicationLoading = false;
            state.editAerbApplicationError = action.payload.message;
        },
        editAerbApplicationReset: (state) => {
            state.editAerbApplicationLoading = false;
            state.editAerbApplication = {};
            state.editAerbApplicationMessage = "";
            state.editAerbApplicationError = "";
        },

        deleteAerbApplicationRequest: (state) => {
            state.deleteAerbApplicationLoading = true;
            state.deleteAerbApplicationMessage = "";
            state.deleteAerbApplicationError = "";
        },
        deleteAerbApplicationSuccess: (state, action) => {
            state.deleteAerbApplicationLoading = false;
            state.deleteAerbApplication = action.payload.data;
            state.deleteAerbApplicationMessage = action.payload.message;
        },
        deleteAerbApplicationError: (state, action) => {
            state.deleteAerbApplicationLoading = false;
            state.deleteAerbApplicationError = action.payload.message;
        },
        deleteAerbApplicationReset: (state) => {
            state.deleteAerbApplicationLoading = false;
            state.deleteAerbApplication = {};
            state.deleteAerbApplicationMessage = "";
            state.deleteAerbApplicationError = "";
        },
    }
});

export const {
    aerbApplicationRequest,
    aerbApplicationSuccess,
    aerbApplicationError,
    aerbApplicationReset,

    addAerbApplicationRequest,
    addAerbApplicationSuccess,
    addAerbApplicationError,
    addAerbApplicationReset,

    editAerbApplicationRequest,
    editAerbApplicationSuccess,
    editAerbApplicationError,
    editAerbApplicationReset,

    deleteAerbApplicationRequest,
    deleteAerbApplicationSuccess,
    deleteAerbApplicationError,
    deleteAerbApplicationReset,
} = customerAerbApplicationSlice.actions;

export default customerAerbApplicationSlice.reducer;