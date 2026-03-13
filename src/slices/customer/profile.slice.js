import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_PROFILE } from "../../helpers/slice.name";

export const customerProfileSlice = createSlice({
  name: CUSTOMER_PROFILE,
  initialState: {
    customerProfileLoading: false,
    customerProfile: {},
    customerProfileMessage: "",
    customerProfileError: "",

    customerProfileUpdateLoading: false,
    customerProfileUpdateMessage: "",
    customerProfileUpdateError: "",
  },
  reducers: {
    customerProfileRequest: (state) => {
      state.customerProfileLoading = true;
      state.customerProfileMessage = "";
      state.customerProfileError = "";
    },
    customerProfileSuccess: (state, action) => {
      state.customerProfileLoading = false;
      state.customerProfile = action.payload.data;
      state.customerProfileMessage = action.payload.message;
    },
    customerProfileError: (state, action) => {
      state.customerProfileLoading = false;
      state.customerProfileError = action.payload.message;
    },
    customerProfileReset: (state) => {
        state.customerProfileLoading = false;
        state.customerProfile = {}
        state.customerProfileMessage = ""
        state.customerProfileError = ""
    },

    customerProfileUpdateRequest: (state) => {
      state.customerProfileUpdateLoading = true;
      state.customerProfileUpdateMessage = "";
      state.customerProfileUpdateError = "";
    },
    customerProfileUpdateSuccess: (state, action) => {
      state.customerProfileUpdateLoading = false;
      state.customerProfileUpdateMessage = action.payload.message;
    },
    customerProfileUpdateError: (state, action) => {
      state.customerProfileUpdateLoading = false;
      state.customerProfileUpdateError = action.payload.message;
    },
    customerProfileUpdateReset: (state) => {
      state.customerProfileUpdateLoading = false;
      state.customerProfileUpdateMessage = "";
      state.customerProfileUpdateError = "";
    },
  },
});

export const {
  customerProfileRequest,
  customerProfileSuccess,
  customerProfileError,
  customerProfileReset,

  customerProfileUpdateRequest,
  customerProfileUpdateSuccess,
  customerProfileUpdateError,
  customerProfileUpdateReset,
} = customerProfileSlice.actions;

export default customerProfileSlice.reducer;