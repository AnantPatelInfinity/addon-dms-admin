import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { toast } from "react-toastify";
import { getCompanyStorage } from "../../LocalStorage/CompanyStorage";
import { getComPartsList } from "../../../middleware/companyUser/comParts/comParts";
import {
  comTakeAction,
  comTakeProductAction,
  resetComAction,
  resetComActionProduct,
} from "../../../middleware/companyUser/comService/comService";
import { FileUpload } from "../../FileUpload/FileUpload";
import { DX_URL } from "../../../config/baseUrl";
import axios from "axios";

const CompanyAction = ({ serviceId, fetchServiceData, comOneService }) => {
  const [form, setForm] = useState({
    damageType: "full",
    parts: [],
    warrantyType: "",
    description: "",
    dealerAmount: "",
    customerAmount: "",
    image: "",
    time: Date.now(),
  });

  const [formErrors, setFormErrors] = useState({});
  const [disable, setDisable] = useState(false);

  const dispatch = useDispatch();
  const companyStorage = getCompanyStorage();

  const { comActionTakeError, comActionTakeLoading, comActionTakeMessage, comActionTakeProductMessage, comActionTakeProductError } =
    useSelector((state) => state?.comService);

  const { companyPartsList, companyPartsListLoading } = useSelector(
    (state) => state?.comPart
  );

  useEffect(() => {
    const payload = {
      firmId: companyStorage.firmId,
      companyId: companyStorage.comId,
    };
    dispatch(getComPartsList(payload));
  }, []);

  useEffect(() => {
    if (comActionTakeMessage) {
      toast.success(comActionTakeMessage);
      dispatch(resetComAction());
      fetchServiceData();
      setForm({
        damageType: "full",
        parts: [],
        warrantyType: "",
        description: "",
        dealerAmount: "",
        customerAmount: "",
        image: "",
        time: Date.now(),
      });
    }
    if (comActionTakeError) {
      toast.error(comActionTakeError);
      dispatch(resetComAction());
    }
  }, [comActionTakeMessage, comActionTakeError]);

  useEffect(() => {
    if (comActionTakeProductMessage) {
      toast.success(comActionTakeProductMessage);
      dispatch(resetComActionProduct());
      fetchServiceData();
      setForm({
        damageType: "full",
        parts: [],
        warrantyType: "",
        description: "",
        dealerAmount: "",
        customerAmount: "",
        image: "",
        time: Date.now(),
      });
    }
    if (comActionTakeProductError) {
      toast.error(comActionTakeProductError);
      dispatch(resetComActionProduct());
    }
  }, [comActionTakeProductMessage, comActionTakeProductError]);



  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!form.damageType) {
      errors.damageType = "Please select a damage type.";
      valid = false;
    }

    if (form.damageType === "parts") {
      if (!form.parts.length) {
        errors.parts = "Please select at least one damaged part.";
        valid = false;
      }
      if (!form.warrantyType) {
        errors.warrantyType = "Please select warranty type.";
        valid = false;
      }
      if (!form.description.trim()) {
        errors.description = "Description is required.";
        valid = false;
      }
      if (form.warrantyType === "out") {
        if (!form.customerAmount || Number(form.customerAmount) <= 0) {
          errors.customerAmount = "Please enter valid amount.";
          valid = false;
        }
        if (!form.dealerAmount || Number(form.dealerAmount) <= 0) {
          errors.dealerAmount = "Please enter valid amount.";
          valid = false;
        }
      }
    }

    if (form.damageType === "full") {
      if (!form.description.trim()) {
        errors.description = "Description is required.";
        valid = false;
      }
    }

    setFormErrors(errors);
    return valid;
  };

  const getDefaultWarrantyType = (status) => {
    if (status === 1 || status === 2) return "under";
    if (status === 3) return "out";
    return "";
  };

  const handleDamageTypeChange = (value) => {
    if (value === "parts") {
      const defaultWarranty = getDefaultWarrantyType(
        comOneService?.serviceWarrantyStatus
      );
      setForm({
        ...form,
        damageType: value,
        parts: [],
        warrantyType: defaultWarranty,
        dealerAmount: "",
        customerAmount: "",
        image: "",
      });
    } else {
      setForm({
        ...form,
        damageType: value,
        parts: [],
        warrantyType: "",
        dealerAmount: "",
        customerAmount: "",
        image: "",
      });
    }
  };

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
        toast.success(`File uploaded successfully`);
        setForm((prev) => ({ ...prev, image: fileUrl }));
      } else {
        toast.error(message || `Upload failed`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Error uploading`);
    } finally {
      setDisable(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (form.damageType === "parts") {

      const companyAction = {
        isParts: form.damageType === "parts" ? true : false,
        serviceParts: form.damageType === "parts" ? form.parts : [],
        isWarranty: form.warrantyType === "under" ? true : false,
        description: form.description,
        pdf: form.warrantyType === "under" ? form.image : "",
        dealerAmount:
          form.damageType === "parts" && form.warrantyType === "out"
            ? form.dealerAmount
            : null,
        customerAmount:
          form.damageType === "parts" && form.warrantyType === "out"
            ? form.customerAmount
            : null,
        time: form.time,
      };

      dispatch(comTakeAction(companyAction, serviceId));

    } else if (form.damageType === "full") {

      let ProductAction = {
        description: form.description,
      };
      dispatch(comTakeProductAction(ProductAction, serviceId))
    }
  };


  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-building me-2"></i> Company Action Details
        </h5>
      </div>

      <div className="card-body">
        <form>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label fw-semibold">Damage Type</label>
              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    type="radio"
                    id="parts"
                    name="damageType"
                    value="parts"
                    className="form-check-input"
                    checked={form.damageType === "parts"}
                    onChange={(e) => handleDamageTypeChange(e.target.value)}
                  />
                  <label htmlFor="parts" className="form-check-label">
                    Spare / Parts
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    id="full"
                    name="damageType"
                    value="full"
                    className="form-check-input"
                    checked={form.damageType === "full"}
                    onChange={(e) => handleDamageTypeChange(e.target.value)}
                  />
                  <label htmlFor="full" className="form-check-label">
                    Full Product
                  </label>
                </div>
              </div>
              {formErrors.damageType && (
                <small className="text-danger">{formErrors.damageType}</small>
              )}
            </div>

            {form.damageType === "parts" && (
              <div className="col-lg-4 col-12">
                <label className="form-label fw-semibold">
                  Select Parts
                </label>
                <MultiSelect
                  value={form.parts}
                  onChange={(e) => setForm({ ...form, parts: e.value })}
                  options={
                    companyPartsList?.map((part) => ({
                      label: part.name,
                      value: {
                        partId: part._id,
                        // name: part.name,
                        amount: part.amount,
                      },
                    })) || []
                  }
                  optionLabel="label"
                  placeholder={
                    companyPartsListLoading
                      ? "Loading parts..."
                      : "Select parts"
                  }
                  className="w-100 form-select"
                  disabled={companyPartsListLoading}
                />
                {formErrors.parts && (
                  <small className="text-danger">{formErrors.parts}</small>
                )}
              </div>
            )}

            {form.damageType === "parts" && (
              <div className="col-md-12">
                <label className="form-label fw-semibold">Warranty Type</label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="warrantyType"
                      id="under"
                      className="form-check-input"
                      value="under"
                      checked={form.warrantyType === "under"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          warrantyType: e.target.value,
                          dealerAmount: "",
                          customerAmount: "",
                        })
                      }
                    />
                    <label htmlFor="under" className="form-check-label">
                      Under Warranty
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="warrantyType"
                      id="out"
                      className="form-check-input"
                      value="out"
                      checked={form.warrantyType === "out"}
                      onChange={(e) =>
                        setForm({ ...form, warrantyType: e.target.value })
                      }
                    />
                    <label htmlFor="out" className="form-check-label">
                      Out of Warranty
                    </label>
                  </div>
                </div>
                {formErrors.warrantyType && (
                  <small className="text-danger">
                    {formErrors.warrantyType}
                  </small>
                )}
              </div>
            )}

            {form.damageType === "parts" && form.warrantyType === "out" && (
              <>
                <div className="col-lg-4 col-md-6">
                  <label className="form-label fw-semibold">
                    Dealer Amount
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.dealerAmount ? "is-invalid" : ""
                      }`}
                    placeholder="Enter amount"
                    value={form.dealerAmount}
                    onChange={(e) => setForm({ ...form, dealerAmount: e.target.value })}
                  />
                  {formErrors.dealerAmount && (
                    <div className="invalid-feedback">{formErrors.dealerAmount}</div>
                  )}
                </div>
                <div className="col-lg-4 col-md-6">
                  <label className="form-label fw-semibold">
                    Customer Amount
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.customerAmount ? "is-invalid" : ""
                      }`}
                    placeholder="Enter amount"
                    value={form.customerAmount}
                    onChange={(e) => setForm({ ...form, customerAmount: e.target.value })}
                  />
                  {formErrors.customerAmount && (
                    <div className="invalid-feedback">{formErrors.customerAmount}</div>
                  )}
                </div>
              </>

            )}

            {form.warrantyType === "under" && (
              <>
                <div className="col-12">
                  <div className="col-md-6">
                    <FileUpload
                      label="Dispatch Attachment"
                      type="image"
                      value={form.image}
                      onChange={(e) => handleImgUpload(e)}
                    />
                  </div>
                </div>
              </>
            )}

            {(form.damageType === "full" || form.damageType === "parts") && (
              <div className="col-md-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className={`form-control ${formErrors.description ? "is-invalid" : ""
                    }`}
                  rows="3"
                  placeholder="Enter Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
                {formErrors.description && (
                  <div className="invalid-feedback">
                    {formErrors.description}
                  </div>
                )}
              </div>
            )}

            <div className="col-md-12 text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={comActionTakeLoading}
              >
                {comActionTakeLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i> Submit
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

export default CompanyAction;
