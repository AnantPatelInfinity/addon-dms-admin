import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import MediaSection from '../../../components/Admin/Service/MediaSection';
import ServiceForm from '../../../components/Admin/Service/ServiceForm';
import { toast } from 'react-toastify';
import { getWarrantyCodeStatus } from '../../../components/Admin/Service/WarrantyCheck/WarrantyCodeStatus';

const ManageService = () => {
  const { post, get } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const adminStorage = getAdminStorage();

  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});
  const [service, setService] = useState({
    serviceDate: moment().format("YYYY-MM-DD"),
    customerId: "",
    serialNoId: "",
    companyId: "",
    engineerName: "",
    requestBy: "",
    engineerRemarks: "",
    serviceProcessType: null,
  });

  const [dropdowns, setDropdowns] = useState({
    customerData: [],
    serialNoData: [],
    filteredSerialNoData: [],
    engineerData: [],
    installationData: [],
  });
  const [complain, setComplain] = useState({
    description: "",
    audio: [],
    video: [],
    image: [],
  });
  const [isWarranty, setIsWarranty] = useState(null);
  const [amc, setAmc] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await post(`/admin/get-service/${data._id}`);
        const serviceData = response.data;
        setService({
          serviceDate: moment(serviceData?.serviceDate).format("YYYY-MM-DD"),
          customerId: serviceData?.customerId,
          serialNoId: serviceData?.serialNoId,
          companyId: serviceData?.companyId,
          requestBy: serviceData?.requestBy,
          engineerName: serviceData?.engineerName || "",
          engineerRemarks: serviceData?.engineerRemarks,
          serviceProcessType: serviceData?.serviceProcessType,
        });
        setComplain({
          description: serviceData?.complainDetails?.description || "",
          audio: serviceData?.complainDetails?.audios || [],
          video: serviceData?.complainDetails?.videos || [],
          image: serviceData?.complainDetails?.photos || [],
        });
        setIsWarranty(serviceData?.serviceWarrantyStatus);
      } catch (error) {
        toast.error("Failed to fetch service data");
        console.error("Error fetching service data:", error);
      }
    };

    const fetchDropdowns = async () => {
      try {
        const firmId = adminStorage.DX_AD_FIRM;
        const [customerRes, serialNoRes] = await Promise.all([
          get(`/admin/get-customer?status=${2}&firmId=${firmId}`),
          post("/admin/get-serial-no", { firmId: firmId }),
        ]);
        setDropdowns(prev => ({
          ...prev,
          serialNoData: serialNoRes?.data,
          customerData: customerRes?.data
        }));
      } catch (error) {
        toast.error("Failed to fetch dropdown data");
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdowns();
    if (data?._id) {
      fetchServiceData();
    }
  }, [data?._id]);

  useEffect(() => {
    const fetchAmc = async () => {
      const response = await post(`/admin/get-amc-warranty`, {
        serialNoId: service.serialNoId,
        customerId: service.customerId,
        firmId: adminStorage.DX_AD_FIRM,
      });
      setAmc(response.data);
    }

    if (service.customerId && service.serialNoId) {
      fetchAmc();
    }
  }, [service.customerId, service.serialNoId])

  useEffect(() => {
    const fetchInstallations = async () => {
      if (service.customerId) {
        try {
          const firmId = adminStorage.DX_AD_FIRM;
          const installationRes = await post("/admin/get-installation", {
            firmId: firmId,
            customerId: service.customerId,
            status: 2
          });
          setDropdowns(prev => ({
            ...prev,
            installationData: installationRes?.data || [],
          }));

          if (installationRes?.data?.length > 0) {
            const installationSerialIds = installationRes.data.map(inst => inst.serialNoId);
            const filteredSerials = dropdowns.serialNoData.filter(serial =>
              installationSerialIds.includes(serial._id)
            );
            setDropdowns(prev => ({
              ...prev,
              filteredSerialNoData: filteredSerials,
            }));
          } else {
            setDropdowns(prev => ({
              ...prev,
              filteredSerialNoData: [],
            }));
          }
        } catch (error) {
          toast.error("Failed to fetch installations");
          console.error("Error fetching installations:", error);
        }
      } else {
        setDropdowns(prev => ({
          ...prev,
          installationData: [],
          filteredSerialNoData: [],
        }));
      }
    };
    fetchInstallations();
  }, [service.customerId, dropdowns.serialNoData]);

  useEffect(() => {
    if (service.serialNoId) {
      const getCompanyId = dropdowns?.serialNoData?.find((e) => e?._id === service?.serialNoId);
      setService(prev => ({
        ...prev,
        companyId: getCompanyId?.companyId,
      }));
    }
  }, [service?.serialNoId, dropdowns?.serialNoData]);

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
    const oneInstallation = dropdowns?.installationData?.find((e) => e?.serialNoId === service?.serialNoId);
    const code = getWarrantyCodeStatus(oneInstallation, amc);
    setIsWarranty(code);
  }, [dropdowns?.installationData, service?.serialNoId, amc]);

  const validate = () => {
    const newErrors = {};
    if (!service.serviceDate) newErrors.serviceDate = "Service date is required";
    if (!service.customerId) newErrors.customerId = "Customer is required";
    if (!service.serialNoId) newErrors.serialNoId = "Serial number is required";
    if (!complain.description) newErrors.description = "Nature of complaint is required";
    if (!service.requestBy) newErrors.requestBy = "Request by is required";
    if (!service.engineerName) newErrors.engineerName = "Name is required";
    if (!service.engineerRemarks) newErrors.engineerRemarks = "Action taken is required";
    if (!service.serviceProcessType) newErrors.serviceProcessType = "Service process type is required";
    return newErrors;
  }

  const handleSubmit = async () => {
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

    setDisable(true);
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("firmId", adminStorage.DX_AD_FIRM);
    bodyFormData.append("serviceDate", service.serviceDate);
    bodyFormData.append("customerId", service.customerId);
    bodyFormData.append("serialNoId", service.serialNoId);
    bodyFormData.append("companyId", service.companyId);
    bodyFormData.append("requestBy", service.requestBy);
    bodyFormData.append("engineerName", service.engineerName);
    bodyFormData.append("engineerRemarks", service.engineerRemarks);
    bodyFormData.append("serviceProcessType", service.serviceProcessType);
    bodyFormData.append("complainDetails", JSON.stringify(companyDetails));
    bodyFormData.append("serviceWarrantyStatus", isWarranty);

    try {
      const url = data?._id ? `/admin/manage-service/${data?._id}` : "/admin/manage-service"
      const response = await post(url, bodyFormData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      const { message, success } = response;
      if (success) {
        navigate(ADMIN_URLS.SERVICE_LIST);
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Service List", to: ADMIN_URLS.SERVICE_LIST },
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
              dropdowns={dropdowns}
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
                disabled={disable}
              />
              <MediaSection
                type="audio"
                title="Audio Files"
                accept="audio/*"
                icon="fas fa-microphone"
                mediaFiles={complain.audio}
                onMediaUpdate={handleMediaUpdate}
                disabled={disable}
              />
              <MediaSection
                type="video"
                title="Videos"
                accept="video/*"
                icon="fas fa-video"
                mediaFiles={complain.video}
                onMediaUpdate={handleMediaUpdate}
                disabled={disable}
              />
            </div>

            <div className="d-flex align-items-center justify-content-end mt-4">
              <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={disable}>
                {disable ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageService