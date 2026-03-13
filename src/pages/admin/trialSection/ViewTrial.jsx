import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import { useApi } from "../../../context/ApiContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import moment from "moment";
import { Button } from "react-bootstrap";
import { getTrialBadge, getTrialHistoryStatus } from "../../../config/setup";
import Swal from "sweetalert2";

const ViewTrial = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { state: trialData } = useLocation({});

  const [trialObj, setTrialObj] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trialData?._id) {
      fetchTrialData(trialData._id);
    }
  }, [trialData?._id]);

  const fetchTrialData = async (id) => {
    try {
      setLoading(true);
      const response = await get(`/admin/get-trial-order/${id}`);
      const { data, success } = response;
      if (success) {
        setTrialObj(data);
      } else {
        toast.error("Failed to fetch trial data");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getUpdateButtonText = () => {
    const status = trialObj?.trial?.status;
    if (status === "CREATED") {
      return "Dispatch Demo Unit";
    }
    if (status === "RETURNED_BY_CUSTOMER") {
      return "Receive From Customer";
    }
    return null;
  };

  const handleUpdateDemoStatus = async () => {
    const status = trialObj?.trial?.status;
    let nextStatus = "";
    let title = "";
    let buttonColor = "#0d6efd";
    let defaultRemarks = ""

    if (status === "CREATED") {
      nextStatus = "DISPATCHED";
      title = "Dispatch Demo Unit";
      defaultRemarks = "Demonstration unit dispatched to customer."
    }
    else if (status === "RETURNED_BY_CUSTOMER") {
      nextStatus = "COMPLETED";
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
      cancelButtonText: "Cancel",
      confirmButtonColor: buttonColor
    });

    if (remarks === undefined) return;

    try {
      setLoading(true);

      const response = await post(
        `/admin/update-trial-order-status/${trialObj?.trial?._id}`,
        {
          status: nextStatus,
          remarks: remarks || defaultRemarks,
          userType: "ADMIN",
          userId: getAdminStorage()?.AD_ID,
        }
      );

      if (response?.success) {
        toast.success(response?.message || "Status updated successfully");
        fetchTrialData(trialObj?.trial?._id)
      } else {
        toast.error(response?.message || "Failed to update status");
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner text="Loading trial details..." size="md" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <BreadCrumbs
            crumbs={[
              { label: "Demo Unit List", to: ADMIN_URLS.TRIAL_LIST },
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
                    Demo Unit No: {trialObj?.trial?.trialNo || "N/A"}
                  </span>
                  <span className={getTrialBadge(trialObj?.trial?.status)}>
                    {getTrialBadge(trialObj?.trial?.status, trialObj?.trial?.entryType)}
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
                    {trialObj?.trial?.productName || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Product Model
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.productModel || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Serial No
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.serialNo || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Status
                  </label>
                  <div className="fs-15 fw-medium">
                    <span className={getTrialBadge(trialObj?.trial?.status)}>
                      {getTrialBadge(trialObj?.trial?.status, trialObj?.trial?.entryType)}
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
                      checked={trialObj?.trial?.isDocket || false}
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
                    {trialObj?.trial?.registerDate
                      ? moment(trialObj.trial.registerDate).format("DD-MM-YYYY")
                      : "-"}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Start Date
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.startDate
                      ? moment(trialObj.trial.startDate).format("DD-MM-YYYY")
                      : "-"}
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    End Date
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.endDate
                      ? moment(trialObj.trial.endDate).format("DD-MM-YYYY")
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
                    {`${trialObj?.trial?.customerId?.title || ""} ${trialObj?.trial?.customerId?.name || ""
                      } ${trialObj?.trial?.customerId?.lastName || ""}`.trim() || "-"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Email
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.customerId?.email || "N/A"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Phone
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.customerId?.phone || "N/A"}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Clinic Name
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.customerId?.clinicName || "N/A"}
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Address
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.customerId?.address || "N/A"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Customer Remark
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.customerRemarks || "-"}
                  </div>
                </div>
              </div>

              {(Array.isArray(trialObj?.trial?.images) &&
                trialObj?.trial?.images.length > 0) ||
                (Array.isArray(trialObj?.trial?.descPdf) &&
                  trialObj?.trial?.descPdf.length > 0) ? (
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                      <i className="fas fa-paperclip me-2"></i>
                      Uploaded Files
                    </h5>
                  </div>

                  {/* Images */}
                  {Array.isArray(trialObj?.trial?.images) &&
                    trialObj?.trial?.images.length > 0 && (
                      <div className="col-12 mb-4">
                        <h6 className="fw-bold text-dark mb-3">
                          <i className="fas fa-images me-2"></i>Images (
                          {trialObj?.trial?.images.length})
                        </h6>
                        <div className="row g-3">
                          {trialObj?.trial?.images.map((img, index) => (
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
                  {Array.isArray(trialObj?.trial?.descPdf) &&
                    trialObj?.trial?.descPdf.length > 0 && (
                      <div className="col-12 mb-3">
                        <h6 className="fw-bold text-dark mb-3">
                          <i className="fas fa-file-pdf me-2 text-danger"></i>
                          PDF Files ({trialObj?.trial?.descPdf.length})
                        </h6>
                        <div className="row g-3">
                          {trialObj?.trial?.descPdf.map((pdf, index) => (
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

              {/* Remarks */}
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
                    {trialObj?.trial?.engineerName || "-"}
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label text-muted fw-semibold mb-1">
                    Engineer Remark
                  </label>
                  <div className="fs-15 fw-medium">
                    {trialObj?.trial?.engineerRemarks || "-"}
                  </div>
                </div>
              </div>

              {/* Tracking History  */}
              <div className="p-0 border-0 mt-4 mb-4">
                <h5 className="mb-3 fw-semibold text-primary border-bottom pb-2">
                  Tracking History
                </h5>

                {trialObj?.trackingHistory?.map((item, index) => (
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
            ${(trialObj?.trial?.status === "DISPATCHED" || trialObj?.trial?.status === "RECEIVED_BY_CUSTOMER" || trialObj?.trial?.status === "COMPLETED")
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
                onClick={() => navigate(ADMIN_URLS.TRIAL_LIST)}
              >
                <i className="fas fa-arrow-left me-2"></i> Back to Demo Unit List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ViewTrial;
