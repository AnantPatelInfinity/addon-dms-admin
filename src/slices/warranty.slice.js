import { createSlice } from "@reduxjs/toolkit";
import { DE_WARRANTY } from "../helpers/slice.name";


export const dealerWarrantySlice = createSlice({
    name: DE_WARRANTY,
    initialState: {
        warrantyListLoading: false,
        warrantyList: [],
        warrantyListMessage: "",
        warrantyListError: "",
    },
    reducers: {
        warrantyListRequest: (state) => {
            state.warrantyListLoading = true;
            state.warrantyListMessage = "";
            state.warrantyListError = "";
        },
        warrantyListSuccess: (state, action) => {
            state.warrantyListLoading = false;
            state.warrantyList = action.payload.data;
            state.warrantyListMessage = action.payload.message;
        },
        warrantyListError: (state, action) => {
            state.warrantyListLoading = false;
            state.warrantyListError = action.payload.message;
        },
    }
});

export const {
    warrantyListRequest,
    warrantyListSuccess,
    warrantyListError,
} = dealerWarrantySlice.actions;

export default dealerWarrantySlice.reducer;