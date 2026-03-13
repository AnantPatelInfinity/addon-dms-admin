import { CuPoItemsService } from "../../../services/customer/poItems";
import {
    poItemsRequest,
    poItemsSuccess,
    poItemsError,

    poSerialNoRequest,
    poSerialNoSuccess,
    poSerialNoError,

    poInstallSerialNoRequest,
    poInstallSerialNoSuccess,
    poInstallSerialNoError,

    cuProductPoReceiveRequest,
    cuProductPoReceiveError,
    cuProductPoReciveSuccess,
    cuProductPoReceiveReset,

} from "../../../slices/customer/poItems.slice";

export const getCuPoSerialItems = (payload) => {
    return (dispatch) => {
        dispatch(poSerialNoRequest());
        CuPoItemsService.getPoSerialNo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(poSerialNoSuccess({ data, message }));
                } else {
                    dispatch(poSerialNoError({ data, message }));
                }
            }).catch((error) => {
                dispatch(poSerialNoError({ data: [], message: error }));
            });
    }
}

export const getCuInstallSerialNo = (payload) => {
    return (dispatch) => {
        dispatch(poInstallSerialNoRequest());
        CuPoItemsService.getInstallSerialNo(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(poInstallSerialNoSuccess({ data, message }));
                } else {
                    dispatch(poInstallSerialNoError({ data, message }));
                }
            }).catch((error) => {
                dispatch(poInstallSerialNoError({ data: [], message: error }));
            });
    }
}


export const getCuPoProductReceive = (id) => {
    return (dispatch) => {
        cuProductPoReceiveRequest();
        CuPoItemsService.receivePoProduct(id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(cuProductPoReciveSuccess({ data, message }))
                } else {
                    dispatch(cuProductPoReceiveError({ data, message }))
                }
            })
            .catch((error) => {
                dispatch(cuProductPoReceiveError({ data: {}, message: error }))
            })
    }
}

export const resetCuPoProductReceive = () => {
    return (dispatch) => {
        dispatch(cuProductPoReceiveReset())
    }
}