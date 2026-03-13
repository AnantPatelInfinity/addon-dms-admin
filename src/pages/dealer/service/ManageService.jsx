import React, { useEffect, useState } from 'react'
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import moment from 'moment';
import ServiceForm from '../../../components/Dealer/Service/ServiceForm';
import { getDealerCustomerList } from '../../../middleware/customer/customer';
import { getPoSerialItems } from '../../../middleware/PoItems/PoItems';
import { getAllInstallation } from '../../../middleware/installation/installation';
import MediaSection from '../../../components/Admin/Service/MediaSection';
import { toast } from 'react-toastify';
import { addService, editService, getOneService, resetServiceAdd, resetServiceEdit, resetServiceOne } from '../../../middleware/service/service';
import { getDeAmcList } from '../../../middleware/amc/amc';
import { getWarrantyCodeStatus } from '../../../components/Admin/Service/WarrantyCheck/WarrantyCodeStatus';

const ManageService = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: data } = useLocation();
  const dealerStorage = getDealerStorage();
  const [errors, setErrors] = useState({});
  const [service, setService] = useState({
    serviceDate: moment().format("YYYY-MM-DD"),
    customerId: "",
    serialNoId: "",
    companyId: "",
    requestBy: "",
    engineerName: "",
    engineerRemarks: "",
    serviceProcessType: null,
  });
  const [complain, setComplain] = useState({
    description: "",
    audio: [],
    video: [],
    image: [],
  });
  const [isWarranty, setIsWarranty] = useState(null);

  const {
    addServiceError,
    addServiceLoading,
    addServiceMessage,

    editServiceError,
    editServiceLoading,
    editServiceMessage,

    serviceOneList,
  } = useSelector((state) => state?.service);
  const { poSerialNo } = useSelector((state) => state?.dealerPoItems);
  const { amcList } = useSelector((state) => state?.dealerAmc);
  const { installationList } = useSelector((state) => state?.dealerInstallation);

  useEffect(() => {
    if (addServiceMessage) {
      toast.success(addServiceMessage);
      navigate(DEALER_URLS.SERVICE_LIST);
      handleReset()
      dispatch(resetServiceAdd())
    }
    if (addServiceError) {
      toast.error(addServiceError)
      dispatch(resetServiceAdd())
    }
  }, [addServiceMessage, addServiceError]);

  useEffect(() => {
    if (editServiceMessage) {
      toast.success(editServiceMessage);
      navigate(DEALER_URLS.SERVICE_LIST);
      handleReset()
      dispatch(resetServiceEdit());
    }
    if (editServiceError) {
      toast.error(editServiceError)
      dispatch(resetServiceEdit())
    }
  }, [editServiceMessage, editServiceError])

  useEffect(() => {
    if (dealerStorage?.DL_ID && dealerStorage?.DX_DL_FIRM_ID) {
      dispatch(getDealerCustomerList(dealerStorage.DL_ID))
      const formData = new URLSearchParams();
      formData.append("dealerId", dealerStorage?.DL_ID);
      formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
      dispatch(getPoSerialItems(formData));
    }
  }, [dealerStorage?.DL_ID, dealerStorage?.DX_DL_FIRM_ID]);

  useEffect(() => {
    if (service.customerId) {
      dispatch(getAllInstallation({
        firmId: dealerStorage.DX_DL_FIRM_ID,
        dealerId: dealerStorage.DL_ID,
        status: 2,
        customerId: service.customerId,
      }));
    }
  }, [service.customerId]);

  useEffect(() => {
    if (service.customerId && service.serialNoId) {
      dispatch(getDeAmcList({
        firmId: dealerStorage.DX_DL_FIRM_ID,
        customerId: service.customerId,
        serialNoId: service.serialNoId,
        dealerId: dealerStorage.DL_ID,
      }));
    }
  }, [service.customerId, service.serialNoId])

  useEffect(() => {
    if (data?._id && dealerStorage?.DL_ID) {
      const formData = new URLSearchParams();
      formData.append("dealerId", dealerStorage?.DL_ID);
      dispatch(getOneService(formData, data?._id))
    } else {
      dispatch(resetServiceOne());
    }
  }, [data?._id, dealerStorage?.DL_ID]);

  useEffect(() => {
    if (!data?._id) {
      handleReset();
      dispatch(resetServiceOne());
    }
  }, []);

  useEffect(() => {
    if ( data?._id && serviceOneList) {
      setService({
        serviceDate: moment(serviceOneList?.serviceDate).format("YYYY-MM-DD"),
        customerId: serviceOneList?.customerId,
        serialNoId: serviceOneList?.serialNoId,
        companyId: serviceOneList?.companyId,
        requestBy: serviceOneList?.requestBy,
        engineerName: serviceOneList?.engineerName || "",
        engineerRemarks: serviceOneList?.engineerRemarks,
        serviceProcessType: serviceOneList?.serviceProcessType,
      });
      setComplain({
        description: serviceOneList?.complainDetails?.description || "",
        audio: serviceOneList?.complainDetails?.audios || [],
        video: serviceOneList?.complainDetails?.videos || [],
        image: serviceOneList?.complainDetails?.photos || [],
      });
      setIsWarranty(serviceOneList?.serviceWarrantyStatus);
    }
  }, [serviceOneList])

  useEffect(() => {
    if (service.serialNoId) {
      const getCompanyId = poSerialNo?.find((e) => e?._id === service?.serialNoId);
      setService(prev => ({
        ...prev,
        companyId: getCompanyId?.companyId,
      }));
    }
  }, [service?.serialNoId, poSerialNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleComplainChange = (e) => {
    const { name, value } = e.target;
    setComplain((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaUpdate = (type, files) => {
    setComplain((prev) => ({
      ...prev,
      [type]: files
    }));
  };

  useEffect(() => {
    const oneInstallation = installationList?.find((e) => e?.serialNoId === service?.serialNoId);
    const code = getWarrantyCodeStatus(oneInstallation, amcList);
    setIsWarranty(code);
  }, [installationList, service?.serialNoId, amcList]);

  const validate = () => {
    const newErrors = {};
    if (!service.serviceDate) newErrors.serviceDate = "Service date is required";
    if (!service.customerId) newErrors.customerId = "Customer is required";
    if (!service.serialNoId) newErrors.serialNoId = "Serial number is required";
    if (!complain.description) newErrors.description = "Nature of complaint is required";
    if (!service.requestBy) newErrors.requestBy = "Request by is required";
    if (!service.engineerName) newErrors.engineerName = "Name is required";
    if (!service.engineerRemarks) newErrors.engineerRemarks = "Action taken is required";
    if (service.serviceProcessType === null) {
      newErrors.serviceProcessType = "Service process type is required";
    }

    return newErrors;
  }

  const handleSubmit = () => {
    if (!dealerStorage?.DL_ID || !dealerStorage?.DX_DL_FIRM_ID) {
      toast.error("Dealer information missing. Please login again.");
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const companyDetails = {
      description: complain.description,
      photos: complain.image,
      videos: complain.video,
      audios: complain.audio,
    }


    const bodyFormData = new URLSearchParams();
    bodyFormData.append("dealerId", dealerStorage.DL_ID);
    bodyFormData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
    bodyFormData.append("serviceDate", service.serviceDate);
    bodyFormData.append("customerId", service.customerId);
    bodyFormData.append("serialNoId", service.serialNoId);
    bodyFormData.append("companyId", service.companyId);
    bodyFormData.append("requestBy", service.requestBy);
    bodyFormData.append("engineerName", service.engineerName);
    bodyFormData.append("engineerRemarks", service.engineerRemarks);
    bodyFormData.append("complainDetails", JSON.stringify(companyDetails));
    bodyFormData.append("serviceProcessType", service.serviceProcessType);
    bodyFormData.append("serviceWarrantyStatus", isWarranty);
    if (data?._id) {
      dispatch(editService(bodyFormData, data?._id))
    } else {
      dispatch(addService(bodyFormData))
    }
  }

  const handleReset = () => {
    setService({
      serviceDate: moment().format("YYYY-MM-DD"),
      customerId: "",
      serialNoId: "",
      companyId: "",
      requestBy: "",
      engineerName: "",
      engineerRemarks: "",
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
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Service List", to: DEALER_URLS.SERVICE_LIST },
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
              <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={addServiceLoading || editServiceLoading}>
                {addServiceLoading || editServiceLoading ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageService