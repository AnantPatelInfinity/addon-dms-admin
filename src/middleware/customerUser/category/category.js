import { CuCategoryService } from "../../../services/customer/category";
import { categoryListError, categoryListRequest, categoryListSuccess } from "../../../slices/customer/category.slice";

export const getCategoryList = (payload) => {
    return (dispatch) => {
        dispatch(categoryListRequest());
        CuCategoryService.categoryList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(categoryListSuccess({ data, message }));
                } else {
                    dispatch(categoryListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(categoryListError({ data: [], message: error }));
            });
    }
}