import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { useApi } from "../../../context/ApiContext";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import InstallationPreviewCard from "./InstallationPreviewCard";
import FormInput from "../../admin/installationPost/FormInput";
import { getDeProfile } from "../../../middleware/dealerProfile/dealerProfile";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../../ui/admin/PageHeader";
import { getAllInstallation } from "../../../middleware/installation/installation";
import { getOneCompany } from "../../../middleware/company/company";

export default function InstallationPost() {
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    description: "",
    images: ["", "", ""],
    reportNo: "",
    companyId: "",
  });

  const [dealer, setDealer] = useState({});
  const [localCompany, setLocalCompany] = useState({});

  const dispatch = useDispatch();

  const dealerStorage = getDealerStorage();

  const { dealerProfile } = useSelector((state) => state.dealerProfile);
  const { installationList } = useSelector(
    (state) => state?.dealerInstallation
  );
  const { companyOne } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    dispatch(getDeProfile());
  }, []);

  useEffect(() => {
    setLocalCompany(companyOne || {});
  }, [companyOne]);

  useEffect(() => {
    if (dealerProfile) {
      setDealer({
        name: dealerProfile?.name,
        email: dealerProfile?.email,
        firmName: dealerStorage?.DX_DL_FIRM_NAME,
        firmSn: dealerStorage.DX_DL_FIRM_SN,
        phone: dealerProfile?.phone,
        address: dealerProfile?.address,
        addressTwo: dealerProfile?.addressTwo,
        addressThree: dealerProfile?.addressThree,
        image: dealerProfile?.image,
        city: dealerProfile?.city,
        state: dealerProfile?.state,
        pincode: dealerProfile?.pincode,
      });
    }
  }, [dealerProfile]);

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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const selectedReportNo = e.target.value;

    if (selectedReportNo) {
      const selectedInstallation = installationList.find(
        (inst) => inst.reportNo === selectedReportNo
      );

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
    }
  };

  const fetchCompanyDetails = async (companyId) => {
    dispatch(getOneCompany(companyId));
  };

  useEffect(() => {
    if (dealerStorage?.DL_ID) {
      const formData = new URLSearchParams();
      formData.append("dealerId", dealerStorage?.DL_ID);
      dispatch(getAllInstallation(formData));
    }
  }, [dealerStorage?.DL_ID, dispatch]);

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

  // const handleDownloadPDF = async () => {
  //   setLoading((prev) => ({ ...prev, pdf: true }));
  //   try {
  //     const element = pdfRef.current;
  //     if (!element) return;
  //     await preloadImages(formData.images);

  //     const opt = {
  //       margin: 0,
  //       filename: `Service_${Date.now()}.pdf`,
  //       image: { type: "jpeg", quality: 1 },
  //       html2canvas: { scale: 4, useCORS: true },
  //       jsPDF: { unit: "px", format: [2000, 2000], orientation: "portrait" },
  //     };

  //     await html2pdf().set(opt).from(element).save();

  //     resetForm();
  //   } finally {
  //     setLoading((prev) => ({ ...prev, pdf: false }));
  //   }
  // };

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
      setLocalCompany({});
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
                  handleChange={handleChange}
                  installations={installationList}
                  handleCompanyChange={handleCompanyChange}
                  handleImageUpload={handleImageUpload}
                  handleDownloadImage={handleDownloadImage}
                />
              </div>

              <div className="col-xxl-6 col-12 d-flex">
                <InstallationPreviewCard
                  dealer={dealer}
                  ref={pdfRef}
                  formData={formData}
                  company={localCompany}
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
