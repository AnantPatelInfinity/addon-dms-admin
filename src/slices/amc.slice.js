import { createSlice } from "@reduxjs/toolkit";
import { DE_AMC } from "../helpers/slice.name";

export const dealerAmcSlice = createSlice({
    name: DE_AMC,
    initialState: {
        amcListLoading: false,
        amcList: [],
        amcListMessage: "",
        amcListError: "",
    },
    reducers: {
        amcListRequest: (state) => {
            state.amcListLoading = true;
            state.amcListMessage = "";
            state.amcListError = "";
        },
        amcListSuccess: (state, action) => {
            state.amcListLoading = false;
            state.amcList = action.payload.data;
            state.amcListMessage = action.payload.message;
        },
        amcListError: (state, action) => {
            state.amcListLoading = false;
            state.amcListError = action.payload.message;
        }
    }
});

export const {
    amcListRequest,
    amcListSuccess,
    amcListError,
} = dealerAmcSlice.actions;


export default dealerAmcSlice.reducer;