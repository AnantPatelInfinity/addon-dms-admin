import { createSlice } from "@reduxjs/toolkit";
import { COMPANY } from "../helpers/slice.name";


export const companySlice = createSlice({
    name: COMPANY,
    initialState: {
        loading: false,

        companyListLoading: false,
        companyList: [],
        companyListMessage: "",
        companyListError: "",

        companyOneLoading: false,
        companyOne: {},
        companyOneMessage: "",
        companyOneError: "",
    },
    reducers: {
        companyListRequest: (state) => {
            state.companyListLoading = true;
            state.companyListMessage = "";
            state.companyListError = "";
        },
        companyListSuccess: (state, action) => {
            state.companyListLoading = false;
            state.companyList = action.payload.data;
            state.companyListMessage = action.payload.message;
        },
        companyListError: (state, action) => {
            state.companyListLoading = false;
            state.companyListError = action.payload.message;
        },

        companyOneRequest: (state) => {
            state.companyOneLoading = true;
            state.companyOneMessage = "";
            state.companyOneError = "";
        },
        companyOneSuccess: (state, action) => {
            state.companyOneLoading = false;
            state.companyOne = action.payload.data;
            state.companyOneMessage = action.payload.message;

        },
        companyOneError: (state, action) => {
            state.companyOneLoading = false;
            state.companyOneError = action.payload.message;
        }

    }
});

export const {
    companyListRequest,
    companyListSuccess,
    companyListError,

    companyOneRequest,
    companyOneSuccess,
    companyOneError
} = companySlice.actions;

export default companySlice.reducer;
