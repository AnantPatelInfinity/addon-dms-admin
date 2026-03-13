import React, { useEffect, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { useLocation, useNavigate } from 'react-router';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';

const ManageWarranty = () => {

  const { post } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [warranty, setWarranty] = useState({
    name: "",
    duration: "",
    status: true,
  });

  useEffect(() => {
    if (data?._id) {
      setWarranty({
        name: data?.name,
        status: data?.status,
        duration: data?.duration,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarranty((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = () => {
    const newErrors = {};
    if (!warranty.name) newErrors.name = "Name is required";
    if (!warranty.duration) {
      newErrors.duration = "Duration is required";
    } else {
      if (isNaN(warranty.duration)) {
        newErrors.duration = "Duration must be a number";
      } else if (warranty.duration <= 0) {
        newErrors.duration = "Duration must be greater than 0";
      } else if (warranty.duration % 12 !== 0) {
        newErrors.duration = "Duration must be a multiple of 12 (in months, e.g. 12, 24, 36, etc.)";
      }
    }
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
      formData.append("name", warranty.name);
      formData.append("duration", warranty.duration);
      formData.append("status", warranty.status);
      const url = data?._id ? `/admin/manage-warranty/${data._id}` : "/admin/manage-warranty";
      const response = await post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const { success, message } = response;
      if (success) {
        if (addMore) {
          setWarranty({
            name: "",
            status: true,
            duration: ""
          });
        } else {
          navigate(ADMIN_URLS.WARRANTY_LIST);
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
            { label: "Warranty List", to: ADMIN_URLS.WARRANTY_LIST },
            { label: `Warranty ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Warranty {data?._id ? "Edit" : "Add"}</h4>
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
                    value={warranty.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <label>Warranty Name <span className="text-danger">*</span></label>
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                    name="duration"
                    value={warranty.duration}
                    onChange={handleChange}
                    placeholder="Duration"
                    disabled={data?._id}
                  />
                  <label>Duration  (in months)<span className="text-danger">*</span></label>
                  {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
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
                      checked={warranty.status}
                      onChange={(e) => setWarranty({ ...warranty, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {warranty.status ? "Active" : "Inactive"}
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

export default ManageWarranty