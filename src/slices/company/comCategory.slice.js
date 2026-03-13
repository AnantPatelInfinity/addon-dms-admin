import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_CATEGORY } from "../../helpers/slice.name";


export const comCategorySlice = createSlice({
    name: COMPANY_CATEGORY,
    initialState: {
        comCategoryListLoading: false,
        comCategoryList: [],
        comCategoryListMessage: "",
        comCategoryListError: "",

        comAddCategoryLoading: false,
        comAddCategory: {},
        comAddCategoryMessage: "",
        comAddCategoryError: "",

        comUpdateCategoryLoading: false,
        comUpdateCategory: {},
        comUpdateCategoryMessage: "",
        comUpdateCategoryError: "",

        comDeleteCategoryLoading: false,
        comDeleteCategory: {},
        comDeleteCategoryMessage: "",
        comDeleteCategoryError: "",
    },
    reducers: {
        comCategoryListRequest: (state) => {
            state.comCategoryListLoading = true;
            state.comCategoryListMessage = "";
            state.comCategoryListError = "";
        },
        comCategoryListSuccess: (state, action) => {
            state.comCategoryListLoading = false;
            state.comCategoryList = action.payload.data;
            state.comCategoryListMessage = action.payload.message;
        },
        comCategoryListError: (state, action) => {
            state.comCategoryListLoading = false;
            state.comCategoryListError = action.payload.message;
        },
        comCategoryListReset: (state) => {
            state.comCategoryListLoading = false;
            state.comCategoryList = [];
            state.comCategoryListMessage = "";
            state.comCategoryListError = "";
        },

        comAddCategoryRequest: (state) => {
            state.comAddCategoryLoading = true;
            state.comAddCategoryMessage = "";
            state.comAddCategoryError = "";
        },
        comAddCategorySuccess: (state, action) => {
            state.comAddCategoryLoading = false;
            state.comAddCategory = action.payload.data;
            state.comAddCategoryMessage = action.payload.message;
        },
        comAddCategoryError: (state, action) => {
            state.comAddCategoryLoading = false;
            state.comAddCategoryError = action.payload.message;
        },
        comAddCategoryReset: (state) => {
            state.comAddCategoryLoading = false;
            state.comAddCategory = {};
            state.comAddCategoryMessage = "";
            state.comAddCategoryError = "";
        },

        comUpdateCategoryRequest: (state) => {
            state.comUpdateCategoryLoading = true;
            state.comUpdateCategoryMessage = "";
            state.comUpdateCategoryError = "";
        },
        comUpdateCategorySuccess: (state, action) => {
            state.comUpdateCategoryLoading = false;
            state.comUpdateCategory = action.payload.data;
            state.comUpdateCategoryMessage = action.payload.message;
        },
        comUpdateCategoryError: (state, action) => {
            state.comUpdateCategoryLoading = false;
            state.comUpdateCategoryError = action.payload.message;
        },
        comUpdateCategoryReset: (state) => {
            state.comUpdateCategoryLoading = false;
            state.comUpdateCategory = {};
            state.comUpdateCategoryMessage = "";
            state.comUpdateCategoryError = "";
        },

        comDeleteCategoryRequest: (state) => {
            state.comDeleteCategoryLoading = true;
            state.comDeleteCategoryMessage = "";
            state.comDeleteCategoryError = "";
        },
        comDeleteCategorySuccess: (state, action) => {
            state.comDeleteCategoryLoading = false;
            state.comDeleteCategory = action.payload.data;
            state.comDeleteCategoryMessage = action.payload.message;
        },
        comDeleteCategoryError: (state, action) => {
            state.comDeleteCategoryLoading = false;
            state.comDeleteCategoryError = action.payload.message;
        },
        comDeleteCategoryReset: (state) => {
            state.comDeleteCategoryLoading = false;
            state.comDeleteCategory = {};
            state.comDeleteCategoryMessage = "";
            state.comDeleteCategoryError = "";
        },
    }
})

export const {

    comCategoryListRequest,
    comCategoryListSuccess,
    comCategoryListError,
    comCategoryListReset,

    comAddCategoryRequest,
    comAddCategorySuccess,
    comAddCategoryError,
    comAddCategoryReset,

    comUpdateCategoryRequest,
    comUpdateCategorySuccess,
    comUpdateCategoryError,
    comUpdateCategoryReset,

    comDeleteCategoryRequest,
    comDeleteCategorySuccess,
    comDeleteCategoryError,
    comDeleteCategoryReset

} = comCategorySlice.actions;

export default comCategorySlice.reducer;