import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { addSupplyType, resetAddSupplyType, resetUpdateSupplyType, updateSupplyType } from '../../../../middleware/companyUser/comSupplyType/comSupplyType';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';

const ManageSupplyType = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [supply, setSupply] = useState({
    name: "",
    status: true,
  });

  const [addMoreMode, setAddMoreMode] = useState(false);

  const {
    comAddSupplyTypeError,
    comAddSupplyTypeLoading,
    comAddSupplyTypeMessage,

    comUpdateSupplyTypeError,
    comUpdateSupplyTypeLoading,
    comUpdateSupplyTypeMessage,
  } = useSelector((state) => state?.comSupplyType);

  useEffect(() => {
    if (comAddSupplyTypeMessage) {
      toast.success(comAddSupplyTypeMessage);
      dispatch(resetAddSupplyType())
      if (addMoreMode) {
        setSupply({ name: "", status: true });
        setAddMoreMode(false);
      } else {
        navigate(COMPANY_URLS.SUPPLY_TYPE_LIST);
      }
    }
    if (comAddSupplyTypeError) {
      toast.error(comAddSupplyTypeError);
      dispatch(resetAddSupplyType())
    }
  }, [comAddSupplyTypeMessage, comAddSupplyTypeError]);

  useEffect(() => {
    if (comUpdateSupplyTypeMessage) {
      toast.success(comUpdateSupplyTypeMessage);
      navigate(COMPANY_URLS.SUPPLY_TYPE_LIST);
      dispatch(resetUpdateSupplyType())
    }
    if (comUpdateSupplyTypeError) {
      toast.error(comUpdateSupplyTypeError);
      dispatch(resetUpdateSupplyType())
    }
  }, [comUpdateSupplyTypeMessage, comUpdateSupplyTypeError]);

  useEffect(() => {
    if (data?._id) {
      setSupply({
        name: data?.name,
        status: data?.status,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupply((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = () => {
    const errs = {};
    if (!supply.name?.trim()) errs.name = "unit name is required.";
    return errs;
  }

  const handleSubmit = async (addMore = false) => {
    if (comAddSupplyTypeLoading || comUpdateSupplyTypeLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const formData = new URLSearchParams();
    formData.append("name", supply.name);
    formData.append("status", supply.status);

    if (data?._id) {
      dispatch(updateSupplyType(formData, data?._id))
    } else {
      setAddMoreMode(addMore);
      dispatch(addSupplyType(formData))
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Supply Type List", to: COMPANY_URLS.SUPPLY_TYPE_LIST },
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
              <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)}
                disabled={comAddSupplyTypeLoading || comUpdateSupplyTypeLoading}>
                {comAddSupplyTypeLoading || comUpdateSupplyTypeLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
              {!data?._id && (
                <button type="button" className="btn btn-outline-primary mx-2"
                  onClick={() => handleSubmit(true)} disabled={comAddSupplyTypeLoading || comUpdateSupplyTypeLoading}>
                  {comAddSupplyTypeLoading || comUpdateSupplyTypeLoading ? "Loading..." : "Add More"}
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