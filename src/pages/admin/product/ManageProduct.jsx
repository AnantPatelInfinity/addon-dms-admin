import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext'
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { useLocation, useNavigate } from 'react-router';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import { toast } from 'react-toastify';
import { MultiSelect } from 'primereact/multiselect';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ProImgSection from '../../../components/Company/ComProduct/ProImgSection';
import { Dropdown } from 'primereact/dropdown';

const ManageProduct = () => {

  const { post, get } = useApi();
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    hsnNo: "",
    price: "",
    customerPrice: "",
    companyPrice: "",
    gst: "",
    isGst: null,
    supplyTypeId: "",
    companyId: "",
    categoryId: "",
    unitId: "",
    description: "",
    privateDescription: "",
    status: true,
    shortDescription: "",
    warrantyId: "",
  });
  const [imgs, setImgs] = useState([]);
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedPart, setSelectedPart] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    proModelData: [], companies: [], catData: [], unitData: [], partsData: [], supplyType: [], warrantyData: []
  });

  const adminStorage = getAdminStorage();

  useEffect(() => {
    const fetchDropdowns = async () => {
      const firmId = adminStorage.DX_AD_FIRM;
      const [companyRes, catRes, unitRes, partsRes, modelRes, supplyRes, warrantyRes] = await Promise.all([
        get(`/admin/get-company?firmId=${firmId}&status=2`),
        get(`/admin/get-product-category?status=true`),
        get(`/admin/get-unit?status=true`),
        get(`/admin/get-parts?firmId=${firmId}&status=true`),
        post("/admin/get-product-model", { firmId, status: true }),
        get(`/admin/get-supply-type?status=true`),
        get(`/admin/get-warranty?status=true`)
      ]);
      setDropdowns(prev => ({
        ...prev,
        companies: companyRes?.data,
        catData: catRes?.data,
        unitData: unitRes?.data,
        proModelData: modelRes?.data,
        supplyType: supplyRes?.data,
        warrantyData: warrantyRes?.data
      }));
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    const fetchParts = async () => {
      if (product.companyId) {
        const firmId = adminStorage.DX_AD_FIRM;
        const partsRes = await get(`/admin/get-parts?firmId=${firmId}&companyId=${product.companyId}&status=true`);
        setDropdowns(prev => ({
          ...prev,
          partsData: partsRes?.data || []
        }));
      } else {
        setDropdowns(prev => ({
          ...prev,
          partsData: []
        }));
      }
    };

    fetchParts();
  }, [product.companyId]);

  useEffect(() => {
    if (data) {
      setProduct({
        name: data?.nameId,
        hsnNo: data?.hsnNo,
        price: data?.price,
        customerPrice: data?.customerPrice || "",
        companyPrice: data?.companyPrice || "",
        gst: data?.gst,
        isGst: data?.isGst || null,
        supplyTypeId: data?.supplyTypeId || "",
        companyId: data?.companyId,
        categoryId: data?.categoryId,
        unitId: data?.unitId,
        description: data?.description || "",
        privateDescription: data?.privateDescription || "",
        shortDescription: data?.shortDescription || "",
        warrantyId: data?.warrantyId || "",
        status: data?.status,
      });
      setSelectedPart(data?.parts?.map((e) => e?._id))
      setImgs(data?.images);
    }
  }, [data])

  const handleChange = ({ target: { name, value } }) => {
    if (name === "name") {
      const model = dropdowns.proModelData.find(m => m._id === value);
      setProduct(prev => ({ ...prev, name: value, companyId: model?.companyId || "" }));
    } else setProduct(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const fields = { name: "Name", categoryId: "Category", companyId: "Company", price: "Price", warrantyId: "Warranty" };
    const errs = {};
    Object.entries(fields).forEach(([k, v]) => {
      if (!product[k]?.toString().trim()) errs[k] = `${v} is required`;
    });
    if (product.price && (isNaN(product.price) || Number(product.price) <= 0)) {
      errs.price = "Enter a valid positive price";
    }
    if (product.isGst) {
      if (!product.hsnNo?.trim()) errs.hsnNo = "HSN Code is required for GST products";
      if (!product.gst?.toString().trim()) errs.gst = "GST(%) is required";
      else if (isNaN(product.gst) || Number(product.gst) < 0 || Number(product.gst) > 100) {
        errs.gst = "Enter a valid GST percentage (0 - 100)";
      }
    }
    if (product.customerPrice?.toString().trim()) {
      if (isNaN(product.customerPrice) || Number(product.customerPrice) <= 0) {
        errs.customerPrice = "Enter a valid positive customer price";
      }
    }
    if (product.companyPrice?.toString().trim()) {
      if (isNaN(product.companyPrice) || Number(product.companyPrice) <= 0) {
        errs.companyPrice = "Enter a valid positive company price";
      }
    }
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      setDisable(true);
      const formData = new URLSearchParams();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("customerPrice", product.customerPrice || "");
      formData.append("companyPrice", product.companyPrice || "");
      formData.append("companyId", product.companyId);
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      formData.append("categoryId", product.categoryId);
      formData.append("status", product.status);
      formData.append("images", JSON.stringify(imgs));
      formData.append("description", product.description || "");
      formData.append("privateDescription", product.privateDescription || "");
      formData.append("gst", product.gst || 0);
      formData.append("hsnNo", product.hsnNo || "");
      formData.append("unitId", product.unitId || null);
      formData.append("parts", JSON.stringify(selectedPart) || []);
      formData.append("supplyTypeId", product.supplyTypeId || null);
      if (product.isGst !== null) {
        formData.append("isGst", product.isGst)
      }
      formData.append("warrantyId", product.warrantyId || "");
      formData.append("shortDescription", product.shortDescription || "");

      const url = data?._id ? `/admin/manage-product/${data?._id}` : "/admin/manage-product";

      const response = await post(url, formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      const { message, success } = response;
      if (success) {
        toast.success(message);
        navigate(ADMIN_URLS.PRODUCT);
        setProduct({});
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setDisable(false);
    }
  }

  const renderInput = (label, name, type = "text", extra = {}, required = true) => (
    <div className="form-floating mb-3">
      <input
        type={type} name={name} value={product[name] || ""}
        onChange={handleChange} className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        placeholder={label} {...extra}
      />
      <label>{label} {required && <span className="text-danger">*</span>}</label>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const renderSelect = (label, name, options, required = false, disabled = false) => (
    <div className="form-floating mb-3">
      <select name={name} value={product[name]} onChange={handleChange}
        className={`form-select ${errors[name] ? "is-invalid" : ""}`} disabled={disabled}>
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
      </select>
      <label>{label} {required && <span className="text-danger">*</span>}</label>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Product List", to: ADMIN_URLS.PRODUCT },
            { label: `Product ${data?._id ? "Edit" : "Add"}` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">
                  Product {data?._id ? "Edit" : "Add"}
                </h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-lg-8 col-md-6 col-12">
                {/* {renderSelect("Name", "name", dropdowns.proModelData, true)} */}
                <div className="form-floating mb-3">
                  <Dropdown
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    options={dropdowns.proModelData}
                    optionLabel="name"
                    optionValue="_id"
                    showClear
                    filter
                    placeholder="Select Name"
                    className={`w-100 ${errors.name ? 'is-invalid' : ''}`}
                    pt={{
                      root: { className: 'p-dropdown p-component form-select' },
                      input: { className: 'p-dropdown-label p-inputtext' },
                      panel: { className: 'p-dropdown-panel p-component' },
                      item: { className: 'p-dropdown-item' }
                    }}
                  />
                  <label>Name <span className="text-danger">*</span></label>
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {renderSelect("Company", "companyId", dropdowns.companies, false, true)}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {renderInput("Dealer Price(₹)", "price", "number", { onKeyDown: e => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() })}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {renderInput("Customer Price(₹)", "customerPrice", "number", {
                  onKeyDown: e => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault(),
                }, false)}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {renderInput("Company Price(₹)", "companyPrice", "number", {
                  onKeyDown: e => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault(),
                }, false)}
              </div>
            </div>

            <div className='row'>
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-check mb-3 mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={product.isGst || false}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        isGst: e.target.checked,
                        hsnNo: e.target.checked ? prev.hsnNo : "",
                        gst: e.target.checked ? prev.gst : "",
                      }))
                    }
                    id="isGstCheck"
                  />
                  <label className="form-check-label" htmlFor="isGstCheck">
                    Is GST Applicable
                  </label>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                {renderInput("Gst(%)", "gst", "number", {
                  onKeyDown: (e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault(),
                }, product.isGst)}
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                {renderInput("HSN Code", "hsnNo", "text", {}, product.isGst)}
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                {renderSelect("Unit", "unitId", dropdowns.unitData)}
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                {renderSelect("Category", "categoryId", dropdowns.catData, true)}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {renderSelect("Supply Type", "supplyTypeId", dropdowns.supplyType)}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {renderSelect("Warranty", "warrantyId", dropdowns.warrantyData, true)}
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <MultiSelect
                    value={selectedPart}
                    options={dropdowns.partsData.map(p => ({ label: p.name, value: p._id }))}
                    onChange={e => setSelectedPart(e.value)} filter maxSelectedLabels={3}
                    className="w-100 form-select" optionLabel="label" placeholder="Select Parts"
                  />
                  <label>Parts</label>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className="col-12">
                <div className="form-floating mb-3">
                  <textarea
                    type="text"
                    className={`form-control`}
                    name="shortDescription"
                    value={product.shortDescription}
                    onChange={handleChange}
                    placeholder="Short Description"
                  />
                  <label>Short Description</label>
                </div>
              </div>
            </div>

            <div className="row">
              {["description", "privateDescription"].map((field, i) => (
                <div className="col-md-6 col-12 mb-3" key={i}>
                  <label className="form-label">{field === "description" ? "Description" : "Private Description"}</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={product[field]}
                    onChange={(event, editor) => setProduct(prev => ({ ...prev, [field]: editor.getData() }))}
                  />
                </div>
              ))}
            </div>

            <ProImgSection
              imgs={imgs}
              setImgs={setImgs}
            />

            <div className="d-flex align-items-center justify-content-end">
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
}

export default ManageProduct