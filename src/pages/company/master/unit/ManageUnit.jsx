import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { addUnitData, editUnitData, resetAddUnit, resetUpdateUnit } from '../../../../middleware/companyUser/comUnit/comUnit';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';

const ManageUnit = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [unit, setUnit] = useState({
    name: "",
    status: true,
  });
  const [addMoreMode, setAddMoreMode] = useState(false);

  const {
    comAddUnitError,
    comAddUnitLoading,
    comAddUnitMessage,

    comUpdateUnitError,
    comUpdateUnitLoading,
    comUpdateUnitMessage
  } = useSelector((state) => state?.comUnit);

  useEffect(() => {
    if (comAddUnitMessage) {
      toast.success(comAddUnitMessage);
      dispatch(resetAddUnit())
      if (addMoreMode) {
        setUnit({ name: "", status: true });
        setAddMoreMode(false);
      } else {
        navigate(COMPANY_URLS.UNIT_LIST);
      }
    }
    if (comAddUnitError) {
      toast.error(comAddUnitError);
      dispatch(resetAddUnit())
    }
  }, [comAddUnitMessage, comAddUnitError]);

  useEffect(() => {
    if (comUpdateUnitMessage) {
      toast.success(comUpdateUnitMessage);
      navigate(COMPANY_URLS.UNIT_LIST);
      dispatch(resetUpdateUnit())
    }
    if (comUpdateUnitError) {
      toast.error(comUpdateUnitError);
      dispatch(resetUpdateUnit())
    }
  }, [comUpdateUnitMessage, comUpdateUnitError]);

  useEffect(() => {
    if (data?._id) {
      setUnit({
        name: data?.name,
        status: data?.status,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnit((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = () => {
    const errs = {};
    if (!unit.name?.trim()) errs.name = "unit name is required.";
    return errs;
  }

  const handleSubmit = async (addMore = false) => {
    if (comAddUnitLoading || comUpdateUnitLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const formData = new URLSearchParams();
    formData.append("name", unit.name);
    formData.append("status", unit.status);

    if (data?._id) {
      dispatch(editUnitData(formData, data?._id))
    } else {
      setAddMoreMode(addMore);
      dispatch(addUnitData(formData))
    }
  }


  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Unit List", to: COMPANY_URLS.UNIT_LIST },
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
                    value={unit.name}
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
                      checked={unit.status}
                      onChange={(e) => setUnit({ ...unit, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {unit.status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)}
                disabled={comAddUnitLoading || comUpdateUnitLoading}>
                {comAddUnitLoading || comUpdateUnitLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
              {!data?._id && (
                <button type="button" className="btn btn-outline-primary mx-2"
                  onClick={() => handleSubmit(true)} disabled={comAddUnitLoading || comUpdateUnitLoading}>
                  {comAddUnitLoading || comUpdateUnitLoading ? "Loading..." : "Add More"}
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