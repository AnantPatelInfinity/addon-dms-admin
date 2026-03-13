import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DX_URL } from "../../../config/baseUrl";
import { getAdminStorage } from "../../LocalStorage/AdminStorage";
import { FileUpload } from "../../FileUpload/FileUpload";
import { getDealerStorage } from "../../LocalStorage/DealerStorage";

const InstallationDetails = ({ serviceData, isCustomer = false, serviceId, fetchServiceData, isDealer = false }) => {
  const [form, setForm] = useState({
    name: "",
    image: "",
    time: Date.now(),
    description: ""
  });


  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});

  const adminStorage = getAdminStorage();
  const dealerStorage = getDealerStorage();

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getApiUrl = () => {
    return isDealer === true ? `${DX_URL}/dealer/dealer-customer-service-installation/${serviceId}` :
      isCustomer === true ? `${DX_URL}/customer/customer-service-installation/${serviceId}` :
        `${DX_URL}/admin/admin-customer-service-installation/${serviceId}`
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setDisable(true);

      const payload = {
        name: form.name || "",
        image: form.image || "",
        status: serviceData?.status,
        isComplete: true,
        description: form.description || "",
        time: Date.now() || ""
      };

      //   const formData = new URLSearchParams();
      //   formData.append("installationDetails", payload);

      const url = getApiUrl();
      const token = isDealer === true ? dealerStorage?.DX_DL_TOKEN : adminStorage?.DX_AD_TOKEN;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = response?.data;
      if (success) {
        toast.success(message || "Installation details saved");
        fetchServiceData();
        setForm({
          name: "",
          image: "",
          description: "",
          time: "",
        });
      } else {
        toast.error(message || "Failed to save installation details");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-tools me-2"></i>
          Spares/Parts Replacement Process
        </h5>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-xxl-4 col-md-6">
            <label className="form-label fw-semibold">Enginner Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-6 col-12">
            <FileUpload
              label="Installation Image"
              type="image"
              value={form.image}
              onChange={(e) => handleImgUpload(e)}
            />
            {errors.image && (
              <div className="invalid-feedback d-block">{errors.image}</div>
            )}
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control`}
              rows="3"
              placeholder="Enter Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-12 text-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={disable}
          >
            {disable ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallationDetails;
