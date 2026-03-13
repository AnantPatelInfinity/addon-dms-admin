import React, { useState } from "react";
import ImageUpload from "../ImageUpload/ImageUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { getAdminStorage } from "../../LocalStorage/AdminStorage";
import { getDealerStorage } from "../../LocalStorage/DealerStorage";
import { DX_URL } from "../../../config/baseUrl";
import { getCustomerStorage } from "../../LocalStorage/CustomerStorage";

const CourierDispatch = ({
  serviceId,
  serviceData,
  fetchServiceData,
  isDealer = false,
  isCustomer = false,
  serviceParts = [],
}) => {
  // const { post } = useApi();
  const [courier, setCourier] = useState({
    dispatchPdf: "",
    description: ""
  });
  const [disable, setDisable] = useState(false);
  const adminStorage = getAdminStorage();
  const dealerStorage = getDealerStorage();
  const customerStorage = getCustomerStorage();

  const [errors, setErrors] = useState({
    dispatchPdf: ""
  });

  const validate = () => {
    let valid = true;
    let newErrors = { dispatchPdf: "" };

    if (!courier.dispatchPdf) {
      newErrors.dispatchPdf = "Dispatch PDF is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleSubmit = async () => {

    if (!validate()) return;

    if (!courier.dispatchPdf) {
      toast.error("Please upload a dispatch document.");
      return;
    }
    try {
      const dispatchData = {
        dispatchPdf: courier.dispatchPdf,
        description: courier.description || "",
        time: Date.now()
      }

      let url = "";

      if (isDealer) {
        url = serviceData?.isFullProduct
          ? `${DX_URL}/dealer/dealer-courier-dispatch/${serviceId}`
          : `${DX_URL}/dealer/dealer-customer-part-dispatch/${serviceId}`;
      }
      else if (isCustomer) {
        url = serviceData?.isFullProduct
          ? `${DX_URL}/customer/customer-courier-dispatch/${serviceId}`
          : `${DX_URL}/customer/customer-part-dispatch/${serviceId}`
      } else {
        url = serviceData?.isFullProduct
          ? `${DX_URL}/admin/admin-courier-dispatch/${serviceId}`
          : `${DX_URL}/admin/admin-customer-part-dispatch/${serviceId}`;
      }

      const token = isDealer
        ? dealerStorage.DX_DL_TOKEN
        : isCustomer
          ? customerStorage?.DX_CU_TOKEN
          : adminStorage.DX_AD_TOKEN;

      const formData = new URLSearchParams();
      formData.append("courierAdminDispatch", JSON.stringify(dispatchData));
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = response?.data;

      if (success) {
        toast.success(message);
        fetchServiceData();
        setCourier({
          dispatchPdf: "",
          time: Date.now(),
        });
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error, "Error");
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-shipping-fast me-2"></i>
          Courier Dispatch Details
        </h5>
      </div>
      <div className="card-body">
        <ImageUpload
          label="Courier Dispatch Document"
          name="dispatchPdf"
          value={courier.dispatchPdf}
          onChange={(k, v) => setCourier((p) => ({ ...p, [k]: v }))}
          allowPdf={true}
        />
        {errors.dispatchPdf && (
          <p className="text-danger mt-1">{errors.dispatchPdf}</p>
        )}
        <div className="col-md-12 mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control`}
            rows="3"
            placeholder="Enter Description"
            value={courier.description}
            onChange={(e) =>
              setCourier({ ...courier, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="col-md-12 text-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={disable}
          >
            {disable ? (
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
    </div>
  );
};

export default CourierDispatch;
