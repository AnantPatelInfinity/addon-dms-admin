import { createSlice } from "@reduxjs/toolkit";
import { DE_SERIAL_NO } from "../helpers/slice.name";


export const dealerPoItemsSlice = createSlice({
    name: DE_SERIAL_NO,
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

        dePoProductReceiveLoading: false,
        dePoProductReceive: {},
        dePoProductReceiveMessage: "",
        dePoProductReceiveError: "",

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

        deProductPoReceiveRequest: (state) => {
            state.dePoProductReceiveLoading = true;
            state.dePoProductReceiveMessage = "";
            state.dePoProductReceiveError = "";
        },
        deProductPoReciveSuccess: (state, action) => {
            state.dePoProductReceiveLoading = false;
            state.dePoProductReceive = action.payload.data;
            state.dePoProductReceiveMessage = action.payload.message;
        },
        deProductPoReceiveError: (state, action) => {
            state.dePoProductReceiveLoading = false;
            state.dePoProductReceiveError = action.payload.message;
            
        },
        deProductPoReceiveReset: (state) => {
            state.dePoProductReceiveLoading = false;
            state.dePoProductReceive = {};
            state.dePoProductReceiveMessage = "";
            state.dePoProductReceiveError = "";

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

    deProductPoReceiveRequest,
    deProductPoReciveSuccess,
    deProductPoReceiveError,
    deProductPoReceiveReset
    
} = dealerPoItemsSlice.actions;

export default dealerPoItemsSlice.reducer;
