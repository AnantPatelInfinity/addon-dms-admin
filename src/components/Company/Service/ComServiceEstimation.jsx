import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DX_URL } from "../../../config/baseUrl";
import { FileUpload } from "../../FileUpload/FileUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  comServiceEstimation,
  resetComEstimation,
} from "../../../middleware/companyUser/comService/comService";

const ComServiceEstimation = ({
  serviceId,
  fetchServiceData,
  comOneService,
}) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    description: "",
    pdf: "",
    dealerAmount: "",
    customerAmount: "",
    warrantyType: null,
  });
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    comServiceEstimationError,
    comServiceEstimationLoading,
    comServiceEstimationMessage,
  } = useSelector((state) => state?.comService);

  useEffect(() => {
    if (comOneService?.serviceWarrantyStatus) {
      const type =
        comOneService.serviceWarrantyStatus === 1 ? 1 : 2;
      setForm((prev) => ({ ...prev, warrantyType: type }));
    }
  }, [comOneService]);

  useEffect(() => {
    if (comServiceEstimationMessage) {
      toast.success(comServiceEstimationMessage);
      dispatch(resetComEstimation());
      fetchServiceData();
      setForm({
        description: "",
        pdf: "",
        dealerAmount: "",
        customerAmount: "",
        warrantyType: null,
      });
    }

    if (comServiceEstimationError) {
      toast.error(comServiceEstimationError);
      dispatch(resetComEstimation());
    }
  }, [comServiceEstimationMessage, comServiceEstimationError]);

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setDisable(true);
      const response = await axios.post(`${DX_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { data, message, success } = response.data;
      if (success) {
        const fileUrl = data?.image || data?.pdf;
        toast.success("File uploaded successfully");
        setForm((prev) => ({ ...prev, pdf: fileUrl }));
      } else {
        toast.error(message || "Upload failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error uploading file");
    } finally {
      setDisable(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.warrantyType) {
      newErrors.warrantyType = "Warranty type is required";
    }

    if (form.warrantyType === 2) {
      if (!form.description.trim())
        newErrors.description = "Description is required";
      if (!form.dealerAmount || isNaN(form.dealerAmount) || Number(form.dealerAmount) <= 0)
        newErrors.dealerAmount = "Valid amount is required";
      if (!form.customerAmount || isNaN(form.customerAmount) || Number(form.customerAmount) <= 0)
        newErrors.customerAmount = "Valid amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const estimationData = {
      description: form.description,
      dealerAmount: form.dealerAmount,
      customerAmount: form.customerAmount,
      pdf: form.pdf,
      warrantyType: form.warrantyType,
      time: Date.now(),
    };

    const formData = new URLSearchParams();
    formData.append("serviceEstimate", JSON.stringify(estimationData));

    dispatch(comServiceEstimation(formData, serviceId));
  };

  const handleWarrantyTypeChange = (value) => {
    setForm((prev) => ({
      ...prev,
      warrantyType: value,
      description: "",
      dealerAmount: "",
      customerAmount: "",
      pdf: "",
    }));
    setErrors({});
  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-calculator me-2"></i>
          Company Service Estimation Details
        </h5>
      </div>

      <div className="card-body">
        <form>
          <div className="row g-3">
            {/* Warranty Type Selection */}
            <div className="col-12 col-md-6">
              <label className="form-label d-block">
                Warranty Type <span className="text-danger">*</span>
              </label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className={`form-check-input ${errors.warrantyType ? "is-invalid" : ""
                      }`}
                    type="radio"
                    name="warrantyType"
                    id="underWarranty"
                    checked={form.warrantyType === 1}
                    onChange={() => handleWarrantyTypeChange(1)}
                  />
                  <label className="form-check-label" htmlFor="underWarranty">
                    Under Warranty / AMC
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className={`form-check-input ${errors.warrantyType ? "is-invalid" : ""
                      }`}
                    type="radio"
                    name="warrantyType"
                    id="outWarranty"
                    checked={form.warrantyType === 2}
                    onChange={() => handleWarrantyTypeChange(2)}
                  />
                  <label className="form-check-label" htmlFor="outWarranty">
                    Out of Warranty
                  </label>
                </div>
              </div>
              {errors.warrantyType && (
                <div className="invalid-feedback d-block">
                  {errors.warrantyType}
                </div>
              )}
            </div>


            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""
                  }`}
                rows="3"
                placeholder="Enter Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            {/* Out of Warranty Fields */}
            {form.warrantyType === 2 && (
              <>
                <div className="col-12 col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      name="dealerAmount"
                      value={form.dealerAmount}
                      onChange={(e) =>
                        setForm({ ...form, dealerAmount: e.target.value })
                      }
                      className={`form-control ${errors.dealerAmount ? "is-invalid" : ""
                        }`}
                      placeholder="Enter Amount"
                    />
                    <label>
                      Dealer Amount <span className="text-danger">*</span>
                    </label>
                    {errors.dealerAmount && (
                      <div className="invalid-feedback">{errors.dealerAmount}</div>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      name="customerAmount"
                      value={form.customerAmount}
                      onChange={(e) =>
                        setForm({ ...form, customerAmount: e.target.value })
                      }
                      className={`form-control ${errors.customerAmount ? "is-invalid" : ""
                        }`}
                      placeholder="Enter Amount"
                    />
                    <label>
                      Customer Amount <span className="text-danger">*</span>
                    </label>
                    {errors.customerAmount && (
                      <div className="invalid-feedback">{errors.customerAmount}</div>
                    )}
                  </div>
                </div>

                {/* Attachment on a new row */}
                <div className="row">
                  <div className="col-8">
                    <FileUpload
                      label="Attachment"
                      type="image"
                      value={form.pdf}
                      onChange={handleImgUpload}
                    />
                    {errors.pdf && (
                      <div className="text-danger small mt-1">{errors.pdf}</div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="col-md-12 text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={comServiceEstimationLoading || disable}
              >
                {disable || comServiceEstimationLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComServiceEstimation;
