import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import { getServiceStatusBadge } from '../../../config/DataFile';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert/ErrorAlert';
import { toast } from 'react-toastify';
import { getCustomerStorage } from '../../../components/LocalStorage/CustomerStorage';
import CUSTOMER_URLS from '../../../config/routesFile/customer.routes';
import ViewServiceDetails from '../../../components/Admin/Service/ViewServiceDetails';

import {
  downloadDispatchPdf, downloadServiceSlip,
  getOneService, resetServiceDownload, resetServiceDownloadDispatch
} from '../../../middleware/customerUser/customerService/service';
import CustomerApproval from '../../../components/customer/CustomerApproval';
import CourierDispatch from '../../../components/Admin/Service/CourierDispatch';
import CustomerReceive from '../../../components/Admin/Service/CustomerReceive';

import InstallationDetails from '../../../components/Admin/Service/InstallationDetails';
import FinalDispatch from '../../../components/Admin/Service/FinalDispatch';

const ViewService = () => {

  const customerStorage = getCustomerStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: data } = useLocation();

  const {
    serviceOne,
    serviceOneError,
    serviceOneLoading,

    downloadServiceLoading,
    downloadService,
    downloadServiceMessage,
    downloadServiceError,

    downloadDispatchLoading,
    downloadDispatch,
    downloadDispatchMessage,
    downloadDispatchError,
  } = useSelector((state) => state?.customerService);


  useEffect(() => {
    if (downloadServiceMessage) {
      toast.success(downloadServiceMessage);
      window.open(downloadService?.file, '_blank');
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
      window.open(downloadDispatch?.file, '_blank');
      dispatch(resetServiceDownloadDispatch())
    }
    if (downloadDispatchError) {
      toast.error(downloadDispatchError);
      dispatch(resetServiceDownloadDispatch())
    }
  }, [downloadDispatchMessage, downloadDispatchError]);

  useEffect(() => {
    if (data && customerStorage?.CU_ID) {
      fetchData()
    }
  }, [data, customerStorage?.CU_ID]);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("customerId", customerStorage?.CU_ID);
    dispatch(getOneService(formData, data))
  }

  const handleDispatchDownload = (sId) => {
    const payload = {
      isCompany: false
    }
    dispatch(downloadDispatchPdf(payload, sId))
  }

  const handleServiceReceipt = (sId) => {
    const payload = {
      isDealer: false
    }
    dispatch(downloadServiceSlip(payload, sId))
  }

  if (serviceOneLoading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner text="" size='md' />
      </div>
    );
  }

  if (serviceOneError) {
    return (
      <div className="container-fluid py-4">
        <ErrorAlert
          message={serviceOneError || "Failed to load service details"}
          onRetry={() => {
            fetchData()
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
                  { label: "Service List", to: CUSTOMER_URLS.SERVICE_LIST },
                  { label: `View Service Details` },
                ]}
              />
            </div>


            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <h4 className="page-title">
                      View Service Details
                    </h4>
                  </div>
                  <div className="col-lg-8 col-md-6 col-12 text-end">
                    <span className="badge bg-success me-2">Complaint No: {serviceOne?.complainNo || 'N/A'}</span>
                    {getServiceStatusBadge(serviceOne?.status, serviceOne?.isFullProduct)}
                  </div>
                </div>
              </div>
            </div>

            <ViewServiceDetails comOneService={serviceOne} isCustomer={true} />

            {serviceOne?.isFullProduct === true && (
              <>
                {Number(serviceOne?.status) === 2 && (
                  <CourierDispatch
                    serviceData={serviceOne}
                    serviceId={data}
                    isCustomer={true}
                    fetchServiceData={fetchData}
                  />
                )}

                {Number(serviceOne?.status) >= 5 &&
                  Number(serviceOne?.status) <= 10 &&
                  serviceOne?.customerApproval?.isApprove !== false
                  && Number(serviceOne?.customerApproval?.paymentStatus) !== 1
                  && Number(serviceOne?.serviceProcessType) !== 2
                  && !(
                    // Number(serviceObj?.status) === 6 &&
                    (Number(serviceOne?.serviceEstimate?.warrantyType) === 1)
                  ) && (
                    <CustomerApproval
                      serviceId={data}
                      fetchServiceData={fetchData}
                      isCustomer={true}
                      serviceObj={serviceOne}
                    />
                  )}

                {Number(serviceOne?.status) === 7 && (
                  <CustomerReceive
                    serviceData={serviceOne}
                    serviceId={data}
                    isCustomer={true}
                    fetchServiceData={fetchData}
                  />
                )}
              </>
            )}

            {serviceOne?.isParts === true && (
              <>
                {(serviceOne?.status >= 2 && serviceOne?.status <= 10)
                  && serviceOne?.customerApproval?.paymentStatus !== 1
                  && serviceOne?.customerApproval?.isApprove !== false
                  && serviceOne?.serviceEstimate?.warrantyType === 2 && (
                    <CustomerApproval
                      serviceId={data}
                      fetchServiceData={fetchData}
                      serviceObj={serviceOne}
                    />
                  )}

                {/*  1 under and 2 out */}
                {((serviceOne?.status === 2 &&
                  serviceOne?.serviceEstimate?.warrantyType === 1) ||
                  (serviceOne?.status === 4 &&
                    serviceOne?.serviceEstimate?.warrantyType === 2)) && (
                    <CustomerReceive
                      serviceId={data}
                      isCustomer={true}
                      serviceData={serviceOne}
                      fetchServiceData={fetchData}
                    />
                  )}

                {serviceOne?.status === 5 && (
                  <CourierDispatch
                    serviceId={data}
                    serviceData={serviceOne}
                    isCustomer={true}
                    fetchServiceData={fetchData}
                  />
                )}

                {/* {serviceOne?.status === 7 && (
                  <InstallationDetails
                    serviceData={serviceOne}
                    serviceId={data}
                    isCustomer={true}
                    fetchServiceData={fetchData}
                  />
                )} */}
              </>
            )}


            <div className="card-footer bg-white border-top">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleDispatchDownload(serviceOne?._id)}
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
                    onClick={() => handleServiceReceipt(serviceOne?._id)}
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
                </div>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(CUSTOMER_URLS.SERVICE_LIST)}
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
  )
}

export default ViewService