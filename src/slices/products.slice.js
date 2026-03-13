import { createSlice } from "@reduxjs/toolkit";
import { PRODUCTS } from "../helpers/slice.name";

export const productSlice = createSlice({
    name: PRODUCTS,
    initialState: {
        loading: false,

        productListLoading: false,
        productsList: [],
        productListMessage: "",
        productListError: "",

        productDetailsLoading: false,
        productDetails: {},
        productDetailsMessage: "",
        productDetailsError: "",

        productDropdownLoading: false,
        productDropdown: [],
        productDropdownMessage: "",
        productDropdownError: "",
    },
    reducers: {
        productListRequest: (state, action) => {
            state.productListLoading = true;
            state.productListMessage = "";
            state.productListError = "";
        },
        productListSuccess: (state, action) => {
            state.productListLoading = false;
            state.productsList = action.payload.data;
            state.productListMessage = action.payload.message;
        },
        productListError: (state, action) => {
            state.productListLoading = false;
            state.productsList = action.payload.data;
            state.productListError = action.payload.message;
        },

        productDetailsRequest: (state) => {
            state.productDetailsLoading = true;
            state.productDetailsMessage = "";
            state.productDetailsError = "";
        },
        productDetailsSuccess: (state, action) => {
            state.productDetailsLoading = false;
            state.productDetails = action.payload.data;
            state.productDetailsMessage = action.payload.message;
        },
        productDetailsError: (state, action) => {
            state.productDetailsLoading = false;
            state.productDetailsError = action.payload;
        },


        productDropdownRequest: (state) => {
            state.productDropdownLoading = true;
            state.productDropdownMessage = "";
            state.productDropdownError = "";
        },
        productDropdownSuccess: (state, action) => {
            state.productDropdownLoading = false;
            state.productDropdown = action.payload.data;
            state.productDropdownMessage = action.payload.message;
        },
        productDropdownError: (state, action) => {
            state.productDropdownLoading = false;
            state.productDropdownError = action.payload;
        },
        productDropdownReset: (state) => {
            state.productDropdownLoading = false;
            state.productDropdown = [];
            state.productDropdownMessage = "";
            state.productDropdownError = "";
        }
    }
});

export const {
    productListRequest,
    productListSuccess,
    productListError,

    productDetailsRequest,
    productDetailsSuccess,
    productDetailsError,
    productDetailsReset,

    productDropdownRequest,
    productDropdownSuccess,
    productDropdownError,
    productDropdownReset
} = productSlice.actions;

export default productSlice.reducer;