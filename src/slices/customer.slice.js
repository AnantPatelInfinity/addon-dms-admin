import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER } from "../helpers/slice.name";


export const customerSlice = createSlice({
    name: CUSTOMER,
    initialState: {
        customerListLoading: false,
        customerList: [],
        customerListMessage: "",
        customerListError: "",

        addCustomerLoading: false,
        addCustomer: {},
        addCustomerMessage: "",
        addCustomerError: "",
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

        addCustomerRequest: (state) => {
            state.addCustomerLoading = true;
            state.addCustomerMessage = "";
            state.addCustomerError = "";
        },
        addCustomerSuccess: (state, action) => {
            state.addCustomerLoading = false;
            state.addCustomer = action.payload.data;
            state.addCustomerMessage = action.payload.message;
        },
        addCustomerError: (state, action) => {
            state.addCustomerLoading = false;
            state.addCustomerError = action.payload.message;
        },
        resetAddCustomer: (state) => {
            state.addCustomerLoading = false;
            state.addCustomer = {};
            state.addCustomerMessage = "";
            state.addCustomerError = "";
        }
    }
});

export const {
    customerListRequest,
    customerListSuccess,
    customerListError,

    addCustomerRequest,
    addCustomerSuccess,
    addCustomerError,
    resetAddCustomer
} = customerSlice.actions;

export default customerSlice.reducer;