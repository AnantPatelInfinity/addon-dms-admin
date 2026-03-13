import React, { useEffect, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { useLocation, useNavigate } from 'react-router';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';

const ManageProductModel = () => {

  const { post, get } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [proModel, setProModel] = useState({
    name: "",
    companyId: "",
    status: true,
  });
  const [companyData, setCompanyData] = useState([]);
  const adminStorage = getAdminStorage();

  useEffect(() => {
    getCompanyData();
  }, [])

  const getCompanyData = async () => {
    try {
      const result = await get(`/admin/get-company?firmId=${adminStorage.DX_AD_FIRM}`);
      const { data, success } = result;
      if (success) {
        setCompanyData(data || []);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data?._id) {
      setProModel({
        name: data?.name,
        companyId: data?.companyId,
        status: data?.status,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProModel((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = () => {
    const newErrors = {};
    if (!proModel.name) newErrors.name = "Name is required";
    if (!proModel.companyId) newErrors.companyId = "Company is required";
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
      formData.append("name", proModel.name);
      formData.append("companyId", proModel.companyId);
      formData.append("status", proModel.status);
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      const url = data?._id ?
        `/admin/manage-product-model/${data._id}` :
        "/admin/manage-product-model";

      const response = await post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const { success, message } = response;
      if (success) {
        if (addMore) {
          setProModel({
            name: "",
            companyId: "",
            status: true,
          })
        } else {
          navigate(ADMIN_URLS.PRO_MODEL_LIST);
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
            { label: "Product Model List", to: ADMIN_URLS.PRO_MODEL_LIST },
            { label: `Product Model ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Product Category {data?._id ? "Edit" : "Add"}</h4>
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
                    value={proModel.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <label>Product Model Name <span className="text-danger">*</span></label>
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select
                    className={`form-select ${errors.companyId ? "is-invalid" : ""}`}
                    name="companyId"
                    value={proModel.companyId}
                    onChange={handleChange}
                  >
                    <option value="">Select Company</option>
                    {companyData?.map((elem) => (
                      <option key={elem?._id} value={elem?._id}>{elem?.name}</option>
                    ))}
                  </select>
                  <label>Company <span className="text-danger">*</span></label>
                  {errors.companyId && <div className="invalid-feedback">{errors.companyId}</div>}
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
                      checked={proModel.status}
                      onChange={(e) => setProModel({ ...proModel, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {proModel.status ? "Active" : "Inactive"}
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

export default ManageProductModel