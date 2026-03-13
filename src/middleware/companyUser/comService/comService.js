import { CompanyService } from "../../../services/company/comService";
import {
    comServiceListRequest,
    comServiceListSuccess,
    comServiceListError,

    comOneServiceRequest,
    comOneServiceSuccess,
    comOneServiceError,

    comActionTakeRequest,
    comActionTakeSuccess,
    comActionTakeError,
    comActionTakeReset,

    comActionTakeProductRequest,
    comActionTakeProductSuccess,
    comActionTakeProductError,

    comFinalReceiveRequest,
    comFinalReceiveSuccess,
    comFinalReceiveError,
    comFinalReceiveReset,

    comReceiveConfirmationRequest,
    comReceiveConfirmationSuccess,
    comReceiveConfirmationError,
    comReceiveConfirmationReset,

    comServiceEstimationRequest,
    comServiceEstimationSuccess,
    comServiceEstimationError,
    comServiceEstimationReset,

    comDispatchRequest,
    comDispatchSuccess,
    comDispatchError,
    comDispatchReset,

    comPartsDispatchRequest,
    comPartsDispatchSuccess,
    comPartsDispatchError,
    comPartsDispatchReset,

    comDispatchPdfRequest,
    comDispatchPdfSuccess,
    comDispatchPdfError,
    comDispatchPdfReset,

    comDownloadServiceRequest,
    comDownloadServiceSuccess,
    comDownloadServiceError,
    comDownloadServiceReset,
    comDownloadServiceChallanReset,
    comDownloadServiceChallanSuccess,
    comDownloadServiceChallanError,
    

    comReceiveConfirmationProductRequest,
    comReceiveConfirmationProductError,
    comReceiveConfirmationProductSuccess,
    comActionTakeProductReset,
    comReceiveConfirmationProductReset,
    comDownloadServiceChallanRequest,
    comCompleteServiceRequest,
    comCompleteServiceSuccess,
    comCompleteServiceError,
    comCompleteServiceReset

} from "../../../slices/company/comService.slice";

export const getComService = (payload) => {
    return (dispatch) => {
        dispatch(comServiceListRequest());
        CompanyService.getAllService(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comServiceListSuccess({ data, message }));
                } else {
                    dispatch(comServiceListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comServiceListError({ data: [], message: error }));
            })
    }
}

export const getComOneService = (payload, id) => {
    return (dispatch) => {
        dispatch(comOneServiceRequest());
        CompanyService.getOneService(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comOneServiceSuccess({ data, message }));
                } else {
                    dispatch(comOneServiceError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comOneServiceError({ data: {}, message: error }));
            })
    }
}

export const comTakeAction = (payload, id) => {
    return (dispatch) => {
        dispatch(comActionTakeRequest());
        CompanyService.serviceActionTake(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comActionTakeSuccess({ data, message }));
                } else {
                    dispatch(comActionTakeError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comActionTakeError({ data: {}, message: error }));
            })
    }
}

export const comTakeProductAction = (payload, id) => {
    return (dispatch) => {
        dispatch(comActionTakeProductRequest());
        CompanyService.serviceActionTakeProduct(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comActionTakeProductSuccess({ data, message }));
                } else {
                    dispatch(comActionTakeProductError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comActionTakeProductError({ data: {}, message: error }));
            })
    }
}

export const comProductReceiveConfirmation = (payload, id) => {
    return (dispatch) => {
        dispatch(comReceiveConfirmationProductRequest());
        CompanyService.companyReceiveProduct(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comReceiveConfirmationProductSuccess({ data, message }));
                } else {
                    dispatch(comReceiveConfirmationProductError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comReceiveConfirmationProductError({ data: {}, message: error }));
            })
    }
}

export const comReceiveConfirmation = (payload, id) => {
    return (dispatch) => {
        dispatch(comReceiveConfirmationRequest());
        CompanyService.companyReceive(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comReceiveConfirmationSuccess({ data, message }));
                } else {
                    dispatch(comReceiveConfirmationError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comReceiveConfirmationError({ data: {}, message: error }));
            })
    }
}

export const comFinalReceiveProduct = (payload, id) => {
    return (dispatch) => {
        dispatch(comFinalReceiveRequest());
        CompanyService.companyFinalReceive(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comFinalReceiveSuccess({ data, message }));
                } else {
                    dispatch(comFinalReceiveError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comFinalReceiveError({ data: {}, message: error }));
            })
    }
}

