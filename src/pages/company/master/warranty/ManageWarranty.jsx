import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { addWarranty, resetAddWarranty, resetUpdateWarranty, updateWarranty } from '../../../../middleware/companyUser/comWarranty/comWarranty';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { toast } from 'react-toastify';

const ManageWarranty = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [warranty, setWarranty] = useState({
    name: "",
    status: true,
  });
  const [addMoreMode, setAddMoreMode] = useState(false);

  const {
    comAddWarrantyError,
    comAddWarrantyLoading,
    comAddWarrantyMessage,

    comUpdateWarrantyError,
    comUpdateWarrantyLoading,
    comUpdateWarrantyMessage
  } = useSelector((state) => state.comWarranty);

  useEffect(() => {
    if (comAddWarrantyMessage) {
      toast.success(comAddWarrantyMessage);
      dispatch(resetAddWarranty())
      if (addMoreMode) {
        setWarranty({ name: "", status: true });
        setAddMoreMode(false);
      } else {
        navigate(COMPANY_URLS.WARRANTY_LIST);
      }
    }
    if (comAddWarrantyError) {
      toast.error(comAddWarrantyError);
      dispatch(resetAddWarranty())
    }
  }, [comAddWarrantyMessage, comAddWarrantyError]);

  useEffect(() => {
    if (comUpdateWarrantyMessage) {
      toast.success(comUpdateWarrantyMessage);
      navigate(COMPANY_URLS.WARRANTY_LIST);
      dispatch(resetUpdateWarranty())
    }
    if (comUpdateWarrantyError) {
      toast.error(comUpdateWarrantyError);
      dispatch(resetUpdateWarranty())
    }
  }, [comUpdateWarrantyMessage, comUpdateWarrantyError])

  useEffect(() => {
    if (data?._id) {
      setWarranty({
        name: data?.name,
        status: data?.status,
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
    const errs = {};
    if (!warranty.name?.trim()) errs.name = "Warranty name is required.";
    return errs;
  }

  const handleSubmit = async (addMore = false) => {
    if (comAddWarrantyLoading || comUpdateWarrantyLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const formData = new URLSearchParams();
    formData.append("name", warranty.name);
    formData.append("status", warranty.status);

    if (data?._id) {
      dispatch(updateWarranty(formData, data?._id))
    } else {
      setAddMoreMode(addMore);
      dispatch(addWarranty(formData))
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Warranty List", to: COMPANY_URLS.WARRANTY_LIST },
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
              <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)}
                disabled={comAddWarrantyLoading || comUpdateWarrantyLoading}>
                {comAddWarrantyLoading || comUpdateWarrantyLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
              {!data?._id && (
                <button type="button" className="btn btn-outline-primary mx-2"
                  onClick={() => handleSubmit(true)} disabled={comAddWarrantyLoading || comUpdateWarrantyLoading}>
                  {comAddWarrantyLoading || comUpdateWarrantyLoading ? "Loading..." : "Add More"}
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