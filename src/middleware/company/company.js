import { CompanyService } from "../../services/company";
import { companyListError, companyListRequest, companyListSuccess, companyOneError, companyOneRequest, companyOneSuccess } from "../../slices/company.slice";

export const getCompanyList = (payload) => {
    return (dispatch) => {
        dispatch(companyListRequest());
        CompanyService.companyList(payload)
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
        CompanyService.companyById(companyId)
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