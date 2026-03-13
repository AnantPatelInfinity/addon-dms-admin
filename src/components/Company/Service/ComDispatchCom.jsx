import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { FileUpload } from "../../FileUpload/FileUpload";
import { DX_URL } from "../../../config/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import {
  comFullProductDispatch,
  comPartsDispatch,
  resetComDispatch,
  resetComPartsDispatch,
} from "../../../middleware/companyUser/comService/comService";

const ComDispatchCom = ({ serviceId, serviceData, fetchServiceData }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    pdf: "",
    description: "",
  });
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({
    pdf: ""
  });

  const validate = () => {
    let isValid = true;
    let newErrors = { pdf: "" };

    if (!form.pdf) {
      newErrors.pdf = "Dispatch document is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const { comDispatchError, comDispatchLoading, comDispatchMessage, comPartsDispatchMessage, comPartsDispatchError } =
    useSelector((state) => state?.comService);

  useEffect(() => {
    if (comDispatchMessage) {
      toast.success(comDispatchMessage);
      dispatch(resetComDispatch());
      setForm({
        pdf: "",
      });
      fetchServiceData();
    }
    if (comDispatchError) {
      toast.error(comDispatchError);
      dispatch(resetComDispatch());
    }
  }, [comDispatchMessage, comDispatchError]);

  useEffect(() => {
    if (comPartsDispatchMessage) {
      toast.success(comPartsDispatchMessage);
      dispatch(resetComPartsDispatch());
      setForm({
        pdf: "",
      });
      fetchServiceData();
    }
    if (comPartsDispatchError) {
      toast.error(comPartsDispatchError);
      dispatch(resetComPartsDispatch());
    }
  }, [comPartsDispatchMessage, comPartsDispatchError]);

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
        setForm((prev) => ({ ...prev, pdf: fileUrl }));
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

    if (!validate()) return;

    if (!form.pdf) {
      toast.error("Please upload the dispatch document");
      return;
    }

    const dispatchData = {
      pdf: form.pdf,
      description: form.description,
      time: Date.now(),
    };
    const formData = new URLSearchParams();
    formData.append("companyDispatch", JSON.stringify(dispatchData));
    if (serviceData?.isFullProduct === true) {
      dispatch(comFullProductDispatch(formData, serviceId));
    } else {
      dispatch(comPartsDispatch(formData, serviceId));
    }

  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Company Service Spares/Machine Dispatch Details
        </h5>
      </div>
      <div className="card-body">
        <form>
          <div className="row g-3">
            <div className="col-lg-6 col-12">
              <FileUpload
                label="Attatchment"
                type="image"
                value={form.pdf}
                onChange={handleImgUpload}
              />
            </div>
            {errors.pdf && (
              <p className="text-danger mt-1">{errors.pdf}</p>
            )}

            <div className="col-md-12">
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

            <div className="col-md-12 text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={comDispatchLoading || disable}
              >
                {disable || comDispatchLoading ? (
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

export default ComDispatchCom;
