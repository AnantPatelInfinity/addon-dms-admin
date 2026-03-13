import { CustomerDispatchThroughService } from "../../../services/customer/dispatchThrough";
import {
    dispatchThroughRequest,
    dispatchThroughSuccess,
    dispatchThroughError,

    cuAddDispatchThroughRequest,
    cuAddDispatchThroughSuccess,
    cuAddDispatchThroughError,
    cuAddDispatchThroughReset,

    cuEditDispatchThroughRequest,
    cuEditDispatchThroughSuccess,
    cuEditDispatchThroughError,
    cuEditDispatchThroughReset
} from "../../../slices/customer/dispatchThrough.slice";


export const getDispatchThroughList = (payload) => {
    return (dispatch) => {
        dispatch(dispatchThroughRequest());
        CustomerDispatchThroughService.dispatchThroughList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(dispatchThroughSuccess({ data, message }));
                } else {
                    dispatch(dispatchThroughError({ data, message }));
                }
            }).catch((error) => {
                dispatch(dispatchThroughError({ data: [], message: error }));
            });
    }
}

export const addDispatchThrough = (payload) => {
    return (dispatch) => {
        dispatch(cuAddDispatchThroughRequest());
        CustomerDispatchThroughService.cuAddDispatch(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(cuAddDispatchThroughSuccess({ data, message }));
                } else {
                    dispatch(cuAddDispatchThroughError({ data, message }));
                }
            }).catch((error) => {
                dispatch(cuAddDispatchThroughError({ data: [], message: error }));
            });
    }
}

export const editDispatchThrough = (payload, id) => {
    return (dispatch) => {
        dispatch(cuEditDispatchThroughRequest());
        CustomerDispatchThroughService.cuEditDispatch(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(cuEditDispatchThroughSuccess({ data, message }));
                } else {
                    dispatch(cuEditDispatchThroughError({ data, message }));
                }
            }).catch((error) => {
                dispatch(cuEditDispatchThroughError({ data: [], message: error }));
            });
    }
}

export const resetAddDispatchThrough = () => {
    return (dispatch) => {
        dispatch(cuAddDispatchThroughReset());
    }
}

export const resetEditDispatchThrough = () => {
    return (dispatch) => {
        dispatch(cuEditDispatchThroughReset());
    }
}