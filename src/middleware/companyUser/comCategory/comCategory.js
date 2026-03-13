import { ComCategoryService } from "../../../services/company/comCategory";
import {
    comCategoryListRequest,
    comCategoryListSuccess,
    comCategoryListError,
    comCategoryListReset,

    comAddCategoryRequest,
    comAddCategorySuccess,
    comAddCategoryError,
    comAddCategoryReset,

    comUpdateCategoryRequest,
    comUpdateCategorySuccess,
    comUpdateCategoryError,
    comUpdateCategoryReset,

    comDeleteCategoryRequest,
    comDeleteCategorySuccess,
    comDeleteCategoryError,
    comDeleteCategoryReset
} from "../../../slices/company/comCategory.slice";

export const getComCategoryList = (payload) => {
    return (dispatch) => {
        dispatch(comCategoryListRequest());
        ComCategoryService.getAllCategoryList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comCategoryListSuccess({ data, message }));
                } else {
                    dispatch(comCategoryListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comSupplyTypeListError({ data: [], message: error }));
            })
    }
}

export const addComCategory = (payload) => {
    return (dispatch) => {
        dispatch(comAddCategoryRequest());
        ComCategoryService.addCategory(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comAddCategorySuccess({ data, message }));
                } else {
                    dispatch(comAddCategoryError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comAddCategoryError({ data: {}, message: error }));
            })
    }
}

export const updateComCategory = (payload, id) => {
    return (dispatch) => {
        dispatch(comUpdateCategoryRequest());
        ComCategoryService.editCategory(payload, id)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comUpdateCategorySuccess({ data, message }));
                } else {
                    dispatch(comUpdateCategoryError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comUpdateCategoryError({ data: {}, message: error }));
            })
    }
}

export const deleteComCategory = (payload) => {
    return (dispatch) => {
        dispatch(comDeleteCategoryRequest());
        ComCategoryService.deleteCategory(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(comDeleteCategorySuccess({ data, message }));
                } else {
                    dispatch(comDeleteCategoryError({ data, message }));
                }
            }).catch((error) => {
                dispatch(comDeleteCategoryError({ data: {}, message: error }));
            })
    }
}

export const resetCategoryList = () => {
    return (dispatch) => {
        dispatch(comCategoryListReset());
    }
}

export const resetAddCategory = () => {
    return (dispatch) => {
        dispatch(comAddCategoryReset());
    }
}

export const resetUpdateCategory = () => {
    return (dispatch) => {
        dispatch(comUpdateCategoryReset());
    }
}

export const resetDeleteCategory = () => {
    return (dispatch) => {
        dispatch(comDeleteCategoryReset());
    }
}