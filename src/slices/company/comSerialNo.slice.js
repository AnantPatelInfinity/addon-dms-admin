import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_SERIAL_NO } from "../../helpers/slice.name";

export const comSerialNoSlice = createSlice({
    name: COMAPNY_SERIAL_NO,
    initialState: {
        serialNoListLoading: false,
        serialNoList: [],
        serialNoListMessage: "",
        serialNoListError: "",
    },
    reducers: {
        serialNoListRequest: (state) => {
            state.serialNoListLoading = true;
            state.serialNoListMessage = "";
            state.serialNoListError = "";
        },
        serialNoListSuccess: (state, action) => {
            state.serialNoListLoading = false;
            state.serialNoList = action.payload.data;
            state.serialNoListMessage = action.payload.message;
        },
        serialNoListError: (state, action) => {
            state.serialNoListLoading = false;
            state.serialNoListError = action.payload.message;
        },
        serialNoListReset: (state) => {
            state.serialNoListLoading = false;
            state.serialNoList = [];
            state.serialNoListMessage = "";
            state.serialNoListError = "";
        },
    }
});

export const {
    serialNoListRequest,
    serialNoListSuccess,
    serialNoListError,
    serialNoListReset,
} = comSerialNoSlice.actions;

export default comSerialNoSlice.reducer;
