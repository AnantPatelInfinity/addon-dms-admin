import { ServiceData } from "../../../services/customer/service.js";
import {
  serviceListRequest,
  serviceListSuccess,
  serviceListError,
  serviceListReset,

  serviceOneRequest,
  serviceOneSuccess,
  serviceOneError,
  serviceOneReset,

  addServiceRequest,
  addServiceSuccess,
  addServiceError,
  addServiceReset,

  editServiceRequest,
  editServiceSuccess,
  editServiceError,
  editServiceReset,

  downloadServiceRequest,
  downloadServiceSuccess,
  downloadServiceError,
  downloadServiceReset,

  downloadDispatchRequest,
  downloadDispatchSuccess,
  downloadDispatchError,
  downloadDispatchReset,

  downloadServiceChallanRequest,
  downloadServiceChallanSuccess,
  downloadServiceChallanError,
  downloadServiceChallanReset,
} from "../../../slices/customer/service.slice.js";

export const getServiceList = (payload) => {
  return (dispatch) => {
    dispatch(serviceListRequest());
    ServiceData.getAllService(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(serviceListSuccess({ data, message }));
        } else {
          dispatch(serviceListError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(serviceListError({ data: [], message: error }));
      });
  };
};

export const addService = (payload) => {
  return (dispatch) => {
    dispatch(addServiceRequest());
    ServiceData.addServiceData(payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(addServiceSuccess({ data, message }));
        } else {
          dispatch(addServiceError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(addServiceError({ data: {}, message: error }));
      });
  };
};

export const editService = (payload, id) => {
  return (dispatch) => {
    dispatch(editServiceRequest());
    ServiceData.updateServiceData(payload, id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(editServiceSuccess({ data, message }));
        } else {
          dispatch(editServiceError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(editServiceError({ data: {}, message: error }));
      });
  };
};

export const getOneService = (payload, id) => {
  return (dispatch) => {
    dispatch(serviceOneRequest());
    ServiceData.getOneServiceData(payload, id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(serviceOneSuccess({ data, message }));
        } else {
          dispatch(serviceOneError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(serviceOneError({ data: {}, message: error }));
      });
  };
};

export const resetServiceList = () => {
  return (dispatch) => {
    dispatch(serviceListReset());
  };
}

export const resetServiceOne = () => {
  return (dispatch) => {
    dispatch(serviceOneReset());
  };
};

export const resetServiceAdd = () => {
  return (dispatch) => {
    dispatch(addServiceReset());
  };
};

export const resetServiceEdit = () => {
  return (dispatch) => {
    dispatch(editServiceReset());
  };
};

export const downloadServiceSlip = (payload, id) => {
  return (dispatch) => {
    dispatch(downloadServiceRequest());
    ServiceData.downloadServiceReceipt(payload, id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(downloadServiceSuccess({ data, message }));
        } else {
          dispatch(downloadServiceError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(downloadServiceError({ data: {}, message: error }));
      });
  };
};

export const downloadDispatchPdf = (payload, id) => {
  return (dispatch) => {
    dispatch(downloadDispatchRequest());
    ServiceData.downloadServiceDispatch(payload, id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(downloadDispatchSuccess({ data, message }));
        } else {
          dispatch(downloadDispatchError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(downloadDispatchError({ data: {}, message: error }));
      });
  };
};

export const downloadServiceChallanPdf = (id) => {
  return (dispatch) => {
    dispatch(downloadServiceChallanRequest());
    ServiceData.downloadServiceChallan(id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(downloadServiceChallanSuccess({ data, message }));
        } else {
          dispatch(downloadServiceChallanError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(downloadServiceChallanError({ data: {}, message: error }));
      });
  };
};

export const resetServiceDownload = () => {
  return (dispatch) => {
    dispatch(downloadServiceReset());
  };
};

export const resetServiceDownloadDispatch = () => {
  return (dispatch) => {
    dispatch(downloadDispatchReset());
  };
};

export const resetServiceChallanDownload = () => {
  return (dispatch) => {
    dispatch(downloadServiceChallanReset())
  }
}