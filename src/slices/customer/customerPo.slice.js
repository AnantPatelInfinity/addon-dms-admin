import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_PO } from "../../helpers/slice.name";

export const customerPoSlice = createSlice({
  name: CUSTOMER_PO,
  initialState: {
    cuPoListLoading: false,
    cuPoList: [],
    cuPoListMessage: "",
    cuPoListError: "",

    cuOnePoListLoading: false,
    cuOnePoList: {},
    cuOnePoListMessage: "",
    cuOnePoListError: "",

    cuPoDownloadLoading: false,
    cuPoDownload: {},
    cuPoDownloadMessage: "",
    cuPoDownloadError: "",
  },
  reducers: {
    customerPoListRequest: (state) => {
      state.cuPoListLoading = true;
      state.cuPoListMessage = "";
      state.cuPoListError = "";
    },
    customerPoListSuccess: (state, action) => {
      state.cuPoListLoading = false;
      state.cuPoList = action.payload.data;
      state.cuPoListMessage = action.payload.message;
    },
    customerPoListError: (state, action) => {
      state.cuPoListLoading = false;
      state.cuPoListError = action.payload.message;
    },

    customerOnePoListRequest: (state) => {
      state.cuOnePoListLoading = true;
      state.cuOnePoListMessage = "";
      state.cuOnePoListError = "";
    },
    customerOnePoListSuccess: (state, action) => {
      state.cuOnePoListLoading = false;
      state.cuOnePoList = action.payload.data;
      state.cuOnePoListMessage = action.payload.message;
    },
    customerOnePoListError: (state, action) => {
      state.cuOnePoListLoading = false;
      state.cuOnePoListError = action.payload.message;
    },

    customerPoDownloadRequest: (state) => {
      state.cuPoDownloadLoading = true;
      state.cuPoDownloadMessage = "";
      state.cuPoDownloadError = "";
    },
    customerPoDownloadSuccess: (state, action) => {
      state.cuPoDownloadLoading = false;
      state.cuPoDownload = action.payload.data;
      state.cuPoDownloadMessage = action.payload.message;
    },
    customerPoDownloadError: (state, action) => {
      state.cuPoDownloadLoading = false;
      state.cuPoDownloadError = action.payload.message;
    },
    customerPoDownloadReset: (state) => {
      state.cuPoDownloadLoading = false;
      state.cuPoDownload = {};
      state.cuPoDownloadMessage = "";
      state.cuPoDownloadError = "";
    },
  },
});

export const {
  customerPoListRequest,
  customerPoListSuccess,
  customerPoListError,

  customerOnePoListRequest,
  customerOnePoListSuccess,
  customerOnePoListError,

  customerPoDownloadRequest,
  customerPoDownloadSuccess,
  customerPoDownloadError,
  customerPoDownloadReset,
} = customerPoSlice.actions;

export default customerPoSlice.reducer;
