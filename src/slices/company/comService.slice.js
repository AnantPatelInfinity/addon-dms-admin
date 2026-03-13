import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_SERVICE } from "../../helpers/slice.name";

export const comServiceSlice = createSlice({
    name: COMAPNY_SERVICE,
    initialState: {
        comServiceListLoading: false,
        comServiceList: [],
        comServiceListMessage: "",
        comServiceListError: "",

        comOneServiceLoading: false,
        comOneService: {},
        comOneServiceMessage: "",
        comOneServiceError: "",

        comActionTakeLoading: false,
        comActionTake: {},
        comActionTakeMessage: "",
        comActionTakeError: "",

        // company parts receive
        comReceiveConfirmationLoading: false,
        comReceiveConfirmation: {},
        comReceiveConfirmationMessage: "",
        comReceiveConfirmationError: "",

        // company action
        comActionTakeProductLoading: false,
        comActionTakeProduct: {},
        comActionTakeProductMessage: "",
        comActionTakeProductError: "",
        
        // company full product receive
        comReceiveConfirmationProductLoading: false,
        comReceiveConfirmationProduct: {},
        comReceiveConfirmationProductMessage: "",
        comReceiveConfirmationProductError: "",

        comFinalReceiveLoading: false,
        comFinalReceive: {},
        comFinalReceiveMessage: "",
        comFinalReceiveError: "",

        // service estimation
        comServiceEstimationLoading: false,
        comServiceEstimation: {},
        comServiceEstimationMessage: "",
        comServiceEstimationError: "",

        // full product dispatch
        comDispatchLoading: false,
        comDispatch: {},
        comDispatchMessage: "",
        comDispatchError: "",

        // parts dispatch
        comPartsDispatchLoading: false,
        comPartsDispatch: {},
        comPartsDispatchMessage: false,
        comPartsDispatchError: false,

        // donwload pdf
        comDispatchPdfLoading: false,
        comDispatchPdf: {},
        comDispatchPdfMessage: "",
        comDispatchPdfError: "",

        comDownloadServiceLoading: false,
        comDownloadService: {},
        comDownloadServiceMessage: "",
        comDownloadServiceError: "",

        comDownloadServiceChallanLoading: false,
        comDownloadServiceChallan: {},
        comDownloadServiceChallanMessage: "",
        comDownloadServiceChallanError: "",

        // complete company service between flow
        comCompleteServiceLoading: false,
        comCompleteService: {},
        comCompleteServiceMessage: "",
        comCompleteServiceError: "",
    },
    reducers: {
        comServiceListRequest: (state) => {
            state.comServiceListLoading = true;
            state.comServiceListMessage = "";
            state.comServiceListError = "";
        },
        comServiceListSuccess: (state, action) => {
            state.comServiceListLoading = false;
            state.comServiceList = action.payload.data;
            state.comServiceListMessage = action.payload.message;
        },
        comServiceListError: (state, action) => {
            state.comServiceListLoading = false;
            state.comServiceListError = action.payload.message;
        },

        comOneServiceRequest: (state) => {
            state.comOneServiceLoading = true;
            state.comOneServiceMessage = "";
            state.comOneServiceError = "";
        },
        comOneServiceSuccess: (state, action) => {
            state.comOneServiceLoading = false;
            state.comOneService = action.payload.data;
            state.comOneServiceMessage = "";
            state.comOneServiceError = "";
        },
        comOneServiceSuccess: (state, action) => {
            state.comOneServiceLoading = false;
            state.comOneService = action.payload.data;
            state.comOneServiceMessage = action.payload.message;
        },
        comOneServiceError: (state, action) => {
            state.comOneServiceLoading = false;
            state.comOneServiceError = action.payload.message;
        },

        comActionTakeRequest: (state) => {
            state.comActionTakeLoading = true;
            state.comActionTakeMessage = "";
            state.comActionTakeError = "";
        },
        comActionTakeSuccess: (state, action) => {
            state.comActionTakeLoading = false;
            state.comActionTake = action.payload.data;
            state.comActionTakeMessage = action.payload.message;
        },
        comActionTakeError: (state, action) => {
            state.comActionTakeLoading = false;
            state.comActionTakeError = action.payload.message;
        },
        comActionTakeReset: (state) => {
            state.comActionTakeLoading = false;
            state.comActionTake = {};
            state.comActionTakeMessage = "";
            state.comActionTakeError = "";
        },

        comActionTakeProductRequest: (state) => {
            state.comActionTakeProductLoading = true;
            state.comActionTakeProductMessage = "";
            state.comActionTakeProductError = "";
        },
        comActionTakeProductSuccess: (state, action) => {
            state.comActionTakeProductLoading = false;
            state.comActionTakeProduct = action.payload.data;
            state.comActionTakeProductMessage = action.payload.message;
        },
        comActionTakeProductError: (state, action) => {
            state.comActionTakeProductLoading = false;
            state.comActionTakeProductError = action.payload.message;
        },
        comActionTakeProductReset: (state) => {
            state.comActionTakeProductLoading = false;
            state.comActionTakeProduct = {};
            state.comActionTakeProductMessage = "";
            state.comActionTakeProductError = "";
        },

        comFinalReceiveRequest: (state) => {
            state.comFinalReceiveLoading = true;
            state.comFinalReceiveMessage = "";
            state.comFinalReceiveError = "";
        },
        comFinalReceiveSuccess: (state, action) => {
            state.comFinalReceiveLoading = false;
            state.comFinalReceive = action.payload.data;
            state.comFinalReceiveMessage = action.payload.message;
        },
        comFinalReceiveError: (state, action) => {
            state.comFinalReceiveLoading = false;
            state.comFinalReceiveError = action.payload.message;
        },
        comFinalReceiveReset: (state) => {
            state.comFinalReceiveLoading = false;
            state.comFinalReceive = {};
            state.comFinalReceiveMessage = "";
            state.comFinalReceiveError = "";
        },


        comReceiveConfirmationProductRequest: (state) => {
            state.comReceiveConfirmationProductLoading = true;
            state.comReceiveConfirmationProductMessage = "";
            state.comReceiveConfirmationProductError = "";
        },
        comReceiveConfirmationProductSuccess: (state, action) => {
            state.comReceiveConfirmationProductLoading = false;
            state.comReceiveConfirmationProduct = action.payload.data;
            state.comReceiveConfirmationProductMessage = action.payload.message;
        },
        comReceiveConfirmationProductError: (state, action) => {
            state.comReceiveConfirmationProductLoading = false;
            state.comReceiveConfirmationProductError = action.payload.message;
        },
        comReceiveConfirmationProductReset: (state) => {
            state.comReceiveConfirmationProductLoading = false;
            state.comReceiveConfirmationProduct = {};
            state.comReceiveConfirmationProductMessage = "";
            state.comReceiveConfirmationProductError = "";
        },


        comReceiveConfirmationRequest: (state) => {
            state.comReceiveConfirmationLoading = true;
            state.comReceiveConfirmationMessage = "";
            state.comReceiveConfirmationError = "";
        },
        comReceiveConfirmationSuccess: (state, action) => {
            state.comReceiveConfirmationLoading = false;
            state.comReceiveConfirmation = action.payload.data;
            state.comReceiveConfirmationMessage = action.payload.message;
        },
        comReceiveConfirmationError: (state, action) => {
            state.comReceiveConfirmationLoading = false;
            state.comReceiveConfirmationError = action.payload.message;
        },
        comReceiveConfirmationReset: (state) => {
            state.comReceiveConfirmationLoading = false;
            state.comReceiveConfirmation = {};
            state.comReceiveConfirmationMessage = "";
            state.comReceiveConfirmationError = "";
        },

        comServiceEstimationRequest: (state) => {
            state.comServiceEstimationLoading = true;
            state.comServiceEstimationMessage = "";
            state.comServiceEstimationError = "";
        },
        comServiceEstimationSuccess: (state, action) => {
            state.comServiceEstimationLoading = false;
            state.comServiceEstimation = action.payload.data;
            state.comServiceEstimationMessage = action.payload.message;
        },
        comServiceEstimationError: (state, action) => {
            state.comServiceEstimationLoading = false;
            state.comServiceEstimationError = action.payload.message;
        },
        comServiceEstimationReset: (state) => {
            state.comServiceEstimationLoading = false;
            state.comServiceEstimation = {};
            state.comServiceEstimationMessage = "";
            state.comServiceEstimationError = "";
        },

        // full product dispatch
        comDispatchRequest: (state) => {
            state.comDispatchLoading = true;
            state.comDispatchMessage = "";
            state.comDispatchError = "";
        },
        comDispatchSuccess: (state, action) => {
            state.comDispatchLoading = false;
            state.comDispatch = action.payload.data;
            state.comDispatchMessage = action.payload.message;
        },
        comDispatchError: (state, action) => {
            state.comDispatchLoading = false;
            state.comDispatchError = action.payload.message;
        },
        comDispatchReset: (state) => {
            state.comDispatchLoading = false;
            state.comDispatch = {};
            state.comDispatchMessage = "";
            state.comDispatchError = "";
        },

        // parts company dispatch
        comPartsDispatchRequest: (state) => {
            state.comPartsDispatchLoading = true;
            state.comPartsDispatchMessage = "";
            state.comPartsDispatchError = "";
        },
        comPartsDispatchSuccess: (state, action) => {
            state.comPartsDispatchLoading = false;
            state.comPartsDispatch = action.payload.data;
            state.comPartsDispatchMessage = action.payload.message;
        },
        comPartsDispatchError: (state, action) => {
            state.comPartsDispatchLoading = false;
            state.comPartsDispatchError = action.payload.message;
        },
        comPartsDispatchReset: (state) => {
            state.comPartsDispatchLoading = false;
            state.comPartsDispatch = {};
            state.comPartsDispatchMessage = "";
            state.comPartsDispatchError = "";
        },

        // dowload dispatch
        comDispatchPdfRequest: (state) => {
            state.comDispatchPdfLoading = true;
            state.comDispatchPdfMessage = "";
            state.comDispatchPdfError = "";
        },
        comDispatchPdfSuccess: (state, action) => {
            state.comDispatchPdfLoading = false;
            state.comDispatchPdf = action.payload.data;
            state.comDispatchPdfMessage = action.payload.message;
        },
        comDispatchPdfError: (state, action) => {
            state.comDispatchPdfLoading = false;
            state.comDispatchPdfError = action.payload.message;
        },
        comDispatchPdfReset: (state) => {
            state.comDispatchPdfLoading = false;
            state.comDispatchPdf = {};
            state.comDispatchPdfMessage = "";
            state.comDispatchPdfError = "";
        },

        comDownloadServiceRequest: (state) => {
            state.comDownloadServiceLoading = true;
            state.comDownloadServiceMessage = "";
            state.comDownloadServiceError = "";
        },
        comDownloadServiceSuccess: (state, action) => {
            state.comDownloadServiceLoading = false;
            state.comDownloadService = action.payload.data;
            state.comDownloadServiceMessage = action.payload.message;
        },
        comDownloadServiceError: (state, action) => {
            state.comDownloadServiceLoading = false;
            state.comDownloadServiceError = action.payload.message;
        },
        comDownloadServiceReset: (state) => {
            state.comDownloadServiceLoading = false;
            state.comDownloadService = {};
            state.comDownloadServiceMessage = "";
            state.comDownloadServiceError = "";
        },


        comDownloadServiceChallanRequest: (state) => {
            state.comDownloadServiceChallanLoading = true;
            state.comDownloadServiceChallanMessage = "";
            state.comDownloadServiceChallanError = "";
        },
        comDownloadServiceChallanSuccess: (state, action) => {
            state.comDownloadServiceChallanLoading = false;
            state.comDownloadServiceChallan = action.payload.data;
            state.comDownloadServiceChallanMessage = action.payload.message;
        },
        comDownloadServiceChallanError: (state, action) => {
            state.comDownloadServiceChallanLoading = false;
            state.comDownloadServiceChallanError = action.payload.message;
        },
        comDownloadServiceChallanReset: (state) => {
            state.comDownloadServiceChallanLoading = false;
            state.comDownloadServiceChallan = {};
            state.comDownloadServiceChallanMessage = "";
            state.comDownloadServiceChallanError = "";
        },

        comCompleteServiceRequest: (state) => {
            state.comCompleteServiceLoading = true;
            state.comCompleteServiceMessage = "";
            state.comCompleteServiceError = "";
        },
        comCompleteServiceSuccess: (state, action) => {
            state.comCompleteServiceLoading = false;
            state.comCompleteService = action.payload.data;
            state.comCompleteServiceMessage = action.payload.message;
        },
        comCompleteServiceError: (state, action) => {
            state.comCompleteServiceLoading = false;
            state.comCompleteServiceError = action.payload.message;
        },
        comCompleteServiceReset: (state) => {
            state.comCompleteServiceLoading = false;
            state.comCompleteService = {};
            state.comCompleteServiceMessage = "";
            state.comCompleteServiceError = "";
        }

    }
});

