import { createSlice } from "@reduxjs/toolkit";
import { DEALER_OLD_PO } from "../helpers/slice.name";

export const dealerOldPoSlice = createSlice({
    name: DEALER_OLD_PO,
    initialState: {
        dealerOldPoListLoading: false,
        dealerOldPoList: [],
        dealerOldPoListMessage: "",
        dealerOldPoListError: "",

        createDealerOldPoLoading: false,
        createDealerOldPo: {},
        createDealerOldPoMessage: "",
        createDealerOldPoError: "",
    },
    reducers: {
        dealerOldPoListRequest: (state) => {
            state.dealerOldPoListLoading = true;
            state.dealerOldPoListMessage = "";
            state.dealerOldPoListError = "";
        },
        dealerOldPoListSuccess: (state, action) => {
            state.dealerOldPoListLoading = false;
            state.dealerOldPoList = action.payload.data;
            state.dealerOldPoListMessage = action.payload.message;
        },
        dealerOldPoListError: (state, action) => {
            state.dealerOldPoListLoading = false;
            state.dealerOldPoListError = action.payload.message;
        },
        resetDealerOldPoList: (state) => {
            state.dealerOldPoList = [];
            state.dealerOldPoListMessage = "";
            state.dealerOldPoListError = "";
        },

        createDealerOldPoRequest: (state) => {
            state.createDealerOldPoLoading = true;
            state.createDealerOldPoMessage = "";
            state.createDealerOldPoError = "";
        },
        createDealerOldPoSuccess: (state, action) => {
            state.createDealerOldPoLoading = false;
            state.createDealerOldPo = action.payload.data;
            state.createDealerOldPoMessage = action.payload.message;
        },
        createDealerOldPoError: (state, action) => {
            state.createDealerOldPoLoading = false;
            state.createDealerOldPoError = action.payload.message;
        },
        resetCreateDealerOldPo: (state) => {
            state.createDealerOldPo = {};
            state.createDealerOldPoMessage = "";
            state.createDealerOldPoError = "";
        }
    }
});

export const {
    dealerOldPoListRequest,
    dealerOldPoListSuccess,
    dealerOldPoListError,
    resetDealerOldPoList,

    createDealerOldPoRequest,
    createDealerOldPoSuccess,
    createDealerOldPoError,
    resetCreateDealerOldPo
} = dealerOldPoSlice.actions;

export default dealerOldPoSlice.reducer;