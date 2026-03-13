import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_PARTS } from "../../helpers/slice.name";


export const comPartSlice = createSlice({
    name: COMPANY_PARTS,
    initialState: {
        companyPartsListLoading: false,
        companyPartsList: [],
        companyPartsListMessage: "",
        companyPartsListError: "",

        addCompanyPartsLoading: false,
        addCompanyParts: {},
        addCompanyPartsMessage: "",
        addCompanyPartsError: "",

        removeCompanyPartsLoading: false,
        removeCompanyParts: {},
        removeCompanyPartsMessage: "",
        removeCompanyPartsError: "",

        updateCompanyPartsLoading: false,
        updateCompanyParts: {},
        updateCompanyPartsMessage: "",
        updateCompanyPartsError: "",
    },
    reducers: {
        companyPartsListRequest: (state) => {
            state.companyPartsListLoading = true;
            state.companyPartsListMessage = "";
            state.companyPartsListError = "";
        },
        companyPartsListSuccess: (state, action) => {
            state.companyPartsListLoading = false;
            state.companyPartsList = action.payload.data;
            state.companyPartsListMessage = action.payload.message;
        },
        companyPartsListError: (state, action) => {
            state.companyPartsListLoading = false;
            state.companyPartsListError = action.payload.message;
        },

        addCompanyPartsRequest: (state) => {
            state.addCompanyPartsLoading = true;
            state.addCompanyPartsMessage = "";
            state.addCompanyPartsError = "";
        },
        addCompanyPartsSuccess: (state, action) => {
            state.addCompanyPartsLoading = false;
            state.addCompanyParts = action.payload.data;
            state.addCompanyPartsMessage = action.payload.message;
        },
        addCompanyPartsError: (state, action) => {
            state.addCompanyPartsLoading = false;
            state.addCompanyPartsError = action.payload.message;
        },
        addCompanyPartsReset: (state) => {
            state.addCompanyPartsLoading = false;
            state.addCompanyParts = {};
            state.addCompanyPartsMessage = "";
            state.addCompanyPartsError = "";
        },

        removeCompanyPartsRequest: (state) => {
            state.removeCompanyPartsLoading = true;
            state.removeCompanyPartsMessage = "";
            state.removeCompanyPartsError = "";
        },
        removeCompanyPartsSuccess: (state, action) => {
            state.removeCompanyPartsLoading = false;
            state.removeCompanyParts = action.payload.data;
            state.removeCompanyPartsMessage = action.payload.message;
        },
        removeCompanyPartsError: (state, action) => {
            state.removeCompanyPartsLoading = false;
            state.removeCompanyPartsError = action.payload.message;
        },
        removeCompanyPartsReset: (state) => {
            state.removeCompanyPartsLoading = false;
            state.removeCompanyParts = {};
            state.removeCompanyPartsMessage = "";
            state.removeCompanyPartsError = "";
        },

        updateCompanyPartsRequest: (state) => {
            state.updateCompanyPartsLoading = true;
            state.updateCompanyPartsMessage = "";
            state.updateCompanyPartsError = "";
        },
        updateCompanyPartsSuccess: (state, action) => {
            state.updateCompanyPartsLoading = false;
            state.updateCompanyParts = action.payload.data;
            state.updateCompanyPartsMessage = action.payload.message;
        },
        updateCompanyPartsError: (state, action) => {
            state.updateCompanyPartsLoading = false;
            state.updateCompanyPartsError = action.payload.message;
        },
        updateCompanyPartsReset: (state) => {
            state.updateCompanyPartsLoading = false;
            state.updateCompanyParts = {};
            state.updateCompanyPartsMessage = "";
            state.updateCompanyPartsError = "";
        },
    }
});

export const {
    companyPartsListRequest,
    companyPartsListSuccess,
    companyPartsListError,

    addCompanyPartsRequest,
    addCompanyPartsSuccess,
    addCompanyPartsError,
    addCompanyPartsReset,

    removeCompanyPartsRequest,
    removeCompanyPartsSuccess,
    removeCompanyPartsError,
    removeCompanyPartsReset,

    updateCompanyPartsRequest,
    updateCompanyPartsSuccess,
    updateCompanyPartsError,
    updateCompanyPartsReset

} = comPartSlice.actions;

export default comPartSlice.reducer;