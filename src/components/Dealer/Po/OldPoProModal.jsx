import React, { useEffect, useState } from 'react'
import ModalWrapper from '../../Modal/ModalWrapper';
import { Dropdown } from 'primereact/dropdown';
import { getDealerCustomerList } from '../../../middleware/customer/customer';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerStorage } from '../../LocalStorage/DealerStorage';
import { getProductDropdown } from '../../../middleware/product/product';
import { getTrueWarranty } from '../../../middleware/warranty/warranty';
import moment from 'moment';
import { toast } from 'react-toastify';

const initialState = {
    productId: "", 
    date: "", 
    quantity: "", 
    rate: "", 
    amount: "",
    discount: "", 
    discountAmount: "", 
    spDiscount: "", 
    spDiscountAmount: "",
    gst: "", 
    gstAmount: "", 
    totalAmount: "", 
    taxableAmount: "",
    poRemarks: "",
    warrantyId: "",
    poAutoRemarks: "",
    isOldData: true,
    xPhyDate: "",
    xWarrantyId: "",
    xEngName: "",
    xCustomerId: "",
    xWarrantyEndDate: "",
    companySerialNo: "",
}

const OldPoProModal = ({
    modal,
    poItems,
    setPoItems,
    companyId,
    editId,
    setEditId,
}) => {
    const dispatch = useDispatch();
    const dealerStorage = getDealerStorage();
    const [form, setForm] = useState(initialState);
    const [disable, setDisable] = useState(false);
    const [proObj, setProObj] = useState({});
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (!modal.isShown) {
            resetForm();
            setEditId(null);
        }
    }, [modal.isShown]);

    useEffect(() => {
        if (modal.isShown && !editId) {
            resetForm();     // reset when opening ADD mode
        }
    }, [modal.isShown, editId]);

    // Load data when editing
    useEffect(() => {
        if (editId && poItems.length > 0) {
            const itemToEdit = poItems.find(item => item._id === editId);
    
            if (itemToEdit) {
                setForm({
                    ...itemToEdit,
                    xPhyDate: itemToEdit.xPhyDate
                        ? moment(itemToEdit.xPhyDate).format("YYYY-MM-DD")
                        : "",
                });
            }
        }
    }, [editId, poItems]);

    const resetForm = () => {
        setForm(initialState);
        setDisable(false);
        setProObj({});
        setErrors({});
    };

    const { customerList } = useSelector((state) => state?.customer);
    const { productDropdown } = useSelector((state) => state?.product);
    const { warrantyList } = useSelector((state) => state?.dealerWarranty);

    useEffect(() => {
        dispatch(getDealerCustomerList(dealerStorage.DL_ID));
        dispatch(getTrueWarranty());
    }, []);

    useEffect(() => {
        if (!companyId) return
        dispatch(getProductDropdown({ 
            firmId: dealerStorage.DX_DL_FIRM_ID, 
            companyId, 
            status: "true" 
        }));
    }, [companyId])

    useEffect(() => {
        // Don't update if we're editing
        if (editId) return;
        
        const product = productDropdown?.find(p => p._id === form.productId);
        setProObj(product || {});
        if (product) {
            setForm(f => ({
                ...f,
                rate: product.price || "",
                gst: product?.gst || "",
                warrantyId: product?.warrantyId || "",
                poAutoRemarks: `${product?.warrantyName || ""} - ${product?.shortDescription || ""}`,
                xWarrantyId: product.warrantyId || "",
                // Add product details for display in table
                productName: product.name || "",
                categoryName: product.categoryName || "",
                companyName: product.companyName || "",
            }));
        }
    }, [form.productId, productDropdown, editId]);

    useEffect(() => {
        if (!form.xWarrantyId || !warrantyList?.length || !form.xPhyDate) return;

        const selectedWarranty = warrantyList?.find(
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
    }, [form.xWarrantyId, warrantyList, form.xPhyDate]);

    useEffect(() => {
        const rate = parseFloat(form.rate) || 0;
        const quantity = parseFloat(form.quantity) || 0;
        const discount = parseFloat(form.discount) || 0;
        const spDiscount = parseFloat(form.spDiscount) || 0;
        const gst = parseFloat(form.gst) || 0;

        // Calculate base rate (exclusive of GST)
        const baseRate = gst > 0 ? rate / (1 + gst / 100) : rate;
        const amount = baseRate * quantity;
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

    const inputField = (label, name, required = false, disabled = false) => (
        <div className="mb-3">
            <label className="form-label">
                {label}
                {required && <span className="text-danger">*</span>}
            </label>
            <input
                type="number"
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="form-control"
                disabled={disabled}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
            />
            {name === "rate" && Number(form.gst) > 0 && (
                <small className="text-muted me-2">Inclusive of GST</small>
            )}
            {errors[name] && <small className="text-danger">{errors[name]}</small>}
        </div>
    );

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields
        ['productId', 'rate', 'quantity'].forEach(field => {
            if (!form[field]) newErrors[field] = "This field is required.";
        });
        
        // Validate quantity for old data
        if (form.isOldData && parseFloat(form.quantity) > 1) {
            newErrors.quantity = "Quantity cannot be greater than 1 for old data.";
        }
        
        // Numeric validations
        ['rate', 'quantity', 'discount', 'spDiscount', 'gst'].forEach(field => {
            const val = parseFloat(form[field]);
            if (form[field] && (isNaN(val) || val <= 0)) {
                newErrors[field] = "Invalid number.";
            }
        });
        
        // Old data specific validations
        if (form.isOldData) {
            ['xPhyDate', 'xEngName', 'xCustomerId', 'companySerialNo'].forEach(field => {
                if (!form[field]) {
                    newErrors[field] = "This field is required for old data.";
                }
            });
        }
        
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    const handleSubmit = (addMore = false) => {
        if (!validateForm()) return;
        setDisable(true);

        const selectedCustomer = customerList?.find(
            c => c._id === form.xCustomerId
          );

        try {
            // Create the item payload
            const itemPayload = {
                ...form,
                _id: editId || `temp_${Date.now()}`, // Temporary ID for new items
                firmId: dealerStorage.DX_DL_FIRM_ID,
                dealerId: dealerStorage.DL_ID,

                customerData: selectedCustomer || null,
            };

            if (editId) {
                // Update existing item
                const updatedItems = poItems.map(item => 
                    item._id === editId ? itemPayload : item
                );
                setPoItems(updatedItems);
                toast.success("Product updated successfully");
            } else {
                // Add new item
                setPoItems([...poItems, itemPayload]);
                toast.success("Product added successfully");
            }

            if (addMore) {
                // Reset form but keep modal open
                resetForm();
                setDisable(false);
            } else {
                // Close modal
                modal.hide();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setDisable(false);
        }
    };


    return (
        <>
            <ModalWrapper
                title={editId ? "Edit Product Details" : "Add Product Details"}
                isShown={modal.isShown}
                hide={modal.hide}
                size={"xl"}
                footer={false}
            >
                <form>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Product <span className="text-danger">*</span>
                            </label>
                            <select 
                                name="productId" 
                                className="form-control form-select" 
                                value={form.productId} 
                                onChange={handleChange}
                                disabled={editId ? true : false}
                            >
                                <option value="">Select Product</option>
                                {productDropdown?.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.productId && (
                                <small className="text-danger">{errors.productId}</small>
                            )}
                        </div>

                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">
                                    Physical Date
                                    {form.isOldData && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    name="xPhyDate"
                                    value={form.xPhyDate || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.xPhyDate && (
                                    <small className="text-danger">{errors.xPhyDate}</small>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">
                                    Company Serial No. 
                                    {form.isOldData && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="companySerialNo"
                                    value={form.companySerialNo || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.companySerialNo && (
                                    <small className="text-danger">{errors.companySerialNo}</small>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">
                                    Engineer Name
                                    {form.isOldData && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="xEngName"
                                    value={form.xEngName || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.xEngName && (
                                    <small className="text-danger">{errors.xEngName}</small>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">
                                    Customer
                                    {form.isOldData && <span className="text-danger">*</span>}
                                </label>
                                <Dropdown
                                    name="xCustomerId"
                                    value={form.xCustomerId || ""}
                                    onChange={handleDropdownChange}
                                    options={customerList}
                                    optionLabel={(e) => `${e?.title} ${e?.name} ${e?.lastName} ${e?.clinicName ? `(${e?.clinicName})` : ''}`}
                                    optionValue="_id"
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
                                            {option.clinicName && (
                                                <div className="small text-muted">{option.clinicName}</div>
                                            )}
                                        </div>
                                    )}
                                />
                                {errors.xCustomerId && (
                                    <small className="text-danger">{errors.xCustomerId}</small>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6 col-12">
                            <div className="mb-3">
                                <label className="form-label">
                                    Warranty End Date
                                </label>
                                <input
                                    type="date"
                                    name="xWarrantyEndDate"
                                    value={form.xWarrantyEndDate || ""}
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>

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
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() => handleSubmit(false)} 
                            disabled={disable}
                        >
                            {disable ? "Loading..." : editId ? "Update" : "Create"}
                        </button>
                        {!editId && (
                            <button 
                                type="button" 
                                className="btn btn-soft-primary mx-2" 
                                onClick={() => handleSubmit(true)} 
                                disabled={disable}
                            >
                                {disable ? "Loading..." : "Add More"}
                            </button>
                        )}
                    </div>
                </form>
            </ModalWrapper>
        </>
    )
}

export default OldPoProModal