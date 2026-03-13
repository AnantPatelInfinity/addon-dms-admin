import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_UNIT } from "../../helpers/slice.name";

export const comUnitSlice = createSlice({
    name: COMPANY_UNIT,
    initialState: {
        comUnitListLoading: false,
        comUnitList: [],
        comUnitListMessage: "",
        comUnitListError: "",

        comAddUnitLoading: false,
        comAddUnit: {},
        comAddUnitMessage: "",
        comAddUnitError: "",

        comUpdateUnitLoading: false,
        comUpdateUnit: {},
        comUpdateUnitMessage: "",
        comUpdateUnitError: "",

        comDeleteUnitLoading: false,
        comDeleteUnit: {},
        comDeleteUnitMessage: "",
        comDeleteUnitError: "",
    },
    reducers: {
        comUnitListRequest: (state) => {
            state.comUnitListLoading = true;
            state.comUnitListMessage = "";
            state.comUnitListError = "";
        },
        comUnitListSuccess: (state, action) => {
            state.comUnitListLoading = false;
            state.comUnitList = action.payload.data;
            state.comUnitListMessage = action.payload.message;
        },
        comUnitListError: (state, action) => {
            state.comUnitListLoading = false;
            state.comUnitListError = action.payload.message;
        },

        comAddUnitRequest: (state) => {
            state.comAddUnitLoading = true;
            state.comAddUnitMessage = "";
            state.comAddUnitError = "";
        },
        comAddUnitSuccess: (state, action) => {
            state.comAddUnitLoading = false;
            state.comAddUnit = action.payload.data;
            state.comAddUnitMessage = action.payload.message;
        },
        comAddUnitError: (state, action) => {
            state.comAddUnitLoading = false;
            state.comAddUnitError = action.payload.message;
        },
        comAddUnitReset: (state) => {
            state.comAddUnitLoading = false;
            state.comAddUnit = {};
            state.comAddUnitMessage = "";
            state.comAddUnitError = "";
        },

        comUpdateUnitRequest: (state) => {
            state.comUpdateUnitLoading = true;
            state.comUpdateUnitMessage = "";
            state.comUpdateUnitError = "";
        },
        comUpdateUnitSuccess: (state, action) => {
            state.comUpdateUnitLoading = false;
            state.comUpdateUnit = action.payload.data;
            state.comUpdateUnitMessage = action.payload.message;
        },
        comUpdateUnitError: (state, action) => {
            state.comUpdateUnitLoading = false;
            state.comUpdateUnitError = action.payload.message;
        },
        comUpdateUnitReset: (state) => {
            state.comUpdateUnitLoading = false;
            state.comUpdateUnit = {};
            state.comUpdateUnitMessage = "";
            state.comUpdateUnitError = "";
        },

        comDeleteUnitRequest: (state) => {
            state.comDeleteUnitLoading = true;
            state.comDeleteUnitMessage = "";
            state.comDeleteUnitError = "";
        },
        comDeleteUnitSuccess: (state, action) => {
            state.comDeleteUnitLoading = false;
            state.comDeleteUnit = action.payload.data;
            state.comDeleteUnitMessage = action.payload.message;
        },
        comDeleteUnitError: (state, action) => {
            state.comDeleteUnitLoading = false;
            state.comDeleteUnitError = action.payload.message;
        },
        comDeleteUnitReset: (state) => {
            state.comDeleteUnitLoading = false;
            state.comDeleteUnit = {};
            state.comDeleteUnitMessage = "";
            state.comDeleteUnitError = "";
        }
    }
});

export const {
    comUnitListRequest,
    comUnitListSuccess,
    comUnitListError,

    comAddUnitRequest,
    comAddUnitSuccess,
    comAddUnitError,
    comAddUnitReset,

    comUpdateUnitRequest,
    comUpdateUnitSuccess,
    comUpdateUnitError,
    comUpdateUnitReset,

    comDeleteUnitRequest,
    comDeleteUnitSuccess,
    comDeleteUnitError,
    comDeleteUnitReset

} = comUnitSlice.actions;

export default comUnitSlice.reducer;