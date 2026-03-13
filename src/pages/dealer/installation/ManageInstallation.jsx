import React, { useEffect, useMemo, useState } from "react";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import { useLocation, useNavigate } from "react-router";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWarranty,
  getTrueWarranty,
} from "../../../middleware/warranty/warranty";
import {
  getDeInstallSerialNo,
  getPoSerialItems,
} from "../../../middleware/PoItems/PoItems";
import { getDealerCustomerList } from "../../../middleware/customer/customer";
import { toast } from "react-toastify";
import DocSection from "../../../components/Dealer/InstallationSection/DocSection";
import EquipmentSection from "../../../components/Dealer/InstallationSection/EquipmentSection";
import InstallSection from "../../../components/Dealer/InstallationSection/InstallSection";
import CustomerSection from "../../../components/Dealer/InstallationSection/CustomerSection";
import {
  addInstallation,
  getOneInstallation,
} from "../../../middleware/installation/installation";
import axios from "axios";
import { DX_URL } from "../../../config/baseUrl";
import CheckListSection from "../../../components/Admin/AdInstallation/CheckListSection";
import CustomInstallation from "../../../components/Admin/CustomInstallation/CustomInstallation";

const ManageInstallation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: data } = useLocation();
  const dealerStorage = useMemo(() => getDealerStorage(), []);
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [installation, setInstallation] = useState({
    registerDate: moment(Date.now()).format("YYYY-MM-DD"),
    installationType: "",
    serialNoId: "",
    installWarrantyId: "",
    physicalInstallDate: moment(Date.now()).format("YYYY-MM-DD"),
    engineerName: "",
    customerType: "",
    customerId: "",
    equipmentName: "",
    productModel: "",
    productSerialNo: "",
    engineerRemarks: "",
    productSerialNoImage: "",
    customerSignature: "",
    proofDeliveryImage: "",
    companyId: "",
    warrantyStartDate: "",
    warrantyEndDate: "",
    isOldCheckList: false,
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dynamicDealerFields, setDynamicDealerFields] = useState([]);
  const [dynamicDealerValues, setDynamicDealerValues] = useState({});
  const [checklistFields, setChecklistFields] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    title: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    clinicName: "",
    address: "",
    addressTwo: "",
    addressThree: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [checkList, setCheckList] = useState({
    isInstallationDone: false,
    isArebProcessDone: false,
    isManualReceived: false,
    isEquipmentDemo: false,
    userTraining: false,
    serviceContact: false,
  });

  const { poSerialNo } = useSelector((state) => state?.dealerPoItems);
  const { customerList } = useSelector((state) => state?.customer);
  const { installationOne } = useSelector((state) => state?.dealerInstallation);
  const { warrantyList } = useSelector((state) => state?.dealerWarranty);



  const fetchDynamicSelection = async () => {
    try {

      if (!installation.companyId) {
        setDynamicDealerFields(checklistFields);
        return;
      }

      const response = await axios.get(`${DX_URL}/admin/get-attribute?companyId=${installation.companyId}`);
      const allAttributes = response?.data?.data?.attributes || [];

      const nonEquipmentAttrs = allAttributes.filter(attr => attr.category !== "Equipment Attributes");

      const nonChecklistAttrs = nonEquipmentAttrs.filter(
        attr => attr.category !== "Checklist For Installation"
      );

      const mergedMap = new Map();

      checklistFields.forEach(attr => {
        if (!mergedMap.has(attr.key)) mergedMap.set(attr.key, attr);
      });

      nonChecklistAttrs.forEach(attr => {
        if (!mergedMap.has(attr.key)) mergedMap.set(attr.key, attr);
      });

      const mergedFields = Array.from(mergedMap.values());

      setDynamicDealerFields(mergedFields);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await axios.get(`${DX_URL}/admin/get-attribute`);
        const allAttributes = res?.data?.data?.attributes || [];
        const checklist = allAttributes.filter(attr => attr.category === "Checklist For Installation");
        setChecklistFields(checklist);
        setDynamicDealerFields(checklist);
      } catch (err) {
        console.error("Checklist fetch error", err);
      }
    };
    fetchChecklist();
  }, []);

  const calculateWarrantyDates = (warrantyId, physicalDate) => {
    const selectedWarranty = warrantyList?.find((w) => w._id === warrantyId);
    if (
      selectedWarranty &&
      selectedWarranty.duration !== null &&
      physicalDate
    ) {
      const startDate = moment(physicalDate);
      const endDate = startDate
        .clone()
        .add(selectedWarranty.duration, "months");
      return {
        warrantyStartDate: startDate.format("YYYY-MM-DD"),
        warrantyEndDate: endDate.format("YYYY-MM-DD"),
      };
    }
    return { warrantyStartDate: "", warrantyEndDate: "" };
  };

  useEffect(() => {
    dispatch(getTrueWarranty());
    dispatch(getDealerCustomerList(dealerStorage.DL_ID));
    const formData = new URLSearchParams();
    formData.append("dealerId", dealerStorage?.DL_ID);
    formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
    dispatch(getPoSerialItems(formData));
    dispatch(getDeInstallSerialNo(formData));
    dispatch(getAllWarranty());
  }, []);

  useEffect(() => {
    if (data?._id) {
      const formData = new URLSearchParams();
      formData.append("dealerId", dealerStorage?.DL_ID);
      formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
      dispatch(getOneInstallation(formData, data?._id));
    }
  }, [data?._id]);

  useEffect(() => {
    if (data?._id && installationOne) {
      setInstallation({
        registerDate: moment(installationOne.registerDate).format("YYYY-MM-DD"),
        installationType: installationOne.installationType || "",
        serialNoId: installationOne.serialNoId || "",
        installWarrantyId: installationOne.installWarrantyId || "",
        physicalInstallDate: moment(installationOne.physicalInstallDate).format(
          "YYYY-MM-DD"
        ),
        engineerName: installationOne.engineerName || "",
        customerType: "existing",
        customerId: installationOne.customerId || "",
        equipmentName: installationOne.equipmentName || "",
        productModel: installationOne.productModel || "",
        productSerialNo: installationOne.productSerialNo || "",
        engineerRemarks: installationOne.engineerRemarks || "",
        productSerialNoImage: installationOne.productSerialNoImage || "",
        customerSignature: installationOne.customerSignature || "",
        proofDeliveryImage: installationOne.proofDeliveryImage || "",
        companyId: installationOne.companyId || "",
        warrantyStartDate: installationOne.warrantyStartDate || "",
        warrantyEndDate: installationOne.warrantyEndDate || "",
        isOldCheckList: installationOne.isOldCheckList ? installationOne?.isOldCheckList : false, // FOR THE NEW PRODUCT ATTRIBUTES ALWAYS SEND FOR NEW DATA FALSE AND OLD DATA TRUE
      });

      const checkListData = installationOne?.checkList;
      setCheckList({
        isInstallationDone: checkListData?.isInstallationDone || false,
        isArebProcessDone: checkListData?.isArebProcessDone || false,
        isManualReceived: checkListData?.isManualReceived || false,
        isEquipmentDemo: checkListData?.isEquipmentDemo || false,
        userTraining: checkListData?.userTraining || false,
        serviceContact: checkListData?.serviceContact || false,
      });


      if (installationOne?.productAttributes) {
        const mapped = {};

        Object.entries(installationOne.productAttributes).forEach(([key, attr]) => {
          mapped[key] = {
            label: attr.label || "",
            value: attr.value || "",
            unit: attr.unit || "",
            type: attr.type || "",
            category: attr.category || "",
            inputType: attr.inputType || "",
          };
        });

        setDynamicDealerValues(mapped);
      }
    }
  }, [data?._id, installationOne]);

  useEffect(() => {
    fetchDynamicSelection();
  }, [installation.companyId]);


  useEffect(() => {
    if (installation.customerId) {
      const customer = customerList?.find(
        (c) => c._id === installation.customerId
      );
      setSelectedCustomer(customer);
      setInstallation((prev) => ({
        ...prev,
        customerSignature: customer?.signature,
      }));
    } else {
      setSelectedCustomer(null);
    }
  }, [installation.customerId, customerList]);

  useEffect(() => {
    if (installation.serialNoId) {
      const product = poSerialNo?.find(
        (p) => p._id === installation.serialNoId
      );
      const { warrantyStartDate, warrantyEndDate } = calculateWarrantyDates(
        product?.warrantyId,
        installation.physicalInstallDate
      );
      setInstallation((prev) => ({
        ...prev,
        equipmentName: `${product?.companyName}` || "",
        productModel: product?.name || "",
        productSerialNo: product?.companySerialNo || "",
        companyId: product?.companyId || "",
        installWarrantyId: product?.warrantyId,
        warrantyStartDate,
        warrantyEndDate,
      }));
    } else {
      setInstallation((prev) => ({
        ...prev,
        equipmentName: "",
        productModel: "",
        productSerialNo: "",
        companyId: "",
        installWarrantyId: "",
        warrantyStartDate: "",
        warrantyEndDate: "",
      }));
    }
  }, [
    installation.serialNoId,
    poSerialNo,
    installation.physicalInstallDate,
    warrantyList,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    if (name === "customerType" && value === "new") {
      setInstallation((prev) => ({
        ...prev,
        [name]: value,
        customerId: "",
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customerId;
        return newErrors;
      });
    }

    if (name === "installWarrantyId" || name === "physicalInstallDate") {
      const newInstallation = {
        ...installation,
        [name]: value,
      };
      const { warrantyStartDate, warrantyEndDate } = calculateWarrantyDates(
        name === "installWarrantyId" ? value : installation.installWarrantyId,
        name === "physicalInstallDate"
          ? value
          : installation.physicalInstallDate
      );
      newInstallation.warrantyStartDate = warrantyStartDate;
      newInstallation.warrantyEndDate = warrantyEndDate;
      setInstallation(newInstallation);
      return;
    }

    setInstallation((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!installation.registerDate)
      newErrors.registerDate = "Register date is required";
    if (!installation.installationType)
      newErrors.installationType = "Installation type is required";
    if (!installation.serialNoId)
      newErrors.serialNoId = "Serial number is required";
    if (!installation.installWarrantyId)
      newErrors.installWarrantyId = "Warranty is required";
    if (!installation.physicalInstallDate)
      newErrors.physicalInstallDate = "Installation date is required";
    if (!installation.engineerName)
      newErrors.engineerName = "Engineer name is required";
    if (!installation.customerType)
      newErrors.customerType = "Customer type is required";
    if (installation.customerType === "existing" && !installation.customerId)
      newErrors.customerId = "Customer is required";
    if (!installation.equipmentName)
      newErrors.equipmentName = "Equipment name is required";
    if (!installation.productModel)
      newErrors.productModel = "Product model is required";
    if (!installation.productSerialNo)
      newErrors.productSerialNo = "Product serial no is required";
    // if (!installation.engineerRemarks) newErrors.engineerRemarks = "Engineer remarks are required";

    if (installation.customerType === "new") {
      if (!newCustomer.title) newErrors.title = "Title is required";
      if (!newCustomer.name) newErrors.name = "Name is required";
      if (!newCustomer.lastName) newErrors.lastName = "Last name is required";
      if (!newCustomer.email) newErrors.email = "Email is required";
      if (!newCustomer.phone) newErrors.phone = "Phone is required";
      if (!newCustomer.clinicName)
        newErrors.clinicName = "Clinic name is required";
      if (!newCustomer.address) newErrors.address = "Address is required";
      if (!newCustomer.city) newErrors.city = "City is required";
      if (!newCustomer.state) newErrors.state = "State is required";
      if (!newCustomer.pincode) newErrors.pincode = "Pincode is required";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors)?.length > 0) return;
    setDisable(true);
    try {
      let customerId = installation.customerId;
      if (installation.customerType === "new") {
        const customerData = {
          dealerId: dealerStorage?.DL_ID,
          isDealer: true,
          firmId: dealerStorage.DX_DL_FIRM_ID,
          name: newCustomer.name,
          lastName: newCustomer.lastName,
          email: newCustomer.email,
          phone: newCustomer.phone,
          clinicName: newCustomer.clinicName,
          address: newCustomer.address,
          addressTwo: newCustomer.addressTwo,
          addressThree: newCustomer.addressThree,
          city: newCustomer.city,
          state: newCustomer.state,
          pincode: newCustomer.pincode,
          title: newCustomer.title,
          signature: installation.customerSignature || "",
        };

        const res = await axios.post(
          `${DX_URL}/dealer/manage-dealer-customer`,
          customerData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${dealerStorage.DX_DL_TOKEN}`,
            },
          }
        );
        const { data, success, message } = res?.data;
        if (success) {
          customerId = data?._id;
          toast.success(message);
        } else {
          toast.error(message);
          setDisable(false);
          return;
        }
      }

      const installData = {
        dealerId: dealerStorage?.DL_ID,
        firmId: dealerStorage.DX_DL_FIRM_ID,
        firmName: dealerStorage.DX_DL_FIRM_SN,
        registerDate: installation.registerDate,
        installationType: installation.installationType,
        serialNoId: installation.serialNoId,
        installWarrantyId: installation.installWarrantyId,
        physicalInstallDate: installation.physicalInstallDate,
        engineerName: installation.engineerName,
        customerType: installation.customerType,
        customerId: customerId,
        equipmentName: installation.equipmentName,
        productModel: installation.productModel,
        productSerialNo: installation.productSerialNo,
        engineerRemarks: installation.engineerRemarks,
        productSerialNoImage: installation.productSerialNoImage,
        customerSignature: installation.customerSignature,
        proofDeliveryImage: installation.proofDeliveryImage,
        companyId: installation.companyId,
        // checkList: JSON.stringify(checkList),
        productAttributes: dynamicDealerValues,
        warrantyStartDate: installation.warrantyStartDate,
        warrantyEndDate: installation.warrantyEndDate,
        isOldCheckList: installation.isOldCheckList, // FOR THE NEW PRODUCT ATTRIBUTES ALWAYS SEND 
      };

      const url = data?._id
        ? `${DX_URL}/dealer/manage-installation/${data?._id}`
        : `${DX_URL}/dealer/manage-installation`;

      const resInstall = await axios.post(url, installData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dealerStorage.DX_DL_TOKEN}`,
        },
      });
      const { success, message } = resInstall?.data;
      if (success) {
        toast.success(message);
        navigate(DEALER_URLS.INSTALL_LIST);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };



  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Installation List", to: DEALER_URLS.INSTALL_LIST },
            { label: `Installation ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  Installation {data?._id ? "Edit" : "Add"}
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <InstallSection
              installation={installation}
              handleChange={handleChange}
              errors={errors}
              data={data}
            />

            <CustomerSection
              installation={installation}
              handleChange={handleChange}
              errors={errors}
              customerList={customerList}
              selectedCustomer={selectedCustomer}
              setNewCustomer={setNewCustomer}
              newCustomer={newCustomer}
            />

            {!installation?.isOldCheckList && (
              <CustomInstallation
                dynamicFields={dynamicDealerFields}
                values={dynamicDealerValues}
                checklistFields={checklistFields}
                setValues={setDynamicDealerValues}
              />
            )}
            <EquipmentSection
              installation={installation}
              handleChange={handleChange}
              errors={errors}
            />

            {installation?.isOldCheckList && Object.keys(installationOne?.productAttributes ?? {})?.length === 0 && (
              <CheckListSection
                checkList={checkList}
                setCheckList={setCheckList}
              />
            )}
            <DocSection
              installation={installation}
              setInstallation={setInstallation}
              setDisable={setDisable}
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
                {disable ? "Loading..." : data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInstallation;
