import React, { useEffect, useState } from "react";
import COMPANY_URLS from "../../../config/routesFile/company.routes";
import { useLocation, useNavigate } from "react-router";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import { companyRoleOptions } from "../../../config/DataFile";
import { useDispatch, useSelector } from "react-redux";
import {
  AddComUser,
  EditComUser,
  resetComAddUser,
  resetComEditUser,
} from "../../../middleware/companyUser/companyUserList/comUser";
import { toast } from "react-toastify";
import { getCompanyStorage } from "../../../components/LocalStorage/CompanyStorage";

const ManageUser = () => {
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const dispatch = useDispatch();
  const companyStorage = getCompanyStorage();

  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    comAddUserMessage,
    comAddUserError,
    comAddUserLoading,
    comEditUserMessage,
    comEditUserError,
    comEditUserLoading,
  } = useSelector((state) => state?.comUser);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  // Handle messages
  useEffect(() => {
    if (comAddUserMessage) {
      toast.success(comAddUserMessage);
      navigate(COMPANY_URLS.USERS);
      dispatch(resetComAddUser());
    }
    if (comAddUserError) {
      toast.error(comAddUserError);
      dispatch(resetComAddUser());
    }
  }, [comAddUserMessage, comAddUserError]);

  useEffect(() => {
    if (comEditUserMessage) {
      toast.success(comEditUserMessage);
      navigate(COMPANY_URLS.USERS);
      dispatch(resetComEditUser());
    }
    if (comEditUserError) {
      toast.error(comEditUserError);
      dispatch(resetComEditUser());
    }
  }, [comEditUserMessage, comEditUserError]);

  // Populate data if editing
  useEffect(() => {
    if (data?._id) {
      setUser({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        password: "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!user.name) newErrors.name = "Name is required";
    if (!user.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!user.phone) newErrors.phone = "Mobile is required";
    else if (!/^\d{10}$/.test(user.phone)) {
      newErrors.phone = "Mobile must be 10 digits";
    }
    if (!user.role) newErrors.role = "Role is required";

    // Password required for new user or if changing
    if (!data?._id || user.password) {
      if (!user.password)
        newErrors.password = "Password is required";
      else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
          user.password
        )
      )
        newErrors.password =
          "Password must have 8 chars, uppercase, lowercase, number & special char";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setDisable(true);

    const formData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyId: companyStorage?.comId,
    };

    if (user.password) {
      formData.password = user.password;
      formData.showPassword = user.password; 
    }

    if (data?._id) {
      dispatch(EditComUser(data._id, formData));
    } else {
      dispatch(AddComUser(formData));
    }

    setDisable(false);
  };

  const renderInput = (label, name, type = "text", required = false) => (
    <div className="col-lg-4 col-md-6 col-12 mb-3">
      <label>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        name={name}
        value={user[name]}
        onChange={handleChange}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "User List", to: COMPANY_URLS.USERS },
            { label: `${data?._id ? "Edit" : "Add"} User` },
          ]}
        />
        <div className="card">
          <div className="card-header">
            <h4>{data?._id ? "Edit" : "Add"} User</h4>
          </div>
          <div className="card-body">
            <div className="row">
              {renderInput("Name", "name", "text", true)}
              {renderInput("Email", "email", "email", true)}
              {renderInput("Mobile", "phone", "tel", true)}
              {renderInput(
                "Password",
                "password",
                "password",
                !data?._id
              )}
              <div className="col-lg-4 col-md-6 col-12 mb-3">
                <label>
                  Role <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.role ? "is-invalid" : ""}`}
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  {companyRoleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <div className="invalid-feedback">{errors.role}</div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-light me-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={disable || comAddUserLoading || comEditUserLoading}
              >
                {data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
