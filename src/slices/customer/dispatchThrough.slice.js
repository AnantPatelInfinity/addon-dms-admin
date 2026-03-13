import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_DIS_THROUGH } from "../../helpers/slice.name";

export const customerDispatchThroughSlice = createSlice({
    name: CUSTOMER_DIS_THROUGH,
    initialState: {
        dispatchThroughLoading: false,
        dispatchThrough: [],
        dispatchThroughMessage: "",
        dispatchThroughError: "",

        cuAddDispatchThroughLoading: false,
        cuAddDispatchThrough: {},
        cuAddDispatchThroughMessage: "",
        cuAddDispatchThroughError: "",

        cuEditDispatchThroughLoading: false,
        cuEditDispatchThrough: {},
        cuEditDispatchThroughMessage: "",
        cuEditDispatchThroughError: "",
    },
    reducers: {
        dispatchThroughRequest: (state) => {
            state.dispatchThroughLoading = true;
            state.dispatchThroughMessage = "";
            state.dispatchThroughError = "";
        },
        dispatchThroughSuccess: (state, action) => {
            state.dispatchThroughLoading = false;
            state.dispatchThrough = action.payload.data;
            state.dispatchThroughMessage = action.payload.message;
        },
        dispatchThroughError: (state, action) => {
            state.dispatchThroughLoading = false;
            state.dispatchThroughError = action.payload.message;
        },
        dispatchThroughReset: (state) => {
            state.dispatchThrough = [];
            state.dispatchThroughMessage = "";
            state.dispatchThroughError = "";
        },

        cuAddDispatchThroughRequest: (state) => {
            state.cuAddDispatchThroughLoading = true;
            state.cuAddDispatchThroughMessage = "";
            state.cuAddDispatchThroughError = "";
        },
        cuAddDispatchThroughSuccess: (state, action) => {
            state.cuAddDispatchThroughLoading = false;
            state.cuAddDispatchThrough = action.payload.data;
            state.cuAddDispatchThroughMessage = action.payload.message;
        },
        cuAddDispatchThroughError: (state, action) => {
            state.cuAddDispatchThroughLoading = false;
            state.cuAddDispatchThroughError = action.payload.message;
        },
        cuAddDispatchThroughReset: (state) => {
            state.cuAddDispatchThrough = {};
            state.cuAddDispatchThroughMessage = "";
            state.cuAddDispatchThroughError = "";
        },

        cuEditDispatchThroughRequest: (state) => {
            state.cuEditDispatchThroughLoading = true;
            state.cuEditDispatchThroughMessage = "";
            state.cuEditDispatchThroughError = "";
        },
        cuEditDispatchThroughSuccess: (state, action) => {
            state.cuEditDispatchThroughLoading = false;
            state.cuEditDispatchThrough = action.payload.data;
            state.cuEditDispatchThroughMessage = action.payload.message;
        },
        cuEditDispatchThroughError: (state, action) => {
            state.cuEditDispatchThroughLoading = false;
            state.cuEditDispatchThroughError = action.payload.message;
        },
        cuEditDispatchThroughReset: (state) => {
            state.cuEditDispatchThrough = {};
            state.cuEditDispatchThroughMessage = "";
            state.cuEditDispatchThroughError = "";
        },
    },
});

export const {
    dispatchThroughRequest,
    dispatchThroughSuccess,
    dispatchThroughError,
    dispatchThroughReset,

    cuAddDispatchThroughRequest,
    cuAddDispatchThroughSuccess,
    cuAddDispatchThroughError,
    cuAddDispatchThroughReset,

    cuEditDispatchThroughRequest,
    cuEditDispatchThroughSuccess,
    cuEditDispatchThroughError,
    cuEditDispatchThroughReset
} = customerDispatchThroughSlice.actions;

export default customerDispatchThroughSlice.reducer;
