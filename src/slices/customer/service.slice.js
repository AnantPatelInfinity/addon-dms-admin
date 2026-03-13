import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_SERVICE } from "../../helpers/slice.name";

export const serviceSlice = createSlice({
  name: CUSTOMER_SERVICE,
  initialState: {
    serviceListLoading: false,
    serviceList: [],
    serviceListMessage: "",
    serviceListError: "",

    serviceOneLoading: false,
    serviceOne: {},
    serviceOneMessage: "",
    serviceOneError: "",

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
    serviceListReset: (state, action) => {
      state.serviceListLoading = false;
      state.serviceList = [];
      state.serviceListMessage = "";
      state.serviceListError = "";
    },

    serviceOneRequest: (state, action) => {
      state.serviceOneLoading = true;
      state.serviceOneMessage = "";
      state.serviceOneError = "";
    },
    serviceOneSuccess: (state, action) => {
      state.serviceOneLoading = false;
      state.serviceOne = action.payload.data;
      state.serviceOneMessage = action.payload.message;
    },
    serviceOneError: (state, action) => {
      state.serviceOneLoading = false;
      state.serviceOneError = action.payload.message;
    },
    serviceOneReset: (state, action) => {
      state.serviceOneLoading = false;
      state.serviceOne = {};
      state.serviceOneMessage = "";
      state.serviceOneError = "";
    },

    addServiceRequest: (state) => {
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
  },
});

export const {
  serviceListRequest,
  serviceListSuccess,
  serviceListError,
  serviceListReset,

  serviceOneRequest,
  serviceOneSuccess,
  serviceOneError,
  serviceOneReset,

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
  downloadServiceChallanReset

} = serviceSlice.actions;

export default serviceSlice.reducer;