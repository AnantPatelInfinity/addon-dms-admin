import { createSlice } from "@reduxjs/toolkit";
import { PRODUCT_MODEL } from "../helpers/slice.name";

export const productModelSlice = createSlice({
    name: PRODUCT_MODEL,
    initialState: {

        productModelLoading: false,
        productModels: [],
        productModelsMessage: "",
        productModelsError: "",

        addProModelLoading: false,
        addProModel: {},
        addProModelMessage: "",
        addProModelError: "",

        editProModelLoading: false,
        editProModel: {},
        editProModelMessage: "",
        editProModelError: "",

        deleteProModelLoading: false,
        deleteProModel: {},
        deleteProModelMessage: "",
        deleteProModelError: "",
    },
    reducers: {
        proModelListRequest: (state, action) => {
            state.productModelLoading = true;
            state.productModelsMessage = "";
            state.productModelsError = "";
        },
        proModelListSuccess: (state, action) => {
            state.productModelLoading = false;
            state.productModels = action.payload.data;
            state.productModelsMessage = action.payload.message;
        },
        proModelListError: (state, action) => {
            state.productModelLoading = false;
            state.productModels = action.payload.data;
            state.productModelsError = action.payload.message;
        },

        addProModelRequest: (state, action) => {
            state.addProModelLoading = true;
            state.addProModelMessage = "";
            state.addProModelError = "";
        },
        addProModelSuccess: (state, action) => {
            state.addProModelLoading = false;
            state.addProModel = action.payload.data;
            state.addProModelMessage = action.payload.message;
        },
        addProModelError: (state, action) => {
            state.addProModelLoading = false;
            state.addProModelError = action.payload;
        },

        editProModelRequest: (state, action) => {
            state.editProModelLoading = true;
            state.editProModelMessage = "";
            state.editProModelError = "";
        },
        editProModelSuccess: (state, action) => {
            state.editProModelLoading = false;
            state.editProModel = action.payload.data;
            state.editProModelMessage = action.payload.message;
        },
        editProModelError: (state, action) => {
            state.editProModelLoading = false;
            state.editProModelError = action.payload;
        },


        deleteProModelRequest: (state, action) => {
            state.deleteProModelLoading = true;
            state.deleteProModelMessage = "";
            state.deleteProModelError = "";
        },
        deleteProModelSuccess: (state, action) => {
            state.deleteProModelLoading = false;
            state.deleteProModel = action.payload.data;
            state.deleteProModelMessage = action.payload.message;
        },
        deleteProModelError: (state, action) => {
            state.deleteProModelLoading = false;
            state.deleteProModelError = action.payload;
        },
    }
});

export const {
    proModelListRequest,
    proModelListSuccess,
    proModelListError,

    addProModelRequest,
    addProModelSuccess,
    addProModelError,

    editProModelRequest,
    editProModelSuccess,
    editProModelError,

    deleteProModelRequest,
    deleteProModelSuccess,
    deleteProModelError
} = productModelSlice.actions;


export default productModelSlice.reducer;
