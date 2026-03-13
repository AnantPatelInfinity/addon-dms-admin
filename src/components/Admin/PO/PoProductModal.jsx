import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext'
import ModalWrapper from '../../Modal/ModalWrapper'
import { getAdminStorage } from '../../LocalStorage/AdminStorage';
import { toast } from 'react-toastify';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';

const initialForm = {
    productId: "", date: "", quantity: "", rate: "", amount: "",
    discount: "", discountAmount: "", spDiscount: "", spDiscountAmount: "",
    gst: "", gstAmount: "", totalAmount: "", taxableAmount: "", sgst: "", sgstAmount: "", cgst: "", cgstAmount: "",
    poRemarks: "",
    warrantyId: "",
    poAutoRemarks: "",

    isOldData: false,
    xPhyDate: "",
    xWarrantyId: "",
    xEngName: "",
    xCustomerId: "",
    xWarrantyEndDate: "",
    companySerialNo: "",
};

const PoProductModal = ({ modal, poId, editId, setTriggerApi, setEditId, companyId, shipTo, selectedDePo, dealerPoId, selectedCuPo, customerPoId }) => {
    const { get, post } = useApi();
    const [productData, setProductData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [proObj, setProObj] = useState({});
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const adminStorage = getAdminStorage();
    const [customerData, setCustomerData] = useState([]);
    const [warrantyData, setWarrantyData] = useState([]);

    useEffect(() => {
        if (companyId) {
            get(`/admin/get-products?firmId=${adminStorage.DX_AD_FIRM}&companyId=${companyId}`)
                .then(res => setProductData(res.data))
                .catch(console.error);
        }
    }, [companyId]);

    useEffect(() => {
        get(`/admin/get-customer?firmId=${adminStorage.DX_AD_FIRM}`)
            .then(res => setCustomerData(res.data))
            .catch(console.error);
        get(`/admin/get-warranty`)
            .then(res => setWarrantyData(res.data))
            .catch(console.error);
    }, [])

    useEffect(() => {
        if (editId) {
            get(`/admin/get-po-items/${editId}?poId=${poId}`).then(res => {
                const item = res.data[0];
                if (item) setForm({ ...initialForm, ...item, xPhyDate: item.xPhyDate ? moment(item.xPhyDate).format("YYYY-MM-DD") : null });
            }).catch(console.error);
        } else {
            resetForm();
        }
    }, [editId]);

    useEffect(() => {
        if (!modal.isShown) {
            resetForm();
            setEditId(null);
        }
    }, [modal.isShown]);

    useEffect(() => {
        if (!form.isOldData) {
            setForm(prev => ({
                ...prev,
                xPhyDate: "",
                xWarrantyId: "",
                xEngName: "",
                xCustomerId: "",
                xWarrantyEndDate: "",
                companySerialNo: "",
            }));
        }
    }, [form.isOldData]);

    useEffect(() => {
        const product = productData.find(p => p._id === form.productId);
        setProObj(product || {});
        if (product) {
            setForm(f => ({
                ...f,
                rate: product.companyPrice || "",
                gst: product?.gst || "",
                warrantyId: product?.warrantyId || "",
                poAutoRemarks: `${product?.warrantyName || ""} - ${product?.shortDescription || ""}`,
                xWarrantyId: product.warrantyId || "",
            }));
        }
    }, [form.productId, productData]);

    useEffect(() => {
        if (!form.xWarrantyId || !warrantyData?.length || !form.xPhyDate) return;

        const selectedWarranty = warrantyData.find(
            (w) => w._id === form.xWarrantyId
        );

        if (!selectedWarranty?.duration) return;

        const endDate = moment(form.xPhyDate)
            .clone()
            .add(selectedWarranty.duration, "months");

        setForm(prev => ({
            ...prev,
            xWarrantyEndDate: endDate.format("YYYY-MM-DD"),
        }));
    }, [form.xWarrantyId, warrantyData, form.xPhyDate]);

    // useEffect(() => {
    //     const rate = parseFloat(form.rate) || 0;
    //     const quantity = parseFloat(form.quantity) || 0;
    //     const discount = parseFloat(form.discount) || 0;
    //     const spDiscount = parseFloat(form.spDiscount) || 0;
    //     const gst = parseFloat(form.gst) || 0;
    //     const amount = rate * quantity;
    //     const discountAmount = (amount * discount) / 100;
    //     const spDiscountAmount = ((amount - discountAmount) * spDiscount) / 100;
    //     const taxableAmount = amount - discountAmount - spDiscountAmount || 0;
    //     const gstAmount = (taxableAmount * gst) / 100;
    //     const totalAmount = taxableAmount + gstAmount;

    //     setForm(prev => ({
    //         ...prev,
    //         amount: amount.toFixed(2),
    //         discountAmount: discountAmount.toFixed(2),
    //         spDiscountAmount: spDiscountAmount.toFixed(2),
    //         gstAmount: gstAmount.toFixed(2),
    //         totalAmount: totalAmount.toFixed(2),
    //         taxableAmount: taxableAmount.toFixed(2),
    //     }));
    // }, [form.rate, form.quantity, form.discount, form.spDiscount, form.gst]);

    useEffect(() => {
        const rate = parseFloat(form.rate) || 0; // GST-inclusive rate
        const quantity = parseFloat(form.quantity) || 0;
        const discount = parseFloat(form.discount) || 0;
        const spDiscount = parseFloat(form.spDiscount) || 0;
        const gst = parseFloat(form.gst) || 0;

        // Calculate base rate (exclusive of GST)
        const baseRate = gst > 0 ? rate / (1 + gst / 100) : rate;
        const amount = baseRate * quantity; // Amount before discounts
        const discountAmount = (amount * discount) / 100;
        const spDiscountAmount = ((amount - discountAmount) * spDiscount) / 100;
        const taxableAmount = amount - discountAmount - spDiscountAmount || 0;
        const gstAmount = taxableAmount * (gst / 100);
        const totalAmount = taxableAmount + gstAmount;

        setForm(prev => ({
            ...prev,
            amount: amount.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            spDiscountAmount: spDiscountAmount.toFixed(2),
            gstAmount: gstAmount.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            taxableAmount: taxableAmount.toFixed(2),
        }));
    }, [form.rate, form.quantity, form.discount, form.spDiscount, form.gst]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    }
    const handleDropdownChange = (e) => {
        setForm({
            ...form,
            xCustomerId: e.value
        });
    }

    const validateForm = () => {
        const newErrors = {};
        ['productId', 'rate', 'quantity'].forEach(field => {
            if (!form[field]) newErrors[field] = "This field is required.";
        });
        // Validate quantity for old data
        if (form.isOldData && parseFloat(form.quantity) > 1) {
            newErrors.quantity = "Quantity cannot be greater than 1 for old data.";
        }
        ['rate', 'quantity', 'discount', 'spDiscount', 'gst'].forEach(field => {
            const val = parseFloat(form[field]);
            if (form[field] && (isNaN(val) || val < 0)) newErrors[field] = "Invalid number.";
        });
        // Old data validation
        if (form.isOldData) {
            ['xPhyDate', 'xEngName', 'xCustomerId', 'companySerialNo'].forEach(field => {
                if (!form[field]) newErrors[field] = "This field is required for old data.";
            });
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    const handleSubmit = async (isAddMore = false) => {
        if (!validateForm()) return;
        setDisable(true);

        const findProduct = productData?.find((e) => e?._id === form?.productId);
        const matchProId = selectedDePo?.products?.find((pro) => pro?.nameId == findProduct?.nameId);


        try {
            const url = editId ? `/admin/manage-po-items/${editId}` : `/admin/add-po-multiple-items`;

            const isDealerPo = !!selectedDePo?.dealerId;

            let payload = {
                ...form,
                firmId: adminStorage.DX_AD_FIRM,
                poId,

                dealerId: isDealerPo ? selectedDePo?.dealerId || "" : "",
                dealerPoId: isDealerPo ? selectedDePo?._id || "" : "",
                dealerPoProductId: isDealerPo ? matchProId?._id || "" : "",

                customerId: selectedDePo?.customerId || "",
                customerPoId: !isDealerPo ? selectedDePo?._id || "" : "",
                customerPoProductId: !isDealerPo ? matchProId?._id || "" : "",
            };

            const { success, message } = await post(url, payload);
            if (success) {
                toast.success(message);
                setTriggerApi(true);
                isAddMore ? resetForm() : (modal.hide(), setEditId(null));
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setDisable(false);
        }
    };

    const resetForm = () => {
        setForm(initialForm);
        setProObj({});
        setErrors({});
    };

    const inputField = (label, name, required = false, disabled = false) => (
        <div className="mb-3">
            <label className="form-label">{label}{required && <span className="text-danger">*</span>}</label>
            <input
                type="number"
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="form-control"
                disabled={disabled}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
            />
            {name === "rate" && (
                <small className="text-muted">Inclusive of GST</small>
            )}
            {errors[name] && <small className="text-danger">{errors[name]}</small>}
        </div>
    );

    return (
        <ModalWrapper
            title="Product Details"
            isShown={modal.isShown}
            hide={modal.hide}
            size={"xl"}
            footer={false}
        >
            <form>
                <div className="row">
                    <div className="col-md-8 mb-3">
                        <label className="form-label">Product <span className="text-danger">*</span></label>
                        <select name="productId" className="form-control form-select" value={form.productId} onChange={handleChange}>
                            <option value="">Select Product</option>
                            {productData.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        {errors.productId && <small className="text-danger">{errors.productId}</small>}
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-end">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isOldData"
                                checked={form.isOldData}
                                onChange={handleChange}
                                id="isOldDataCheck"
                            />
                            <label className="form-check-label" htmlFor="isOldDataCheck">
                                Is Old Data
                            </label>
                        </div>
                    </div>
                </div>

                <ProductDetailsAccordion proObj={proObj} form={form} />

                {form.isOldData && (
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <h5>Old Product Details</h5>
                            <hr />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">Physical Date{form.isOldData && <span className="text-danger">*</span>}</label>
                                <input
                                    type="date"
                                    name="xPhyDate"
                                    value={form.xPhyDate || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.xPhyDate && <small className="text-danger">{errors.xPhyDate}</small>}
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">Company Serial No. {form.isOldData && <span className="text-danger">*</span>}</label>
                                <input
                                    type="text"
                                    name="companySerialNo"
                                    value={form.companySerialNo || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.companySerialNo && <small className="text-danger">{errors.companySerialNo}</small>}
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">Engineer Name{form.isOldData && <span className="text-danger">*</span>}</label>
                                <input
                                    type="text"
                                    name="xEngName"
                                    value={form.xEngName || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.xEngName && <small className="text-danger">{errors.xEngName}</small>}
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">Customer{form.isOldData && <span className="text-danger">*</span>}</label>
                                <Dropdown
                                    name="xCustomerId"
                                    value={form.xCustomerId || ""}
                                    onChange={handleDropdownChange}
                                    options={customerData}
                                    optionLabel={(e) => `${e?.title} ${e?.name} ${e?.lastName} ${e?.clinicName ? `(${e?.clinicName})` : ''}`}
                                    optionValue="_id"
                                    // showClear
                                    filter
                                    placeholder="Select Customer"
                                    className={`w-100 ${errors.xCustomerId ? 'is-invalid' : ''}`}
                                    pt={{
                                        root: { className: 'p-dropdown p-component form-select' },
                                        input: { className: 'p-dropdown-label p-inputtext' },
                                        panel: { className: 'p-dropdown-panel p-component' },
                                        item: { className: 'p-dropdown-item' }
                                    }}
                                    itemTemplate={(option) => (
                                        <div>
                                            <div>{option.title} {option.name} {option.lastName}</div>
                                            {option.clinicName && <div className="small text-muted">{option.clinicName}</div>}
                                        </div>
                                    )}
                                />
                                {errors.xCustomerId && <small className="text-danger">{errors.xCustomerId}</small>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="col-md-6">{inputField("Qty", "quantity", true)}</div>
                    <div className="col-md-6">{inputField("Rate (₹)", "rate", true)}</div>
                    <div className="col-md-12">{inputField("Amount (₹)", "amount", false, true)}</div>
                    <div className="col-md-6">{inputField("Discount (%)", "discount")}</div>
                    <div className="col-md-6">{inputField("Discount Amount (₹)", "discountAmount", false, true)}</div>
                    <div className="col-md-6">{inputField("Special Discount (%)", "spDiscount")}</div>
                    <div className="col-md-6">{inputField("SP Discount Amount (₹)", "spDiscountAmount", false, true)}</div>
                    <div className="col-md-12">{inputField("Taxable Amount (₹)", "taxableAmount", false, true)}</div>
                    <div className="col-md-6">{inputField("GST (%)", "gst")}</div>
                    <div className="col-md-6">{inputField("GST Amount (₹)", "gstAmount", false, true)}</div>
                    <div className="col-md-12">{inputField("Total Item Amount (₹)", "totalAmount", false, true)}</div>
                </div>

                <div className='row'>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <label className="form-label">Remarks</label>
                            <input
                                type="text"
                                name="poRemarks"
                                value={form.poRemarks}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)} disabled={disable}>
                        {disable ? "Loading..." : editId ? "Update" : "Create"}
                    </button>
                    {!editId && (
                        <button type="button" className="btn btn-soft-primary mx-2" onClick={() => handleSubmit(true)} disabled={disable}>
                            {disable ? "Loading..." : "Add More"}
                        </button>
                    )}
                </div>
            </form>
        </ModalWrapper>
    );
}

export default PoProductModal;