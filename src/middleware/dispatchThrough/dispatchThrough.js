import { dispatchThroughService } from "../../services/dispatchThrough";
import {
    dispatchThroughRequest,
    dispatchThroughSuccess,
    dispatchThroughError,

    deAddDispatchThroughRequest,
    deAddDispatchThroughSuccess,
    deAddDispatchThroughError,
    deAddDispatchThroughReset,

    deEditDispatchThroughRequest,
    deEditDispatchThroughSuccess,
    deEditDispatchThroughError,
    deEditDispatchThroughReset
} from "../../slices/dispatchThrough.slice";


export const getDispatchThroughList = (payload) => {
    return (dispatch) => {
        dispatch(dispatchThroughRequest());
        dispatchThroughService.dispatchThroughList(payload)
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
        dispatch(deAddDispatchThroughRequest());
        dispatchThroughService.deAddDispatch(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(deAddDispatchThroughSuccess({ data, message }));
                } else {
                    dispatch(deAddDispatchThroughError({ data, message }));
                }
            }).catch((error) => {
                dispatch(deAddDispatchThroughError({ data: [], message: error }));
            });
    }
}

export const editDispatchThrough = (payload, id) => {
    return (dispatch) => {
        dispatch(deEditDispatchThroughRequest());
        dispatchThroughService.deEditDispatch(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(deEditDispatchThroughSuccess({ data, message }));
                } else {
                    dispatch(deEditDispatchThroughError({ data, message }));
                }
            }).catch((error) => {
                dispatch(deEditDispatchThroughError({ data: [], message: error }));
            });
    }
}

export const resetAddDispatchThrough = () => {
    return (dispatch) => {
        dispatch(deAddDispatchThroughReset());
    }
}

export const resetEditDispatchThrough = () => {
    return (dispatch) => {
        dispatch(deEditDispatchThroughReset());
    }
}