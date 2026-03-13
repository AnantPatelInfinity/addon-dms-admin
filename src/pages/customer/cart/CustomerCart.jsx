import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Minus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage";
import {
  getCustomerCart,
  inCustomerCartQty,
  outCustomerCartQty,
  removeCustomerCart,
} from "../../../middleware/customerUser/customerCart/cart";
import {
  inCartQtyReset,
  outCartQtyReset,
  removeCartReset,
} from "../../../slices/customer/cart.slice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";

const CustomerCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CustomerStorage = getCustomerStorage();

  const [updatingProductId, setUpdatingProductId] = useState(null);

  const {
    cartList,
    loading,
    cartListError,

    inCartQtyError,
    inCartQtyLoading,
    inCartQtyMessage,

    outCartQtyError,
    outCartQtyLoading,
    outCartQtyMessage,

    removeCartError,
    removeCartLoading,
    removeCartMessage,
  } = useSelector((state) => state.customerCart);

  const fetchCart = () => {
    const formData = new URLSearchParams();
    formData.append("customerId", CustomerStorage.CU_ID);
    dispatch(getCustomerCart(formData));
  };

  useEffect(() => {
    if (inCartQtyMessage || outCartQtyMessage) {
      fetchCart();
    }

    // if (inCartQtyMessage) toast.success(inCartQtyMessage);
    // if (outCartQtyMessage) toast.success(outCartQtyMessage);
    if (inCartQtyError) toast.error(inCartQtyError);
    if (outCartQtyError) toast.error(outCartQtyError);

    setUpdatingProductId(null);
    dispatch(inCartQtyReset());
    dispatch(outCartQtyReset());
  }, [inCartQtyMessage, inCartQtyError, outCartQtyMessage, outCartQtyError]);

  useEffect(() => {
    if (removeCartMessage) {
      toast.success(removeCartMessage);
      fetchCart();
      dispatch(removeCartReset());
    }
    if (removeCartError) {
      toast.error(removeCartError);
      dispatch(removeCartReset());
    }
  }, [removeCartMessage, removeCartError]);

  const calculateGstAmount = (inclusivePrice, gstPercentage) => {
    // Formula: GST Amount = (Inclusive Price * GST%) / (100 + GST%)
    const gstAmount = (inclusivePrice * gstPercentage) / (100 + gstPercentage);
    return parseFloat(gstAmount.toFixed(2));
  };

  // Function to calculate the base price before GST
  const calculateBasePrice = (inclusivePrice, gstPercentage) => {
    // Formula: Base Price = Inclusive Price / (1 + GST%/100)
    return parseFloat((inclusivePrice / (1 + gstPercentage / 100)).toFixed(2));
  };

  if (cartListError) {
    Swal.fire({
      title: "Error!",
      text: cartListError,
      icon: "error",
      confirmButtonText: "OK",
    });
    return (
      <div className="container mt-4 text-center py-5 text-danger">
        <p>Failed to load cart. Please try again.</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!cartList || cartList.length === 0) {
    return (
      <div className="container mt-4 text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <h2 className="mb-3">Your Cart is Empty</h2>
            <p className="text-muted mb-4">
              Add some products to see them here
            </p>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate(CUSTOMER_URLS.PRODUCT_LIST)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartData = cartList[0];
  const handleIncreaseQty = (productId, currentQty) => {
    if (currentQty >= 10) {
      Swal.fire({
        icon: "info",
        title: "Limit Reached",
        text: "You can only add up to 10 units of this product.",
      });
      return;
    }
    setUpdatingProductId(productId);
    const newQty = currentQty + 1;
    const formData = new URLSearchParams();
    formData.append("customerId", CustomerStorage.CU_ID);
    formData.append("productId", productId);
    formData.append("quantity", newQty);
    dispatch(inCustomerCartQty(formData));
  };

  const handleDecreaseQty = (productId, currentQty) => {
    if (currentQty <= 1) return;
    setUpdatingProductId(productId);
    const newQty = currentQty - 1;
    const formData = new URLSearchParams();
    formData.append("customerId", CustomerStorage.CU_ID);
    formData.append("productId", productId);
    formData.append("quantity", newQty);
    dispatch(outCustomerCartQty(formData));
  };

  const handleRemoveItem = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed from your cart",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdatingProductId(productId);
        const formData = {
          customerId: CustomerStorage.CU_ID,
          productId: productId,
        };
        dispatch(removeCustomerCart(formData));
      }
    });
  };

  const calculateSubtotal = () => {
    return cartData.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const calculateTotalGst = () => {
    return cartData.products.reduce((total, product) => {
      const gstAmount = calculateGstAmount(
        product.price,
        product.productDetails.gst
      );
      return total + gstAmount * product.quantity;
    }, 0);
  };

  return (
    <div className="container mt-3 mt-md-4 mb-5">
      <h2 className="mb-3 mb-md-4 text-center">
        Your Cart - {cartData?.customerName}
      </h2>

      <div className="row g-3">
        <div className="col-12 col-md-8 order-1 order-md-0">
          <div className="card shadow-sm">
            <div className="card-body p-2 p-md-3">
              {cartData?.products?.map((product, index) => (
                <div key={product.productId}>
                  <div className="row align-items-center g-2 py-2 py-md-3">
                    <div className="col-4 col-md-2">
                      <img
                        src={
                          product?.productDetails?.images[0]?.url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={product?.productDetails?.name}
                        className="img-fluid rounded border"
                        style={{
                          maxHeight: "80px",
                          width: "auto",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div className="col-8 col-md-4">
                      <h6 className="mb-1 mb-md-2">
                        {product.productDetails.name}
                      </h6>
                      <p className="small text-muted mb-1 d-none d-md-block">
                        {product?.productDetails?.companyName} •{" "}
                        {product.productDetails.categoryName}
                      </p>
                      <p className="small text-muted mb-0">
                        ₹{product?.price?.toLocaleString()} ×{" "}
                        {product?.quantity}
                      </p>
                      <p className="small text-muted mb-0">
                        GST: {product?.productDetails?.gst}%
                      </p>
                    </div>

                    <div className="col-12 col-md-3 mt-2 mt-md-0">
                      <div className="d-flex align-items-center justify-content-start justify-content-md-center">
                        <button
                          className="btn btn-outline-secondary btn-sm py-1 px-2"
                          onClick={() =>
                            handleDecreaseQty(
                              product.productId,
                              product.quantity
                            )
                          }
                          disabled={
                            product?.quantity <= 1 ||
                            (outCartQtyLoading &&
                              updatingProductId === product.productId)
                          }
                        >
                          {outCartQtyLoading &&
                          updatingProductId === product.productId ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            <Minus size={14} />
                          )}
                        </button>

                        <span className="mx-2 mx-md-3">{product.quantity}</span>

                        <button
                          className="btn btn-outline-secondary btn-sm py-1 px-2"
                          onClick={() =>
                            handleIncreaseQty(
                              product.productId,
                              product.quantity
                            )
                          }
                          disabled={
                            product?.quantity >= 10 ||
                            (inCartQtyLoading &&
                              updatingProductId === product.productId)
                          }
                        >
                          {inCartQtyLoading &&
                          updatingProductId === product.productId ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            <Plus size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-6 col-md-2 text-start text-md-end">
                      <h6 className="mb-0">
                        ₹{(product?.price * product?.quantity).toLocaleString()}
                      </h6>
                      <p className="small text-muted mb-0">
                        (Includes GST: ₹
                        {(
                          calculateGstAmount(
                            product?.price,
                            product?.productDetails?.gst
                          ) * product?.quantity
                        ).toLocaleString()}
                        )
                      </p>
                    </div>

                    <div className="col-6 col-md-1 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm py-1 px-2"
                        onClick={() => handleRemoveItem(product.productId)}
                        aria-label="Remove item"
                        disabled={
                          removeCartLoading &&
                          updatingProductId === product.productId
                        }
                      >
                        {removeCartLoading &&
                        updatingProductId === product.productId ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {index < cartData.products.length - 1 && (
                    <hr className="my-1 my-md-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 order-0 order-md-1">
          <div className="card shadow-sm sticky-md-top">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>
              <hr className="my-2" />
              <div className="d-flex justify-content-between mb-2">
                <span>Taxable Amount(₹):</span>
                <span>
                  ₹
                  {cartData.products
                    .reduce((total, product) => {
                      const basePrice = calculateBasePrice(
                        product.price,
                        product.productDetails.gst
                      );
                      return total + basePrice * product.quantity;
                    }, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>
                  Total GST(₹)
                  {/* ({cartData.products.reduce((acc, product) => {
                                    const uniqueGst = !acc.includes(product.productDetails.gstPercentage)
                                        ? [...acc, product.productDetails.gst]
                                        : acc;
                                    return uniqueGst;
                                }, []).join('%, ')}%) */}
                  :
                </span>
                <span>₹{calculateTotalGst().toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Net Amount(₹):</span>
                <span>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <button
                className="btn btn-primary w-100 py-2 mb-2"
                onClick={() => navigate(CUSTOMER_URLS.CHECKOUT)}
              >
                Proceed to Checkout
              </button>
              <button
                className="btn btn-outline-secondary w-100 py-2"
                type="button"
                onClick={() => navigate(CUSTOMER_URLS.PRODUCT_LIST)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCart;
