import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { addComParts, resetComAddParts, resetComUpdateParts, updateComParts } from '../../../../middleware/companyUser/comParts/comParts';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import { getCompanyStorage } from '../../../../components/LocalStorage/CompanyStorage';

const ManageParts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [part, setPart] = useState({
    name: "",
    amount: "",
    description: "",
    status: true,
  });
  const companyStorage = getCompanyStorage();
  const [addMoreMode, setAddMoreMode] = useState(false);

  const {
    addCompanyPartsError,
    addCompanyPartsLoading,
    addCompanyPartsMessage,

    updateCompanyPartsError,
    updateCompanyPartsLoading,
    updateCompanyPartsMessage,
  } = useSelector((state) => state.comPart);

  useEffect(() => {
    if (addCompanyPartsMessage) {
      toast.success(addCompanyPartsMessage);
      dispatch(resetComAddParts())
      if (addMoreMode) {
        setPart({ name: "", status: true });
        setAddMoreMode(false);
      } else {
        navigate(COMPANY_URLS.PART_LIST);
      }
    }
    if (addCompanyPartsError) {
      toast.error(addCompanyPartsError);
      dispatch(resetComAddParts())
    }
  }, [addCompanyPartsMessage, addCompanyPartsError]);

  useEffect(() => {
    if (updateCompanyPartsMessage) {
      toast.success(updateCompanyPartsMessage);
      navigate(COMPANY_URLS.PART_LIST);
      dispatch(resetComUpdateParts())
    }
    if (updateCompanyPartsError) {
      toast.error(updateCompanyPartsError);
      dispatch(resetComUpdateParts())
    }
  }, [updateCompanyPartsMessage, updateCompanyPartsError]);

  useEffect(() => {
    if (data?._id) {
      setPart({
        name: data?.name,
        amount: data?.amount,
        description: data?.description,
        companyId: data?.companyId,
        firmId: data?.firmId,
        status: data?.status,
      });
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPart((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validate = () => {
    const newErrors = {};
    if (!part.name) newErrors.name = "Name is required";
    if (part.amount === undefined || part.amount === null || part.amount === "") {
      newErrors.amount = "Amount is required";
    } else if (isNaN(part.amount)) {
      newErrors.amount = "Amount must be a valid number";
    } else if (Number(part.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    return newErrors;
  }

  const handleSubmit = async (addMore = false) => {
    if (addCompanyPartsLoading || updateCompanyPartsLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const formData = new URLSearchParams();
    formData.append("name", part.name);
    formData.append("amount", part.amount);
    formData.append("description", part.description);
    formData.append("companyId", companyStorage.comId);
    formData.append("firmId", companyStorage.firmId);
    formData.append("status", part.status);

    if (data?._id) {
      dispatch(updateComParts(formData, data?._id))
    } else {
      setAddMoreMode(addMore);
      dispatch(addComParts(formData))
    }
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Part List", to: COMPANY_URLS.PART_LIST },
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
                    value={part.name}
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
                    value={part.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                  />
                  <label>Amount <span className="text-danger">*</span></label>
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12">
                <div className="form-floating mb-3">
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    name="description"
                    value={part.description}
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
                      checked={part.status}
                      onChange={(e) => setPart({ ...part, status: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="switch-md">
                      {part.status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)}
                disabled={addCompanyPartsLoading || updateCompanyPartsLoading}>
                {addCompanyPartsLoading || updateCompanyPartsLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
              {!data?._id && (
                <button type="button" className="btn btn-outline-primary mx-2"
                  onClick={() => handleSubmit(true)} disabled={addCompanyPartsLoading || updateCompanyPartsLoading}>
                  {addCompanyPartsLoading || updateCompanyPartsLoading ? "Loading..." : "Add More"}
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