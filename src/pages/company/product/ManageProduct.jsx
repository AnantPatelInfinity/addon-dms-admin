import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { getComCategoryList } from '../../../middleware/companyUser/comCategory/comCategory';
import { getUnitList } from '../../../middleware/companyUser/comUnit/comUnit';
import { getComPartsList } from '../../../middleware/companyUser/comParts/comParts';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import { comAllProModelList } from '../../../middleware/companyUser/comProModel/comProModel';
import { comAllSupplyTypeList } from '../../../middleware/companyUser/comSupplyType/comSupplyType';
import { getWarrantyList } from '../../../middleware/companyUser/comWarranty/comWarranty';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ProForm from '../../../components/Company/ComProduct/ProForm';
import ProImgSection from '../../../components/Company/ComProduct/ProImgSection';
import { addComProduct, getComOneProduct, resetComAddProduct, resetComUpdateProduct, updateComProduct } from '../../../middleware/companyUser/comProduct/comProduct';
import { Dropdown } from 'primereact/dropdown';

const ManageProduct = () => {
  const dispatch = useDispatch();
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    hsnNo: "",
    companyPrice: "",
    gst: "",
    isGst: null,
    supplyTypeId: "",
    categoryId: "",
    unitId: "",
    description: "",
    privateDescription: "",
    status: true,
    shortDescription: "",
    warrantyId: "",
  });
  const [imgs, setImgs] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedPart, setSelectedPart] = useState([]);
  const companyStorage = getCompanyStorage();
  const { comProModelList } = useSelector((state) => state?.comProModel);
  const {
    comProductAddError,
    comProductAddLoading,
    comProductAddMessage,

    comProductUpdateError,
    comProductUpdateLoading,
    comProductUpdateMessage,

    comOneProduct,
    comOneProductError,
    comOneProductLoading,
  } = useSelector((state) => state.comProduct);

  useEffect(() => {
    if (comProductAddMessage) {
      toast.success(comProductAddMessage);
      navigate(COMPANY_URLS.PRODUCT_LIST);
      dispatch(resetComAddProduct())
    }
    if (comProductAddError) {
      toast.error(comProductAddError)
      dispatch(resetComAddProduct())
    }
  }, [comProductAddMessage, comProductAddError])

  useEffect(() => {
    if (comProductUpdateMessage) {
      toast.success(comProductUpdateMessage);
      navigate(COMPANY_URLS.PRODUCT_LIST);
      dispatch(resetComUpdateProduct())
    }
    if (comProductUpdateError) {
      toast.error(comProductUpdateError);
      dispatch(resetComUpdateProduct())
    }
  }, [comProductUpdateMessage, comProductUpdateError])

  useEffect(() => {
    dispatch(getComCategoryList());
    dispatch(getUnitList());
    getPartsList();
    getProductModel();
    dispatch(comAllSupplyTypeList());
    dispatch(getWarrantyList())
  }, []);

  const getPartsList = () => {
    const payload = {
      firmId: companyStorage.firmId,
      companyId: companyStorage.comId,
    }
    dispatch(getComPartsList(payload))
  }

  useEffect(() => {
    if (data?._id) {
      dispatch(getComOneProduct(data?._id))
    }
  }, [data?._id]);

  useEffect(() => {
    if (comOneProduct) {
      setProduct({
        name: data?.nameId,
        hsnNo: data?.hsnNo,
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
      setImgs(data?.images || []);
    }
  }, [comOneProduct])

  const getProductModel = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage.comId);
    formData.append("status", true);
    dispatch(comAllProModelList(formData))
  }

  const handleChange = ({ target: { name, value } }) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const fields = { name: "Name", categoryId: "Category" };
    const errs = {};
    Object.entries(fields).forEach(([k, v]) => {
      if (!product[k]?.toString().trim()) errs[k] = `${v} is required`;
    });
    if (product.isGst) {
      if (!product.hsnNo?.trim()) errs.hsnNo = "HSN Code is required for GST products";
      if (!product.gst?.toString().trim()) errs.gst = "GST(%) is required";
      else if (isNaN(product.gst) || Number(product.gst) < 0 || Number(product.gst) > 100) {
        errs.gst = "Enter a valid GST percentage (0 - 100)";
      }
    }
    if (product.companyPrice?.toString().trim()) {
      if (isNaN(product.companyPrice) || Number(product.companyPrice) <= 0) {
        errs.companyPrice = "Enter a valid positive company price";
      }
    }
    return errs;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formData = new URLSearchParams();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("customerPrice", product.customerPrice || "");
    formData.append("companyPrice", product.companyPrice || "");
    formData.append("companyId", companyStorage.comId);
    formData.append("firmId", companyStorage.firmId);
    formData.append("categoryId", product.categoryId);
    // formData.append("status", product.status);
    formData.append("images", JSON.stringify(imgs));
    formData.append("description", product.description || "");
    formData.append("privateDescription", product.privateDescription || "");
    formData.append("gst", product.gst || 0);
    formData.append("hsnNo", product.hsnNo || "");
    formData.append("unitId", product.unitId || null);
    formData.append("parts", JSON.stringify(selectedPart) || []);
    formData.append("supplyTypeId", product.supplyTypeId || null);
    formData.append("isGst", product.isGst);

    formData.append("warrantyId", product.warrantyId || "");
    formData.append("shortDescription", product.shortDescription || "");

    if (data?._id) {
      dispatch(updateComProduct(formData, data?._id))
    } else {
      dispatch(addComProduct(formData))
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
            { label: "Product List", to: COMPANY_URLS.PRODUCT_LIST },
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
                {/* {renderSelect("Name", "name", comProModelList, true)} */}
                <div className="form-floating mb-3">

                  <Dropdown
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    options={comProModelList}
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
                {renderInput("Company Price(₹)", "companyPrice", "number", {
                  onKeyDown: e => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault(),
                }, false)}
              </div>
            </div>

            <ProForm
              renderInput={renderInput}
              renderSelect={renderSelect}
              product={product}
              setProduct={setProduct}
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
              handleChange={handleChange}
            />

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
                disabled={comProductAddLoading || comProductUpdateLoading}
              >
                {comProductAddLoading || comProductUpdateLoading ?
                  "Loading..." : data?._id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageProduct