import { createSlice } from "@reduxjs/toolkit";
import { DE_CHECKOUT } from "../helpers/slice.name";

export const dealerCheckoutSlice = createSlice({
    name: DE_CHECKOUT,
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
} = dealerCheckoutSlice.actions;


export default dealerCheckoutSlice.reducer;