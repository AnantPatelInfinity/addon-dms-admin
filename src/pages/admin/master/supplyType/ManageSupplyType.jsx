import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { useApi } from '../../../../context/ApiContext';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';

const ManageSupplyType = () => {

    const { post } = useApi();
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [supply, setSupply] = useState({
        name: "",
        status: true,
    });

    useEffect(() => {
        if (data?._id) {
            setSupply({
                name: data?.name,
                status: data?.status,
            });
        }
    }, [data])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupply((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    const validate = () => {
        const newErrors = {};
        if (!supply.name) newErrors.name = "Name is required";
        return newErrors;
    }

    const handleSubmit = async (addMore = false) => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setDisable(true);
        try {
            const formData = new URLSearchParams();
            formData.append("name", supply.name);
            formData.append("status", supply.status);
            const url = data?._id ? `/admin/manage-supply-type/${data._id}` : "/admin/manage-supply-type";
            const response = await post(url, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            const { success, message } = response;
            if (success) {
                if (addMore) {
                    setSupply({
                        name: "",
                        status: true
                    });
                } else {
                    navigate(ADMIN_URLS.SUPPLY_TYPE_LIST);
                }
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setDisable(false);
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs
                    crumbs={[
                        { label: "Supply Type List", to: ADMIN_URLS.SUPPLY_TYPE_LIST },
                        { label: `Supply Type ${data?._id ? "Edit" : "Add"}` },
                    ]}
                />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4 className="page-title">Supply Type {data?._id ? "Edit" : "Add"}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        name="name"
                                        value={supply.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                    />
                                    <label>Supply Type Name <span className="text-danger">*</span></label>
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                            </div>
                            {data?._id && (
                                <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
                                    <h6 className="mb-3">Status</h6>
                                    <div className="form-check form-check-md form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="switch-md"
                                            checked={supply.status}
                                            onChange={(e) => setSupply({ ...supply, status: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="switch-md">
                                            {supply.status ? "Active" : "Inactive"}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)} disabled={disable}>
                                {disable ? "Loading..." : data?._id ? "Update" : "Create"}
                            </button>
                            {!data?._id && (
                                <button type="button" className="btn btn-outline-primary mx-2" onClick={() => handleSubmit(true)} disabled={disable}>
                                    {disable ? "Loading..." : "Add More"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageSupplyType
