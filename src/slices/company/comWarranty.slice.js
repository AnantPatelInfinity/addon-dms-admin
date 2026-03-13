import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_WARRANTY } from "../../helpers/slice.name";


export const comWarrantySlice = createSlice({
    name: COMAPNY_WARRANTY,
    initialState: {
        comWarrantyListLoading: false,
        comWarrantyList: [],
        comWarrantyListMessage: "",
        comWarrantyListError: "",

        comAddWarrantyLoading: false,
        comAddWarranty: {},
        comAddWarrantyMessage: "",
        comAddWarrantyError: "",

        comUpdateWarrantyLoading: false,
        comUpdateWarranty: {},
        comUpdateWarrantyMessage: "",
        comUpdateWarrantyError: "",

        comDeleteWarrantyLoading: false,
        comDeleteWarranty: {},
        comDeleteWarrantyMessage: "",
        comDeleteWarrantyError: "",
    },
    reducers: {
        comWarrantyListRequest: (state) => {
            state.comWarrantyListLoading = true;
            state.comWarrantyListMessage = "";
            state.comWarrantyListError = "";
        },
        comWarrantyListSuccess: (state, action) => {
            state.comWarrantyListLoading = false;
            state.comWarrantyList = action.payload.data;
            state.comWarrantyListMessage = action.payload.message;
        },
        comWarrantyListError: (state, action) => {
            state.comWarrantyListLoading = false;
            state.comWarrantyListError = action.payload.message;
        },

        comAddWarrantyRequest: (state) => {
            state.comAddWarrantyLoading = true;
            state.comAddWarrantyMessage = "";
            state.comAddWarrantyError = "";
        },
        comAddWarrantySuccess: (state, action) => {
            state.comAddWarrantyLoading = false;
            state.comAddWarranty = action.payload.data;
            state.comAddWarrantyMessage = action.payload.message;
        },
        comAddWarrantyError: (state, action) => {
            state.comAddWarrantyLoading = false;
            state.comAddWarrantyError = action.payload.message;
        },
        comAddWarrantyReset: (state) => {
            state.comAddWarrantyLoading = false;
            state.comAddWarranty = {};
            state.comAddWarrantyMessage = "";
            state.comAddWarrantyError = "";
        },

        comUpdateWarrantyRequest: (state) => {
            state.comUpdateWarrantyLoading = true;
            state.comUpdateWarrantyMessage = "";
            state.comUpdateWarrantyError = "";
        },
        comUpdateWarrantySuccess: (state, action) => {
            state.comUpdateWarrantyLoading = false;
            state.comUpdateWarranty = action.payload.data;
            state.comUpdateWarrantyMessage = action.payload.message;
        },
        comUpdateWarrantyError: (state, action) => {
            state.comUpdateWarrantyLoading = false;
            state.comUpdateWarrantyError = action.payload.message;
        },
        comUpdateWarrantyReset: (state) => {
            state.comUpdateWarrantyLoading = false;
            state.comUpdateWarranty = {};
            state.comUpdateWarrantyMessage = "";
            state.comUpdateWarrantyError = "";
        },

        comDeleteWarrantyRequest: (state) => {
            state.comDeleteWarrantyLoading = true;
            state.comDeleteWarrantyMessage = "";
            state.comDeleteWarrantyError = "";
        },
        comDeleteWarrantySuccess: (state, action) => {
            state.comDeleteWarrantyLoading = false;
            state.comDeleteWarranty = action.payload.data;
            state.comDeleteWarrantyMessage = action.payload.message;
        },
        comDeleteWarrantyError: (state, action) => {
            state.comDeleteWarrantyLoading = false;
            state.comDeleteWarrantyError = action.payload.message;
        },
        comDeleteWarrantyReset: (state) => {
            state.comDeleteWarrantyLoading = false;
            state.comDeleteWarranty = {};
            state.comDeleteWarrantyMessage = "";
            state.comDeleteWarrantyError = "";
        },
    }
});

export const {
    comWarrantyListRequest,
    comWarrantyListSuccess,
    comWarrantyListError,

    comAddWarrantyRequest,
    comAddWarrantySuccess,
    comAddWarrantyError,
    comAddWarrantyReset,

    comUpdateWarrantyRequest,
    comUpdateWarrantySuccess,
    comUpdateWarrantyError,
    comUpdateWarrantyReset,

    comDeleteWarrantyRequest,
    comDeleteWarrantySuccess,
    comDeleteWarrantyError,
    comDeleteWarrantyReset

} = comWarrantySlice.actions;


export default comWarrantySlice.reducer;