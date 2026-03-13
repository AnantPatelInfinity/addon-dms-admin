import { CustomerCompanyService } from "../../../services/customer/company";
import { companyListError, companyListRequest, companyListSuccess, 
    companyOneError, companyOneRequest, companyOneSuccess } from "../../../slices/customer/company.slice";

export const getCompanyList = (payload) => {
    return (dispatch) => {
        dispatch(companyListRequest());
        CustomerCompanyService.companyList(payload)
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success === true) {
                    dispatch(companyListSuccess({ data, message }));
                } else {
                    dispatch(companyListError({ data, message }));
                }
            }).catch((error) => {
                dispatch(companyListError({ data: [], message: error }));
            });
    }
}

export const getOneCompany = (companyId) => {
    return (dispatch) => {
        dispatch(companyOneRequest())
        CustomerCompanyService.companyById(companyId)
        .then((response) => {
            const {data, success, message} = response?.data;
            if(success === true){
                dispatch(companyOneSuccess({data, message}))
            }else{
                dispatch(companyOneError({data, message}))
            }
        })
        .catch((error) => {
            dispatch(companyOneError({data: {}, message: error}))
        })
    }
}