import { createSlice } from "@reduxjs/toolkit";
import { DE_AERB_APPLICATION } from "../helpers/slice.name";

export const dealerAerbApplicationSlice = createSlice({
    name: DE_AERB_APPLICATION,
    initialState: {
        deAerbApplicationLoading: false,
        deAerbApplication: {},
        deAerbApplicationMessage: "",
        deAerbApplicationError: "",
    },
    reducers: {
        deAerbApplicationRequest: (state) => {
            state.deAerbApplicationLoading = true;
            state.deAerbApplicationMessage = "";
            state.deAerbApplicationError = "";
        },
        deAerbApplicationSuccess: (state, action) => {
            state.deAerbApplicationLoading = false;
            state.deAerbApplication = action.payload.data;
            state.deAerbApplicationMessage = action.payload.message;
        },
        deAerbApplicationError: (state, action) => {
            state.deAerbApplicationLoading = false;
            state.deAerbApplicationError = action.payload.message;
        },
        deAerbApplicationReset: (state) => {
            state.deAerbApplicationLoading = false;
            state.deAerbApplication = {};
            state.deAerbApplicationMessage = "";
            state.deAerbApplicationError = "";
        },
    }
});

export const {
    deAerbApplicationRequest,
    deAerbApplicationSuccess,
    deAerbApplicationError,
    deAerbApplicationReset,

} = dealerAerbApplicationSlice.actions;

export default dealerAerbApplicationSlice.reducer;