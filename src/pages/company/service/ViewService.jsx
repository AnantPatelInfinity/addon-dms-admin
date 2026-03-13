import React, { useEffect } from "react";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import COMPANY_URLS from "../../../config/routesFile/company.routes";
import { useLocation, useNavigate } from "react-router";
import { getCompanyStorage } from "../../../components/LocalStorage/CompanyStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  comProductReceiveConfirmation,
  comReceiveConfirmation,
  completeComService,
  downloadDispatchPdf,
  downloadServicePdf,
  getComOneService,
  resetComCompleteService,
  resetComConfirmation,
  resetComConfirmationProduct,
  resetComDispatchPdf,
  resetComDownloadService,
} from "../../../middleware/companyUser/comService/comService";
import { getServiceStatusBadge } from "../../../config/DataFile";
import DateTime from "../../../helpers/DateFormat/DateTime";
import CompanyAction from "../../../components/Company/Service/CompanyAction";
import ComServiceEstimation from "../../../components/Company/Service/ComServiceEstimation";
import ComDispatchCom from "../../../components/Company/Service/ComDispatchCom";
import ViewServiceDetails from "../../../components/Admin/Service/ViewServiceDetails";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import FinalReceive from "../../../components/Company/Service/FinalReceive";

const ViewService = () => {
  const companyStorage = getCompanyStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const {
    comOneService,
    comOneServiceError,
    comOneServiceLoading,

    comDispatchPdf,
    comDispatchPdfLoading,
    comDispatchPdfError,
    comDispatchPdfMessage,

    comDownloadService,
    comDownloadServiceLoading,
    comDownloadServiceError,
    comDownloadServiceMessage,

    comReceiveConfirmationError,
    comReceiveConfirmationMessage,

    comReceiveConfirmationProductMessage,
    comReceiveConfirmationProductError,

    comCompleteServiceLoading,
    comCompleteServiceMessage,
    comCompleteServiceError,
  } = useSelector((state) => state?.comService);

  useEffect(() => {
    if (data) {
      fetchServiceData();
    }
  }, [data]);

  useEffect(() => {
    if (comDownloadService?.file) {
      window.open(comDownloadService?.file, "_blank");
    }
    if (comDownloadServiceMessage) {
      toast.success(comDownloadServiceMessage);
      dispatch(resetComDownloadService());
    }
    if (comDownloadServiceError) {
      toast.error(comDownloadServiceError);
      dispatch(resetComDownloadService());
    }
  }, [comDownloadService, comDownloadServiceMessage, comDownloadServiceError]);

  useEffect(() => {
    if (comReceiveConfirmationMessage) {
      toast.success(comReceiveConfirmationMessage);
      dispatch(resetComConfirmation());
      fetchServiceData();
    }
    if (comReceiveConfirmationError) {
      toast.error(comReceiveConfirmationError);
      dispatch(resetComConfirmation());
    }
  }, [comReceiveConfirmationMessage, comReceiveConfirmationError]);

  useEffect(() => {
    if (comCompleteServiceMessage) {
      toast.success(comCompleteServiceMessage);
      dispatch(resetComCompleteService());
      navigate(COMPANY_URLS.SERVICE_LIST);
    }
    if (comCompleteServiceError) {
      toast.error(comCompleteServiceError);
      dispatch(resetComCompleteService());
    }
  }, [comCompleteServiceMessage, comCompleteServiceError]);

  useEffect(() => {
    if (comReceiveConfirmationProductMessage) {
      toast.success(comReceiveConfirmationProductMessage);
      dispatch(resetComConfirmationProduct());
      fetchServiceData();
    }
    if (comReceiveConfirmationProductError) {
      toast.error(comReceiveConfirmationProductError);
      dispatch(resetComConfirmationProduct());
    }
  }, [comReceiveConfirmationProductMessage, comReceiveConfirmationError]);

  useEffect(() => {
    if (comDispatchPdfMessage) {
      toast.success(comDispatchPdfMessage);
      window.open(comDispatchPdf?.file, "_blank");
      dispatch(resetComDispatchPdf());
    }
    if (comDispatchPdfError) {
      toast.error(comDispatchPdfError);
      dispatch(resetComDispatchPdf());
    }
  }, [comDispatchPdfMessage, comDispatchPdfError]);

  const fetchServiceData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    dispatch(getComOneService(formData, data));
  };

  const handleDispatchDownload = (sId) => {
    const payload = {
      isCompany: "true",
    };
    dispatch(downloadDispatchPdf(payload, sId));
  };

  const handleCompleteService = async () => {
    try {
      const confirmResult = await Swal.fire({
        title: "Complete Service?",
        html: `
          <p><strong>Complaint No:</strong> ${
            comOneService?.complainNo || "N/A"
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
        userModel: "company",
        remarks: remark,
      };

      dispatch(completeComService(comOneService?._id, payload));
    } catch (error) {
      console.error("Complete service error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleReceive = (sId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this as received?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const receiveData = {
          isReceive: 2,
          time: Date.now(),
        };
        const formData = new URLSearchParams();
        formData.append("companyReceiveDetails", JSON.stringify(receiveData));
        formData.append("companyReceiveStatus", comOneService?.status);
        if (comOneService?.isFullProduct) {
          // for full product
          dispatch(comProductReceiveConfirmation(formData, sId));
        } else {
          // for parts
          dispatch(comReceiveConfirmation(formData, sId));
        }
      }
    });
  };

  const handleServiceDownload = (sId) => {
    const payload = {
      isDealer: false,
    };
    dispatch(downloadServicePdf(payload, sId));
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="mb-4">
            <BreadCrumbs
              crumbs={[
                { label: "Service List", to: COMPANY_URLS.SERVICE_LIST },
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
                    Complaint No: {comOneService?.complainNo || "N/A"}
                  </span>
                  {getServiceStatusBadge(
                    comOneService?.status,
                    comOneService?.isFullProduct
                  )}
                </div>
              </div>
            </div>
          </div>

          <ViewServiceDetails comOneService={comOneService} />

          {comOneService?.status === 1 && (
            <CompanyAction
              serviceId={data}
              fetchServiceData={fetchServiceData}
            />
          )}

          {comOneService?.isParts && (
            <>
              {comOneService?.status === 3 &&
                comOneService?.serviceEstimate.warrantyType === 2 &&
                comOneService?.customerApproval.isApprove == true && (
                  <ComDispatchCom
                    serviceId={data}
                    serviceData={comOneService}
                    fetchServiceData={fetchServiceData}
                  />
                )}
            </>
          )}

          {comOneService?.isFullProduct && (
            <>
              {comOneService?.status === 4 && (
                <ComServiceEstimation
                  serviceId={data}
                  fetchServiceData={fetchServiceData}
                  comOneService={comOneService}
                />
              )}
              {comOneService?.status === 6 &&
                comOneService?.companyDispatch.pdf === null && (
                  <ComDispatchCom
                    serviceId={data}
                    serviceData={comOneService}
                    fetchServiceData={fetchServiceData}
                  />
                )}
            </>
          )}

          <div className="card-footer border-top-0">
            <div className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => handleDispatchDownload(comOneService?._id)}
                >
                  {comDispatchPdfLoading ? (
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
                  onClick={() => handleServiceDownload(comOneService?._id)}
                >
                  {comDownloadServiceLoading ? (
                    <>
                      <i className="ti ti-loader text-primary me-1" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-arrow-down text-primary me-1" />
                      Service Receipt
                    </>
                  )}
                </button>

                {/* {comOneService?.status !== 10 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCompleteService}
                  >
                    {comCompleteServiceLoading ? (
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

                {/* FOR FULL PRODUCT */}
                {comOneService?.isFullProduct === false && (
                  <>
                    {comOneService.status === 6 && (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleReceive(comOneService?._id)}
                        type="button"
                      >
                        <i className="fe fe-check-circle text-success" />{" "}
                        Approve Receive
                      </button>
                    )}
                  </>
                )}
                {comOneService?.isFullProduct === true && (
                  <>
                    {comOneService.status === 3 && (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleReceive(comOneService?._id)}
                        type="button"
                      >
                        <i className="fe fe-check-circle text-success" />{" "}
                        Approve Receive
                      </button>
                    )}
                  </>
                )}
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewService;
