import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_PRODUCT } from "../../helpers/slice.name";

export const comProductSlice = createSlice({
    name: COMPANY_PRODUCT,
    initialState: {
        comProductListLoading: false,
        comProductList: [],
        comProductListMessage: "",
        comProductListError: "",

        comOneProductLoading: false,
        comOneProduct: {},
        comOneProductMessage: "",
        comOneProductError: "",

        comProductAddLoading: false,
        comProductAdd: {},
        comProductAddMessage: "",
        comProductAddError: "",

        comProductUpdateLoading: false,
        comProductUpdate: {},
        comProductUpdateMessage: "",
        comProductUpdateError: "",

        comProductDeleteLoading: false,
        comProductDelete: {},
        comProductDeleteMessage: "",
        comProductDeleteError: "",
    },
    reducers: {
        comProductListRequest: (state) => {
            state.comProductListLoading = true;
            state.comProductListMessage = "";
            state.comProductListError = ""
        },
        comProductListSuccess: (state, action) => {
            state.comProductListLoading = false;
            state.comProductList = action.payload.data;
            state.comProductListMessage = action.payload.message;
        },
        comProductListError: (state, action) => {
            state.comProductListLoading = false;
            state.comProductListError = action.payload.message
        },

        comOneProductRequest: (state) => {
            state.comOneProductLoading = true;
            state.comOneProductMessage = "";
            state.comOneProductError = ""
        },
        comOneProductSuccess: (state, action) => {
            state.comOneProductLoading = false;
            state.comOneProduct = action.payload.data;
            state.comOneProductMessage = action.payload.message;
        },
        comOneProductError: (state, action) => {
            state.comOneProductLoading = false;
            state.comOneProductError = action.payload.message
        },

        comAddProductRequest: (state) => {
            state.comProductAddLoading = true;
            state.comProductAddMessage = "";
            state.comProductAddError = "";
        },
        comAddProductSuccess: (state, action) => {
            state.comProductAddLoading = false;
            state.comProductAdd = action.payload.data;
            state.comProductAddMessage = action.payload.message;
        },
        comAddProductError: (state, action) => {
            state.comProductAddLoading = false;
            state.comProductAddError = action.payload.message
        },
        comResetAddProduct: (state) => {
            state.comProductAddLoading = false;
            state.comProductAdd = {};
            state.comProductAddMessage = "";
            state.comProductAddError = "";
        },

        comUpdateProductRequest: (state) => {
            state.comProductUpdateLoading = true;
            state.comProductUpdateMessage = "";
            state.comProductUpdateError = "";
        },
        comUpdateProductSuccess: (state, action) => {
            state.comProductUpdateLoading = false;
            state.comProductUpdate = action.payload.data;
            state.comProductUpdateMessage = action.payload.message;
        },
        comUpdateProductError: (state, action) => {
            state.comProductUpdateLoading = false;
            state.comProductUpdateError = action.payload.message
        },
        comResetUpdateProduct: (state) => {
            state.comProductUpdateLoading = false;
            state.comProductUpdate = {};
            state.comProductUpdateMessage = "";
            state.comProductUpdateError = "";
        },

        comDeleteProductRequest: (state) => {
            state.comProductDeleteLoading = true;
            state.comProductDeleteMessage = "";
            state.comProductDeleteError = "";
        },
        comDeleteProductSuccess: (state, action) => {
            state.comProductDeleteLoading = false;
            state.comProductDelete = action.payload.data;
            state.comProductDeleteMessage = action.payload.message;
        },
        comDeleteProductError: (state, action) => {
            state.comProductDeleteLoading = false;
            state.comProductDeleteError = action.payload.message
        },
        comResetDeleteProduct: (state) => {
            state.comProductDeleteLoading = false;
            state.comProductDelete = {};
            state.comProductDeleteMessage = "";
            state.comProductDeleteError = "";
        },
    }
})

export const {
    comProductListRequest,
    comProductListSuccess,
    comProductListError,

    comOneProductRequest,
    comOneProductSuccess,
    comOneProductError,

    comAddProductRequest,
    comAddProductSuccess,
    comAddProductError,
    comResetAddProduct,

    comUpdateProductRequest,
    comUpdateProductSuccess,
    comUpdateProductError,
    comResetUpdateProduct,

    comDeleteProductRequest,
    comDeleteProductSuccess,
    comDeleteProductError,
    comResetDeleteProduct
} = comProductSlice.actions;

export default comProductSlice.reducer;