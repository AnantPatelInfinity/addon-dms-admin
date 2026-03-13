import { CategoryService } from "../../services/category";
import { categoryListError, categoryListRequest, categoryListSuccess } from "../../slices/category.slice";



export const getCategoryList = (payload) => {
    return (dispatch) => {
        dispatch(categoryListRequest());
        CategoryService.categoryList(payload)
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