export const comServiceEstimation = (payload, id) => {
    return (dispatch) => {
        dispatch(comServiceEstimationRequest());
        CompanyService.companyServiceEstimation(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comServiceEstimationSuccess({ data, message }));
                } else {
                    dispatch(comServiceEstimationError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comServiceEstimationError({ data: {}, message: error }));
            })
    }
}


// Full Product Company Dispatch
export const comFullProductDispatch = (payload, id) => {
    return (dispatch) => {
        dispatch(comDispatchRequest());
        CompanyService.companyServiceDispatch(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDispatchSuccess({ data, message }));
                } else {
                    dispatch(comDispatchError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDispatchError({ data: {}, message: error }));
            })
    }
}

// Company parts Dispatch
export const comPartsDispatch = (payload, id) => {
    return (dispatch) => {
        dispatch(comPartsDispatchRequest());
        CompanyService.companyServicePartsDispatch(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comPartsDispatchSuccess({ data, message }));
                } else {
                    dispatch(comPartsDispatchError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comPartsDispatchError({ data: {}, message: error }));
            })
    }
}

export const downloadDispatchPdf = (payload, id) => {
    return (dispatch) => {
        dispatch(comDispatchPdfRequest());
        CompanyService.comServiceDispatchPdf(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDispatchPdfSuccess({ data, message }));
                } else {
                    dispatch(comDispatchPdfError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDispatchPdfError({ data: {}, message: error }));
            })
    }
}

export const downloadServicePdf = (payload, id) => {
    return (dispatch) => {
        dispatch(comDownloadServiceRequest());
        CompanyService.downloadServicePdf(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDownloadServiceSuccess({ data, message }));
                } else {
                    dispatch(comDownloadServiceError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDownloadServiceError({ data: {}, message: error }));
            })
    }
}

export const downloadServiceChallan = (id) => {
    return (dispatch) => {
        dispatch(comDownloadServiceChallanRequest())
        CompanyService.downloadServiceChallan(id)
        .then((response) => {
            const {data, success, message} = response?.data;
            if(success){
                dispatch(comDownloadServiceChallanSuccess({data, message}))
            }else{
                dispatch(comDownloadServiceChallanError({data, message}))
            }
        })
        .catch((error) => {
            dispatch(comDownloadServiceChallanError({data: {}, message: error}))
        })
    }
}

export const completeComService = (id, payload) => {
    return (dispatch) => {
        dispatch(comCompleteServiceRequest())
        CompanyService.completeComService(id, payload)
        .then((response) => {
            const {data, success, message} = response?.data;
            if(success){
                dispatch(comCompleteServiceSuccess({data, message}))
            }else{
                dispatch(comCompleteServiceError({data, message}))
            }
        })
        .catch((error) => {
            dispatch(comCompleteServiceError({data: {}, message: error}))
        })
    }
}

export const resetComCompleteService = () => {
    return (dispatch) => {
        dispatch(comCompleteServiceReset());
    }
}

export const resetComDownloadServiceChallan = () => {
    return (dispatch) => {
        dispatch(comDownloadServiceChallanReset());
    }
}

export const resetComAction = () => {
    return (dispatch) => {
        dispatch(comActionTakeReset());
    }
}

export const resetComActionProduct = () => {
    return (dispatch) => {
        dispatch(comActionTakeProductReset());
    }
}

export const resetComFinalReceiveProduct = () => {
    return (dispatch) => {
        dispatch(comFinalReceiveReset());
    }
}


export const resetComConfirmation = () => {
    return (dispatch) => {
        dispatch(comReceiveConfirmationReset());
    }
}

export const resetComConfirmationProduct = () => {
    return (dispatch) => {
        dispatch(comReceiveConfirmationProductReset());
    }
}

export const resetComEstimation = () => {
    return (dispatch) => {
        dispatch(comServiceEstimationReset());
    }
}

export const resetComDispatch = () => {
    return (dispatch) => {
        dispatch(comDispatchReset());
    }
}

export const resetComPartsDispatch = () => {
    return (dispatch) => {
        dispatch(comPartsDispatchReset());
    }
}


export const resetComDispatchPdf = () => {
    return (dispatch) => {
        dispatch(comDispatchPdfReset());
    }
}

export const resetComDownloadService = () => {
    return (dispatch) => {
        dispatch(comDownloadServiceReset());
    }
}