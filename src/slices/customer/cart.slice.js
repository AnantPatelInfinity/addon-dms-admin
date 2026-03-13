import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER_CART } from "../../helpers/slice.name";

export const CustomerCartSlice = createSlice({
    name: CUSTOMER_CART,
    initialState: {
        loading: false,
        cartList: [],
        cartListMessage: "",
        cartListError: "",

        addCartLoading: false,
        addCart: {},
        addCartMessage: "",
        addCartError: "",

        removeCartLoading: false,
        removeCart: {},
        removeCartMessage: "",
        removeCartError: "",

        inCartQtyLoading: false,
        inCartQty: {},
        inCartQtyMessage: "",
        inCartQtyError: "",

        outCartQtyLoading: false,
        outCartQty: {},
        outCartQtyMessage: "",
        outCartQtyError: "",
    },
    reducers: {
        cartListRequest: (state) => {
            state.loading = true;
            state.cartListMessage = "";
            state.cartListError = "";
        },
        cartListSuccess: (state, action) => {
            state.loading = false;
            state.cartList = action.payload.data;
            state.cartListMessage = action.payload.message;
        },
        cartListError: (state, action) => {
            state.loading = false;
            state.cartListError = action.payload.message;
        },

        addCartRequest: (state) => {
            state.addCartLoading = true;
            state.addCartMessage = "";
            state.addCartError = "";
        },
        addCartSuccess: (state, action) => {
            state.addCartLoading = false;
            state.addCart = action.payload.data;
            state.addCartMessage = action.payload.message;
        },
        addCartError: (state, action) => {
            state.addCartLoading = false;
            state.addCartError = action.payload.message;
        },
        addCartReset: (state) => {
            state.addCart = {};
            state.addCartMessage = "";
            state.addCartError = "";
        },

        removeCartRequest: (state) => {
            state.removeCartLoading = true;
            state.removeCartMessage = "";
            state.removeCartError = "";
        },
        removeCartSuccess: (state, action) => {
            state.removeCartLoading = false;
            state.removeCart = action.payload.data;
            state.removeCartMessage = action.payload.message;
        },
        removeCartError: (state, action) => {
            state.removeCartLoading = false;
            state.removeCartError = action.payload.message;
        },
        removeCartReset: (state) => {
            state.removeCart = {};
            state.removeCartMessage = "";
            state.removeCartError = "";
        },

        inCartQtyRequest: (state) => {
            state.inCartQtyLoading = true;
            state.inCartQtyMessage = "";
            state.inCartQtyError = "";
        },
        inCartQtySuccess: (state, action) => {
            state.inCartQtyLoading = false;
            state.inCartQty = action.payload.data;
            state.inCartQtyMessage = action.payload.message;
        },
        inCartQtyError: (state, action) => {
            state.inCartQtyLoading = false;
            state.inCartQtyError = action.payload.message;
        },
        inCartQtyReset: (state) => {
            state.inCartQty = {};
            state.inCartQtyMessage = "";
            state.inCartQtyError = "";
        },

        outCartQtyRequest: (state) => {
            state.outCartQtyLoading = true;
            state.outCartQtyMessage = "";
            state.outCartQtyError = "";
        },
        outCartQtySuccess: (state, action) => {
            state.outCartQtyLoading = false;
            state.outCartQty = action.payload.data;
            state.outCartQtyMessage = action.payload.message;
        },
        outCartQtyError: (state, action) => {
            state.outCartQtyLoading = false;
            state.outCartQtyError = action.payload.message;
        },
        outCartQtyReset: (state) => {
            state.outCartQty = {};
            state.outCartQtyMessage = "";
            state.outCartQtyError = "";
        }
    }
});

export const {
    cartListRequest,
    cartListSuccess,
    cartListError,

    addCartRequest,
    addCartSuccess,
    addCartError,
    addCartReset,

    removeCartRequest,
    removeCartSuccess,
    removeCartError,
    removeCartReset,

    inCartQtyRequest,
    inCartQtySuccess,
    inCartQtyError,
    inCartQtyReset,

    outCartQtyRequest,
    outCartQtySuccess,
    outCartQtyError,
    outCartQtyReset
} = CustomerCartSlice.actions;

export default CustomerCartSlice.reducer;
