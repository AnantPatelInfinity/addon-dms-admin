import { createSlice } from "@reduxjs/toolkit";
import { COMPANY_USER } from "../../helpers/slice.name";

const companyUserSlice = createSlice({
    name: COMPANY_USER,
    initialState: {
        comUserLoading: false,
        comUserList : [],
        comUserMessage: "",
        comUserError: "",
        
        comOneUserLoading: false,
        comOneUser : {},
        comOneUserMessage: "",
        comOneUserError: "",

        comAddUserLoading: false,
        comAddUser : {},
        comAddUserMessage: "",
        comAddUserError: "",

        comEditUserLoading: false,
        comEditUser : {},
        comEditUserMessage: "",
        comEditUserError: "",

        comDeleteUserLoading: false,
        comDeleteUser : {},
        comDeleteUserMessage: "",
        comDeleteUserError: "",

    },
    reducers: {
        comUserListRequest: (state, action) => {
            state.comUserLoading = true;
            state.comUserMessage = "";
            state.comUserError = "";
        },
        comUserListSuccess: (state, action) => {
            state.comUserLoading = false;
            state.comUserList = action.payload.data;
            state.comUserMessage = action.payload.message;
        },
        comUserListError: (state, action) => {
            state.comUserLoading = false;
            state.comUserError = action.payload.message;
        },

        comOneUserRequest: (state, action) => {
            state.comOneUserLoading = true;
            state.comOneUserMessage = "";
            state.comOneUserError = "";
        },
        comOneUserSuccess: (state, action) => {
            state.comOneUserLoading = false;
            state.comOneUser = action.payload.data;
            state.comOneUserMessage = action.payload.message;
        },
        comOneUserError: (state, action) => {
            state.comOneUserLoading = false;
            state.comOneUserError = action.payload.message;
        },


        comAddUserRequest: (state, action) => {
            state.comAddUserLoading = true;
            state.comAddUserMessage = "";
            state.comAddUserError = "";
        },
        comAddUserSuccess: (state, action) => {
            state.comAddUserLoading = false;
            state.comAddUser = action.payload.data;
            state.comAddUserMessage = action.payload.message;
        },
        comAddUserError: (state, action) => {
            state.comAddUserLoading = false;
            state.comAddUserError = action.payload.message;
        },
        comResetAddUser: (state) => {
            state.comAddUserLoading = false;
            state.comAddUser = {};
            state.comAddUserMessage = "";
            state.comAddUserError = "";
        },

        comEditUserRequest: (state, action) => {
            state.comEditUserLoading = true;
            state.comEditUserMessage = "";
            state.comEditUserError = "";
        },
        comEditUserSuccess: (state, action) => {
            state.comEditUserLoading = false;
            state.comEditUser = action.payload.data;
            state.comEditUserMessage = action.payload.message;
        },
        comEditUserError: (state, action) => {
            state.comEditUserLoading = false;
            state.comEditUserError = action.payload.message;
        },
        comResetEditUser: (state) => {
            state.comEditUserLoading = false;
            state.comEditUser = {};
            state.comEditUserMessage = "";
            state.comEditUserError = "";
        },

        comDeleteUserRequest: (state, action) => {
            state.comDeleteUserLoading = true;
            state.comDeleteUserMessage = "";
            state.comDeleteUserError = "";
        },
        comDeleteUserSuccess: (state, action) => {
            state.comDeleteUserLoading = false;
            state.comDeleteUser = action.payload.data;
            state.comDeleteUserMessage = action.payload.message;
        },
        comDeleteUserError: (state, action) => {
            state.comDeleteUserLoading = false;
            state.comDeleteUserError = action.payload.message;
        },

        comResetDeleteUser: (state) => {
            state.comDeleteUserLoading = false;
            state.comDeleteUser = {};
            state.comDeleteUserMessage = "";
            state.comDeleteUserError = "";
        },

    }
})


export const {
    comUserListRequest,
    comUserListSuccess,
    comUserListError,

    comOneUserRequest,
    comOneUserSuccess,
    comOneUserError,

    comAddUserRequest,
    comAddUserSuccess,
    comAddUserError,
    comResetAddUser,

    comEditUserRequest,
    comEditUserSuccess,
    comEditUserError,
    comResetEditUser,

    comDeleteUserRequest,
    comDeleteUserSuccess,
    comDeleteUserError,
    comResetDeleteUser

} = companyUserSlice.actions

export default companyUserSlice.reducer