import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_SERIAL_NO } from "../../helpers/slice.name";

export const customerPoItemsSlice = createSlice({
    name: CUSTOMER_SERIAL_NO,
    initialState: {
        poItemsLoading: false,
        poItems: [],
        poItemsMessage: "",
        poItemsError: "",

        poSerialNoLoading: false,
        poSerialNo: [],
        poSerialNoMessage: "",
        poSerialNoError: "",

        poInstallSerialNoLoading: false,
        poInstallSerialNo: [],
        poInstallSerialNoMessage: "",
        poInstallSerialNoError: "",

        cuPoProductReceiveLoading: false,
        cuPoProductReceive: {},
        cuPoProductReceiveMessage: "",
        cuPoProductReceiveError: "",

    },
    reducers: {
        poItemsRequest: (state) => {
            state.poItemsLoading = true;
            state.poItemsMessage = "";
            state.poItemsError = "";
        },
        poItemsSuccess: (state, action) => {
            state.poItemsLoading = false;
            state.poItems = action.payload.data;
            state.poItemsMessage = action.payload.message;
        },
        poItemsError: (state, action) => {
            state.poItemsLoading = false;
            state.poItemsError = action.payload.message;
        },

        poSerialNoRequest: (state) => {
            state.poSerialNoLoading = true;
            state.poSerialNoMessage = "";
            state.poSerialNoError = "";
        },
        poSerialNoSuccess: (state, action) => {
            state.poSerialNoLoading = false;
            state.poSerialNo = action.payload.data;
            state.poSerialNoMessage = action.payload.message;
        },
        poSerialNoError: (state, action) => {
            state.poSerialNoLoading = false;
            state.poSerialNoError = action.payload.message;
        },

        poInstallSerialNoRequest: (state) => {
            state.poInstallSerialNoLoading = true;
            state.poInstallSerialNoMessage = "";
            state.poInstallSerialNoError = "";
        },
        poInstallSerialNoSuccess: (state, action) => {
            state.poInstallSerialNoLoading = false;
            state.poInstallSerialNo = action.payload.data;
            state.poInstallSerialNoMessage = action.payload.message;
        },
        poInstallSerialNoError: (state, action) => {
            state.poInstallSerialNoLoading = false;
            state.poInstallSerialNoError = action.payload.message;
        },

        cuProductPoReceiveRequest: (state) => {
            state.cuPoProductReceiveLoading = true;
            state.cuPoProductReceiveMessage = "";
            state.cuPoProductReceiveError = "";
        },
        cuProductPoReciveSuccess: (state, action) => {
            state.cuPoProductReceiveLoading = false;
            state.cuPoProductReceive = action.payload.data;
            state.cuPoProductReceiveMessage = action.payload.message;
        },
        cuProductPoReceiveError: (state, action) => {
            state.cuPoProductReceiveLoading = false;
            state.cuPoProductReceiveError = action.payload.message;
            
        },
        cuProductPoReceiveReset: (state) => {
            state.cuPoProductReceiveLoading = false;
            state.cuPoProductReceive = {};
            state.cuPoProductReceiveMessage = "";
            state.cuPoProductReceiveError = "";
        }
    }
});

export const {
    poItemsRequest,
    poItemsSuccess,
    poItemsError,

    poSerialNoRequest,
    poSerialNoSuccess,
    poSerialNoError,

    poInstallSerialNoRequest,
    poInstallSerialNoSuccess,
    poInstallSerialNoError,

    cuProductPoReceiveRequest,
    cuProductPoReciveSuccess,
    cuProductPoReceiveError,
    cuProductPoReceiveReset
    
} = customerPoItemsSlice.actions;

export default customerPoItemsSlice.reducer;
