import React, { useState } from "react";
import { toast } from "react-toastify";
import { useApi } from "../../../context/ApiContext";

const AdminReceive = ({ serviceId, fetchServiceData, serviceObj }) => {
  const { post } = useApi();
  const [form, setForm] = useState({
    isReceive: false,
  });
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);

  const handleChange = (value) => {
    setForm({ isReceive: value });
    if (errors.isReceive) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.isReceive === null) {
      newErrors.isReceive = "Please select an option.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setDisable(true);
      const url = `/admin/admin-customer-part-receive-info/${serviceId}`;
      const payload = {
        isReceive: form.isReceive,
      };

      const response = await post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { success, message } = response;

      if (success) {
        toast.success(message || "Status updated successfully!");
        setForm({ isReceive: null });
        fetchServiceData();
      } else {
        toast.error(message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error submitting receive status:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-box me-2"></i> Information Received
        </h5>
      </div>

      <div className="card-body">
        {serviceObj?.serviceParts?.length > 0 ? (
          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Part Name</th>
                </tr>
              </thead>
              <tbody>
                {serviceObj?.serviceParts?.map((part, index) => (
                  <tr key={part._id || index}>
                    <td>{index + 1}</td>
                    <td>{part.name || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">
            No parts data available for this service.
          </p>
        )}

        {serviceObj?.serviceWarrantyStatus === 3 && (
          <div className="my-2 mb-3">
            <p className="fw-bold">
              {" "}
              Estimate Amount:{" "}
              <span className="ms-1 ">
                {serviceObj?.serviceEstimate?.amount || "N/A"}
              </span>{" "}
            </p>
          </div>
        )}

        <div className="row g-3">
          <div className="col-12">
            <label className="form-label d-block">
              Is Spare/Parts Received? <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className={`form-check-input ${
                    errors.isReceive ? "is-invalid" : ""
                  }`}
                  type="radio"
                  name="isReceive"
                  id="received"
                  checked={form.isReceive === true}
                  onChange={() => handleChange(true)}
                  disabled={disable}
                />
                <label className="form-check-label" htmlFor="received">
                  Yes
                </label>
              </div>

              <div className="form-check">
                <input
                  className={`form-check-input ${
                    errors.isReceive ? "is-invalid" : ""
                  }`}
                  type="radio"
                  name="isReceive"
                  id="notReceived"
                  checked={form.isReceive === false}
                  onChange={() => handleChange(false)}
                  disabled={disable}
                />
                <label className="form-check-label" htmlFor="notReceived">
                  No
                </label>
              </div>
            </div>
            {errors.isReceive && (
              <div className="invalid-feedback d-block">{errors.isReceive}</div>
            )}
          </div>

          <div className="col-md-12 text-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={disable}
            >
              {disable ? (
                "Submitting..."
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i> Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReceive;
