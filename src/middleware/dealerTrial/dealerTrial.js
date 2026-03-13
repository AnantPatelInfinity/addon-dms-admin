import { DeTrialService } from "../../services/dealerTrialOrder";
import {
  trialListRequest,
  trialListSuccess,
  trialListError,
  trialListReset,
  addTrialRequest,
  addTrialSuccess,
  addTrialError,
  addTrialReset,
  editTrialRequest,
  editTrialSuccess,
  editTrialError,
  editTrialReset,
  deleteTrialRequest,
  deleteTrialSuccess,
  deleteTrialError,
  deleteTrialReset,
  trialOneRequest,
  trialOneSuccess,
  trialOneError,
  trialOneReset,
  downloadTrialRequest,
  downloadTrialReset,
  downloadTrialSuccess,
  downloadTrialError,

  dispatchTrialRequest,
  dispatchTrialSuccess,
  dispatchTrialError,
  dispatchTrialReset,

  returnTrialRequest,
  returnTrialSuccess,
  returnTrialError,
  returnTrialReset
} from "../../slices/dealerTrial.slice";

export const getDeTrialData = (payload) => {
  return (dispatch) => {
    dispatch(trialListRequest());
    DeTrialService.getDeTrial(payload)
      .then((response) => {
        const { success, message } = response?.data;
        const { data } = response?.data;
        if (success === true) {
          dispatch(trialListSuccess({ data, message }));
        } else {
          dispatch(trialListError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(trialListError({ data: [], message: error }));
      });
  };
};

export const viewDeTrialData = (id) => {
  return (dispatch) => {
    dispatch(trialOneRequest());
    DeTrialService.viewDeTrial(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(trialOneSuccess({ data, message }));
        } else {
          dispatch(trialOneError({ data, message }));
        }
      })
      .catch((err) => {
        dispatch(trialOneError({ data: {}, message: err }));
      });
  };
};

export const addDeTrialData = (payload) => {
  return (dispatch) => {
    dispatch(addTrialRequest());
    DeTrialService.addDeTrial(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(addTrialSuccess({ data, message }));
        } else {
          dispatch(addTrialError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(addTrialError({ data: {}, message: error }));
      });
  };
};

export const editDeTrialData = (id, payload) => {
  return (dispatch) => {
    dispatch(editTrialRequest());
    DeTrialService.updateDeTrial(id, payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(editTrialSuccess({ data, message }));
        } else {
          dispatch(editTrialError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(editTrialError({ data: {}, message: error }));
      });
  };
};

export const deleteDeTrialData = (id) => {
  return (dispatch) => {
    dispatch(deleteTrialRequest());
    DeTrialService.deleteDeTrial(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(deleteTrialSuccess({ data, message }));
        } else {
          dispatch(deleteTrialError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(deleteTrialError({ data: {}, message: error }));
      });
  };
};

export const downloadDeTrial = (id) => {
  return (dispatch) => {
    downloadTrialRequest();
    DeTrialService.downloadTrial(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(downloadTrialSuccess({ data, message }));
        } else {
          dispatch(downloadTrialError({ data, message }));
        }
      })
      .catch((err) => {
        dispatch(downloadTrialError({ data: {}, message: err }));
      });
  };
};

// dealer dispatch product after creation
export const dispatchDeTrial = (id, payload) => {
  return (dispatch) => {
    dispatch(dispatchTrialRequest());
    DeTrialService.dispatchTrial(id, payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(dispatchTrialSuccess({ data, message }));
        } else {
          dispatch(dispatchTrialError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(dispatchTrialError({ data: {}, message: error }));
      });
  };
};

// return remarks of received return product by customer
export const returnDeTrial = (id, payload) => {
  return (dispatch) => {
    dispatch(returnTrialRequest());
    DeTrialService.returnTrial(id, payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success === true) {
          dispatch(returnTrialSuccess({ data, message }));
        } else {
          dispatch(returnTrialError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(returnTrialError({ data: {}, message: error }));
      });
  };
};

export const resetDeTrialData = () => {
  return (dispatch) => {
    dispatch(trialListReset());
  };
};

export const resetViewDeTrial = () => {
  return (dispatch) => {
    dispatch(trialOneReset());
  };
};

export const resetAddDeTrialData = () => {
  return (dispatch) => {
    dispatch(addTrialReset());
  };
};
export const resetEditDeTrialData = () => {
  return (dispatch) => {
    dispatch(editTrialReset());
  };
};
export const resetDeleteDeTrialData = () => {
  return (dispatch) => {
    dispatch(deleteTrialReset());
  };
};

export const resetDeDownloadTrial = () => {
  return (dispatch) => {
    dispatch(downloadTrialReset())
  }
}

export const resetDispatchDeTrial = () => {
  return (dispatch) => {
    dispatch(dispatchTrialReset())
  }
}

export const resetReturnDeTrial = () => {
  return (dispatch) => {
    dispatch(returnTrialReset())
  }
}