import { createSlice } from "@reduxjs/toolkit";
import { DE_SERVICE } from "../helpers/slice.name";

export const serviceSlice = createSlice({
  name: DE_SERVICE,
  initialState: {
    serviceListLoading: false,
    serviceList: [],
    serviceListMessage: "",
    serviceListError: "",

    serviceOneListLoading: false,
    serviceOneList: {},
    serviceOneListMessage: "",
    serviceOneListError: "",

    addServiceLoading: false,
    addService: {},
    addServiceMessage: "",
    addServiceError: "",

    editServiceLoading: false,
    editService: {},
    editServiceMessage: "",
    editServiceError: "",

    downloadServiceLoading: false,
    downloadService: {},
    downloadServiceMessage: "",
    downloadServiceError: "",

    downloadDispatchLoading: false,
    downloadDispatch: {},
    downloadDispatchMessage: "",
    downloadDispatchError: "",

    downloadServiceChallanLoading: false,
    downloadServiceChallan: {},
    downloadServiceChallanMessage: "",
    downloadServiceChallanError: "",

    // complete dealer service between flow
    deCompleteServiceLoading: false,
    deCompleteService: {},
    deCompleteServiceMessage: "",
    deCompleteServiceError: "",
  },
  reducers: {
    serviceListRequest: (state, action) => {
      state.serviceListLoading = true;
      state.serviceListMessage = "";
      state.serviceListError = "";
    },
    serviceListSuccess: (state, action) => {
      state.serviceListLoading = false;
      state.serviceList = action.payload.data;
      state.serviceListMessage = action.payload.message;
    },
    serviceListError: (state, action) => {
      state.serviceListLoading = false;
      state.serviceListError = action.payload.message;
    },

    serviceOneListRequest: (state, action) => {
      state.serviceOneListLoading = true;
      state.serviceOneListMessage = "";
      state.serviceOneListError = "";
    },
    serviceOneListSuccess: (state, action) => {
      state.serviceOneListLoading = false;
      state.serviceOneList = action.payload.data;
      state.serviceOneListMessage = action.payload.message;
    },
    serviceOneListError: (state, action) => {
      state.serviceOneListLoading = false;
      state.serviceOneListError = action.payload.message;
    },
    serviceOneListReset: (state, action) => {
      state.serviceOneListLoading = false;
      state.serviceOneList = {};
      state.serviceOneListMessage = "";
      state.serviceOneListError = "";
    },

    addServiceRequest: (state, action) => {
      state.addServiceLoading = true;
      state.addServiceMessage = "";
      state.addServiceError = "";
    },
    addServiceSuccess: (state, action) => {
      state.addServiceLoading = false;
      state.addService = action.payload.data;
      state.addServiceMessage = action.payload.message;
    },
    addServiceError: (state, action) => {
      state.addServiceLoading = false;
      state.addServiceError = action.payload.message;
    },
    addServiceReset: (state, action) => {
      state.addServiceLoading = false;
      state.addService = {};
      state.addServiceMessage = "";
      state.addServiceError = "";
    },

    editServiceRequest: (state, action) => {
      state.editServiceLoading = true;
      state.editServiceMessage = "";
      state.editServiceError = "";
    },
    editServiceSuccess: (state, action) => {
      state.editServiceLoading = false;
      state.editService = action.payload.data;
      state.editServiceMessage = action.payload.message;
    },
    editServiceError: (state, action) => {
      state.editServiceLoading = false;
      state.editServiceError = action.payload.message;
    },
    editServiceReset: (state, action) => {
      state.editServiceLoading = false;
      state.editService = {};
      state.editServiceMessage = "";
      state.editServiceError = "";
    },

    downloadServiceRequest: (state, action) => {
      state.downloadServiceLoading = true;
      state.downloadServiceMessage = "";
      state.downloadServiceError = "";
    },
    downloadServiceSuccess: (state, action) => {
      state.downloadServiceLoading = false;
      state.downloadService = action.payload.data;
      state.downloadServiceMessage = action.payload.message;
    },
    downloadServiceError: (state, action) => {
      state.downloadServiceLoading = false;
      state.downloadServiceError = action.payload.message;
    },
    downloadServiceReset: (state, action) => {
      state.downloadServiceLoading = false;
      state.downloadService = {};
      state.downloadServiceMessage = "";
      state.downloadServiceError = "";
    },

    downloadDispatchRequest: (state, action) => {
      state.downloadDispatchLoading = true;
      state.downloadDispatchMessage = "";
      state.downloadDispatchError = "";
    },
    downloadDispatchSuccess: (state, action) => {
      state.downloadDispatchLoading = false;
      state.downloadDispatch = action.payload.data;
      state.downloadDispatchMessage = action.payload.message;
    },
    downloadDispatchError: (state, action) => {
      state.downloadDispatchLoading = false;
      state.downloadDispatchError = action.payload.message;
    },
    downloadDispatchReset: (state, action) => {
      state.downloadDispatchLoading = false;
      state.downloadDispatch = {};
      state.downloadDispatchMessage = "";
      state.downloadDispatchError = "";
    },

    downloadServiceChallanRequest: (state, action) => {
      state.downloadServiceChallanLoading = true;
      state.downloadServiceChallanMessage = "";
      state.downloadServiceChallanError = "";
    },
    downloadServiceChallanSuccess: (state, action) => {
      state.downloadServiceChallanLoading = false;
      state.downloadServiceChallan = action.payload.data;
      state.downloadServiceChallanMessage = action.payload.message;
    },
    downloadServiceChallanError: (state, action) => {
      state.downloadServiceChallanLoading = false;
      state.downloadServiceChallanError = action.payload.message;
    },
    downloadServiceChallanReset: (state, action) => {
      state.downloadServiceChallanLoading = false;
      state.downloadServiceChallan = {};
      state.downloadServiceChallanMessage = "";
      state.downloadServiceChallanError = "";
    },

    deCompleteServiceRequest: (state) => {
      state.deCompleteServiceLoading = true;
      state.deCompleteServiceMessage = "";
      state.deCompleteServiceError = "";
    },
    deCompleteServiceSuccess: (state, action) => {
      state.deCompleteServiceLoading = false;
      state.deCompleteService = action.payload.data;
      state.deCompleteServiceMessage = action.payload.message;
    },
    deCompleteServiceError: (state, action) => {
      state.deCompleteServiceLoading = false;
      state.deCompleteServiceError = action.payload.message;
    },
    deCompleteServiceReset: (state) => {
      state.deCompleteServiceLoading = false;
      state.deCompleteService = {};
      state.deCompleteServiceMessage = "";
      state.deCompleteServiceError = "";
    },
  },
});

export const {
  serviceListRequest,
  serviceListSuccess,
  serviceListError,

  serviceOneListRequest,
  serviceOneListSuccess,
  serviceOneListError,
  serviceOneListReset,

  addServiceRequest,
  addServiceSuccess,
  addServiceError,
  addServiceReset,

  editServiceRequest,
  editServiceSuccess,
  editServiceError,
  editServiceReset,

  downloadServiceRequest,
  downloadServiceSuccess,
  downloadServiceError,
  downloadServiceReset,

  downloadDispatchRequest,
  downloadDispatchSuccess,
  downloadDispatchError,
  downloadDispatchReset,

  downloadServiceChallanRequest,
  downloadServiceChallanSuccess,
  downloadServiceChallanError,
  downloadServiceChallanReset,

  deCompleteServiceRequest,
  deCompleteServiceSuccess,
  deCompleteServiceError,
  deCompleteServiceReset,
  
} = serviceSlice.actions;

export default serviceSlice.reducer;
