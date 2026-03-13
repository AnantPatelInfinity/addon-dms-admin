import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_CUSTOMER } from "../../helpers/slice.name";

export const comCustomerSlice = createSlice({
    name: COMPANY_CUSTOMER,
    initialState: {
        customerListLoading: false,
        customerList: [],
        customerListMessage: "",
        customerListError: "",
    },
    reducers: {
        customerListRequest: (state) => {
            state.customerListLoading = true;
            state.customerListMessage = "";
            state.customerListError = "";
        },
        customerListSuccess: (state, action) => {
            state.customerListLoading = false;
            state.customerList = action.payload.data;
            state.customerListMessage = action.payload.message;
        },
        customerListError: (state, action) => {
            state.customerListLoading = false;
            state.customerListError = action.payload.message;
        },
        customerListReset: (state) => {
            state.customerListLoading = false;
            state.customerList = [];
            state.customerListMessage = "";
            state.customerListError = "";
        },
    }
});

export const {
    customerListRequest,
    customerListSuccess,
    customerListError,
    customerListReset,
} = comCustomerSlice.actions;

export default comCustomerSlice.reducer;