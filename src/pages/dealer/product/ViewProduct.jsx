import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useDealerApi } from '../../../context/DealerApiContext';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { addDealerCart, getDealerCart } from '../../../middleware/cart/cart';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addCartReset } from '../../../slices/cart.slice';
import { logos } from '../../../config/DataFile';

const ViewProduct = () => {

    const { id } = useParams();
    const { get } = useDealerApi();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [proObj, setProObj] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const printRef = useRef();
    const dealerStorage = getDealerStorage();
    

    useEffect(() => {
        getProductData();
    }, []);

    useEffect(() => {
        if (proObj?.price) {
            setTotalPrice(quantity * proObj.price);
        }
    }, [quantity, proObj]);

    const { addCartLoading, addCartMessage, addCartError } = useSelector((state) => state?.cart);

    useEffect(() => {
        if (!addCartMessage && !addCartError) {
            return;
        }
        if (addCartMessage) {
            toast.success(addCartMessage);
        }
        if (addCartError) {
            toast.error(addCartError);
        }
        dispatch(addCartReset());
        const formData = new URLSearchParams();
        formData.append("dealerId", dealerStorage.DL_ID);
        dispatch(getDealerCart(formData))
    }, [addCartMessage, addCartError]);

    const getProductData = async () => {
        try {
            const response = await get(`/dealer/get-products/${id}`);
            const { success, data } = response;
            console.log(response);
            if (success && data?.length > 0) {
                setProObj(data[0]);
            } else {
                setError("Product data not found.");
            }
        } catch (err) {
            setError("Failed to fetch product data.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (type) => {
        if (type === "minus" && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
        if (type === "plus" && quantity < 10) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleAddToCart = () => {
        const formData = new URLSearchParams();
        formData.append("dealerId", dealerStorage.DL_ID);
        formData.append("productId", proObj._id);
        formData.append("quantity", quantity);
        formData.append("price", proObj.price);
        formData.append("totalPrice", totalPrice);
        dispatch(addDealerCart(formData));
    }

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger text-center my-5 mx-auto" style={{ maxWidth: '600px' }}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
            <button className="btn btn-sm btn-outline-danger ms-3" onClick={getProductData}>
                <i className="fas fa-sync-alt me-1"></i> Retry
            </button>
        </div>
    );

    const hasImages = proObj?.images?.length > 0;
    const imagesToDisplay = hasImages ? proObj.images : [{ url: logos.NO_PRO_IMAGE, originalName: 'Placeholder' }];

    return (
        <div className="container-fluid px-2 px-sm-3 px-md-4 py-3">
            <BreadCrumbs
                crumbs={[
                    { label: "Product List", to: DEALER_URLS.PRODUCT_LIST },
                    { label: `View Product Details` },
                ]}
            />

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <h4 className="mb-2 mb-md-0 fw-semibold">Product Details</h4>
                        <div className="text-muted small">
                            Product ID: {proObj?._id?.substring(0, 8) || 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="card-body p-1" ref={printRef}>
                    <div className="row g-0">
                        <div className="col-12 col-lg-5 col-xxl-4 border-end p-2 p-sm-3 p-md-4">
                            <div className="sticky-md-top" style={{ top: '20px' }}>
                                <div className="product-image-main mb-3 rounded-3 overflow-hidden">
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        navigation={{
                                            nextEl: '.swiper-button-next',
                                            prevEl: '.swiper-button-prev',
                                        }}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        spaceBetween={10}
                                        className="product-main-swiper h-100"
                                    >
                                        {imagesToDisplay?.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '300px', minHeight: '300px' }}>
                                                    <img
                                                        src={image.url}
                                                        alt={image.originalName}
                                                        className="img-fluid rounded-3"
                                                        style={{
                                                            maxHeight: '100%',
                                                            width: 'auto',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                        {hasImages && imagesToDisplay.length > 1 && (
                                            <>
                                                <div className="swiper-button-next"></div>
                                                <div className="swiper-button-prev"></div>
                                            </>
                                        )}
                                    </Swiper>
                                </div>

                                {/* <div className="product-image-thumbnails mt-3">
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        spaceBetween={8}
                                        slidesPerView={4}
                                        freeMode={true}
                                        watchSlidesProgress
                                        modules={[FreeMode, Thumbs]}
                                        className="product-thumb-swiper"
                                        breakpoints={{
                                            320: {
                                                slidesPerView: 3,
                                                spaceBetween: 6
                                            },
                                            576: {
                                                slidesPerView: 4,
                                                spaceBetween: 8
                                            }
                                        }}
                                    >
                                        {proObj?.images?.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="border rounded-2 p-1 bg-light" style={{ height: '70px' }}>
                                                    <img
                                                        src={image.url}
                                                        alt={image.originalName}
                                                        className="img-fluid h-100 w-100"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div> */}
                                {hasImages && (
                                    <div className="product-image-thumbnails mt-3">
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            spaceBetween={8}
                                            slidesPerView={Math.min(4, imagesToDisplay.length)}
                                            freeMode={true}
                                            watchSlidesProgress
                                            modules={[FreeMode, Thumbs]}
                                            className="product-thumb-swiper"
                                            breakpoints={{
                                                320: {
                                                    slidesPerView: Math.min(3, imagesToDisplay.length),
                                                    spaceBetween: 6
                                                },
                                                576: {
                                                    slidesPerView: Math.min(4, imagesToDisplay.length),
                                                    spaceBetween: 8
                                                }
                                            }}
                                        >
                                            {imagesToDisplay.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="border rounded-2 p-1 bg-light" style={{ height: '70px' }}>
                                                        <img
                                                            src={image.url}
                                                            alt={image.originalName}
                                                            className="img-fluid h-100 w-100"
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="col-12 col-lg-7 col-xxl-8 p-2 p-sm-3 p-md-4">
                            <div className="mb-4">
                                <h1 className="d-lg-none h5 fw-bold mb-2">{proObj?.name || "Unnamed Product"}</h1>
                                <h2 className="d-none d-lg-block h3 fw-bold mb-2">{proObj?.name || "Unnamed Product"}</h2>
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                    <span className="badge bg-primary bg-opacity-10 text-primary">
                                        {proObj?.categoryName || "N/A"}
                                    </span>
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary">
                                        {proObj?.unitName || "N/A"}
                                    </span>
                                </div>
                                <div className="text-muted mb-3">
                                    <i className="fas fa-industry me-2"></i>
                                    {proObj?.companyName || "Manufacturer not specified"}
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="bg-light rounded-3 p-3 mb-4">
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                    <div className="mb-2 mb-sm-0">
                                        <div className="d-flex align-items-baseline gap-2">
                                            <h3 className="text-primary mb-0">₹{totalPrice.toLocaleString()}</h3>
                                            {proObj?.customerPrice && (
                                                <small className="text-muted">
                                                    <span style={{ textDecoration: 'line-through' }}>
                                                        M.R.P.: ₹{(proObj.customerPrice * quantity).toLocaleString()}
                                                    </span>
                                                </small>
                                            )}
                                        </div>
                                        <div className="text-success small">
                                            <i className="fas fa-check-circle me-1"></i>
                                            {proObj?.stockStatus || "In Stock"}
                                        </div>
                                    </div>
                                    <div className="text-sm-end">
                                        <div className="text-muted small">Price per unit</div>
                                        <div className="fw-bold">₹{proObj?.price?.toLocaleString() || "0"}</div>
                                    </div>
                                </div>
                                <div className="mt-2 text-muted small">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Inclusive of {proObj?.gst || 0}% GST
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Quantity</label>
                                <div className="d-flex align-items-center gap-2" style={{ maxWidth: '160px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary p-2 w-100"
                                        onClick={() => handleQuantityChange("minus")}
                                        disabled={quantity <= 1}
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        readOnly
                                        className="form-control text-center flex-grow-1"
                                        style={{ height: '42px' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary p-2 w-100"
                                        onClick={() => handleQuantityChange("plus")}
                                        disabled={quantity >= 10}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div className="form-text">Max 10 units per order</div>
                            </div>

                            {/* Action Buttons - Stacked on mobile */}
                            <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mb-5">
                                <button
                                    className="btn btn-primary py-2"
                                    onClick={handleAddToCart}
                                    disabled={addCartLoading}
                                >
                                    {addCartLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-cart-plus me-2"></i>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Product Specifications */}
                            <div className="mb-5">
                                <h5 className="mb-3 border-bottom pb-2">
                                    <i className="fas fa-list-alt me-2 text-muted"></i>
                                    Specifications
                                </h5>
                                <div className="row">
                                    <div className="col-12 col-sm-6">
                                        <ul className="list-unstyled">
                                            <li className="mb-2">
                                                <strong className="text-muted">HSN Code:</strong>
                                                <span className="ms-2">{proObj?.hsnNo || "N/A"}</span>
                                            </li>
                                            <li className="mb-2">
                                                <strong className="text-muted">Brand:</strong>
                                                <span className="ms-2">{proObj?.firmName || "N/A"}</span>
                                            </li>
                                            <li className="mb-2">
                                                <strong className="text-muted">Warranty:</strong>
                                                <span className="ms-2">{proObj?.warrantyName || "N/A"}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <ul className="list-unstyled">
                                            <li className="mb-2">
                                                <strong className="text-muted">Category:</strong>
                                                <span className="ms-2">{proObj?.categoryName || "N/A"}</span>
                                            </li>
                                            <li className="mb-2">
                                                <strong className="text-muted">Unit:</strong>
                                                <span className="ms-2">{proObj?.unitName || "N/A"}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Included Parts */}
                            {proObj?.parts?.length > 0 && (
                                <div className="mb-5">
                                    <h5 className="mb-3 border-bottom pb-2">
                                        <i className="fas fa-puzzle-piece me-2 text-muted"></i>
                                        Included Parts
                                    </h5>
                                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
                                        {proObj.parts.map((part, index) => (
                                            <div key={index} className="col">
                                                <div className="border rounded p-2 bg-light">
                                                    <i className="fas fa-check-circle text-success me-2"></i>
                                                    {part.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Product Description */}
                            <div className="mb-4">
                                <h5 className="mb-3 border-bottom pb-2">
                                    <i className="fas fa-align-left me-2 text-muted"></i>
                                    Description
                                </h5>
                                <div className="bg-light rounded-3 p-3">
                                    {proObj?.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: proObj.description }} />
                                    ) : (
                                        <p className="text-muted mb-0">No description provided.</p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Information */}
                            {proObj?.privateDescription && (
                                <div className="mb-4">
                                    <h5 className="mb-3 border-bottom pb-2">
                                        <i className="fas fa-info-circle me-2 text-muted"></i>
                                        Additional Information
                                    </h5>
                                    <div className="bg-light rounded-3 p-3">
                                        <div dangerouslySetInnerHTML={{ __html: proObj.privateDescription }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-footer bg-white border-top">
                    <div className="d-flex justify-content-end">
                        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
                            <button
                                className="btn btn-outline-secondary order-2 order-sm-1"
                                onClick={() => navigate(DEALER_URLS.PRODUCT_LIST)}
                            >
                                <i className="fas fa-arrow-left me-2"></i>Back to Products
                            </button>
                            <div className="d-flex gap-2 order-1 order-sm-2 ms-sm-auto">
                                <button className="btn btn-outline-primary" onClick={handlePrint}>
                                    <i className="fas fa-print me-2"></i>Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewProduct