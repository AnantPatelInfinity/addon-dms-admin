import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_PO } from "../../helpers/slice.name";

export const companyPoSlice = createSlice({
    name: COMAPNY_PO,
    initialState: {
        companyPoListLoading: false,
        companyPoList: [],
        companyPoListMessage: "",
        companyPoListError: "",

        companyOnePoListLoading: false,
        companyOnePoList: {},
        companyOnePoListMessage: "",
        companyOnePoListError: "",

        companyPoItemsListLoading: false,
        companyPoItemsList: [],
        companyPoItemsListMessage: "",
        companyPoItemsListError: "",

        companyPoApproveLoading: false,
        companyPoApproveMessage: "",
        companyPoApproveError: "",

        companyInvoiceLoading: false,
        companyInvoiceMessage: "",
        companyInvoiceError: "",


        companyPoDownloadLoading: false,
        companyPoDownload: {},
        companyPoDownloadMessage: "",
        companyPoDownloadError: "",

    },
    reducers: {
        companyPoListRequest: (state) => {
            state.companyPoListLoading = true;
            state.companyPoListMessage = "";
            state.companyPoListError = "";
        },
        companyPoListSuccess: (state, action) => {
            state.companyPoListLoading = false;
            state.companyPoList = action.payload.data;
            state.companyPoListMessage = action.payload.message;
        },
        companyPoListError: (state, action) => {
            state.companyPoListLoading = false;
            state.companyPoListError = action.payload.message;
        },

        companyOnePoListRequest: (state) => {
            state.companyOnePoListLoading = true;
            state.companyOnePoListMessage = "";
            state.companyOnePoListError = "";
        },
        companyOnePoListSuccess: (state, action) => {
            state.companyOnePoListLoading = false;
            state.companyOnePoList = action.payload.data;
            state.companyOnePoListMessage = action.payload.message;
        },
        companyOnePoListError: (state, action) => {
            state.companyOnePoListLoading = false;
            state.companyOnePoListError = action.payload.message;
        },

        companyPoItemsListRequest: (state) => {
            state.companyPoItemsListLoading = true;
            state.companyPoItemsListMessage = "";
            state.companyPoItemsListError = "";
        },
        companyPoItemsListSuccess: (state, action) => {
            state.companyPoItemsListLoading = false;
            state.companyPoItemsList = action.payload.data;
            state.companyPoItemsListMessage = action.payload.message;
        },
        companyPoItemsListError: (state, action) => {
            state.companyPoItemsListLoading = false;
            state.companyPoItemsListError = action.payload.message;
        },

        companyPoApproveRequest: (state) => {
            state.companyPoApproveLoading = true;
            state.companyPoApproveMessage = "";
            state.companyPoApproveError = "";
        },
        companyPoApproveSuccess: (state, action) => {
            state.companyPoApproveLoading = false;
            state.companyPoApproveMessage = action.payload.message;
        },
        companyPoApproveError: (state, action) => {
            state.companyPoApproveLoading = false;
            state.companyPoApproveError = action.payload.message;
        },
        companyPoApproveReset: (state) => {
            state.companyPoApproveLoading = false;
            state.companyPoApproveMessage = "";
            state.companyPoApproveError = "";
        },

        companyInvoiceRequest: (state) => {
            state.companyInvoiceLoading = true;
            state.companyInvoiceMessage = "";
            state.companyInvoiceError = "";
        },
        companyIncoiceSuccess: (state, action) => {
            state.companyInvoiceLoading = false;
            state.companyInvoiceMessage = action.payload.message;
        },
        companyIncoiceError: (state, action) => {
            state.companyInvoiceLoading = false;
            state.companyInvoiceError = action.payload.message;
        },
        companyInvoiceReset: (state) => {
            state.companyInvoiceLoading = false;
            state.companyInvoiceMessage = "";
            state.companyInvoiceError = "";
        },

        companyPoDownloadRequest: (state) => {
            state.companyPoDownloadLoading = true;
            state.companyPoDownloadMessage = "";
            state.companyPoDownloadError = "";
        },
        companyPoDownloadSuccess: (state, action) => {
            state.companyPoDownloadLoading = false;
            state.companyPoDownload = action.payload.data;
            state.companyPoDownloadMessage = action.payload.message;
        },
        companyPoDownloadError: (state, action) => {
            state.companyPoDownloadLoading = false;
            state.companyPoDownloadError = action.payload.message;
        },
        companyPoDownloadReset: (state) => {
            state.companyPoDownloadLoading = false;
            state.companyPoDownload = {};
            state.companyPoDownloadMessage = "";
            state.companyPoDownloadError = "";
        },
    }
});

export const {
    companyPoListRequest,
    companyPoListSuccess,
    companyPoListError,

    companyOnePoListRequest,
    companyOnePoListSuccess,
    companyOnePoListError,

    companyPoItemsListRequest,
    companyPoItemsListSuccess,
    companyPoItemsListError,

    companyPoApproveRequest,
    companyPoApproveSuccess,
    companyPoApproveError,
    companyPoApproveReset,

    companyInvoiceRequest,
    companyIncoiceSuccess,
    companyIncoiceError,
    companyInvoiceReset,

    companyPoDownloadRequest,
    companyPoDownloadSuccess,
    companyPoDownloadError,
    companyPoDownloadReset
} = companyPoSlice.actions;

export default companyPoSlice.reducer;