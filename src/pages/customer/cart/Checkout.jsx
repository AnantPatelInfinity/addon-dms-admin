import moment from "moment";
import React, { useEffect, useState } from "react";
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerCart } from "../../../middleware/customerUser/customerCart/cart";
import { toast } from "react-toastify";
import CuCartPoList from "../../../components/customer/cart/CuCardPoList";
import { Accordion, Button } from "react-bootstrap";
import { addCustomerCheckoutPo } from "../../../middleware/customerUser/checkout/checkout";
import { addCheckoutReset } from "../../../slices/customer/checkout.slice";
import { useNavigate } from "react-router";
import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";
import ShippingAddress from "../../../components/customer/cart/ShippingAddress";
import { getDispatchThroughList } from "../../../middleware/customerUser/dispatchThrough/dispatchThrough";
import { getCuProfile } from "../../../middleware/customerUser/customerProfile/profile"

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [po, setPo] = useState({
    poDate: moment(new Date()).format("YYYY-MM-DD"),
    customerId: "",
    dispatchCompanyId: "",
    termsOfDelivery: "",
    termsOfPayment: "",
  });

  const [shipTo, setShipTo] = useState({
    mailName: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    country: "India",
    gstRegisterType: "",
    gstNo: "",
  });
  
  const [errors, setErrors] = useState({});
  const CustomerStorage = getCustomerStorage();

  const [activeKey, setActiveKey] = useState("0");

  const { cartList } = useSelector((state) => state.customerCart);
  const { dispatchThrough } = useSelector((state) => state?.customerDispatchThrough);
  const { customerProfile } = useSelector((state) => state?.customerProfile);

  const [productList, setProductList] = useState([]);

  const { addCheckoutError, addCheckoutLoading, addCheckoutMessage } =
    useSelector((state) => state?.customerCheckout);

    useEffect(() => {
      if (CustomerStorage?.CU_ID) {
        dispatch(getCuProfile());
      }
    }, [dispatch]);

    useEffect(() => {
      if (customerProfile) {
        setShipTo({
          mailName: `${customerProfile?.title || ""} ${customerProfile?.name || ""} ${customerProfile?.lastName || ""}`.trim(),
          address: `${customerProfile?.address || ""} ${customerProfile?.addressTwo || ""} ${customerProfile?.addressThree || ""}`.trim(),
          state: customerProfile?.state || "",
          city: customerProfile?.city || "",
          pincode: customerProfile?.pincode || "",
          country: "India",
          gstRegisterType: customerProfile?.gstNo !== null ? "registered" : "unregistered",
          gstNo: customerProfile?.gstNo || "",
        });
      }
    }, [customerProfile]);

  useEffect(() => {
    if (addCheckoutError) {
      toast.error(addCheckoutError);
      dispatch(addCheckoutReset());
    }
    if (addCheckoutMessage) {
      toast.success(addCheckoutMessage);
      fetchCart();
      dispatch(addCheckoutReset());
      navigate(CUSTOMER_URLS.DASHBOARD);
    }
  }, [addCheckoutError, addCheckoutMessage]);

  const products = cartList[0]?.products || [];

  useEffect(() => {
    dispatch(getDispatchThroughList());
    fetchCart();
  }, [dispatch]);

  useEffect(() => {
    const updated = products?.map((p) => ({
      ...p,
      poRemarks: p.poRemarks || "",
    }));
    setProductList(updated);
  }, [cartList]);

  const fetchCart = () => {
    const formData = new URLSearchParams();
    formData.append("customerId", CustomerStorage.CU_ID);
    dispatch(getCustomerCart(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPo({ ...po, [name]: value });
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRemarkChange = (index, value) => {
    const updated = [...productList];
    updated[index].poRemarks = value;
    setProductList(updated);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!po.poDate) newErrors.poDate = "PO Date is required";
      if (!po.dispatchCompanyId)
        newErrors.dispatchCompanyId = "Dispatch Through is required";
    } else if (step === 1) {
      if (!shipTo.mailName) newErrors.mailName = "Mail name is required";
      if (!shipTo.address) newErrors.address = "Address is required";
      if (!shipTo.state) newErrors.state = "State is required";
      if (!shipTo.city) newErrors.city = "City is required";
      if (!shipTo.pincode) newErrors.pincode = "Pincode is required";
      if (shipTo.gstRegisterType === "registered" && !shipTo.gstNo) {
        newErrors.gstNo = "GST Number is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (nextKey) => {
    if (validateStep(parseInt(activeKey))) {
      setActiveKey(nextKey);
    }
  };

  const renderInput = (label, name, type = "text", required = true) => (
    <div className="col-lg-4 col-md-6 col-12">
      <div className="form-floating mb-3">
        <input
          type={type}
          name={name}
          className={`form-control ${errors[name] ? "is-invalid" : ""}`}
          value={po[name]}
          onChange={handleChange}
          placeholder={label}
        />
        <label>
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
      </div>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(0) && validateStep(1)) {

      const updatedPros = productList?.map((pro) => {
        const { productId, quantity, price, productDetails, poRemarks } = pro;

        const rate = price;
        const amount = quantity * rate;
        const totalAmount = amount;
        return {
          productId: productId,
          companyId: productDetails.companyId,
          name: productDetails.name,
          date: new Date(),
          quantity: quantity,
          rate: rate,
          amount: amount,
          discount: null,
          discountAmount: null,
          spDiscount: null,
          spDiscountAmount: null,
          taxableAmount: null,
          gst: productDetails.gst,
          gstAmount: null,
          totalAmount: totalAmount,
          poRemarks: poRemarks || null,
          warrantyId: productDetails?.warrantyId || null,
          poAutoRemarks:
            `${productDetails?.warrantyName} - ${productDetails?.shortDescription}` ||
            null,
        };
      });
      const formData = new URLSearchParams();
      formData.append("customerId", CustomerStorage.CU_ID);
      formData.append("firmId", CustomerStorage.DX_CU_FIRM_ID);
      formData.append("poDate", po.poDate);
      formData.append("dispatchCompanyId", po.dispatchCompanyId);
      formData.append("termsOfDelivery", po.termsOfDelivery);
      formData.append("termsOfPayment", po.termsOfPayment);
      formData.append("shipTo", JSON.stringify(shipTo));
      formData.append("products", JSON.stringify(updatedPros));
      dispatch(addCustomerCheckoutPo(formData));
    }
  };

  return (
    <div className="container mt-4">
      <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className="fw-bold">Step 1: Order Information</span>
            <small className="text-muted ms-2">(Basic PO Details)</small>
          </Accordion.Header>
          <Accordion.Body>
            <form className="mb-4">
              <div className="row">
                {renderInput("PO Date", "poDate", "date")}
                {renderInput(
                  "Terms Of Delivery",
                  "termsOfDelivery",
                  "text",
                  false
                )}
                {renderInput(
                  "Terms Of Payment",
                  "termsOfPayment",
                  "text",
                  false
                )}
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-floating mb-3">
                    <select
                      className={`form-control form-select ${
                        errors.dispatchCompanyId ? "is-invalid" : ""
                      }`}
                      name="dispatchCompanyId"
                      value={po.dispatchCompanyId}
                      onChange={handleChange}
                    >
                      <option>Select Dispatch Through</option>
                      {dispatchThrough?.map((e, i) => (
                        <option key={i} value={e?._id}>
                          {" "}
                          {e?.name}{" "}
                        </option>
                      ))}
                    </select>
                    <label>
                      Dispatch Through <span className="text-danger">*</span>
                    </label>
                    {errors.dispatchCompanyId && (
                      <div className="invalid-feedback">
                        {errors.dispatchCompanyId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <div className="text-end">
              <Button variant="primary" onClick={() => handleNext("1")}>
                Next: Billing
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <span className="fw-bold">Step 2: Billing</span>
            <small className="text-muted ms-2">(Address Details)</small>
          </Accordion.Header>
          <Accordion.Body>
            <ShippingAddress
              customerProfile={customerProfile}
              setShipTo={setShipTo}
              shipTo={shipTo}
              setPo={setPo}
              errors={errors}
              setErrors={setErrors}
            />
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setActiveKey("0")}
              >
                Back to Order Info
              </Button>
              <Button variant="primary" onClick={() => handleNext("2")}>
                {" "}
                Next: Review Products
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <span className="fw-bold">Step 3: Product Review</span>
            <small className="text-muted ms-2">(Cart Items)</small>
          </Accordion.Header>
          <Accordion.Body>
            <CuCartPoList
              products={productList}
              onRemarkChange={handleRemarkChange}
            />
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setActiveKey("1")}
              >
                Back to Address Details
              </Button>
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={addCheckoutLoading}
              >
                {addCheckoutLoading ? "Processing..." : "Submit Purchase Order"}
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Checkout;
