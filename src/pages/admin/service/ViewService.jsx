import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../../../context/ApiContext";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import { getServiceStatusBadge } from "../../../config/DataFile";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import CourierDispatch from "../../../components/Admin/Service/CourierDispatch";
import CustomerApproval from "../../../components/Admin/Service/CustomerApproval";
import CustomerReceive from "../../../components/Admin/Service/CustomerReceive";
import PaymentHistory from "../../../components/Admin/Service/PaymentHistory";
import ViewServiceDetails from "../../../components/Admin/Service/ViewServiceDetails";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import AdminReceive from "../../../components/Admin/Service/AdminReceive";
import InstallationDetails from "../../../components/Admin/Service/InstallationDetails";
import Swal from "sweetalert2";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";

const ViewService = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const data =
    typeof location.state === "string" || typeof location.state === "number"
      ? location.state
      : null;
  const [serviceObj, setServiceObj] = useState({});
  const [loading, setLoading] = useState(true);
  const adminStorage = getAdminStorage();
  const [isDownload, setIsDownload] = useState(false);
  const [isDispatch, setIsDispatch] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (data) {
      fetchServiceData();
    } else {
      setLoading(false);
    }
  }, [data]);

  const fetchServiceData = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      const response = await post(`/admin/get-service/${data}`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const { success, data: resData } = response;
      if (success) {
        setServiceObj(resData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceReceipt = async (sId) => {
    try {
      setIsDownload(true);
      const url = `/admin/download-service-slip/${sId}`;
      const payload = {
        isDealer: false,
      };
      const response = await post(url, payload);
      const { message, success, data: resData } = response;
      if (success) {
        window.open(resData?.file, "_blank");
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log("Error in handleDispatchDownload:", error);
      toast.error(error?.response?.data?.message || "Someting went wrong");
    } finally {
      setIsDownload(false);
    }
  };

  const handleDispatchDownload = async (sId) => {
    try {
      setIsDispatch(true);
      const url = `/admin/download-courier-dispatch/${sId}`;
      const payload = {
        isCompany: false,
      };
      const response = await post(url, payload);
      const { message, success, data: resData } = response;
      if (success) {
        window.open(resData?.file, "_blank");
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log("Error in handleDispatchDownload:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsDispatch(false);
    }
  };

  const handleCompleteService = async () => {
    try {
      const confirmResult = await Swal.fire({
        title: "Complete Service?",
        html: `
          <p><strong>Complaint No:</strong> ${
            serviceObj?.complainNo || "N/A"
          }</p>
          <p class="text-danger">
            This action will <b>end the service permanently</b>.
            <br/>You <b>cannot revert</b> this action.
          </p>
        `,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Complete Service",
        confirmButtonColor: "green",
        reverseButtons: true,
      });

      if (!confirmResult.isConfirmed) return;

      const remarkResult = await Swal.fire({
        title: "Final Remark Required",
        input: "textarea",
        inputLabel: "Please provide a reason / closing remark",
        inputPlaceholder: "Enter remarks here...",
        inputAttributes: {
          rows: 4,
        },
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return "Remark is required to complete the service!";
          }
        },
        showCancelButton: true,
        confirmButtonText: "Confirm & Complete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "green",
      });

      if (!remarkResult.isConfirmed) return;

      const remark = remarkResult.value;

      const url = `/admin/admin-service-midcomplete/${serviceObj?._id}`;
      const payload = {
        isComplete: true,
        userModel: "admin",
        remarks: remark,
      };

      const response = await post(url, payload);
      const { message, success } = response;
      if (success) {
        navigate(DEALER_URLS.SERVICE_LIST);
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Complete service error:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <LoadingSpinner text="" size="md" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="alert alert-danger">
        Invalid service ID or no service selected.
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Breadcrumb */}
          <div className="mb-4">
            <BreadCrumbs
              crumbs={[
                { label: "Service List", to: ADMIN_URLS.SERVICE_LIST },
                { label: `View Service Details` },
              ]}
            />
          </div>

          {/* Header Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <h4 className="page-title">View Service Details</h4>
                </div>
                <div className="col-lg-8 col-md-6 col-12 text-end">
                  <span className="badge bg-success me-2">
                    Complaint No: {serviceObj?.complainNo || "N/A"}
                  </span>
                  {getServiceStatusBadge(
                    serviceObj?.status,
                    serviceObj?.isFullProduct
                  )}
                </div>
              </div>
            </div>
          </div>

          <ViewServiceDetails comOneService={serviceObj} />

          {serviceObj?.isFullProduct === true && (
            <>
              {Number(serviceObj?.status) === 2 && (
                <CourierDispatch
                  serviceData={serviceObj}
                  serviceId={data}
                  fetchServiceData={fetchServiceData}
                />
              )}

              {Number(serviceObj?.status) >= 5 &&
                Number(serviceObj?.status) <= 10 &&
                Number(serviceObj?.customerApproval?.paymentStatus) !== 1 &&
                Number(serviceObj?.serviceProcessType) !== 2 &&
                serviceObj?.customerApproval?.isApprove !== false &&
                !(
                  // Number(serviceObj?.status) === 6 &&
                  (Number(serviceObj?.serviceEstimate?.warrantyType) === 1)
                ) && (
                  <CustomerApproval
                    serviceId={data}
                    fetchServiceData={fetchServiceData}
                    serviceObj={serviceObj}
                  />
                )}

              {Number(serviceObj?.status) === 7 && (
                <CustomerReceive
                  serviceData={serviceObj}
                  serviceId={data}
                  fetchServiceData={fetchServiceData}
                />
              )}
            </>
          )}

          {serviceObj?.isParts === true && (
            <>
              {serviceObj?.status >= 2 &&
                serviceObj?.status <= 10 &&
                serviceObj?.customerApproval?.paymentStatus !== 1 &&
                serviceObj?.serviceEstimate?.warrantyType === 2 &&
                serviceObj?.customerApproval?.isApprove !== false && (
                  <CustomerApproval
                    serviceId={data}
                    fetchServiceData={fetchServiceData}
                    serviceObj={serviceObj}
                  />
                )}

              {/*  1 under and 2 out */}
              {((serviceObj?.status === 2 &&
                serviceObj?.serviceEstimate?.warrantyType === 1) ||
                (serviceObj?.status === 4 &&
                  serviceObj?.serviceEstimate?.warrantyType === 2)) && (
                <CustomerReceive
                  serviceId={data}
                  serviceData={serviceObj}
                  fetchServiceData={fetchServiceData}
                />
              )}

              {serviceObj?.status === 5 && (
                <CourierDispatch
                  serviceId={data}
                  serviceData={serviceObj}
                  fetchServiceData={fetchServiceData}
                />
              )}

              {(serviceObj?.status === 5 ||
                serviceObj?.status === 6 ||
                serviceObj?.status === 7) &&
                serviceObj?.installationDetails?.isComplete === false && (
                  <InstallationDetails
                    serviceData={serviceObj}
                    serviceId={data}
                    fetchServiceData={fetchServiceData}
                  />
                )}
            </>
          )}

          <div className="card-footer border-top-0">
            <div className="d-flex justify-content-between">
              {/* Left side - download buttons */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleDispatchDownload(serviceObj._id)}
                  disabled={isDispatch}
                >
                  {isDispatch ? (
                    <>
                      <i className="ti ti-loader text-primary me-1" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-arrow-down text-primary me-1" />
                      Download Dispatch
                    </>
                  )}
                </button>

                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => handleServiceReceipt(serviceObj?._id)}
                  disabled={isDownload}
                >
                  {isDownload ? (
                    <>
                      <i className="ti ti-loader text-primary me-1" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-arrow-down text-primary me-1" />
                      Download Service Receipt
                    </>
                  )}
                </button>

                {/* {serviceObj?.status !== 10 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCompleteService}
                  >
                    {isComplete ? (
                      <>
                       <i className="ti ti-loader text-primary me-1" />
                       Loading...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-check me-1 mt-2" />
                        Complete Service
                      </>
                    )}
                  </button>
                )} */}


              </div>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(ADMIN_URLS.SERVICE_LIST)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Service List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewService;
