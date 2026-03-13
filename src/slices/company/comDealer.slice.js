import { createSlice } from "@reduxjs/toolkit";
import { COMAPNY_DEALER } from "../../helpers/slice.name";

export const comDealerSlice = createSlice({
    name: COMAPNY_DEALER,
    initialState: {
        dealerListLoading: false,
        dealerList: [],
        dealerListMessage: "",
        dealerListError: "",
    },
    reducers: {
        dealerListRequest: (state) => {
            state.dealerListLoading = true;
            state.dealerListMessage = "";
            state.dealerListError = "";
        },
        dealerListSuccess: (state, action) => {
            state.dealerListLoading = false;
            state.dealerList = action.payload.data;
            state.dealerListMessage = action.payload.message;
        },
        dealerListError: (state, action) => {
            state.dealerListLoading = false;
            state.dealerListError = action.payload.message;
        },
        dealerListReset: (state) => {
            state.dealerListLoading = false;
            state.dealerList = [];
            state.dealerListMessage = "";
            state.dealerListError = "";
        },
    }
});

export const {
    dealerListRequest,
    dealerListSuccess,
    dealerListError,
    dealerListReset,
} = comDealerSlice.actions;

export default comDealerSlice.reducer;