import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import moment from "moment";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import { toast } from "react-toastify";
import TrialForm from "../../../components/Admin/trialSection/TrialForm";
import EquipmentSection from "../../../components/Admin/trialSection/EquipmentSection";
import MediaSection from "../../../components/Admin/Service/MediaSection";
import CheckListSection from "../../../components/Admin/trialSection/CheckListSection";
import CustomerSection from "../../../components/Dealer/Trial/CustomerSection";
import {
  addDeTrialData,
  editDeTrialData,
  resetAddDeTrialData,
  resetEditDeTrialData,
  resetViewDeTrial,
  viewDeTrialData,
} from "../../../middleware/dealerTrial/dealerTrial";
import { getDealerCustomerList } from "../../../middleware/customer/customer";
import { getProductList } from "../../../middleware/product/product";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SignatureCanvas from 'react-signature-canvas';
import { DX_URL } from "../../../config/baseUrl";

const ManageTrial = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: trialData } = useLocation();

  const { customerList } = useSelector((state) => state?.customer);
  const { productsList } = useSelector((state) => state?.product);

  const products = productsList?.products || []
  const dealerStorage = getDealerStorage();

  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigCanvas = useRef(null);

  const [checkList, setCheckList] = useState({
    isDocket: true,
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
    // partyType: "",
    // customerType: "",
  });

  // const [newCustomer, setNewCustomer] = useState({
  //   title: "",
  //   name: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   clinicName: "",
  //   address: "",
  //   addressTwo: "",
  //   addressThree: "",
  //   city: "",
  //   state: "",
  //   pincode: "",
  // });

  const {
    addTrialMessage,
    addTrialError,
    editTrialMessage,
    editTrialError,
  } = useSelector((state) => state?.dealerTrial);

  useEffect(() => {
    if (addTrialMessage) {
      navigate(DEALER_URLS.TRIAL_LIST);
      toast.success(addTrialMessage);
      dispatch(resetAddDeTrialData());
    }
    if (addTrialError) {
      toast.error(addTrialError);
      dispatch(resetAddDeTrialData());
    }

    if (editTrialMessage) {
      navigate(DEALER_URLS.TRIAL_LIST);
      toast.success(editTrialMessage);
      dispatch(resetEditDeTrialData());
    }
    if (editTrialError) {
      toast.error(editTrialError);
      dispatch(resetEditDeTrialData());
    }
  }, [
    addTrialMessage,
    addTrialError,
    editTrialMessage,
    editTrialError,
  ]);

  useEffect(() => {
    if (dealerStorage?.DL_ID) {
      dispatch(getDealerCustomerList(dealerStorage.DL_ID));
      dispatch(getProductList());
    }
  }, [dispatch, dealerStorage?.DL_ID]);

  useEffect(() => {
    if (trialData?._id) {
      dispatch(viewDeTrialData(trialData?._id));
    }
    return () => {
      dispatch(resetViewDeTrial());
    }
  }, [dispatch, trialData?._id]);

  const { trialOne } = useSelector((state) => state.dealerTrial);

  useEffect(() => {
    if (trialOne?.trial) {
      setTrial({
        registerDate: trialOne?.trial?.registerDate
          ? moment(trialOne?.trial?.registerDate).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        startDate: trialOne?.trial?.startDate
          ? moment(trialOne?.trial?.startDate).format("YYYY-MM-DD")
          : "",
        endDate: trialOne?.trial?.endDate
          ? moment(trialOne?.trial?.endDate).format("YYYY-MM-DD")
          : "",
        status: trialOne?.trial?.status || "",
        customerId: trialOne?.trial?.customerId?._id || "",
        completedRemark: trialOne?.trial?.completedRemark || "",
        productName: trialOne?.trial?.productName || "",
        productId: trialOne?.trial?.productId?._id || "",
        productModel: trialOne?.trial?.productModel || "",
        productSerialNo: trialOne?.trial?.serialNo || "",
        engineerName: trialOne?.trial?.engineerName || "",
        engineerRemarks: trialOne?.trial?.engineerRemarks || "",
        customerRemarks: trialOne?.trial?.customerRemarks || "",
        customerSignature: trialOne?.trial?.customerSignature || "",
        productImage: (trialOne?.trial?.images || []).map(img => typeof img === 'string' ? { url: img } : img),
        productPdf: (trialOne?.trial?.descPdf || []).map(pdf => typeof pdf === 'string' ? { url: pdf } : pdf),
        // partyType: trialOne.partyType || "",
        // partyId: trialOne.partyId || ""
      });

      setCheckList({
        isDocket: trialOne?.trial?.isDocket || false,
      });
    }
  }, [trialOne]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // if (name === "customerType" && value === "new") {
    //   setTrial((prev) => ({
    //     ...prev,
    //     [name]: value,
    //     customerId: "",
    //   }));
    //   return;
    // }

    setTrial((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selected = products.find((p) => p._id === productId);

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
      const customer = customerList.find(
        (c) => c._id === trial.customerId
      );
      setSelectedCustomer(customer);

      if (customer?.signature) {
        setTrial(prev => ({
          ...prev,
          customerSignature: customer?.signature ? customer?.signature : ""
        }));
      }
    } else {
      setSelectedCustomer(null);
    }
  }, [trial.customerId, customerList]);

  const validate = () => {
    const newErrors = {};
    if (!trial.registerDate)
      newErrors.registerDate = "Register date is required";
    if (!checkList?.isDocket && !trial.startDate) {
      if (!trial.startDate) newErrors.startDate = "Start date is required";
    }
    if (!trial.endDate) newErrors.endDate = "End date is required";
    if (!trial.productId) newErrors.productId = "Product is required";
    if (!trial.productName)
      newErrors.productName = "Equipment name is required";
    if (!trial.productModel)
      newErrors.productModel = "Product model is required";
    if (!trial.productSerialNo)
      newErrors.productSerialNo = "Product serial number is required";
    if (!trial.customerId) newErrors.customerId = "Customer is required";

    // if (!trial.customerType)
    //   newErrors.customerType = "Customer type is required";

    // if (trial.customerType === "existing" && !trial.customerId)
    //   newErrors.customerId = "Customer is required";

    // if (trial.customerType === "new") {
    //   if (!newCustomer.name) newErrors.name = "Name is required";
    //   if (!newCustomer.lastName) newErrors.lastName = "Last name is required";
    //   if (!newCustomer.email) newErrors.email = "Email is required";
    //   if (!newCustomer.phone) newErrors.phone = "Phone is required";
    //   if (!newCustomer.city) newErrors.city = "City is required";
    //   if (!/^\d{6}$/.test(newCustomer.pincode))
    //     newErrors.pincode = "Invalid pincode format";
    // }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    setDisable(true);

    try {
      const trialPayload = {
        firmId: dealerStorage.DX_DL_FIRM_ID,
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
        customerId: trial.customerId || "",
        entryType: "DEALER",
        dealerId: dealerStorage.DL_ID,

        images: Array.isArray(trial.productImage)
          ? trial.productImage.map((img) => img.url)
          : [],

        descPdf: Array.isArray(trial.productPdf)
          ? trial.productPdf.map((pdf) => pdf.url)
          : [],

        // partyType: "CUSTOMER",
        // entryType: "DEALER",
      };

      trialData?._id
        ? dispatch(editDeTrialData(trialData._id, trialPayload))
        : dispatch(addDeTrialData(trialPayload));

      // navigate(DEALER_URLS.TRIAL_LIST)
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
            { label: "Demo Unit List", to: DEALER_URLS.TRIAL_LIST },
            { label: `Demo Unit ${trialData ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  {trialData ? "Edit" : "Add"} Demo Unit
                </h4>
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
              errors={errors}
              customerList={customerList}
              selectedCustomer={selectedCustomer}
            // setNewCustomer={setNewCustomer}
            // newCustomer={newCustomer}
            />

            <EquipmentSection
              trial={trial}
              handleChange={handleChange}
              errors={errors}
              productList={products}
              handleProductChange={handleProductChange}
            />

            {/* <CheckListSection
              checkList={checkList}
              setCheckList={setCheckList}
            /> */}

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
