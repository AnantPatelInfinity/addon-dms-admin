import { createSlice } from "@reduxjs/toolkit";
import { DE_DIS_THROUGH } from "../helpers/slice.name";


export const dealerDispatchThroughSlice = createSlice({
    name: DE_DIS_THROUGH,
    initialState: {
        dispatchThroughLoading: false,
        dispatchThrough: [],
        dispatchThroughMessage: "",
        dispatchThroughError: "",

        deAddDispatchThroughLoading: false,
        deAddDispatchThrough: {},
        deAddDispatchThroughMessage: "",
        deAddDispatchThroughError: "",

        deEditDispatchThroughLoading: false,
        deEditDispatchThrough: {},
        deEditDispatchThroughMessage: "",
        deEditDispatchThroughError: "",
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

        deAddDispatchThroughRequest: (state) => {
            state.deAddDispatchThroughLoading = true;
            state.deAddDispatchThroughMessage = "";
            state.deAddDispatchThroughError = "";
        },
        deAddDispatchThroughSuccess: (state, action) => {
            state.deAddDispatchThroughLoading = false;
            state.deAddDispatchThrough = action.payload.data;
            state.deAddDispatchThroughMessage = action.payload.message;
        },
        deAddDispatchThroughError: (state, action) => {
            state.deAddDispatchThroughLoading = false;
            state.deAddDispatchThroughError = action.payload.message;
        },
        deAddDispatchThroughReset: (state) => {
            state.deAddDispatchThrough = {};
            state.deAddDispatchThroughMessage = "";
            state.deAddDispatchThroughError = "";
        },

        deEditDispatchThroughRequest: (state) => {
            state.deEditDispatchThroughLoading = true;
            state.deEditDispatchThroughMessage = "";
            state.deEditDispatchThroughError = "";
        },
        deEditDispatchThroughSuccess: (state, action) => {
            state.deEditDispatchThroughLoading = false;
            state.deEditDispatchThrough = action.payload.data;
            state.deEditDispatchThroughMessage = action.payload.message;
        },
        deEditDispatchThroughError: (state, action) => {
            state.deEditDispatchThroughLoading = false;
            state.deEditDispatchThroughError = action.payload.message;
        },
        deEditDispatchThroughReset: (state) => {
            state.deEditDispatchThrough = {};
            state.deEditDispatchThroughMessage = "";
            state.deEditDispatchThroughError = "";
        },
    },
});

export const {
    dispatchThroughRequest,
    dispatchThroughSuccess,
    dispatchThroughError,
    dispatchThroughReset,

    deAddDispatchThroughRequest,
    deAddDispatchThroughSuccess,
    deAddDispatchThroughError,
    deAddDispatchThroughReset,

    deEditDispatchThroughRequest,
    deEditDispatchThroughSuccess,
    deEditDispatchThroughError,
    deEditDispatchThroughReset
} = dealerDispatchThroughSlice.actions;

export default dealerDispatchThroughSlice.reducer;
