import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import InstallationPreviewCard from "./InstallationPreviewCard";
import FormInput from "./FormInput";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import { useApi } from "../../../context/ApiContext";
import PageHeader from "../../../ui/admin/PageHeader";

export default function InstallationPost() {
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    description: "",
    images: ["", "", ""],
    reportNo: "",
    companyId: "",
  });

  const [installation, setInstallation] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null); 
  const [firm, setFirm] = useState({});
  
  const { get, post } = useApi();
  const adminStorage = getAdminStorage();

  const [loading, setLoading] = useState({
    pdf: false,
    image: false,
    refresh: false,
    company: false,
  });

  const resetForm = () => {
    setFormData({
      description: "",
      images: ["", "", ""],
      reportNo: "",
      companyId: "",
    });
    setCompanyDetails(null); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const selectedReportNo = e.target.value;
    
    if (selectedReportNo) {
      const selectedInstallation = 
                  installation.find((inst) => inst.reportNo === selectedReportNo);
      
      if (selectedInstallation) {
        setFormData((prev) => ({
          ...prev,
          reportNo: selectedReportNo,
          companyId: selectedInstallation.companyId,
        }));
        
        fetchCompanyDetails(selectedInstallation.companyId);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        reportNo: "",
        companyId: "",
      }));
      setCompanyDetails(null);
    }
  };

  const fetchCompanyDetails = async (companyId) => {
    if (!companyId) return;
    
    setLoading((prev) => ({ ...prev, company: true }));
    try {
      const response = await get(`/admin/view-company/${companyId}`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (response.success) {
        setCompanyDetails(response.data);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    } finally {
      setLoading((prev) => ({ ...prev, company: false }));
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => {
        const newImages = [...prev.images];
        newImages[index] = reader.result;
        return { ...prev, images: newImages };
      });
    };
    reader.readAsDataURL(file);
  };

  const preloadImages = (srcArray) => {
    const srcs = Array.isArray(srcArray) ? srcArray.filter(Boolean) : [];
    return Promise.all(
      srcs.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          })
      )
    );
  };

  const getInstallationDetails = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("firmId", adminStorage?.DX_AD_FIRM);
      const response = await post(`/admin/get-installation`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { data, success } = response;
      if (success) {
        setInstallation(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (adminStorage?.DX_AD_FIRM) {
      fetchFirm();
      getInstallationDetails();
    }
  }, [adminStorage?.DX_AD_FIRM]);

  const fetchFirm = async () => {
    try {
      const response = await get(`/admin/get-one-firm/${adminStorage?.DX_AD_FIRM}`);
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        setFirm(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching firm:", err);
    }
  };

  const handleDownloadImage = async () => {
    setLoading((prev) => ({ ...prev, image: true }));
    try {
      const element = pdfRef.current;
      if (!element) return;
      await preloadImages(formData.images);

      const canvas = await html2canvas(element, { scale: 4, useCORS: true });
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = 2000;
      targetCanvas.height = 2000;
      const ctx = targetCanvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(canvas, 0, 0, targetCanvas.width, targetCanvas.height);

      const imgData = targetCanvas.toDataURL("image/jpeg", 0.95);

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Installation_Image_${Date.now()}.jpeg`;
      link.click();

      resetForm();
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  const handleRefresh = async () => {
    setLoading((prev) => ({ ...prev, refresh: true }));
    try {
      resetForm();
      await fetchFirm();
    } finally {
      setLoading((prev) => ({ ...prev, refresh: false }));
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name="Create Installation Post"
          handleRefresh={handleRefresh}
          loading={loading.refresh}
        />

        <div className="card p-3">
          <div className="card-body">
            <div className="row g-4 d-flex align-items-stretch">
              <div className="col-xxl-6 col-12 d-flex">
                <FormInput
                  formData={formData}
                  loading={loading}
                  installations={installation}
                  handleChange={handleChange}
                  handleCompanyChange={handleCompanyChange} 
                  handleImageUpload={handleImageUpload}
                  handleDownloadImage={handleDownloadImage}
                />
              </div>

              <div className="col-xxl-6 col-12 d-flex">
                <InstallationPreviewCard
                  firm={firm}
                  ref={pdfRef}
                  formData={formData}
                  company={companyDetails} 
                  isPreview={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}