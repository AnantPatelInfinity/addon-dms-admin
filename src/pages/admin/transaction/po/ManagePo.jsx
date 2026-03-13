import { useEffect, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { useLocation, useNavigate } from 'react-router';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import moment from 'moment';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import PoProductsList from '../../../../components/Admin/PO/PoProductsList';
import { toast } from 'react-toastify';
import PartyDetails from '../../../../components/Admin/PO/PartyDetails';
import AdminPoForm from '../../../../components/Admin/PO/AdminPoForm';
import DealerProductsList from '../../../../components/Admin/PO/DealerProductsList';

const ManagePo = () => {
    const { post, get, uploadImage } = useApi();
    const { state: data } = useLocation();
    const navigate = useNavigate();
    const [po, setPo] = useState({
        poNo: "",
        destination: "",
        dispatchCompanyId: "",
        dispatchDocNo: "",
        termsOfDelivery: "",
        termsOfPayment: "",
        poDate: !data?._id && moment().format('YYYY-MM-DD'),
        companyId: "",
        expectedDeliveryDate: "",
        image: "",
        signature: "",
        status: "",
        dealerId: "",
        dealerPoId: "",
        isOldData: false,
    });
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [companyData, setCompanyData] = useState([]);
    const [dispatchData, setDispatchData] = useState([]);
    const [poId, setPoId] = useState(null);
    const adminStorage = getAdminStorage();
    const [isCheckPro, setIsCheckPro] = useState([]);
    const [billTo, setBillTo] = useState({});
    const [shipTo, setShipTo] = useState({});
    const [dealerPoData, setDealerPoData] = useState([]);
    const [dealerProducts, setDealerProducts] = useState([]);
    const [selectedDePo, setSelectedDePo] = useState({});
    const [loading, setLoading] = useState(true);
    const [proData, setProData] = useState([]);
    const [hasOldData, setHasOldData] = useState(false);

    useEffect(() => {
        setLoading(true);
        get(`/admin/get-company?firmId=${adminStorage.DX_AD_FIRM}&status=2`)
            .then(res => setCompanyData(res.data))
            .catch(() => toast.error("Failed to fetch company data"));
        get("/admin/get-dispatch-company")
            .then((res) => setDispatchData(res?.data))
            .catch(() => toast.error("Failed to fetch dispatch companies"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (data?._id) {
            getEditPoData();
        }
    }, [data?._id]);

    useEffect(() => {
        if (po?.dealerPoId) {
            const findDealerPo = dealerPoData?.find((de) => de?._id === po?.dealerPoId);
            if (findDealerPo) {
                setDealerProducts(findDealerPo?.products);
                setSelectedDePo(findDealerPo);
                if (!data?._id) {
                    setPo(prev => ({
                        ...prev,
                        poNo: findDealerPo.voucherNo || "",
                        destination: findDealerPo.shipTo?.city || '',
                        dispatchCompanyId: findDealerPo.dispatchCompanyId || '',
                        termsOfDelivery: findDealerPo.termsOfDelivery || '',
                        termsOfPayment: findDealerPo.termsOfPayment || '',
                        dealerPoId: findDealerPo._id,
                        dealerId: findDealerPo?.dealerId || ''
                    }));
                    setShipTo({
                        shipId: findDealerPo?.customerId ? findDealerPo?.customerId : findDealerPo?.dealerId || null,
                        shipType: findDealerPo?.customerId ? "Customer" : "Dealer",
                        mailName: findDealerPo.shipTo?.mailName || '',
                        address: findDealerPo.shipTo?.address || '',
                        state: findDealerPo.shipTo?.state || '',
                        city: findDealerPo.shipTo?.city || '',
                        pincode: findDealerPo.shipTo?.pincode || '',
                        country: findDealerPo.shipTo?.country || 'India',
                        // gstRegisterType: findDealerPo.shipTo?.gstRegisterType || 'Unregistered',
                        gstRegisterType: findDealerPo.shipTo?.gstNo
                            ? 'Registered'
                            : (findDealerPo.shipTo?.gstRegisterType || 'Unregistered'),
                        gstNo: findDealerPo.shipTo?.gstNo || ''
                    });
                    setBillTo({
                        billId: findDealerPo?.dealerId || null,
                        billType: "Dealer",
                        mailName: findDealerPo.billTo?.mailName || '',
                        address: findDealerPo.billTo?.address || '',
                        state: findDealerPo.billTo?.state || '',
                        city: findDealerPo.billTo?.city || '',
                        pincode: findDealerPo.billTo?.pincode || '',
                        country: findDealerPo.billTo?.country || 'India',
                        // gstRegisterType: findDealerPo.billTo?.gstRegisterType || 'Unregistered',
                        gstRegisterType: findDealerPo.billTo?.gstNo
                            ? 'Registered'
                            : (findDealerPo.billTo?.gstRegisterType || 'Unregistered'),
                        gstNo: findDealerPo.billTo?.gstNo || '',
                        placeOfSupply: findDealerPo?.shipTo?.city || ''
                    });
                }
            }
            else {
                setDealerProducts([]);
                setSelectedDePo({});
                setShipTo({});
                setBillTo({});
                setPo(prev => ({
                    ...prev,
                    poNo: "",
                }));
            }
        }
    }, [po?.dealerPoId, data?._id, dealerPoData]);

    useEffect(() => {
        if (proData?.length > 0) {
            const oldDataExists = proData.some(pro => pro.isOldData === true);
            setHasOldData(oldDataExists);
        }
    }, [proData]);

    const getEditPoData = async () => {
        try {
            const res = await get(`/admin/get-po/${data?._id}`)
            const result = res?.data;
            setPo({
                poNo: result?.poNo,
                destination: result?.destination,
                dispatchCompanyId: result?.dispatchCompanyId,
                dispatchDocNo: result?.dispatchDocNo,
                termsOfDelivery: result?.termsOfDelivery,
                termsOfPayment: result?.termsOfPayment,
                poDate: moment(result?.poDate).format("YYYY-MM-DD"),
                companyId: result?.companyId,
                expectedDeliveryDate: result?.expectedDeliveryDate ? moment(result?.expectedDeliveryDate).format("YYYY-MM-DD") : "",
                status: result?.status,
                image: result?.image,
                signature: result?.signature,
                dealerId: result?.dealerId,
                dealerPoId: result?.dealerPoId,
                isOldData: result?.isOldData,
            });
            setPoId(result?._id);
            setBillTo(result?.billTo);
            setShipTo(result?.shipTo);
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "companyId") {
            setPo(prev => ({
                ...prev,
                companyId: value,
                dealerPoId: ""
            }));
        } else {
            setPo({ ...po, [name]: value });
        }
    };

    const validate = () => {
        const required = ['companyId', 'poDate', 'destination', 'termsOfDelivery', 'termsOfPayment', "dispatchCompanyId"];
        const errs = required.reduce((acc, key) => {
            if (!po[key]) acc[key] = `${key} is required`;
            return acc;
        }, {});
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleImgUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PNG, JPG, and PDF files are allowed.");
            return;
        }
        if (file.size > maxSize) {
            toast.error("File size should not exceed 5MB.");
            return;
        }
        try {
            setDisable(true);
            const res = await uploadImage("/upload-image", file);
            const { data, message, success } = res;

            if (success) {
                const fileType = file.type;
                setPo(prev => ({
                    ...prev,
                    [field]: fileType === "application/pdf" ? data?.pdf : data?.image
                }));
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setDisable(false);
        }
    }

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setDisable(true);
            const formData = new URLSearchParams();
            formData.append("poNo", po.poNo);
            formData.append("firmId", adminStorage.DX_AD_FIRM);
            formData.append("destination", po.destination);
            formData.append("dispatchCompanyId", po.dispatchCompanyId);
            formData.append("dispatchDocNo", po.dispatchDocNo);
            formData.append("termsOfDelivery", po.termsOfDelivery);
            formData.append("termsOfPayment", po.termsOfPayment);
            formData.append("poDate", po.poDate);
            formData.append("companyId", po.companyId);
            formData.append("expectedDeliveryDate", po.expectedDeliveryDate);
            formData.append("signature", po.signature);
            formData.append("status", 1);
            formData.append("billTo", JSON.stringify(billTo));
            formData.append("shipTo", JSON.stringify(shipTo));
            formData.append("isOldData", po.isOldData)

            formData.append("dealerId", selectedDePo?.dealerId);
            formData.append("dealerPoId", selectedDePo?._id);
            formData.append("customerId", selectedDePo?.customerId);
            formData.append("customerPoId", selectedDePo?._id);

            const payload = {
                poNo: po.poNo,
                firmId: adminStorage.DX_AD_FIRM,
                destination: po.destination,
                dispatchCompanyId: po.dispatchCompanyId,
                dispatchDocNo: po.dispatchDocNo,
                termsOfDelivery: po.termsOfDelivery,
                termsOfPayment: po.termsOfPayment,
                poDate: po.poDate,
                companyId: po.companyId,
                expectedDeliveryDate: po.expectedDeliveryDate,
                signature: po.signature,
                status: 1,
                billTo: JSON.stringify(billTo),           // Already an object, no need to stringify unless backend expects string
                shipTo: JSON.stringify(shipTo),           // Same as above
                isOldData: po.isOldData,
                dealerId: selectedDePo?.dealerId,
                dealerPoId: selectedDePo?._id,
                customerId: selectedDePo?.customerId,
                customerPoId: selectedDePo?._id
            };

            const url = data?._id ? `/admin/manage-po/${data?._id}` : `/admin/manage-po`
            const result = await post(url, payload, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            const { success, message } = result;
            if (success) {
                toast.success(message);
                setPoId(result?.data?._id);
                if (data?._id) {
                    getEditPoData();
                }
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong...");
        } finally {
            setDisable(false);
        }
    }

    const handleCompleted = async () => {
        if (isCheckPro?.length === 0) {
            toast.error("Please select at least one product");
            return;
        }
        toast.success("PO Submitted Successfully");
        navigate(ADMIN_URLS.PO_LIST);
    }

    const hanldeOldData = async () => {
        try {
            // Validate input data
            if (proData?.length === 0) {
                toast.error("Please add product first");
                return;
            }

            // Filter old data products
            const filteredProData = proData.filter(pro => pro.isOldData === true);
            if (filteredProData.length === 0) {
                toast.error("No old data products found");
                return;
            }

            // Get unique PO IDs
            const uniquePoIds = [...new Set(filteredProData.map(pro => pro.poId))];
            if (uniquePoIds.length === 0) {
                toast.error("No PO ID found in old data products");
                return;
            }

            // Prepare installation data
            const oldProductData = filteredProData.map((pro) => ({
                firmId: adminStorage.DX_AD_FIRM,
                firmName: adminStorage.DX_AD_FIRM_SN,
                registerDate: Date.now(),
                installationType: "sotck_from_order",
                serialNoId: pro._id,
                installWarrantyId: pro.xWarrantyId,
                physicalInstallDate: pro.xPhyDate,
                engineerName: pro.xEngName,
                customerType: "existing",
                customerId: pro.xCustomerId,
                equipmentName: pro.companyName,
                productModel: pro.productName,
                productSerialNo: pro.companySerialNo,
                companyId: pro.companyId,
                isOldData: true,
                customerSignature: pro.xCustomerSign,
                warrantyStartDate: pro.xPhyDate,
                warrantyEndDate: pro.xWarrantyEndDate,
            }));

            // First API call - Create installations
            const installationResponse = await post("/admin/old-installation-entry", {
                oldData: JSON.stringify(oldProductData)
            });

            if (!installationResponse.success) {
                toast.error(`Installation failed: ${installationResponse.message}`);
                return;
            }

            // Second API call - Update PO status (using first PO ID found)
            const poIdToUpdate = uniquePoIds[0];
            const poUpdateResponse = await post(`/admin/old-data-po-complete/${poIdToUpdate}`);

            if (!poUpdateResponse.success) {
                toast.error(`PO update failed: ${poUpdateResponse.message}`);
                return;
            }

            // Both operations succeeded
            setProData([]);
            setHasOldData(false);
            setPoId(null);
            navigate(ADMIN_URLS.PO_LIST)
            toast.success(installationResponse.message);
            toast.success(poUpdateResponse.message);
        } catch (error) {
            console.error("Error in hanldeOldData:", error);
            const errorMessage = error?.response?.data?.message ||
                error.message ||
                "Something went wrong";
            toast.error(`Operation failed: ${errorMessage}`);
        }
    }

    const renderInput = (label, name, type = 'text', required = true) => (
        <div className="col-lg-4 col-md-6 col-12">
            <div className="form-floating mb-3">
                <input
                    type={type}
                    name={name}
                    className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    value={po[name]}
                    onChange={handleChange}
                    placeholder={name}
                    max={type === "date" ? moment().format('YYYY-MM-DD') : ""}
                />
                <label>{label} {required && <span className="text-danger">*</span>}</label>
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
            </div>
        </div>
    );

    const FileUpload = ({ label, value, onChange, type }) => {
        const isPdf = value?.endsWith('.pdf');
        return (
            <div className="col-lg-6 col-md-6 col-12 mt-2 mb-3">
                <div className="mb-3">
                    <label className="col-form-label">{label}</label>
                    <div className="drag-attach">
                        <input type="file" onChange={(e) => onChange(e, type)} />
                        {value ? (
                            <div className="my-2 mx-2">
                                {isPdf ? (
                                    <div className="pdf-preview">
                                        <i className="ti ti-file-type-pdf" style={{ fontSize: '50px', color: 'red' }} />
                                        <p>PDF Document</p>
                                    </div>
                                ) : (
                                    <img
                                        src={value}
                                        alt="Uploaded"
                                        style={{
                                            width: "100%",
                                            maxHeight: "200px",
                                            objectFit: "cover",
                                            borderRadius: "10px"
                                        }}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="img-upload">
                                <i className="ti ti-file-broken" />
                                Upload File
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs
                    crumbs={[
                        { label: "PO List", to: ADMIN_URLS.PO_LIST },
                        { label: `PO ${data?._id ? "Edit" : "Add"}` },
                    ]}
                />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4 className="page-title">
                                    PO {data?._id ? "Edit" : "Add"}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <AdminPoForm
                            po={po}
                            errors={errors}
                            companyData={companyData}
                            renderInput={renderInput}
                            handleChange={handleChange}
                            dispatchData={dispatchData}
                            dealerPoData={dealerPoData}
                            setDealerPoData={setDealerPoData}
                            data={data}
                        />
                    </div>
                </div>

                {po?.companyId && (
                    <PartyDetails
                        setBillTo={setBillTo}
                        setShipTo={setShipTo}
                        billTo={billTo}
                        shipTo={shipTo}
                        companyId={po?.companyId}
                        isEdit={data?._id ? true : false}
                    />
                )}

                <div className="card">
                    <div className="card-header"><h4 className="page-title">Documents</h4></div>
                    <div className="card-body">
                        <div className="row">
                            <FileUpload label="Attachment" value={po.signature} onChange={handleImgUpload} type="signature" />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={disable || (!data?._id && poId)}>
                                {disable ? "Loading..." : data?._id ? "Update" : "Save PO Details"}
                            </button>
                        </div>
                    </div>
                </div>

                {dealerProducts?.length > 0 && !data?._id && (
                    <DealerProductsList dealerProducts={dealerProducts} />
                )}

                <PoProductsList
                    poId={poId}
                    companyId={po?.companyId}
                    setIsCheckPro={setIsCheckPro}
                    shipTo={shipTo}
                    dealerPoId={po.dealerPoId}
                    customerId={po.customerId}
                    selectedDePo={selectedDePo}
                    setProData={setProData}
                />

                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-end">
                            <button className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
                            {(data?._id || !hasOldData) && (
                                <button type="button" className="btn btn-primary" onClick={handleCompleted}>
                                    {data?._id ? "Update" : "Create"} PO
                                </button>
                            )}
                            {hasOldData && (
                                <button type="button" className={`btn btn-primary ${data?._id ? 'mx-2' : ''}`} onClick={hanldeOldData}>
                                    Old Data
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagePo