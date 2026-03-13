import React, { useEffect, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { useLocation, useNavigate } from 'react-router';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';

const ManageDispatchCompany = () => {

  const { post } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [dispatchCompany, setDispatchCompany] = useState({
    name: "",
    status: true,
  });

  useEffect(() => {
    if (data?._id) {
      setDispatchCompany({
        name: data?.name,
        status: data?.status,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispatchCompany((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = () => {
    const newErrors = {};
    if (!dispatchCompany.name) newErrors.name = "Name is required";
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
      formData.append("name", dispatchCompany.name);
      formData.append("status", dispatchCompany.status);
      const url = data?._id ? `/admin/manage-dispatch-company/${data._id}` : "/admin/manage-dispatch-company";
      const response = await post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const { success, message } = response;
      if (success) {
        if (addMore) {
          setDispatchCompany({
            name: "",
            status: true
          });
        } else {
          navigate(ADMIN_URLS.DISPATCH_LIST);
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
            { label: "Dispatch Company List", to: ADMIN_URLS.DISPATCH_LIST },
            { label: `Dispatch Company ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Dispatch Company {data?._id ? "Edit" : "Add"}</h4>
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
                    value={dispatchCompany.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <label>Dispatch Company Name <span className="text-danger">*</span></label>
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
                      checked={dispatchCompany.status}
                      onChange={(e) => setDispatchCompany({ ...dispatchCompany, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {dispatchCompany.status ? "Active" : "Inactive"}
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

export default ManageDispatchCompany