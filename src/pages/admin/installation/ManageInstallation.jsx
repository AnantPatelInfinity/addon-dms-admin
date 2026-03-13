import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../../../context/ApiContext";
import moment from "moment";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import AdInstallationSection from "../../../components/Admin/AdInstallation/AdInstallationSection";
import CustomerSection from "../../../components/Dealer/InstallationSection/CustomerSection";
import EquipmentSection from "../../../components/Dealer/InstallationSection/EquipmentSection";
import DocSection from "../../../components/Dealer/InstallationSection/DocSection";
import { toast } from "react-toastify";
import { DX_URL } from "../../../config/baseUrl";
import axios from "axios";
import CheckListSection from "../../../components/Admin/AdInstallation/CheckListSection";
import CustomInstallationSection from "../../../components/Admin/CustomInstallation/CustomInstallation";

const ManageInstallation = () => {
    const navigate = useNavigate();
    const { post, get } = useApi();
    const { state: data } = useLocation();
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const adminStorage = getAdminStorage();
    const [installObj, setInstallObj] = useState({});
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
        status: null,
        isOldCheckList: false,
    });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
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

    const [dropdowns, setDropdowns] = useState({
        warrantyData: [],
        companyData: [],
        serialNoData: [],
        customerData: [],
        installSerialNo: [],
    });

    const [dynamicFields, setDynamicFields] = useState([]);
    const [dynamicValues, setDynamicValues] = useState({});
    const [checklistFields, setChecklistFields] = useState([]);

    const fetchDynamicSelection = async () => {
        try {
            if (!installation.companyId) {
                setDynamicFields(checklistFields);
                return;
            }

            const response = await axios.get(
                `${DX_URL}/admin/get-attribute?companyId=${installation.companyId}`
            );
            const allAttributes = response?.data?.data?.attributes || [];

            const nonEquipmentAttrs = allAttributes.filter(
                (attr) => attr.category !== "Equipment Attributes"
            );

            const nonChecklistAttrs = nonEquipmentAttrs.filter(
                (attr) => attr.category !== "Checklist For Installation"
            );

            const mergedMap = new Map();

            checklistFields.forEach((attr) => {
                if (!mergedMap.has(attr.key)) mergedMap.set(attr.key, attr);
            });

            nonChecklistAttrs.forEach((attr) => {
                if (!mergedMap.has(attr.key)) mergedMap.set(attr.key, attr);
            });

            const mergedFields = Array.from(mergedMap.values());

            setDynamicFields(mergedFields);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                const res = await axios.get(`${DX_URL}/admin/get-attribute`);
                const allAttributes = res?.data?.data?.attributes || [];
                const checklist = allAttributes.filter(
                    (attr) => attr.category === "Checklist For Installation"
                );
                setChecklistFields(checklist);
                setDynamicFields(checklist);
            } catch (err) {
                console.error("Checklist fetch error", err);
            }
        };
        fetchChecklist();
    }, []);

    useEffect(() => {
        if (installation.companyId && checklistFields.length > 0) {
            fetchDynamicSelection();
        }
    }, [installation.companyId]);

    const calculateWarrantyDates = (warrantyId, physicalDate) => {
        const selectedWarranty = dropdowns?.warrantyData?.find(
            (w) => w._id === warrantyId
        );
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
        const fetchDropdowns = async () => {
            const firmId = adminStorage.DX_AD_FIRM;
            const [
                companyRes,
                warrantyRes,
                customerRes,
                serialNoRes,
                installSerialRes,
            ] = await Promise.all([
                get(`/admin/get-company?firmId=${firmId}&status=2`),
                get(`/admin/get-warranty`),
                get(`/admin/get-customer?status=${2}&firmId=${firmId}`),
                post("/admin/get-serial-no", { firmId: firmId }),
                post("/admin/get-installation-serialno", { firmId: firmId }),
            ]);
            setDropdowns({
                companyData: companyRes?.data,
                warrantyData: warrantyRes?.data,
                serialNoData: serialNoRes?.data,
                customerData: customerRes?.data,
                installSerialNo: installSerialRes?.data,
            });
        };
        fetchDropdowns();
    }, []);

    useEffect(() => {
        if (data) {
            const getInstallation = async () => {
                try {
                    const formData = new URLSearchParams();
                    formData.append("firmId", adminStorage.DX_AD_FIRM);
                    const response = await post(`/admin/get-installation/${data}`);
                    const { data: resData, success } = response;
                    if (success) {
                        setInstallObj(resData);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            getInstallation();
        }
    }, [data]);

    useEffect(() => {
        if (data && installObj) {
            setInstallation({
                registerDate: moment(installObj.registerDate).format("YYYY-MM-DD"),
                installationType: installObj.installationType || "",
                serialNoId: installObj.serialNoId || "",
                installWarrantyId: installObj.installWarrantyId || "",
                physicalInstallDate: moment(installObj.physicalInstallDate).format(
                    "YYYY-MM-DD"
                ),
                engineerName: installObj.engineerName || "",
                customerType: "existing",
                customerId: installObj.customerId || "",
                equipmentName: installObj.equipmentName || "",
                productModel: installObj.productModel || "",
                productSerialNo: installObj.productSerialNo || "",
                engineerRemarks: installObj.engineerRemarks || "",
                productSerialNoImage: installObj.productSerialNoImage || "",
                customerSignature: installObj.customerSignature || "",
                proofDeliveryImage: installObj.proofDeliveryImage || "",
                companyId: installObj.companyId || "",
                warrantyStartDate: installObj.warrantyStartDate || "",
                warrantyEndDate: installObj.warrantyEndDate || "",
                status: installObj.status || null,
                isOldCheckList: installObj.isOldCheckList ? installObj?.isOldCheckList : false, // FOR THE NEW PRODUCT ATTRIBUTES ALWAYS SEND FOR NEW DATA FALSE AND OLD DATA TRUE
            });

            const checkListData = installObj?.checkList;

            setCheckList({
                isInstallationDone: checkListData?.isInstallationDone || false,
                isArebProcessDone: checkListData?.isArebProcessDone || false,
                isManualReceived: checkListData?.isManualReceived || false,
                isEquipmentDemo: checkListData?.isEquipmentDemo || false,
                userTraining: checkListData?.userTraining || false,
                serviceContact: checkListData?.serviceContact || false,
            });

            if (installObj?.productAttributes) {
                const mapped = {};
                Object.entries(installObj.productAttributes).forEach(([key, attr]) => {
                    mapped[key] = {
                        label: attr.label || "",
                        value: attr.value || "",
                        unit: attr.unit || "",
                        type: attr.type || "",
                        category: attr.category || "",
                        inputType: attr.inputType || "",
                    };
                });
                setDynamicValues(mapped);
            }
        }
    }, [data, installObj]);

    useEffect(() => {
        if (installation.customerId) {
            const customer = dropdowns?.customerData?.find(
                (c) => c._id === installation.customerId
            );
            setSelectedCustomer(customer);

            if (customer) {
                setInstallation((prev) => ({
                    ...prev,
                    customerSignature:
                        customer?.signature || prev.customerSignature || "",
                }));
            }
        } else {
            setSelectedCustomer(null);
        }
    }, [installation.customerId, dropdowns?.customerData]);

    useEffect(() => {
        if (installation.serialNoId) {
            const product = dropdowns?.serialNoData?.find(
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
        dropdowns?.serialNoData,
        installation.physicalInstallDate,
        dropdowns?.warrantyData,
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

        // default case manage
        setInstallation((prev) => ({ ...prev, [name]: value }));
    };

    console.log(installation?.warrantyStartDate, installation?.warrantyEndDate, "@@@@")

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
        // if (!installation.engineerRemarks) {
        //     newErrors.engineerRemarks = "Engineer remarks are required";
        // } else if (installation.engineerRemarks.length > 200) {
        //     newErrors.engineerRemarks = "Engineer remarks must be under 200 characters";
        // }

        if (installation.customerType === "new") {
            if (!newCustomer?.title?.trim()) newErrors.title = "Title is required";
            if (!newCustomer?.name?.trim()) newErrors.name = "Name is required";
            if (!newCustomer?.lastName?.trim())
                newErrors.lastName = "Last name is required";
            if (!newCustomer.email) newErrors.email = "Email is required";
            if (!newCustomer.phone) newErrors.phone = "Phone is required";
            if (!newCustomer?.clinicName?.trim())
                newErrors.clinicName = "Clinic name is required";
            if (!newCustomer?.address?.trim())
                newErrors.address = "Address is required";
            if (!newCustomer?.city?.trim()) newErrors.city = "City is required";
            if (!newCustomer?.state?.trim()) newErrors.state = "State is required";
            if (!newCustomer?.pincode) {
                newErrors.pincode = "Pincode is required";
            } else if (!/^\d{6}$/.test(newCustomer.pincode)) {
                newErrors.pincode = "Invalid pincode format";
            }
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
                    firmId: adminStorage.DX_AD_FIRM,
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
                    signature: installation.customerSignature,
                };
                const res = await axios.post(
                    `${DX_URL}/admin/manage-customer`,
                    customerData,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer ${adminStorage.DX_AD_TOKEN}`,
                        },
                    }
                );
                const { data, success, message } = res?.data;
                if (success) {
                    customerId = data;
                    toast.success(message);
                } else {
                    toast.error(message);
                    setDisable(false);
                    return;
                }
            }

            const installData = {
                firmId: adminStorage.DX_AD_FIRM,
                firmName: adminStorage.DX_AD_FIRM_SN,
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
                productAttributes: dynamicValues,
                warrantyStartDate: installation.warrantyStartDate,
                warrantyEndDate: installation.warrantyEndDate,

                // status: installation.status
                isOldCheckList: installation.isOldCheckList, // FOR THE NEW PRODUCT ATTRIBUTES ALWAYS SEND 
            };

            const url = data
                ? `${DX_URL}/admin/manage-installation/${data}`
                : `${DX_URL}/admin/manage-installation`;
            // const url = data ? `${DX_URL}/admin/testing-manage-installation/${data}` : `${DX_URL}/admin/testing-manage-installation`
            const resInstall = await axios.post(url, installData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminStorage.DX_AD_TOKEN}`,
                },
            });
            const { success, message } = resInstall?.data;
            if (success) {
                toast.success(message);
                navigate(ADMIN_URLS.INSTALL_LIST);
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
                        { label: "Installation List", to: ADMIN_URLS.INSTALL_LIST },
                        { label: `Installation ${data ? "Edit" : "Add"}` },
                    ]}
                />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4 className="page-title">
                                    Installation {data ? "Edit" : "Add"}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <AdInstallationSection
                            installation={installation}
                            setInstallation={setInstallation}
                            handleChange={handleChange}
                            errors={errors}
                            data={data}
                            dropdowns={dropdowns}
                        />
                        <CustomerSection
                            installation={installation}
                            handleChange={handleChange}
                            errors={errors}
                            customerList={dropdowns?.customerData}
                            selectedCustomer={selectedCustomer}
                            setNewCustomer={setNewCustomer}
                            newCustomer={newCustomer}
                        />

                        {!installation?.isOldCheckList && (
                            <CustomInstallationSection
                                dynamicFields={dynamicFields}
                                values={dynamicValues}
                                checklistFields={checklistFields}
                                setValues={setDynamicValues}
                            />
                        )}
                        <EquipmentSection
                            installation={installation}
                            handleChange={handleChange}
                            errors={errors}
                        />

                        {installation?.isOldCheckList && Object.keys(installObj?.productAttributes ?? {})?.length === 0 && (
                            <CheckListSection checkList={checkList} setCheckList={setCheckList} />
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
                                {disable ? "Loading..." : data ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageInstallation;
