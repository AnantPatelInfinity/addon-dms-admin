import React, { useEffect, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { useLocation, useNavigate } from 'react-router';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import AmcForm from '../../../../components/Admin/AmcForm/AmcForm';
import moment from 'moment';
import { toast } from 'react-toastify';

const ManageAmc = () => {

    const { post, get } = useApi();
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const adminStorage = getAdminStorage();
    const firmId = adminStorage.DX_AD_FIRM;
    const [disable, setDisable] = useState(false);
    const [errors, setErrors] = useState({});
    const [amc, setAmc] = useState({
        customerId: "",
        serialNoId: "",
        companyId: "",
        entryDate: moment().format("YYYY-MM-DD"),
        warrantyId: "",
        startDate: "",
        endDate: "",
        amount: "",
        description: "",
        document: "",
        installationId: "",
    });
    const [dropdowns, setDropdowns] = useState({
        customerData: [],
        serialNoData: [],
        warrantyData: [],
        installationData: [],
    });
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);

    useEffect(() => {
        fetchDropdowns();
        // eslint-disable-next-line
    }, [firmId]);

    useEffect(() => {
        if (data?._id) {
            fetchEditAmc();
        }
    }, [data?._id]);

    const fetchEditAmc = async () => {
        try {
            const response = await post(`/admin/get-amc-warranty/${data?._id}`, { firmId: firmId });
            const { data: resData, success } = response;
            if (success) {
                setAmc(prev => ({
                    ...prev,
                    entryDate: resData?.entryDate ? moment(resData?.entryDate).format("YYYY-MM-DD") : "",
                    warrantyId: resData?.warrantyId,
                    startDate: resData?.startDate ? moment(resData?.startDate).format("YYYY-MM-DD") : "",
                    endDate: resData?.endDate ? moment(resData?.endDate).format("YYYY-MM-DD") : "",
                    amount: resData?.amount,
                    description: resData?.description,
                    document: resData?.document,
                    customerId: resData?.customerId,
                    serialNoId: resData?.serialNoId,
                    companyId: resData?.companyId,
                    installationId: resData?.installationId,
                }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch AMC data");
        }
    }

    const fetchDropdowns = async () => {
        setLoadingDropdowns(true);
        try {
            const [customerRes, serialNoRes, warrantyRes, installationRes] = await Promise.all([
                get(`/admin/get-customer?status=${2}`),
                post("/admin/get-serial-no", { firmId: firmId }),
                get(`/admin/get-warranty?status=${true}`),
                post(`/admin/get-installation`, { firmId: firmId }),
            ]);
            setDropdowns(prev => ({
                ...prev,
                customerData: customerRes?.data || [],
                serialNoData: serialNoRes?.data || [],
                warrantyData: warrantyRes?.data || [],
                installationData: installationRes?.data || [],
            }));
        } catch (error) {
            toast.error("Failed to load dropdown data");
            setDropdowns({
                customerData: [],
                serialNoData: [],
                warrantyData: [],
                installationData: [],
            });
        } finally {
            setLoadingDropdowns(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAmc({ ...amc, [name]: value });

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }

    const validate = () => {
        const newErrors = {};
        if (!amc.customerId) newErrors.customerId = "Customer is required";
        if (!amc.serialNoId) newErrors.serialNoId = "Serial number is required";
        if (!amc.entryDate) newErrors.entryDate = "Entry date is required";
        if (!amc.warrantyId) newErrors.warrantyId = "Warranty is required";
        if (!amc.startDate) newErrors.startDate = "Start date is required";
        if (!amc.endDate) newErrors.endDate = "End date is required";
        if (!amc.amount) newErrors.amount = "Amount is required";
        if (!amc.installationId) newErrors.installationId = "Installation is required";
        return newErrors;
    }

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            setDisable(true);
            const formData = new URLSearchParams();
            formData.append("firmId", adminStorage.DX_AD_FIRM);
            formData.append("customerId", amc.customerId);
            formData.append("serialNoId", amc.serialNoId);
            formData.append("companyId", amc.companyId);
            formData.append("installationId", amc.installationId);
            formData.append("entryDate", amc.entryDate);
            formData.append("warrantyId", amc.warrantyId);
            formData.append("startDate", amc.startDate);
            formData.append("endDate", amc.endDate);
            formData.append("amount", amc.amount);
            formData.append("description", amc.description);
            formData.append("document", amc.document);
            // formData.append("status", amc.status);
            const url = data?._id ? `admin/manage-amc-warranty/${data?._id}` : `admin/manage-amc-warranty`
            const response = await post(url, formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });
            const { success, message } = response;
            if (success) {
                toast.success(message);
                navigate(ADMIN_URLS.AMC_LIST);
                setAmc({
                    customerId: "",
                    serialNoId: "",
                    companyId: "",
                    entryDate: moment().format("YYYY-MM-DD"),
                    warrantyId: "",
                    startDate: "",
                    endDate: "",
                    amount: "",
                    description: "",
                    document: "",
                    installationId: "",
                })
                setErrors({});
            } else {
                toast.error(message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setDisable(false);
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs
                    crumbs={[
                        { label: "AMC List", to: ADMIN_URLS.AMC_LIST },
                        { label: `AMC ${data?._id ? "Edit" : "Add"}` },
                    ]}
                />
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4 className="page-title">
                                    AMC {data?._id ? "Edit" : "Add"}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {loadingDropdowns ? (
                            <div className="text-center py-5">Loading...</div>
                        ) : (
                            <AmcForm
                                amc={amc}
                                setAmc={setAmc}
                                errors={errors}
                                handleChange={handleChange}
                                dropdowns={dropdowns}
                                editId={data?._id}
                            />
                        )}
                        <div className="d-flex align-items-center justify-content-end mt-4">
                            <button type="button" className="btn btn-light me-2" onClick={() => navigate(ADMIN_URLS.AMC_LIST)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={disable}>
                                {disable ? "Loading..." : data?._id ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAmc