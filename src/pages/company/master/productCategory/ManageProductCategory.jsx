import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { addComCategory, resetAddCategory, resetUpdateCategory, updateComCategory } from '../../../../middleware/companyUser/comCategory/comCategory';
import { toast } from 'react-toastify';

const ManageProductCategory = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [errors, setErrors] = useState({});
  const [proCat, setProCat] = useState({
    name: "",
    status: true,
  });
  const [addMoreMode, setAddMoreMode] = useState(false);

  const {
    comAddCategoryError,
    comAddCategoryLoading,
    comAddCategoryMessage,

    comUpdateCategoryError,
    comUpdateCategoryLoading,
    comUpdateCategoryMessage
  } = useSelector((state) => state.comCategory);

  useEffect(() => {
    if (comAddCategoryMessage) {
      toast.success(comAddCategoryMessage);
      dispatch(resetAddCategory())
      if (addMoreMode) {
        setProCat({ name: "", status: true });
        setAddMoreMode(false);
      } else {
        navigate(COMPANY_URLS.CATEGORY_LIST);
      }
    }
    if (comAddCategoryError) {
      toast.error(comAddCategoryError);
      dispatch(resetAddCategory())
    }
  }, [comAddCategoryMessage, comAddCategoryError]);

  useEffect(() => {
    if (comUpdateCategoryMessage) {
      toast.success(comUpdateCategoryMessage);
      navigate(COMPANY_URLS.CATEGORY_LIST);
      dispatch(resetUpdateCategory())
    }
    if (comUpdateCategoryError) {
      toast.error(comUpdateCategoryError);
      dispatch(resetUpdateCategory())
    }
  }, [comUpdateCategoryMessage, comUpdateCategoryError]);

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
    if (comAddCategoryLoading || comUpdateCategoryLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const formData = new URLSearchParams();
    formData.append("name", proCat.name);
    formData.append("status", proCat.status);

    if (data?._id) {
      dispatch(updateComCategory(formData, data?._id))
    } else {
      setAddMoreMode(addMore);
      dispatch(addComCategory(formData))
    }
  }


  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Product Category List", to: COMPANY_URLS.CATEGORY_LIST },
            { label: `Product Category ${data?._id ? "Edit" : "Add"}` },
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
                    value={proCat.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <label>Category Name <span className="text-danger">*</span></label>
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
              <button type="button" className="btn btn-primary"
                onClick={() => handleSubmit(false)} disabled={comAddCategoryLoading || comUpdateCategoryLoading}>
                {comAddCategoryLoading || comUpdateCategoryLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
              {!data?._id && (
                <button type="button" className="btn btn-outline-primary mx-2"
                  onClick={() => handleSubmit(true)} disabled={comAddCategoryLoading || comUpdateCategoryLoading}>
                  {comAddCategoryLoading || comUpdateCategoryLoading ? "Loading..." : "Add More"}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ManageProductCategory