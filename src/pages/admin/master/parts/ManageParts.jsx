import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { useApi } from '../../../../context/ApiContext';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';

const ManageParts = () => {

  const { post, get } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [proCat, setProCat] = useState({
    name: "",
    amount: "",
    companyId: "",
    description: "",
    status: true,
  });
  const [companyData, setCompanyData] = useState([]);
  const adminStorage = getAdminStorage();

  useEffect(() => {
    const fetchCompanyData = async () => {
      const response = await get(`/admin/get-company?firmId=${adminStorage.DX_AD_FIRM}&status=${2}`);
      const { success, data } = response;
      if (success) {
        setCompanyData(data);
      }
    }
    fetchCompanyData();
  }, [])


  useEffect(() => {
    if (data?._id) {
      setProCat({
        name: data?.name,
        amount: data?.amount,
        companyId: data?.companyId,
        status: data?.status,
        description: data?.description,
      });
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProCat((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
    setErrors((prev) => {
      return {
        ...prev,
        [name]: ""
      }
    })
  }

  const validate = () => {
    const newErrors = {};
    if (!proCat.name) newErrors.name = "Name is required";
    if (proCat.amount === undefined || proCat.amount === null || proCat.amount === "") {
      newErrors.amount = "Amount is required";
    } else if (isNaN(proCat.amount)) {
      newErrors.amount = "Amount must be a valid number";
    } else if (Number(proCat.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!proCat.companyId) newErrors.companyId = "Company is required";
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
      formData.append("name", proCat.name);
      formData.append("amount", proCat.amount);
      formData.append("companyId", proCat.companyId);
      formData.append("status", proCat.status);
      formData.append("description", proCat.description);
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      const url = data?._id ? `/admin/manage-parts/${data._id}` : "/admin/manage-parts";
      const response = await post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const { success, message } = response;
      if (success) {
        if (addMore) {
          setProCat({
            name: "",
            status: true
          });
        } else {
          navigate(ADMIN_URLS.PRO_PART_LIST);
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
            { label: "Part List", to: ADMIN_URLS.PRO_PART_LIST },
            { label: `Part ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Part {data?._id ? "Edit" : "Add"}</h4>
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
                    value={proCat.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <label>Part Name <span className="text-danger">*</span></label>
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                    name="amount"
                    value={proCat.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                  />
                  <label>Amount <span className="text-danger">*</span></label>
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select className={`form-select ${errors.companyId ? "is-invalid" : ""}`} name="companyId" value={proCat.companyId} onChange={handleChange}>
                    <option value="">Select Company</option>
                    {companyData.map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                  <label>Company <span className="text-danger">*</span></label>
                  {errors.companyId && <div className="invalid-feedback">{errors.companyId}</div>}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12">
                <div className="form-floating mb-3">
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    name="description"
                    value={proCat.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                  ></textarea>
                  <label>Description </label>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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
                      checked={proCat.status}
                      onChange={(e) => setProCat({ ...proCat, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {proCat.status ? "Active" : "Inactive"}
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

export default ManageParts