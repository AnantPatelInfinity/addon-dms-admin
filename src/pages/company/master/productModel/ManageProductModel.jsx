import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { getCompanyStorage } from '../../../../components/LocalStorage/CompanyStorage';
import { toast } from 'react-toastify';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { addProModel, resetAddProModel, resetUpdateProModel, updateProModel } from '../../../../middleware/companyUser/comProModel/comProModel';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';

const ManageProductModel = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const companyStorage = getCompanyStorage();
  const [errors, setErrors] = useState({});
  const [proModel, setProModel] = useState({
    name: "",
    status: true,
  });
  const [addMoreMode, setAddMoreMode] = useState(false);

  const {
    comProModelAddError,
    comProModelAddLoading,
    comProModelAddMessage,

    comProModelUpdateError,
    comProModelUpdateLoading,
    comProModelUpdateMessage,
  } = useSelector((state) => state?.comProModel);

  useEffect(() => {
    if (comProModelAddMessage) {
      toast.success(comProModelAddMessage);
      dispatch(resetAddProModel())
      if (addMoreMode) {
        setProModel({ name: "", status: true });
        setAddMoreMode(false);
      } else {
        navigate(COMPANY_URLS.MODEL_LIST);
      }
    }
    if (comProModelAddError) {
      toast.error(comProModelAddError);
      dispatch(resetAddProModel())
    }
  }, [comProModelAddMessage, comProModelAddError]);

  useEffect(() => {
    if (comProModelUpdateMessage) {
      toast.success(comProModelUpdateMessage);
      navigate(COMPANY_URLS.MODEL_LIST);
      dispatch(resetUpdateProModel())
    }
    if (comProModelUpdateError) {
      toast.error(comProModelUpdateError);
      dispatch(resetUpdateProModel())
    }
  }, [comProModelUpdateMessage, comProModelUpdateError]);

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
    return newErrors;
  }

  const handleSubmit = async (addMore = false) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const formData = new URLSearchParams();
    formData.append("name", proModel.name);
    formData.append("status", proModel.status);
    formData.append("companyId", companyStorage.comId);
    formData.append("firmId", companyStorage.firmId);

    if (data?._id) {
      dispatch(updateProModel(formData, data?._id))
    } else {
      setAddMoreMode(addMore);
      dispatch(addProModel(formData));
    }
    setProModel({ name: "", status: true });
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Model List", to: COMPANY_URLS.MODEL_LIST },
            { label: `Model ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Model {data?._id ? "Edit" : "Add"}</h4>
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
              <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)}
                disabled={comProModelAddLoading || comProModelUpdateLoading}>
                {comProModelAddLoading || comProModelUpdateLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
              {!data?._id && (
                <button type="button" className="btn btn-outline-primary mx-2"
                  onClick={() => handleSubmit(true)} disabled={comProModelAddLoading || comProModelUpdateLoading}>
                  {comProModelAddLoading || comProModelUpdateLoading ? "Loading..." : "Add More"}
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