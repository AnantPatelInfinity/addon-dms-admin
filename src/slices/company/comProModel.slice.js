import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_PRO_MODEL } from "../../helpers/slice.name";

export const comProModelSlice = createSlice({
    name: COMPANY_PRO_MODEL,
    initialState: {
        comProModelListLoading: false,
        comProModelList: [],
        comProModelListMessage: "",
        comProModelListError: "",

        comProModelAddLoading: false,
        comProModelAdd: {},
        comProModelAddMessage: "",
        comProModelAddError: "",

        comProModelUpdateLoading: false,
        comProModelUpdate: {},
        comProModelUpdateMessage: "",
        comProModelUpdateError: "",

        comProModelDeleteLoading: false,
        comProModelDelete: {},
        comProModelDeleteMessage: "",
        comProModelDeleteError: "",
    },
    reducers: {
        comProModelListRequest: (state) => {
            state.comProModelListLoading = true;
            state.comProModelListMessage = "";
            state.comProModelListError = "";
        },
        comProModelListSuccess: (state, action) => {
            state.comProModelListLoading = false;
            state.comProModelList = action.payload.data;
            state.comProModelListMessage = action.payload.message;
        },
        comProModelListError: (state, action) => {
            state.comProModelListLoading = false;
            state.comProModelListError = action.payload.message;
        },

        comAddProModelRequest: (state) => {
            state.comProModelAddLoading = true;
            state.comProModelAddMessage = "";
            state.comProModelAddError = "";
        },
        comAddProModelSuccess: (state, action) => {
            state.comProModelAddLoading = false;
            state.comProModelAdd = action.payload.data;
            state.comProModelAddMessage = action.payload.message;
        },
        comAddProModelError: (state, action) => {
            state.comProModelAddLoading = false;
            state.comProModelAddError = action.payload.message;
        },
        comAddProModelReset: (state) => {
            state.comProModelAddLoading = false;
            state.comProModelAdd = {};
            state.comProModelAddMessage = "";
            state.comProModelAddError = "";
        },

        comUpdateProModelRequest: (state) => {
            state.comProModelUpdateLoading = true;
            state.comProModelUpdateMessage = "";
            state.comProModelUpdateError = "";
        },
        comUpdateProModelSuccess: (state, action) => {
            state.comProModelUpdateLoading = false;
            state.comProModelUpdate = action.payload.data;
            state.comProModelUpdateMessage = action.payload.message;
        },
        comUpdateProModelError: (state, action) => {
            state.comProModelUpdateLoading = false;
            state.comProModelUpdateError = action.payload.message;
        },
        comUpdateProModelReset: (state) => {
            state.comProModelUpdateLoading = false;
            state.comProModelUpdate = {};
            state.comProModelUpdateMessage = "";
            state.comProModelUpdateError = "";
        },

        comDeleteProModelRequest: (state) => {
            state.comProModelDeleteLoading = true;
            state.comProModelDeleteMessage = "";
            state.comProModelDeleteError = "";
        },
        comDeleteProModelSuccess: (state, action) => {
            state.comProModelDeleteLoading = false;
            state.comProModelDelete = action.payload.data;
            state.comProModelDeleteMessage = action.payload.message;
        },
        comDeleteProModelError: (state, action) => {
            state.comProModelDeleteLoading = false;
            state.comProModelDeleteError = action.payload.message;
        },
        comDeleteProModelReset: (state) => {
            state.comProModelDeleteLoading = false;
            state.comProModelDelete = {};
            state.comProModelDeleteMessage = "";
            state.comProModelDeleteError = "";
        }
    }
});


export const {
    comProModelListRequest,
    comProModelListSuccess,
    comProModelListError,

    comAddProModelRequest,
    comAddProModelSuccess,
    comAddProModelError,
    comAddProModelReset,

    comUpdateProModelRequest,
    comUpdateProModelSuccess,
    comUpdateProModelError,
    comUpdateProModelReset,

    comDeleteProModelRequest,
    comDeleteProModelSuccess,
    comDeleteProModelError,
    comDeleteProModelReset

} = comProModelSlice.actions;

export default comProModelSlice.reducer;