import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_PROFILE } from "../../helpers/slice.name";


export const comProfileSlice = createSlice({
    name: COMAPNY_PROFILE,
    initialState: {
        comProfileLoading: false,
        comProfile: {},
        comProfileMessage: "",
        comProfileError: "",

        comProfileUpdateLoading: false,
        comProfileUpdate: {},
        comProfileUpdateMessage: "",
        comProfileUpdateError: "",
    },
    reducers: {
        comProfileRequest: (state) => {
            state.comProfileLoading = true;
            state.comProfileMessage = "";
            state.comProfileError = "";
        },
        comProfileSuccess: (state, action) => {
            state.comProfileLoading = false;
            state.comProfile = action.payload.data;
            state.comProfileMessage = action.payload.message;
        },
        comProfileError: (state, action) => {
            state.comProfileLoading = false;
            state.comProfileError = action.payload.message;
        },
        comProfileReset: (state) => {
            state.comProfileLoading = false;
            state.comProfile = {};
            state.comProfileMessage = "";
            state.comProfileError = "";
        },

        comProfileUpdateRequest: (state) => {
            state.comProfileUpdateLoading = true;
            state.comProfileUpdateMessage = "";
            state.comProfileUpdateError = "";
        },
        comProfileUpdateSuccess: (state, action) => {
            state.comProfileUpdateLoading = false;
            state.comProfileUpdate = action.payload.data;
            state.comProfileUpdateMessage = action.payload.message;
        },
        comProfileUpdateError: (state, action) => {
            state.comProfileUpdateLoading = false;
            state.comProfileUpdateError = action.payload.message;
        },
        comProfileUpdateReset: (state) => {
            state.comProfileUpdateLoading = false;
            state.comProfileUpdate = {};
            state.comProfileUpdateMessage = "";
            state.comProfileUpdateError = "";
        },
    }
});

export const {

    comProfileRequest,
    comProfileSuccess,
    comProfileError,
    comProfileReset,

    comProfileUpdateRequest,
    comProfileUpdateSuccess,
    comProfileUpdateError,
    comProfileUpdateReset,
} = comProfileSlice.actions;

export default comProfileSlice.reducer;