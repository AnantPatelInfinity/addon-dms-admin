import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../../../context/ApiContext";
import moment from "moment";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import CustomerSection from "../../../components/Admin/trialSection/CustomerSection";
import { toast } from "react-toastify";
import { DX_URL } from "../../../config/baseUrl";
import TrialForm from "../../../components/Admin/trialSection/TrialForm";
import EquipmentSection from "../../../components/Admin/trialSection/EquipmentSection";
import MediaSection from "../../../components/Admin/Service/MediaSection";
import CheckListSection from "../../../components/Admin/trialSection/CheckListSection";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

const ManageTrial = () => {
  const navigate = useNavigate();
  const { post, get, put } = useApi();
  const { state: trialData } = useLocation();
  const trialId = trialData?._id;

  const adminStorage = getAdminStorage();

  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [trialObj, setTrialObj] = useState({});

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigCanvas = useRef(null);

  const [dropdowns, setDropdowns] = useState({
    dealersData: [],
    customerData: [],
    productData: [],
  });

  const [checkList, setCheckList] = useState({
    isDocket: true
  });

  const [trial, setTrial] = useState({
    registerDate: moment().format("YYYY-MM-DD"),
    startDate: "",
    endDate: "",
    status: "",
    completedRemark: "",
    productId: "",
    productName: "",
    productModel: "",
    productSerialNo: "",
    engineerName: "",
    engineerRemarks: "",
    customerRemarks: "",
    productImage: [],
    productPdf: [],
    companyId: "",
    customerId: "",
    customerSignature: "",
    // partyType: ""  
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const firmId = adminStorage.DX_AD_FIRM;
        const [dealerRes, customerRes, productRes] = await Promise.all([
          get(`/admin/get-dealer?firmId=${firmId}`),
          get(`/admin/get-customer?status=2&firmId=${firmId}`),
          get(`/admin/get-products`),
        ]);
        setDropdowns({
          dealersData: dealerRes?.data || [],
          customerData: customerRes?.data || [],
          productData: productRes?.data || [],
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (trialId) {
      getTrialById(trialId);
    }
  }, [trialId]);

  const getTrialById = async (id) => {
    try {
      setDisable(true);
      const res = await get(`/admin/get-trial-order/${id}`);
      if (res.success) {
        setTrialObj(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisable(false);
    }
  }

  useEffect(() => {
    if (trialObj?.trial?._id) {
      setTrial({
        registerDate: trialObj?.trial?.registerDate
          ? moment(trialObj?.trial?.registerDate).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        startDate: trialObj?.trial?.startDate
          ? moment(trialObj?.trial?.startDate).format("YYYY-MM-DD")
          : "",
        endDate: trialObj?.trial?.endDate
          ? moment(trialObj?.trial?.endDate).format("YYYY-MM-DD")
          : "",
        status: trialObj?.trial?.status || "",
        customerId: trialObj?.trial?.customerId?._id || "",
        completedRemark: trialObj?.trial?.completedRemark || "",
        productName: trialObj?.trial?.productName || "",
        productId: trialObj?.trial?.productId?._id || "",
        productModel: trialObj?.trial?.productModel || "",
        productSerialNo: trialObj?.trial?.serialNo || "",
        engineerRemarks: trialObj?.trial?.engineerRemarks || "",
        engineerName: trialObj?.trial?.engineerName || "",
        customerRemarks: trialObj?.trial?.customerRemarks || "",
        customerSignature: trialObj?.trial?.customerSignature || "",
        productImage: (trialObj?.trial?.images || []).map(img => typeof img === 'string' ? { url: img } : img),
        productPdf: (trialObj?.trial?.descPdf || []).map(pdf => typeof pdf === 'string' ? { url: pdf } : pdf),
      });

      setCheckList({
        isDocket: trialObj?.trial?.isDocket || false,
      });

    }
  }, [trialObj?.trial?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    setTrial((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selected = dropdowns.productData.find((p) => p._id === productId);

    setTrial((prev) => ({
      ...prev,
      productId,
      productName: selected?.companyName || "",
      productModel: selected?.name || "",
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.productId;
      return newErrors;
    });
  };

  useEffect(() => {
    if (trial.customerId) {
      const dataList = dropdowns.customerData;

      const selected = dataList.find((item) => item._id === trial.customerId);
      setSelectedCustomer(selected || null);

      if (selected?.signature) {
        setTrial(prev => ({
          ...prev,
          customerSignature: selected?.signature ? selected?.signature : ""
        }));
      }
    } else {
      setSelectedCustomer(null);
    }
  }, [trial.customerId, dropdowns.customerData]);

  const validate = () => {
    const newErrors = {};
    if (!trial.registerDate)
      newErrors.registerDate = "Register date is required";
    if (!checkList?.isDocket && !trial.startDate) {
      if (!trial.startDate) newErrors.startDate = "Start date is required";
    }
    if (!trial.endDate) newErrors.endDate = "End date is required";
    if (!trial.productId) newErrors.productId = "Product is required";
    if (!trial.customerId) newErrors.customerId = "Customer selection is required";
    if (!trial.productName)
      newErrors.productName = "Equipment name is required";
    if (!trial.productModel)
      newErrors.productModel = "Product model is required";
    if (!trial.productSerialNo)
      newErrors.productSerialNo = "Product serial number is required";

    return newErrors;
  };

  const handleSubmit = async () => {

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setDisable(true);

    try {
      const trialData = {
        firmId: adminStorage.DX_AD_FIRM,
        serialNo: trial.productSerialNo,
        productName: trial.productName,
        productModel: trial.productModel,
        productId: trial.productId || "",
        registerDate: trial.registerDate,
        ...(!checkList?.isDocket && { startDate: trial.startDate }),
        endDate: trial.endDate,
        status: trial.status?.toUpperCase(),
        completedRemark: trial.completedRemark,
        engineerRemarks: trial.engineerRemarks,
        engineerName: trial.engineerName,
        customerRemarks: trial.customerRemarks,
        customerSignature: trial.customerSignature,
        isDocket: checkList.isDocket,
        customerId: trial.customerId,
        entryType: "ADMIN",
        images: Array.isArray(trial.productImage)
          ? trial.productImage.map((img) => img.url)
          : [],

        descPdf: Array.isArray(trial.productPdf)
          ? trial.productPdf.map((pdf) => pdf.url)
          : [],
      };

      const res = trialObj?.trial?._id ? await put(`${DX_URL}/admin/manage-trial-order/${trialObj.trial._id}`, trialData)
        : await post(`${DX_URL}/admin/manage-trial-order`, trialData);

      if (res.success) {
        toast.success(res.message);
        navigate(ADMIN_URLS.TRIAL_LIST);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };

  const handleMediaUpdate = (type, files) => {
    setTrial((prev) => ({
      ...prev,
      [type === "image" ? "productImage" : "productPdf"]: files,
    }));
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf'
    ];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isPDF = file.type === 'application/pdf' || fileExtension === 'pdf';
    if (!allowedTypes.includes(file.type) && !isPDF) {
      toast.error('Only image (JPEG, PNG) and PDF files are allowed');
      e.target.value = '';
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      setDisable(true);
      const response = await axios.post(`${DX_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { data, message, success } = response.data;
      if (success) {
        const fileUrl = isPDF ? data?.pdf : data?.image
        setTrial(prev => ({
          ...prev,
          [fieldName]: fileUrl
        }));
        toast.success(`${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} uploaded successfully`);
      } else {
        toast.error(message || `Upload failed for ${fieldName}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Error uploading ${fieldName}`);
    } finally {
      setDisable(false);
    }
  }

  const handleSaveSignature = async () => {
    if (sigCanvas.current.isEmpty()) {
      toast.error('Please provide a signature first');
      return;
    }

    try {
      setDisable(true);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const signatureCanvas = sigCanvas.current.getCanvas();
      canvas.width = signatureCanvas.width;
      canvas.height = signatureCanvas.height;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(signatureCanvas, 0, 0);

      const signatureData = canvas.toDataURL('image/png');

      const response = await fetch(signatureData);
      const blob = await response.blob();
      const file = new File([blob], 'signature.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await axios.post(`${DX_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const { data, success, message } = uploadResponse.data;
      if (success) {
        setTrial(prev => ({
          ...prev,
          customerSignature: data.image
        }));
        toast.success('Signature saved successfully');
        setShowSignaturePad(false);
      } else {
        toast.error(message || 'Failed to save signature');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving signature');
      console.error('Signature save error:', err);
    } finally {
      setDisable(false);
    }
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Demo Unit List", to: ADMIN_URLS.TRIAL_LIST },
            { label: `Demo Unit ${trialData ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">{trialData ? "Edit" : "Add"} Demo Unit</h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <TrialForm
              trial={trial}
              setTrial={setTrial}
              handleChange={handleChange}
              errors={errors}
              data={trialData}
              checkList={checkList}
              setCheckList={setCheckList}
            />
            <CustomerSection
              trial={trial}
              handleChange={handleChange}
              dealers={dropdowns?.dealersData}
              errors={errors}
              customers={dropdowns?.customerData}
              selectedCustomer={selectedCustomer}
            />

            {/* <CheckListSection checkList={checkList} setCheckList={setCheckList} /> */}

            <EquipmentSection
              trial={trial}
              handleChange={handleChange}
              errors={errors}
              productList={dropdowns.productData}
              handleProductChange={handleProductChange}
            />


            <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
              <div className="mb-3">
                <label className="col-form-label">Customer Signature & Stamp </label>

                {showSignaturePad ? (
                  <div className="signature-pad-container">
                    <div className="signature-pad-wrapper mb-2">
                      <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{
                          width: 300,
                          height: 150,
                          className: 'signature-canvas',
                          style: { background: 'white' }
                        }}
                        penColor="black"
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleSaveSignature}
                      >
                        Save Signature
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={handleClearSignature}
                      >
                        Clear
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setShowSignaturePad(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary mx-2 mb-2"
                      onClick={() => setShowSignaturePad(true)}
                    >
                      <i className="ti ti-pencil" /> Draw Signature
                    </button>
                    <div className="drag-attach">
                      <input
                        type="file"
                        name="customerSignature"
                        onChange={(e) => handleFileChange(e, 'customerSignature')}
                        accept="image/*,.pdf"
                      />
                      {trial.customerSignature ? (
                        <div className="my-2 mx-2">
                          {trial.customerSignature.endsWith('.pdf') ? (
                            <a href={trial.customerSignature} target="_blank" rel="noopener noreferrer">
                              📄 View PDF
                            </a>
                          ) : (
                            <img
                              src={trial.customerSignature}
                              alt="Uploaded"
                              style={{
                                width: "100%",
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="img-upload">
                          <i className="ti ti-file-broken" /> Upload File
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <MediaSection
              type="image"
              title="Images"
              accept="image/*"
              icon="fas fa-image"
              mediaFiles={trial.productImage}
              onMediaUpdate={handleMediaUpdate}
              disabled={disable}
            />
            <MediaSection
              type="pdf"
              title="PDF Documents"
              accept=".pdf"
              icon="fas fa-file-pdf"
              mediaFiles={trial.productPdf}
              onMediaUpdate={handleMediaUpdate}
            />
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
                disabled={disable}
              >
                {disable ? "Loading..." : trialData ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTrial;