export const {
    comServiceListRequest,
    comServiceListSuccess,
    comServiceListError,

    comOneServiceRequest,
    comOneServiceSuccess,
    comOneServiceError,

    comActionTakeRequest,
    comActionTakeSuccess,
    comActionTakeError,
    comActionTakeReset,

    comFinalReceiveRequest,
    comFinalReceiveSuccess,
    comFinalReceiveError,
    comFinalReceiveReset,

    comActionTakeProductRequest,
    comActionTakeProductSuccess,
    comActionTakeProductError,
    comActionTakeProductReset,
    
    comReceiveConfirmationProductRequest,
    comReceiveConfirmationProductSuccess,
    comReceiveConfirmationProductError,
    comReceiveConfirmationProductReset,

    comReceiveConfirmationRequest,
    comReceiveConfirmationSuccess,
    comReceiveConfirmationError,
    comReceiveConfirmationReset,

    comServiceEstimationRequest,
    comServiceEstimationSuccess,
    comServiceEstimationError,
    comServiceEstimationReset,

    comDispatchRequest,
    comDispatchSuccess,
    comDispatchError,
    comDispatchReset,

    comPartsDispatchRequest,
    comPartsDispatchSuccess,
    comPartsDispatchError,
    comPartsDispatchReset,

    comDispatchPdfRequest,
    comDispatchPdfSuccess,
    comDispatchPdfError,
    comDispatchPdfReset,

    comDownloadServiceRequest,
    comDownloadServiceSuccess,
    comDownloadServiceError,
    comDownloadServiceReset,

    comDownloadServiceChallanRequest,
    comDownloadServiceChallanSuccess,
    comDownloadServiceChallanError,
    comDownloadServiceChallanReset,


    comCompleteServiceRequest,
    comCompleteServiceSuccess,
    comCompleteServiceError,
    comCompleteServiceReset,
    
} = comServiceSlice.actions;


export default comServiceSlice.reducer;
