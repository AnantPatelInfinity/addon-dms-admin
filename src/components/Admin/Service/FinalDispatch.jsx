import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DX_URL } from "../../../config/baseUrl";
import { getAdminStorage } from "../../LocalStorage/AdminStorage";
import { FileUpload } from "../../FileUpload/FileUpload";
import { getDealerStorage } from "../../LocalStorage/DealerStorage";
import { getCustomerStorage } from "../../LocalStorage/CustomerStorage";

const FinalDispatch = ({ serviceId, fetchServiceData, isDealer = false, isCustomer = false }) => {
  const [form, setForm] = useState({
    image: "",
    time: Date.now(),
  });
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});

  const adminStorage = getAdminStorage();
  const dealerStorage = getDealerStorage()
  const customerStorage = getCustomerStorage()

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
    if (!form.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getApiUrl = () => {
    return isDealer === true ? `${DX_URL}/dealer/dealer-customer-parts-dispatch-opt/${serviceId}` :
    isCustomer ? `${DX_URL}/customer/customer-parts-dispatch-opt/${serviceId}` :
    `${DX_URL}/admin/admin-customer-parts-dispatch-opt/${serviceId}` 
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setDisable(true);

      const payload = {
        dispatchPdf: form.image,
        // isComplete: true,
      };

      //   const formData = new URLSearchParams();
      //   formData.append("installationDetails", payload);

      const url = getApiUrl();
      const token = isDealer === true ? dealerStorage?.DX_DL_TOKEN : isCustomer === true ? customerStorage?.DX_CU_TOKEN : adminStorage?.DX_AD_TOKEN;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = response?.data;
      if (success) {
        toast.success(message || "Dispatch details saved");
        fetchServiceData();
        setForm({
          image: "",
          time: Date.now(),
        });
      } else {
        toast.error(message || "Failed to save Dispatch details");
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
          Customer Dispatch Details (Optional)
        </h5>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-xxl-6 col-12">
            <FileUpload
              label="Product/part Attachment"
              type="image"
              value={form.image}
              onChange={(e) => handleImgUpload(e)}
            />
            {errors.image && (
              <div className="invalid-feedback d-block">{errors.image}</div>
            )}
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

export default FinalDispatch;
