import { createSlice } from "@reduxjs/toolkit";
import { DE_PO } from "../helpers/slice.name";

export const dealerPoSlice = createSlice({
    name: DE_PO,
    initialState: {
        dealerPoListLoading: false,
        dealerPoList: [],
        dealerPoListMessage: "",
        dealerPoListError: "",

        dealerOnePoListLoading: false,
        dealerOnePoList: [],
        dealerOnePoListMessage: "",
        dealerOnePoListError: "",

        dePoDownloadLoading: false,
        dePoDownload: {},
        dePoDownloadMessage: "",
        dePoDownloadError: "",

    },
    reducers: {
        dealerPoListRequest: (state) => {
            state.dealerPoListLoading = true;
            state.dealerPoListMessage = "";
            state.dealerPoListError = "";
        },
        dealerPoListSuccess: (state, action) => {
            state.dealerPoListLoading = false;
            state.dealerPoList = action.payload.data;
            state.dealerPoListMessage = action.payload.message;
        },
        dealerPoListError: (state, action) => {
            state.dealerPoListLoading = false;
            state.dealerPoListError = action.payload.message;
        },

        dealerOnePoListRequest: (state) => {
            state.dealerOnePoListLoading = true;
            state.dealerOnePoListMessage = "";
            state.dealerOnePoListError = "";
        },
        dealerOnePoListSuccess: (state, action) => {
            state.dealerOnePoListLoading = false;
            state.dealerOnePoList = action.payload.data;
            state.dealerOnePoListMessage = action.payload.message;
        },
        dealerOnePoListError: (state, action) => {
            state.dealerOnePoListLoading = false;
            state.dealerOnePoListError = action.payload.message;
        },

        dePoDownloadRequest: (state) => {
            state.dePoDownloadLoading = true;
            state.dePoDownloadMessage = "";
            state.dePoDownloadError = "";
        },
        dePoDownloadSuccess: (state, action) => {
            state.dePoDownloadLoading = false;
            state.dePoDownload = action.payload.data;
            state.dePoDownloadMessage = action.payload.message;
        },
        dePoDownloadError: (state, action) => {
            state.dePoDownloadLoading = false;
            state.dePoDownloadError = action.payload.message;
        },
        dePoDownloadReset: (state) => {
            state.dePoDownloadLoading = false;
            state.dePoDownload = {};
            state.dePoDownloadMessage = "";
            state.dePoDownloadError = "";
        },
       
    }
});

export const {
    dealerPoListRequest,
    dealerPoListSuccess,
    dealerPoListError,

    dealerOnePoListRequest,
    dealerOnePoListSuccess,
    dealerOnePoListError,
    
    dePoDownloadRequest,
    dePoDownloadSuccess,
    dePoDownloadError,
    dePoDownloadReset,


} = dealerPoSlice.actions;


export default dealerPoSlice.reducer;