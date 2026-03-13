import React, { useEffect, useState } from 'react'
import { useDealerApi } from '../../../../context/DealerApiContext';
import { getDealerStorage } from '../../../../components/LocalStorage/DealerStorage';
import { useLocation, useNavigate } from 'react-router';
import moment from 'moment';
import DEALER_URLS from '../../../../config/routesFile/dealer.routes';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import PoCustomerData from '../../../../components/Admin/PO/PoCustomerData';
import PoProductsList from '../../../../components/Admin/PO/PoProductsList';

const ManagePo = () => {

  const { post, get, uploadImage } = useDealerApi();
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const [po, setPo] = useState({
    destination: "",
    termsOfDelivery: "",
    termsOfPayment: "",
    poDate: !data?._id && moment().format('YYYY-MM-DD'),
    customerId: "",
    companyId: "",
    totalQty: "",
    netAmount: "",
    status: "",
    image: "",
    signature: "",
    billNo: "",
  });
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [poId, setPoId] = useState(null);
  const dealerStorage = getDealerStorage();
  const [isCheckPro, setIsCheckPro] = useState([]);

  useEffect(() => {
    get(`/dealer/get-company?firmId=${dealerStorage.DX_DL_FIRM_ID}&status=${2}`)
      .then(res => setCompanyData(res.data));
  }, []);

  useEffect(() => {
    if (data?._id) {
      getEditPoData();
    }
  }, [data?._id]);

  const getEditPoData = async () => {
    try {
      const res = await get(`/dealer/get-dealer-po/${data?._id}?dealerId=${dealerStorage.DL_ID}`)
      const result = res?.data[0];
      setPo({
        billNo: result?.billNo,
        destination: result?.destination,
        termsOfDelivery: result?.termsOfDelivery,
        termsOfPayment: result?.termsOfPayment,
        poDate: moment(result?.poDate).format("YYYY-MM-DD"),
        customerId: result?.customerId,
        companyId: result?.companyId,
        totalQty: result?.totalQty,
        netAmount: result?.netAmount,
        status: result?.status,
        image: result?.image,
        signature: result?.signature,
      });
      setPoId(result?._id);
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPo({ ...po, [name]: value });
  }

  const validate = () => {
    const required = ['companyId', 'poDate', 'destination', 'termsOfDelivery', 'termsOfPayment', 'customerId', 'billNo'];
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
    try {
      setDisable(true);
      const res = await uploadImage("/upload-image", file);
      const { data, message, success } = res;
      if (success) {
        toast.success(message);
        setPo(prev => ({ ...prev, [field]: data?.image }));
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
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
      formData.append("billNo", po.billNo);
      formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
      formData.append("dealerId", dealerStorage.DL_ID);
      formData.append("poDate", po.poDate);
      formData.append("destination", po.destination);
      formData.append("termsOfDelivery", po.termsOfDelivery);
      formData.append("termsOfPayment", po.termsOfPayment);
      formData.append("customerId", po.customerId);
      formData.append("companyId", po.companyId);
      formData.append("image", po.image);
      formData.append("signature", po.signature);
      formData.append("isDealer", true);
      formData.append("status", 1);
      const url = data?._id ? `/dealer/manage-dealer-po/${data?._id}` : `/dealer/manage-dealer-po`
      const result = await post(url, formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      const { success, message } = result;
      if (success) {
        toast.success(message);
        setPoId(result?.data?._id);
        setPo({});
        if (data?._id) {
          getEditPoData();
        }
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong...");
    } finally {
      setDisable(false);
    }
  }

  const handleCompleted = () => {
    if (isCheckPro?.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    toast.success("PO Submitted Successfully");
    navigate(DEALER_URLS.PO_LIST);
  }

  const renderInput = (label, name, type = 'text') => (
    <div className="col-lg-4 col-md-6 col-12">
      <div className="form-floating mb-3">
        <input
          type={type}
          name={name}
          className={`form-control ${errors[name] ? "is-invalid" : ""}`}
          value={po[name]}
          onChange={handleChange}
          placeholder={name}
        />
        <label>{label} <span className="text-danger">*</span></label>
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
      </div>
    </div>
  );

  const FileUpload = ({ label, value, onChange, type }) => (
    <div className="col-lg-6 col-md-6 col-12 mt-2 mb-3">
      <div className="mb-3">
        <label className="col-form-label">{label}</label>
        <div className="drag-attach">
          <input type="file" onChange={(e) => onChange(e, type)} />
          {value ? (
            <div className="my-2 mx-2">
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
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "PO List", to: DEALER_URLS.PO_LIST },
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
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                  <select className={`form-control form-select ${errors.companyId ? "is-invalid" : ""}`}
                    name="companyId"
                    value={po.companyId}
                    onChange={handleChange}
                    placeholder="companyId"
                  >
                    <option>Select Company</option>
                    {companyData?.map((e, i) => (
                      <option key={i} value={e?._id}>
                        {e?.name}
                      </option>
                    ))}
                  </select>
                  <label>
                    Comapny <span className="text-danger">*</span>
                  </label>
                  {errors.companyId && (
                    <div className="invalid-feedback">{errors.companyId}</div>
                  )}
                </div>
              </div>
              {renderInput("PO Date", "poDate", "date")}
              {renderInput("Bill No.", "billNo")}
            </div>
            <div className="row">
              {renderInput("Destination", "destination")}
              {renderInput("Terms Of Delivery", "termsOfDelivery")}
              {renderInput("Terms Of Payment", "termsOfPayment")}
            </div>
          </div>
        </div>

        <PoCustomerData po={po} handleChange={handleChange} errors={errors} isDealer={true} />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <h4 className="page-title">Images</h4>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <FileUpload label="Image" value={po.image} onChange={handleImgUpload} type="image" />
              <FileUpload label="Signature" value={po.signature} onChange={handleImgUpload} type="signature" />
            </div>
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
                disabled={disable || !data?._id && poId}
              >
                {disable
                  ? "Loading..."
                  : data?._id
                    ? "Update"
                    : "Create and Add Products"}
              </button>
            </div>
          </div>
        </div>

        {poId && <PoProductsList poId={poId} setIsCheckPro={setIsCheckPro} />}

        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCompleted}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagePo