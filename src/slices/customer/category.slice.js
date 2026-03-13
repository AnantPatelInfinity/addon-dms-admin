import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_PRODUCT_CATEGORY } from "../../helpers/slice.name";

export const customerCategorySlice = createSlice({
    name: CUSTOMER_PRODUCT_CATEGORY,
    initialState: {
        loading: false,

        categoryListLoading: false,
        categoryList: [],
        categoryListMessage: "",
        categoryListError: "",
    },
    reducers: {
        categoryListRequest: (state) => {
            state.categoryListLoading = true;
            state.categoryListMessage = "";
            state.categoryListError = "";
        },
        categoryListSuccess: (state, action) => {
            state.categoryListLoading = false;
            state.categoryList = action.payload.data;
            state.categoryListMessage = action.payload.message;
        },
        categoryListError: (state, action) => {
            state.categoryListLoading = false;
            state.categoryListError = action.payload.message;
        },
    }
});

export const {
    categoryListRequest,
    categoryListSuccess,
    categoryListError
} = customerCategorySlice.actions;

export default customerCategorySlice.reducer;
