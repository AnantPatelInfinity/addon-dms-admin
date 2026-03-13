import React, { useEffect } from "react";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import { getServiceStatusBadge } from "../../../config/DataFile";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import ErrorAlert from "../../../components/ErrorAlert/ErrorAlert";
import ViewServiceDetails from "../../../components/Admin/Service/ViewServiceDetails";
import {
  completeDeService,
  downloadDispatchPdf,
  downloadServiceSlip,
  getOneService,
  resetDeCompleteService,
  resetServiceDownload,
  resetServiceDownloadDispatch,
} from "../../../middleware/service/service";
import CustomerApproval from "../../../components/Dealer/Service/CustomerApproval";
import { toast } from "react-toastify";
import CourierDispatch from "../../../components/Admin/Service/CourierDispatch";
import CustomerReceive from "../../../components/Admin/Service/CustomerReceive";
import InstallationDetails from "../../../components/Admin/Service/InstallationDetails";
import FinalDispatch from "../../../components/Admin/Service/FinalDispatch";
import Swal from "sweetalert2";

const ViewService = () => {
  const dealerStorage = getDealerStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const {
    serviceOneList,
    serviceOneListError,
    serviceOneListLoading,

    downloadServiceLoading,
    downloadService,
    downloadServiceMessage,
    downloadServiceError,

    downloadDispatchLoading,
    downloadDispatch,
    downloadDispatchMessage,
    downloadDispatchError,

    deCompleteServiceLoading,
    deCompleteServiceMessage,
    deCompleteServiceError,
  } = useSelector((state) => state?.service);

  useEffect(() => {
    if (downloadServiceMessage) {
      toast.success(downloadServiceMessage);
      window.open(downloadService?.file, "_blank");
      dispatch(resetServiceDownload());
    }
    if (downloadServiceError) {
      toast.error(downloadServiceError);
      dispatch(resetServiceDownload());
    }
  }, [downloadServiceMessage, downloadServiceError]);

  useEffect(() => {
    if (downloadDispatchMessage) {
      toast.success(downloadDispatchMessage);
      window.open(downloadDispatch?.file, "_blank");
      dispatch(resetServiceDownloadDispatch());
    }
    if (downloadDispatchError) {
      toast.error(downloadDispatchError);
      dispatch(resetServiceDownloadDispatch());
    }
  }, [downloadDispatchMessage, downloadDispatchError]);

  useEffect(() => {
    if (deCompleteServiceMessage) {
      toast.success(deCompleteServiceMessage);
      dispatch(resetDeCompleteService());
      navigate(DEALER_URLS.SERVICE_LIST)
    }
    if (deCompleteServiceError) {
      toast.error(deCompleteServiceError);
      dispatch(resetDeCompleteService());
    }
  }, [deCompleteServiceMessage, deCompleteServiceError]);

  useEffect(() => {
    if (data && dealerStorage?.DL_ID) {
      fetchData();
    }
  }, [data, dealerStorage?.DL_ID]);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("dealerId", dealerStorage?.DL_ID);
    dispatch(getOneService(formData, data));
  };

  const handleDispatchDownload = (sId) => {
    const payload = {
      isCompany: false,
    };
    dispatch(downloadDispatchPdf(payload, sId));
  };

  const handleServiceReceipt = (sId) => {
    const payload = {
      isDealer: true,
    };
    dispatch(downloadServiceSlip(payload, sId));
  };

  const handleCompleteService = async () => {
    try {
      const confirmResult = await Swal.fire({
        title: "Complete Service?",
        html: `
          <p><strong>Complaint No:</strong> ${
            serviceOneList?.complainNo || "N/A"
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

      const payload = {
        isComplete: true,
        userModel: "dealer",
        remarks: remark,
      };

      dispatch(completeDeService(serviceOneList?._id, payload));

    } catch (error) {
      console.error("Complete service error:", error);
      toast.error("Something went wrong");
    }
  };

  if (serviceOneListLoading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner text="" size="md" />
      </div>
    );
  }

  if (serviceOneListError) {
    return (
      <div className="container-fluid py-4">
        <ErrorAlert
          message={serviceOneListError || "Failed to load service details"}
          onRetry={() => {
            fetchData();
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="mb-4">
              <BreadCrumbs
                crumbs={[
                  { label: "Service List", to: DEALER_URLS.SERVICE_LIST },
                  { label: `View Service Details` },
                ]}
              />
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <h4 className="page-title">View Service Details</h4>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12 text-end">
                    <span className="badge bg-success me-2">
                      Complaint No: {serviceOneList?.complainNo || "N/A"}
                    </span>
                    {getServiceStatusBadge(
                      serviceOneList?.status,
                      serviceOneList?.isFullProduct
                    )}
                  </div>
                </div>
              </div>
            </div>

            <ViewServiceDetails
              comOneService={serviceOneList}
              isDealer={true}
            />

            {serviceOneList?.isFullProduct === true && (
              <>
                {Number(serviceOneList?.status) === 2 && (
                  <CourierDispatch
                    serviceData={serviceOneList}
                    serviceId={data}
                    isDealer={true}
                    fetchServiceData={fetchData}
                  />
                )}

                {Number(serviceOneList?.status) >= 5 &&
                  Number(serviceOneList?.status) <= 10 &&
                  Number(serviceOneList?.customerApproval?.paymentStatus) !==
                    1 &&
                  serviceOneList?.customerApproval?.isApprove !== false &&
                  Number(serviceOneList?.serviceProcessType) !== 2 &&
                  !(
                    // Number(serviceObj?.status) === 6 &&
                    (
                      Number(serviceOneList?.serviceEstimate?.warrantyType) ===
                      1
                    )
                  ) && (
                    <CustomerApproval
                      serviceId={data}
                      fetchServiceData={fetchData}
                      isDealer={true}
                      serviceObj={serviceOneList}
                    />
                  )}

                {Number(serviceOneList?.status) === 7 && (
                  <CustomerReceive
                    serviceData={serviceOneList}
                    serviceId={data}
                    isDealer={true}
                    fetchServiceData={fetchData}
                  />
                )}
              </>
            )}

            {serviceOneList?.isParts === true && (
              <>
                {serviceOneList?.status >= 2 &&
                  serviceOneList?.status <= 10 &&
                  serviceOneList?.customerApproval?.paymentStatus !== 1 &&
                  serviceOneList?.customerApproval?.isApprove !== false &&
                  serviceOneList?.serviceEstimate?.warrantyType === 2 && (
                    <CustomerApproval
                      serviceId={data}
                      fetchServiceData={fetchData}
                      serviceObj={serviceOneList}
                    />
                  )}

                {/*  1 under and 2 out */}
                {((serviceOneList?.status === 2 &&
                  serviceOneList?.serviceEstimate?.warrantyType === 1) ||
                  (serviceOneList?.status === 4 &&
                    serviceOneList?.serviceEstimate?.warrantyType === 2)) && (
                  <CustomerReceive
                    serviceId={data}
                    isDealer={true}
                    serviceData={serviceOneList}
                    fetchServiceData={fetchData}
                  />
                )}

                {serviceOneList?.status === 5 && (
                  <CourierDispatch
                    serviceId={data}
                    isDealer={true}
                    serviceData={serviceOneList}
                    fetchServiceData={fetchData}
                  />
                )}

                {(serviceOneList?.status === 5 ||
                  serviceOneList?.status === 6 ||
                  serviceOneList?.status === 7) &&
                  serviceOneList?.installationDetails?.isComplete === false && (
                    <InstallationDetails
                      serviceData={serviceOneList}
                      serviceId={data}
                      isDealer={true}
                      fetchServiceData={fetchData}
                    />
                  )}
              </>
            )}

            <div className="card-footer bg-white border-top">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleDispatchDownload(serviceOneList?._id)}
                  >
                    {downloadDispatchLoading ? (
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
                    onClick={() => handleServiceReceipt(serviceOneList?._id)}
                  >
                    {downloadServiceLoading ? (
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

                  {/* {serviceOneList?.status !== 10 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleCompleteService}
                    >
                      {deCompleteServiceLoading ? (
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
                  onClick={() => navigate(DEALER_URLS.SERVICE_LIST)}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Service List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewService;
