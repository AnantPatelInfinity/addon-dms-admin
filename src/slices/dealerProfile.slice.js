import { createSlice } from "@reduxjs/toolkit";
import { DE_PROFILE } from "../helpers/slice.name";


export const dealerProfileSlice = createSlice({
    name: DE_PROFILE,
    initialState: {
        dealerProfileLoading: false,
        dealerProfile: {},
        dealerProfileMessage: "",
        dealerProfileError: "",

        dealerProfileUpdateLoading: false,
        dealerProfileUpdateMessage: "",
        dealerProfileUpdateError: "",
    },
    reducers: {
        dealerProfileRequest: (state) => {
            state.dealerProfileLoading = true;
            state.dealerProfileMessage = "";
            state.dealerProfileError = "";
        },
        dealerProfileSuccess: (state, action) => {
            state.dealerProfileLoading = false;
            state.dealerProfile = action.payload.data;
            state.dealerProfileMessage = action.payload.message;
        },
        dealerProfileError: (state, action) => {
            state.dealerProfileLoading = false;
            state.dealerProfileError = action.payload.message;
        },


        dealerProfileUpdateRequest: (state) => {
            state.dealerProfileUpdateLoading = true;
            state.dealerProfileUpdateMessage = "";
            state.dealerProfileUpdateError = "";
        },
        dealerProfileUpdateSuccess: (state, action) => {
            state.dealerProfileUpdateLoading = false;
            state.dealerProfileUpdateMessage = action.payload.message;
        },
        dealerProfileUpdateError: (state, action) => {
            state.dealerProfileUpdateLoading = false;
            state.dealerProfileUpdateError = action.payload.message;
        },
        dealerProfileUpdateReset: (state) => {
            state.dealerProfileUpdateLoading = false;
            state.dealerProfileUpdateMessage = "";
            state.dealerProfileUpdateError = "";
        }

    }
});

export const {
    dealerProfileRequest,
    dealerProfileSuccess,
    dealerProfileError,

    dealerProfileUpdateRequest,
    dealerProfileUpdateSuccess,
    dealerProfileUpdateError,
    dealerProfileUpdateReset
} = dealerProfileSlice.actions;

export default dealerProfileSlice.reducer;

