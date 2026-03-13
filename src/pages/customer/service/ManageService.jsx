import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage";
import ServiceForm from "../../../components/customer/ServiceForm.jsx";
import { getServiceList, resetServiceList } from "../../../middleware/customerUser/customerService/service.js";
import { getCuPoSerialItems } from "../../../middleware/customerUser/poItems/poItems.js";
import MediaSection from "../../../components/Admin/Service/MediaSection";
import { toast } from "react-toastify";

import {
  addService,
  editService,
  getOneService,
  resetServiceAdd,
  resetServiceEdit,
  resetServiceOne,
} from "../../../middleware/customerUser/customerService/service.js";
import { getWarrantyCodeStatus } from "../../../components/Admin/Service/WarrantyCheck/WarrantyCodeStatus";

import { getAllInstallation } from "../../../middleware/customerUser/customerInstallation/installation.js";
import { getCuAmcList } from "../../../middleware/customerUser/amc/amc.js";
import moment from "moment";

const ManageService = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: data } = useLocation();
  const [errors, setErrors] = useState({});

  const customerStorage = getCustomerStorage();

  const [service, setService] = useState({
    serviceDate: moment().format("YYYY-MM-DD"),
    engineerName: "",
    firmId: "",
    serialNoId: "",
    companyId: "",
    requestBy: "",
    serviceProcessType: null,
  });
  const [complain, setComplain] = useState({
    description: "",
    audio: [],
    video: [],
    image: [],
  });
  const [isWarranty, setIsWarranty] = useState(null);
  const handleReset = () => {
    setService({
      serviceDate: moment().format("YYYY-MM-DD"),
      engineerName: "",
      firmId: "",
      serialNoId: "",
      companyId: "",
      requestBy: "",
      serviceProcessType: null,
    });
    setComplain({
      description: "",
      audio: [],
      video: [],
      image: [],
    });
    setErrors({});
    setIsWarranty(null);
  };


  const {
    addServiceError,
    addServiceLoading,
    addServiceMessage,

    editServiceError,
    editServiceLoading,
    editServiceMessage,

    serviceOne,
  } = useSelector((state) => state?.customerService);

  const { poSerialNo } = useSelector((state) => state?.customerPoItems);

  const { amcList } = useSelector((state) => state?.customerAmc);
  const { installationList } = useSelector(
    (state) => state?.customerInstallation
  );

  useEffect(() => {
    if (addServiceMessage) {
      toast.success(addServiceMessage);
      navigate(CUSTOMER_URLS.SERVICE_LIST);
      handleReset();
      dispatch(resetServiceAdd());
    }
    if (addServiceError) {
      toast.error(addServiceError);
      dispatch(resetServiceAdd());
    }
  }, [addServiceMessage, addServiceError]);

  useEffect(() => {
    if (editServiceMessage) {
      toast.success(editServiceMessage);
      navigate(CUSTOMER_URLS.SERVICE_LIST);
      handleReset();
      dispatch(resetServiceEdit());
    }
    if (editServiceError) {
      toast.error(editServiceError);
      dispatch(resetServiceEdit());
    }
  }, [editServiceMessage, editServiceError]);

  useEffect(() => {
    if (customerStorage?.CU_ID && customerStorage?.DX_CU_FIRM_ID) {
      dispatch(getServiceList(customerStorage.CU_ID));
      const formData = new URLSearchParams();
      formData.append("customerId", customerStorage?.CU_ID);
      formData.append("firmId", customerStorage.DX_CU_FIRM_ID);
      dispatch(getCuPoSerialItems(formData));
    }

    return () => {
      dispatch(resetServiceList());
    };
  }, [customerStorage?.CU_ID, customerStorage?.DX_CU_FIRM_ID]);

  useEffect(() => {
    if (service.customerId) {
      dispatch(
        getAllInstallation({
          firmId: customerStorage.DX_CU_FIRM_ID,
          customerId: customerStorage.CU_ID,
          status: 2,
        })
      );
    }
  }, [service.customerId]);

  useEffect(() => {
    if (service.customerId && service.serialNoId) {
      dispatch(
        getCuAmcList({
          firmId: customerStorage.DX_CU_FIRM_ID,
          serialNoId: service.serialNoId,
          customerId: customerStorage.CU_ID,
        })
      );
    }
  }, [service.customerId, service.serialNoId]);

  useEffect(() => {
    handleReset();
    dispatch(resetServiceOne());

    if (data?._id) {
      const formData = new URLSearchParams();
      formData.append("customerId", customerStorage?.CU_ID);
      dispatch(getOneService(formData, data?._id));
    }
  }, [data?._id, customerStorage?.CU_ID]);

  useEffect(() => {
    if (data?._id && serviceOne && Object.keys(serviceOne).length > 0) {
      setService((prev) => ({
        ...prev,
        serviceDate: serviceOne?.serviceDate ? moment(serviceOne.serviceDate).format("YYYY-MM-DD") : prev.serviceDate,
        serialNoId: serviceOne?.serialNoId || "",
        companyId: serviceOne?.companyId || "",
      }));
      setComplain({
        description: serviceOne?.complainDetails?.description || "",
        audio: serviceOne?.complainDetails?.audios || [],
        video: serviceOne?.complainDetails?.videos || [],
        image: serviceOne?.complainDetails?.photos || [],
      });
      setIsWarranty(serviceOne?.serviceWarrantyStatus);
    }
  }, [serviceOne, data?._id]);

  useEffect(() => {
    if (service.serialNoId) {
      const getCompanyId = poSerialNo?.find(
        (e) => e?._id === service?.serialNoId
      );
      setService((prev) => ({
        ...prev,
        companyId: getCompanyId?.companyId,
      }));
    }
  }, [service?.serialNoId, poSerialNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "requestBy" && value !== "engineer" ? { engineerName: "" } : {}),
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleComplainChange = (e) => {
    const { name, value } = e.target;
    setComplain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaUpdate = (type, files) => {
    setComplain((prev) => ({
      ...prev,
      [type]: files,
    }));
  };

  useEffect(() => {
    const oneInstallation = installationList?.find(
      (e) => e?.serialNoId === service?.serialNoId
    );
    const code = getWarrantyCodeStatus(oneInstallation, amcList);
    setIsWarranty(code);
  }, [installationList, service?.serialNoId, amcList]);

  const validate = () => {
    const newErrors = {};
    if (!service.serialNoId) newErrors.serialNoId = "Serial number is required";
    if (!complain.description)
      newErrors.description = "Nature of complaint is required";
    if (!service.serviceDate) newErrors.serviceDate = "Service Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const companyDetails = {
      description: complain.description,
      photos: complain.image,
      videos: complain.video,
      audios: complain.audio,
    };

    const bodyFormData = new URLSearchParams();
    bodyFormData.append("firmId", customerStorage.DX_CU_FIRM_ID);
    bodyFormData.append("customerId", customerStorage?.CU_ID);
    bodyFormData.append("serialNoId", service.serialNoId);
    bodyFormData.append("companyId", service.companyId);
    bodyFormData.append("complainDetails", JSON.stringify(companyDetails));
    bodyFormData.append("serviceDate", service.serviceDate);
    bodyFormData.append("serviceWarrantyStatus", isWarranty);
    bodyFormData.append("isCustomerEntry", true);
    if (data?._id) {
      dispatch(editService(bodyFormData, data?._id));
    } else {
      dispatch(addService(bodyFormData));
    }
  };


  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Service List", to: CUSTOMER_URLS.SERVICE_LIST },
            { label: `Service ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  Service {data?._id ? "Edit" : "Add"}
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <ServiceForm
              service={service}
              handleChange={handleChange}
              errors={errors}
              complain={complain}
              handleComplainChange={handleComplainChange}
            />

            <div className="row">
              <MediaSection
                type="image"
                title="Images"
                accept="image/*"
                icon="fas fa-image"
                mediaFiles={complain.image}
                onMediaUpdate={handleMediaUpdate}
              />
              <MediaSection
                type="audio"
                title="Audio Files"
                accept="audio/*"
                icon="fas fa-microphone"
                mediaFiles={complain.audio}
                onMediaUpdate={handleMediaUpdate}
              />
              <MediaSection
                type="video"
                title="Videos"
                accept="video/*"
                icon="fas fa-video"
                mediaFiles={complain.video}
                onMediaUpdate={handleMediaUpdate}
              />
            </div>

            <div className="d-flex align-items-center justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-light me-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={addServiceLoading || editServiceLoading}
              >
                {addServiceLoading || editServiceLoading
                  ? "Loading..."
                  : data?._id
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageService;