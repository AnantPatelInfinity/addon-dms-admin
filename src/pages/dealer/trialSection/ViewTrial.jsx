import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { getTrialBadge, getTrialHistoryStatus } from "../../../config/setup";
import { useDispatch, useSelector } from "react-redux";
import { dispatchDeTrial, resetDispatchDeTrial, resetReturnDeTrial, returnDeTrial, viewDeTrialData } from "../../../middleware/dealerTrial/dealerTrial";
import { Button } from "react-bootstrap";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import { toast } from "react-toastify";
import moment from "moment";
import Swal from "sweetalert2";

const ViewTrial = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: trialId } = useLocation();

  const { trialOne, trialOneLoading,
    dispatchTrialMessage, dispatchTrialError,
    returnTrialMessage, returnTrialError } = useSelector((state) => state.dealerTrial);

  useEffect(() => {
    if (dispatchTrialMessage) {
      toast.success(dispatchTrialMessage);
      dispatch(viewDeTrialData(trialId));
      dispatch(resetDispatchDeTrial());
    }
    if (dispatchTrialError) {
      toast.error(dispatchTrialError);
      dispatch(viewDeTrialData(trialId));
      dispatch(resetDispatchDeTrial());
    }
    if (returnTrialMessage) {
      toast.success(returnTrialMessage);
      dispatch(viewDeTrialData(trialId));
      dispatch(resetReturnDeTrial());
    }
    if (returnTrialError) {
      toast.error(returnTrialError);
      dispatch(viewDeTrialData(trialId));
      dispatch(resetReturnDeTrial());
    }
  }, [dispatchTrialMessage, dispatchTrialError,
    returnTrialMessage, returnTrialError])

  useEffect(() => {
    if (trialId) {
      dispatch(viewDeTrialData(trialId));
    }
  }, [dispatch, trialId]);

  if (trialOneLoading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner text="Loading unit details..." size="md" />
      </div>
    );
  }

  const getUpdateButtonText = () => {
    const status = trialOne?.trial?.status;
    if (status === "CREATED") {
      return "Dispatch Demo Unit";
    }
    if (status === "RETURNED_BY_CUSTOMER") {
      return "Receive From Customer";
    }
    return null;
  };

  const handleUpdateDemoStatus = async () => {
    const status = trialOne?.trial?.status;
    let nextStatus = "";
    let action = null;
    let title = "";
    let buttonColor = "#0d6efd";
    let defaultRemarks = ""

    if (status === "CREATED") {
      nextStatus = "DISPATCHED";
      action = dispatchDeTrial;
      title = "Dispatch Demo Unit";
      defaultRemarks = "Demonstration unit dispatched to customer."
    }
    else if (status === "RETURNED_BY_CUSTOMER") {
      nextStatus = "COMPLETED";
      action = returnDeTrial;
      title = "Receive Demo Unit From Customer";
      buttonColor = "#dc3545";
      defaultRemarks = "Demonstration unit received back from customer."
    }
    else {
      Swal.fire({
        icon: "info",
        title: "No Action Available",
        text: "Demo unit status cannot be updated."
      });
      return;
    }

    const { value: remarks } = await Swal.fire({
      title: title,
      text: "Add remarks",
      input: "textarea",
      inputPlaceholder: "Enter remarks here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonColor: "#6c757d",
      confirmButtonColor: buttonColor
    });

    if (remarks === undefined) return;

    dispatch(
      action(trialId, {
        status: nextStatus,
        remarks: remarks || defaultRemarks,
        userType: "DEALER",
        userId: getDealerStorage()?.DL_ID,
      })
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <BreadCrumbs
            crumbs={[
              { label: "Demo Unit List", to: DEALER_URLS.TRIAL_LIST },
              { label: "View Demo Unit Details" },
            ]}
          />

          <div className="card shadow-sm border-0">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                  <h4 className="page-title">View Demo Unit Details</h4>
                </div>
                <div className="col-lg-6 col-md-6 col-12 text-end">
                  <span className="badge bg-success me-2">
                    Demo Unit No: {trialOne?.trial?.trialNo || "N/A"}
                  </span>
                  <span className={getTrialBadge(trialOne?.trial?.status)}>
                    {getTrialBadge(trialOne?.trial?.status, trialOne?.trial?.entryType)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Product Information */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                    Product Information
                  </h5>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Product Name
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.productName || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Product Model
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.productModel || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Serial No
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.serialNo || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Status
                  </label>
                  <div className="fs-15 fw-medium">
                    <span className={getTrialBadge(trialOne?.trial?.status)}>
                      {getTrialBadge(trialOne?.trial?.status, trialOne?.trial?.entryType)}
                    </span>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Docket
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={trialOne?.trial?.isDocket || false}
                      id="isDocketCheckbox"
                    />
                    <label
                      className="form-check-label fw-medium"
                      htmlFor="isDocketCheckbox"
                    >
                      Is Docket
                    </label>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                    Timeline
                  </h5>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Register Date
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.registerDate
                      ? new Date(trialOne?.trial?.registerDate).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Start Date
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.startDate
                      ? new Date(trialOne?.trial?.startDate).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    End Date
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.endDate
                      ? new Date(trialOne?.trial?.endDate).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                    Customer Information
                  </h5>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Customer Name
                  </label>
                  <div className="fs-15 fw-medium">
                    {`${trialOne?.trial?.customerId?.title || ""} ${trialOne?.trial?.customerId?.name || ""
                      } ${trialOne?.trial?.customerId?.lastName || ""}`.trim() || "-"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Email
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.customerId?.email || "N/A"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Phone
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.customerId?.phone || "N/A"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Clinic Name
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.customerId?.clinicName || "N/A"}
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Address
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.customerId?.address || "N/A"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Customer Remark
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.customerRemarks || "-"}
                  </div>
                </div>

              </div>

              {(Array.isArray(trialOne?.trial?.images) &&
                trialOne?.trial?.images.length > 0) ||
                (Array.isArray(trialOne?.trial?.descPdf) &&
                  trialOne?.trial?.descPdf.length > 0) ? (
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                      <i className="fas fa-paperclip me-2"></i>
                      Uploaded Files
                    </h5>
                  </div>

                  {/* Images */}
                  {Array.isArray(trialOne?.trial?.images) &&
                    trialOne?.trial?.images.length > 0 && (
                      <div className="col-12 mb-4">
                        <h6 className="fw-bold text-dark mb-3">
                          <i className="fas fa-images me-2"></i>Images (
                          {trialOne?.trial?.images.length})
                        </h6>
                        <div className="row g-3">
                          {trialOne?.trial?.images.map((img, index) => (
                            <div
                              key={img._id || index}
                              className="col-lg-2 col-md-3 col-sm-4 col-6"
                            >
                              <div className="card border-0 shadow-sm">
                                <img
                                  src={img || ""}
                                  alt={`Trial Image ${index + 1}`}
                                  className="card-img-top"
                                  style={{
                                    height: "120px",
                                    objectFit: "cover",
                                    cursor: img ? "pointer" : "default",
                                  }}
                                  onClick={() =>
                                    img && window.open(img, "_blank")
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* PDFs */}
                  {Array.isArray(trialOne?.trial?.descPdf) &&
                    trialOne?.trial?.descPdf.length > 0 && (
                      <div className="col-12 mb-3">
                        <h6 className="fw-bold text-dark mb-3">
                          <i className="fas fa-file-pdf me-2 text-danger"></i>
                          PDF Files ({trialOne?.trial?.descPdf.length})
                        </h6>
                        <div className="row g-3">
                          {trialOne?.trial?.descPdf.map((pdf, index) => (
                            <div
                              key={pdf._id || index}
                              className="col-xxl-3 col-xl-4 col-md-6 col-12"
                            >
                              <div className="card border-0 shadow-sm p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="text-truncate">
                                    <i className="fas fa-file-pdf me-2 text-danger"></i>
                                    <span className="fw-medium">
                                      {pdf.originalName || `PDF ${index + 1}`}
                                    </span>
                                  </div>
                                  {pdf && (
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => window.open(pdf, "_blank")}
                                    >
                                      <i className="fas fa-eye me-1"></i>View
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : null}

              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                    Engineer Details
                  </h5>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Engineer Name
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.engineerName || "-"}
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Engineer Remark
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialOne?.trial?.engineerRemarks || "-"}
                  </div>
                </div>
              </div>

              {/* Tracking History  */}
              <div className="p-0 border-0 mt-4 mb-4">
                <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                  Tracking History
                </h5>

                {trialOne?.trackingHistory?.map((item, index) => (
                  <div className="border-bottom  mb-3" key={item._id || index}>

                    {/* Step Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-1 mb-1">

                      <div className="d-flex align-items-center gap-2">

                        {/* Step Number */}
                        <span className="text-muted">
                          {index + 1}.
                        </span>

                        {/* Status Badge */}
                        {getTrialHistoryStatus(item?.status, item?.entryType)}

                        {/* Actor */}
                        <label
                          className="form-label text-muted fw-semibold mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          ({item.updatedBy})
                        </label>

                      </div>

                      {/* Date */}
                      <span className="text-muted small mt-1 mt-md-0 ms-auto">
                        {moment(item.date).format("DD MMM YYYY • hh:mm A")}
                      </span>
                    </div>

                    {/* Remarks */}
                    <div className="bg-light rounded mb-1 mt-2">
                      <p className="mb-0">
                        {item.remarks || "-"}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            <div className={`card-footer d-flex flex-wrap
              ${(trialOne?.trial?.status === "DISPATCHED" || trialOne?.trial?.status === "RECEIVED_BY_CUSTOMER" || trialOne?.trial?.status === "COMPLETED")
                ? "justify-content-end" : "justify-content-between"}`}>
              {getUpdateButtonText() && (
                <button
                  className="btn btn-primary mb-3"
                  onClick={handleUpdateDemoStatus}
                >
                  {getUpdateButtonText()}
                </button>
              )}
              <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate(DEALER_URLS.TRIAL_LIST)}
              >
                <i className="fas fa-arrow-left me-2"></i> Back to Demo Unit List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTrial;
