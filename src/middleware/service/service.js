import { ServiceData } from "../../services/service";
import {
  serviceListRequest,
  serviceListSuccess,
  serviceListError,
  serviceOneListRequest,
  serviceOneListSuccess,
  serviceOneListError,
  serviceOneListReset,
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
  deCompleteServiceRequest,
  deCompleteServiceSuccess,
  deCompleteServiceError,
  deCompleteServiceReset,
} from "../../slices/service.slice";

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
    dispatch(serviceOneListRequest());
    ServiceData.getOneServiceData(payload, id)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(serviceOneListSuccess({ data, message }));
        } else {
          dispatch(serviceOneListError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(serviceOneListError({ data: {}, message: error }));
      });
  };
};

export const resetServiceOne = () => {
  return (dispatch) => {
    dispatch(serviceOneListReset());
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

export const downloadDeServiceChallan = (id) => {
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

export const completeDeService = (id, payload) => {
  return (dispatch) => {
    dispatch(deCompleteServiceRequest());
    ServiceData.completeDeService(id, payload)
      .then((response) => {
        const { data, success, message } = response?.data;
        if (success) {
          dispatch(deCompleteServiceSuccess({ data, message }));
        } else {
          dispatch(deCompleteServiceError({ data, message }));
        }
      })
      .catch((error) => {
        dispatch(deCompleteServiceError({ data: {}, message: error }));
      });
  };
};

export const resetDeCompleteService = () => {
  return (dispatch) => {
    dispatch(deCompleteServiceReset());
  };
};

export const resetServiceDownloadChallan = () => {
  return (dispatch) => {
    dispatch(downloadServiceChallanReset());
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
