import { CompanyUsersService } from "../../../services/company/comUser";
import {
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
  comResetDeleteUser,
} from "../../../slices/company/comUser.slice";

export const getComUserList = (payload) => {
  return (dispatch) => {
    dispatch(comUserListRequest());
    CompanyUsersService.getCompanyUserList(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(comUserListSuccess({ data, message }));
        } else {
          dispatch(comUserListError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(comUserListError({ data: [], message: error }));
      });
  };
};

export const getComOneUser = (id) => {
  return (dispatch) => {
    dispatch(comOneUserRequest());
    CompanyUsersService.getCompanyOneUser(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(comOneUserSuccess({ data, message }));
        } else {
          dispatch(comOneUserError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(comOneUserError({ data: {}, message: error }));
      });
  };
};

export const AddComUser = (payload) => {
  return (dispatch) => {
    dispatch(comAddUserRequest());
    CompanyUsersService.createCompanyUser(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(comAddUserSuccess({ data, message }));
        } else {
          dispatch(comAddUserError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(comAddUserError({ data: {}, message: error }));
      });
  };
};

export const EditComUser = (id, payload) => {
  return (dispatch) => {
    dispatch(comEditUserRequest());
    CompanyUsersService.updateCompanyUser(id, payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success == true) {
          dispatch(comEditUserSuccess({ data, message }));
        } else {
          dispatch(comEditUserError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(comEditUserError({ data: {}, message: error }));
      });
  };
};

export const DeleteComUser = (id) => {
  return (dispatch) => {
    dispatch(comDeleteUserRequest());
    CompanyUsersService.deleteCompanyUser(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(comDeleteUserSuccess({ data, message }));
        } else {
          dispatch(comDeleteUserError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(comDeleteUserError({ data: {}, message: error }));
      });
  };
};

export const resetComAddUser = () => {
  return (dispatch) => {
    dispatch(comResetAddUser());
  };
};

export const resetComEditUser = () => {
  return (dispatch) => {
    dispatch(comResetEditUser());
  };
};

export const resetComDeleteUser = () => {
  return (dispatch) => {
    dispatch(comResetDeleteUser());
  };
};
