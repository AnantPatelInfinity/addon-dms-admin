import { createSlice } from "@reduxjs/toolkit";
import {CUSTOMER_PRODUCT} from "../../helpers/slice.name"

export const customerProductSlice = createSlice({
    name: CUSTOMER_PRODUCT,
    initialState: {
        loading: false,

        cuProductListLoading: false,
        cuProductsList: [],
        cuProductListMessage: "",
        cuProductListError: "",

        cuProductDetailsLoading: false,
        cuProductDetails: {},
        cuProductDetailsMessage: "",
        cuProductDetailsError: "",
    },
    reducers: {
        cuProductListRequest: (state) => {
            state.cuProductListLoading = true;
            state.cuProductListMessage = "";
            state.cuProductListError = "";
        },
        cuProductListSuccess: (state, action) => {
            state.cuProductListLoading = false;
            state.cuProductsList = action.payload.data;
            state.cuProductListMessage = action.payload.message;
        },
        cuProductListError: (state, action) => {
            state.cuProductListLoading = false;
            state.cuProductsList = action.payload.data;
            state.cuProductListError = action.payload.message;
        },

        cuProductDetailsRequest: (state) => {
            state.cuProductDetailsLoading = true;
            state.cuProductDetailsMessage = "";
            state.cuProductDetailsError = "";
        },
        cuProductDetailsSuccess: (state, action) => {
            state.cuProductDetailsLoading = false;
            state.cuProductDetails = action.payload.data;
            state.cuProductDetailsMessage = action.payload.message;
        },
        cuProductDetailsError: (state, action) => {
            state.cuProductDetailsLoading = false;
            state.cuProductDetailsError = action.payload;
        },

    }
});

export const {
    cuProductListRequest,
    cuProductListSuccess,
    cuProductListError,

    cuProductDetailsRequest,
    cuProductDetailsSuccess,
    cuProductDetailsError,
} = customerProductSlice.actions;

export default customerProductSlice.reducer;