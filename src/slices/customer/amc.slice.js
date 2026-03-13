import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_AMC } from "../../helpers/slice.name";

export const customerAmcSlice = createSlice({
    name: CUSTOMER_AMC,
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
} = customerAmcSlice.actions;


export default customerAmcSlice.reducer;