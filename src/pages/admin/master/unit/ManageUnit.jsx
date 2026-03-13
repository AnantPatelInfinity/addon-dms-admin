import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { useLocation, useNavigate } from 'react-router';
import { useApi } from '../../../../context/ApiContext';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';

const ManageUnit = () => {

  const { post } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [proCat, setProCat] = useState({
    name: "",
    status: true,
  });

  useEffect(() => {
    if (data?._id) {
      setProCat({
        name: data?.name,
        status: data?.status,
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
  }

  const validate = () => {
    const newErrors = {};
    if (!proCat.name) newErrors.name = "Name is required";
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
      formData.append("status", proCat.status);
      const url = data?._id ? `/admin/manage-unit/${data._id}` : "/admin/manage-unit";
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
          navigate(ADMIN_URLS.PRO_UNIT_LIST);
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
            { label: "Unit List", to: ADMIN_URLS.PRO_UNIT_LIST },
            { label: `Unit ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Unit {data?._id ? "Edit" : "Add"}</h4>
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
                  <label>Unit Name <span className="text-danger">*</span></label>
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

export default ManageUnit