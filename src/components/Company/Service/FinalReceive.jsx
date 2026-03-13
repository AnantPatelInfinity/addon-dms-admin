import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { comFinalReceiveProduct, resetComFinalReceiveProduct } from "../../../middleware/companyUser/comService/comService";

const FinalReceive = ({ serviceId, fetchServiceData }) => {
  const [form, setForm] = useState({
    isReceive: false,
  });
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);

  const { comFinalReceiveMessage, comFinalReceiveError, comFinalReceive } = useSelector((state) => state.comService)

  const dispatch = useDispatch();

  useEffect(() => {
    if(comFinalReceiveMessage){
        toast.success(comFinalReceiveMessage)
        dispatch(resetComFinalReceiveProduct())
        fetchServiceData()
    }else if(comFinalReceiveError){
        toast.error(comFinalReceiveError)
        dispatch(resetComFinalReceiveProduct())
    }
  }, [comFinalReceiveMessage, comFinalReceiveError])

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
      
      const payload = {
        companyReceiveDetails: {
          isReceive: form.isReceive,
        }
      };

      dispatch(comFinalReceiveProduct(payload, serviceId));


    } catch (error) {
      console.error("Error submitting receive status:", error);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mt-4">
      {/* <div className="card-header bg-light border-0">
        <h5 className="card-title mb-0 text-primary">
          <i className="fas fa-box me-2"></i> Information Received
        </h5>
      </div> */}

      <div className="card-body">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label d-block">
              Is Spare Parts Received? <span className="text-danger">*</span>
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

export default FinalReceive;
