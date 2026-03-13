import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_CHECKOUT } from "../../helpers/slice.name";

export const customerCheckoutSlice = createSlice({
    name: CUSTOMER_CHECKOUT,
    initialState: {
        addCheckoutLoading: false,
        addCheckout: {},
        addCheckoutMessage: "",
        addCheckoutError: "",
    },
    reducers: {
        addCheckoutRequest: (state) => {
            state.addCheckoutLoading = true;
            state.addCheckoutMessage = "";
            state.addCheckoutError = "";
        },
        addCheckoutSuccess: (state, action) => {
            state.addCheckoutLoading = false;
            state.addCheckout = action.payload.data;
            state.addCheckoutMessage = action.payload.message;
        },
        addCheckoutError: (state, action) => {
            state.addCheckoutLoading = false;
            state.addCheckoutError = action.payload.message;
        },
        addCheckoutReset: (state) => {
            state.addCheckout = {};
            state.addCheckoutMessage = "";
            state.addCheckoutError = "";
        },

        
    },
});

export const {
    addCheckoutRequest,
    addCheckoutSuccess,
    addCheckoutError,
    addCheckoutReset,
} = customerCheckoutSlice.actions;


export default customerCheckoutSlice.reducer;