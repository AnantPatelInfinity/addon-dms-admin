import { DePoItemsService } from "../../services/poItems";
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

    deProductPoReceiveRequest,
    deProductPoReceiveError,
    deProductPoReciveSuccess,
    deProductPoReceiveReset,

    
} from "../../slices/dePoItems.slices";

export const getPoSerialItems = (payload) => {
    return (dispatch) => {
        dispatch(poSerialNoRequest());
        DePoItemsService.getPoSerialNo(payload)
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

export const getDeInstallSerialNo = (payload) => {
    return (dispatch) => {
        dispatch(poInstallSerialNoRequest());
        DePoItemsService.getInstallSerialNo(payload)
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


export const getDePoProductReceive = (id) => {
    return (dispatch) => {
        deProductPoReceiveRequest();
        DePoItemsService.receivePoProduct(id)
        .then((response) => {
            const {data, success, message} = response?.data;
            if(success === true){
                dispatch(deProductPoReciveSuccess({data, message}))
            }else{
                dispatch(deProductPoReceiveError({data, message}))
            }
        })
        .catch((error) => {
            dispatch(deProductPoReceiveError({data: {}, message: error}))
        })
    }
}

export const resetDePoProductReceive = () => {
    return (dispatch) => {
        dispatch(deProductPoReceiveReset())
    }
}