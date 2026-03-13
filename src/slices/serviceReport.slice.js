import { createSlice } from "@reduxjs/toolkit";
import { DE_SERVICE_REPORT } from "../helpers/slice.name";

export const serviceReportSlice = createSlice({
    name: DE_SERVICE_REPORT,
    initialState: {
        historyListLoading: false,
        historyList: [],
        historyListMessage: "",
        historyListError: "",

        customerReceiveListLoading: false,
        customerReceiveList: [],
        customerReceiveListMessage: "",
        customerReceiveListError: "",

        customerPaymentListLoading: false,
        customerPaymentList: [],
        customerPaymentListMessage: "",
        customerPaymentListError: "",

        companyReceiveListLoading: false,
        companyReceiveList: [],
        companyReceiveListMessage: "",
        companyReceiveListError: "",

        downloadServiceHistoryPdfLoading: false,
        downloadServiceHistoryPdf: {},
        downloadServiceHistoryPdfMessage: "",
        downloadServiceHistoryPdfError: "",
    },
    reducers: {
        historyListRequest: (state) => {
            state.historyListLoading = true;
            state.historyListMessage = "";
            state.historyListError = "";
        },
        historyListSuccess: (state, action) => {
            state.historyListLoading = false;
            state.historyList = action.payload.data;
            state.historyListMessage = action.payload.message;
        },
        historyListError: (state, action) => {
            state.historyListLoading = false;
            state.historyListError = action.payload.message;
        },

        customerReceiveListRequest: (state) => {
            state.customerReceiveListLoading = true;
            state.customerReceiveListMessage = "";
            state.customerReceiveListError = "";
        },
        customerReceiveListSuccess: (state, action) => {
            state.customerReceiveListLoading = false;
            state.customerReceiveList = action.payload.data;
            state.customerReceiveListMessage = action.payload.message;
        },
        customerReceiveListError: (state, action) => {
            state.customerReceiveListLoading = false;
            state.customerReceiveListError = action.payload.message;
        },

        customerPaymentListRequest: (state) => {
            state.customerPaymentListLoading = true;
            state.customerPaymentListMessage = "";
            state.customerPaymentListError = "";
        },
        customerPaymentListSuccess: (state, action) => {
            state.customerPaymentListLoading = false;
            state.customerPaymentList = action.payload.data;
            state.customerPaymentListMessage = action.payload.message;
        },
        customerPaymentListError: (state, action) => {
            state.customerPaymentListLoading = false;
            state.customerPaymentListError = action.payload.message;
        },

        companyReceiveListRequest: (state) => {
            state.companyReceiveListLoading = true;
            state.companyReceiveListMessage = "";
            state.companyReceiveListError = "";
        },
        companyReceiveListSuccess: (state, action) => {
            state.companyReceiveListLoading = false;
            state.companyReceiveList = action.payload.data;
            state.companyReceiveListMessage = action.payload.message;
        },
        companyReceiveListError: (state, action) => {
            state.companyReceiveListLoading = false;
            state.companyReceiveListError = action.payload.message;
        },


        downloadServiceHistoryPdfRequest: (state) => {
            state.downloadServiceHistoryPdfLoading = true;
            state.downloadServiceHistoryPdfMessage = "";
            state.downloadServiceHistoryPdfError = "";
        },
        downloadServiceHistoryPdfSuccess: (state, action) => {
            state.downloadServiceHistoryPdfLoading = false;
            state.downloadServiceHistoryPdf = action.payload.data;
            state.downloadServiceHistoryPdfMessage = action.payload.message;
        },
        downloadServiceHistoryPdfError: (state, action) => {
            state.downloadServiceHistoryPdfLoading = false;
            state.downloadServiceHistoryPdfError = action.payload.message;
        },
        downloadServiceHistoryPdfReset: (state) => {
            state.downloadServiceHistoryPdfLoading = false;
            state.downloadServiceHistoryPdf = {};
            state.downloadServiceHistoryPdfMessage = '';
            state.downloadServiceHistoryPdfError = '';
        }

    }
})

export const {
    historyListRequest,
    historyListSuccess,
    historyListError,

    customerReceiveListRequest,
    customerReceiveListSuccess,
    customerReceiveListError,

    customerPaymentListRequest,
    customerPaymentListSuccess,
    customerPaymentListError,

    companyReceiveListRequest,
    companyReceiveListSuccess,
    companyReceiveListError,

    downloadServiceHistoryPdfRequest,
    downloadServiceHistoryPdfSuccess,
    downloadServiceHistoryPdfError,
    downloadServiceHistoryPdfReset

} = serviceReportSlice.actions;

export default serviceReportSlice.reducer;