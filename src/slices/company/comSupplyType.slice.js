import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_SUPPLY_TYPE } from "../../helpers/slice.name";


export const comSupplyTypeSlice = createSlice({
    name: COMPANY_SUPPLY_TYPE,
    initialState: {
        comSupplyTypeListLoading: false,
        comSupplyTypeList: [],
        comSupplyTypeListMessage: "",
        comSupplyTypeListError: "",

        comAddSupplyTypeLoading: false,
        comAddSupplyType: {},
        comAddSupplyTypeMessage: "",
        comAddSupplyTypeError: "",

        comUpdateSupplyTypeLoading: false,
        comUpdateSupplyType: {},
        comUpdateSupplyTypeMessage: "",
        comUpdateSupplyTypeError: "",

        comDeleteSupplyTypeLoading: false,
        comDeleteSupplyType: {},
        comDeleteSupplyTypeMessage: "",
        comDeleteSupplyTypeError: "",
    },
    reducers: {
        comSupplyTypeListRequest: (state) => {
            state.comSupplyTypeListLoading = true;
            state.comSupplyTypeListMessage = "";
            state.comSupplyTypeListError = "";
        },
        comSupplyTypeListSuccess: (state, action) => {
            state.comSupplyTypeListLoading = false;
            state.comSupplyTypeList = action.payload.data;
            state.comSupplyTypeListMessage = action.payload.message;
        },
        comSupplyTypeListError: (state, action) => {
            state.comSupplyTypeListLoading = false;
            state.comSupplyTypeListError = action.payload.message;
        },

        comAddSupplyTypeRequest: (state) => {
            state.comAddSupplyTypeLoading = true;
            state.comAddSupplyTypeMessage = "";
            state.comAddSupplyTypeError = "";
        },
        comAddSupplyTypeSuccess: (state, action) => {
            state.comAddSupplyTypeLoading = false;
            state.comAddSupplyType = action.payload.data;
            state.comAddSupplyTypeMessage = action.payload.message;
        },
        comAddSupplyTypeError: (state, action) => {
            state.comAddSupplyTypeLoading = false;
            state.comAddSupplyTypeError = action.payload.message;
        },
        comAddSupplyTypeReset: (state) => {
            state.comAddSupplyTypeLoading = false;
            state.comAddSupplyType = {};
            state.comAddSupplyTypeMessage = "";
            state.comAddSupplyTypeError = "";
        },

        comUpdateSupplyTypeRequest: (state) => {
            state.comUpdateSupplyTypeLoading = true;
            state.comUpdateSupplyTypeMessage = "";
            state.comUpdateSupplyTypeError = "";
        },
        comUpdateSupplyTypeSuccess: (state, action) => {
            state.comUpdateSupplyTypeLoading = false;
            state.comUpdateSupplyType = action.payload.data;
            state.comUpdateSupplyTypeMessage = action.payload.message;
        },
        comUpdateSupplyTypeError: (state, action) => {
            state.comUpdateSupplyTypeLoading = false;
            state.comUpdateSupplyTypeError = action.payload.message;
        },
        comUpdateSupplyTypeReset: (state) => {
            state.comUpdateSupplyTypeLoading = false;
            state.comUpdateSupplyType = {};
            state.comUpdateSupplyTypeMessage = "";
            state.comUpdateSupplyTypeError = "";
        },

        comDeleteSupplyTypeRequest: (state) => {
            state.comDeleteSupplyTypeLoading = true;
            state.comDeleteSupplyTypeMessage = "";
            state.comDeleteSupplyTypeError = "";
        },
        comDeleteSupplyTypeSuccess: (state, action) => {
            state.comDeleteSupplyTypeLoading = false;
            state.comDeleteSupplyType = action.payload.data;
            state.comDeleteSupplyTypeMessage = action.payload.message;
        },
        comDeleteSupplyTypeError: (state, action) => {
            state.comDeleteSupplyTypeLoading = false;
            state.comDeleteSupplyTypeError = action.payload.message;
        },
        comDeleteSupplyTypeReset: (state) => {
            state.comDeleteSupplyTypeLoading = false;
            state.comDeleteSupplyType = {};
            state.comDeleteSupplyTypeMessage = "";
            state.comDeleteSupplyTypeError = "";
        },
    }
});

export const {
    comSupplyTypeListRequest,
    comSupplyTypeListSuccess,
    comSupplyTypeListError,

    comAddSupplyTypeRequest,
    comAddSupplyTypeSuccess,
    comAddSupplyTypeError,
    comAddSupplyTypeReset,

    comUpdateSupplyTypeRequest,
    comUpdateSupplyTypeSuccess,
    comUpdateSupplyTypeError,
    comUpdateSupplyTypeReset,

    comDeleteSupplyTypeRequest,
    comDeleteSupplyTypeSuccess,
    comDeleteSupplyTypeError,
    comDeleteSupplyTypeReset,
    
} = comSupplyTypeSlice.actions;


export default comSupplyTypeSlice.reducer;