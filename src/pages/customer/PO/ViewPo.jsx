import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux';
import { getCustomerOnePoList, getCustomerPoDownload, resetCuPoDownload } from '../../../middleware/customerUser/customerPo/customerPo';
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs';
import CUSTOMER_URLS from '../../../config/routesFile/customer.routes';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert/ErrorAlert';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { formatDateTime, getStatusBadge } from '../../../config/setup';
import { toast } from 'react-toastify';
import { getCustomerStorage } from '../../../components/LocalStorage/CustomerStorage';

const ViewPo = () => {

    const { state: poId } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const customerStorage = getCustomerStorage();

    const [modalState, setModalState] = useState({
        isOpen: false,
        imageUrl: '',
        altText: '',
        title: ''
    });

    const openImageModal = (imageUrl, altText, title = 'Image Preview') => {
        setModalState({
            isOpen: true,
            imageUrl,
            altText,
            title
        });
    };

    const closeImageModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const {
        cuOnePoList: cuPoDetails,
        cuOnePoListError: error,
        cuOnePoListLoading: loading,
        cuOnePoListMessage: message,

        cuPoDownloadError,
        cuPoDownloadLoading,
        cuPoDownloadMessage,
        cuPoDownload,
    } = useSelector((state) => state?.customerPo);

    useEffect(() => {
        if (cuPoDownloadMessage) {
            toast.success(cuPoDownloadMessage);
            window.open(cuPoDownload.file, '_blank');
            dispatch(resetCuPoDownload())
        }
        if (cuPoDownloadError) {
            toast.error(cuPoDownloadError)
            dispatch(resetCuPoDownload())
        }
    }, [cuPoDownloadError, cuPoDownloadMessage, cuPoDownload])

    useEffect(() => {
            dispatch(getCustomerOnePoList(null, poId));
    }, [poId, dispatch, navigate]);

    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateGstBreakdown = (totalAmount, gstPercentage) => {
        if (!totalAmount || !gstPercentage) return { baseAmount: 0, gstAmount: 0 };

        const gstDecimal = gstPercentage / 100;
        const baseAmount = totalAmount / (1 + gstDecimal);
        const gstAmount = totalAmount - baseAmount;

        return {
            baseAmount: Math.round(baseAmount),
            gstAmount: Math.round(gstAmount)
        };
    };

    // Calculate total GST for all products
    const calculateTotalGst = () => {
        if (!cuPoDetails?.products) return 0;

        return cuPoDetails.products.reduce((total, product) => {
            const { gstAmount } = calculateGstBreakdown(product.totalAmount, product.gst);
            return total + gstAmount;
        }, 0);
    };

    const handleDownload = (poId) => {
        dispatch(getCustomerPoDownload(poId))
    }

    if (loading) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <LoadingSpinner text="Loading PO details..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <ErrorAlert
                        message={message || 'Failed to load PO details'}
                        onRetry={() => {
                            dispatch(getCustomerOnePoList(null, poId));
                        }}
                    />
                </div>
            </div>
        );
    }

    if (!cuPoDetails) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="alert alert-warning">
                        No PO details found. Please try again or contact support.
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const totalGstAmount = calculateTotalGst();

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs
                    crumbs={[
                        { label: "PO List", to: CUSTOMER_URLS.PO_LIST },
                        { label: `View PO Details` },
                    ]}
                />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4 className="page-title">
                                    View PO Details
                                </h4>
                            </div>
                            <div className="col-lg-8 col-md-6 col-12 text-end">
                                <span className="badge bg-success me-2">PO No: {cuPoDetails.voucherNo || 'N/A'}</span>
                                {getStatusBadge(parseInt(cuPoDetails?.status))}
                            </div>
                        </div>
                    </div>

                    {cuPoDetails.status === 3 && (
                        <div className="alert alert-danger mt-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Rejection Reason:</strong> {cuPoDetails.rejectReason || 'No reason provided'}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Rejected On:</strong> {formatDateTime(cuPoDetails.statusTime)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card-body">
                        <div className="row mb-4">
                            {/* <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Dealer Details</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{cuPoDetails.dealerName || 'N/A'}</strong></p>
                                        <p className="mb-1">Email: {cuPoDetails.dealerEmail || 'N/A'}</p>
                                        <p className="mb-1">Phone: {cuPoDetails.dealerPhone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Firm Details</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{cuPoDetails.firmName || 'N/A'}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {cuPoDetails.customerId && (
                            <div className="row mb-4">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-header bg-light">
                                            <h5>Customer Details</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <p className="mb-1"><strong>Name:</strong> {cuPoDetails.customerName || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <p className="mb-1"><strong>Email:</strong> {cuPoDetails.customerEmail || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <p className="mb-1"><strong>Phone:</strong> {cuPoDetails.customerPhone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {cuPoDetails.customerAddress && (
                                                <div className="row mt-2">
                                                    <div className="col-md-12">
                                                        <p className="mb-1"><strong>Address:</strong> {cuPoDetails.customerAddress}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row mb-4">
                            {/* <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Bill To</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{cuPoDetails.billTo?.mailName || 'N/A'}</strong></p>
                                        <p className="mb-1">{cuPoDetails.billTo?.address || 'N/A'}</p>
                                        <p className="mb-1">{cuPoDetails.billTo?.city || ''}, {cuPoDetails.billTo?.state || ''}, {cuPoDetails.billTo?.pincode || ''}</p>
                                        <p className="mb-1">{cuPoDetails.billTo?.country || ''}</p>
                                        <p className="mb-0">GST: {cuPoDetails.billTo?.gstNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Ship To</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{cuPoDetails.shipTo?.mailName || 'N/A'}</strong></p>
                                        <p className="mb-1">{cuPoDetails.shipTo?.address || 'N/A'}</p>
                                        <p className="mb-1">{cuPoDetails.shipTo?.pincode || ''}, {cuPoDetails.shipTo?.state || ''}, {cuPoDetails.shipTo?.country || ''}</p>
                                        <p className="mb-0">GST: {cuPoDetails.shipTo?.gstNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <p><strong>PO Date:</strong> {formatDate(cuPoDetails.poDate)}</p>
                            </div>
                            <div className="col-md-4">
                                <p><strong>Created At:</strong> {formatDateTime(cuPoDetails.createdAt)}</p>
                            </div>
                            <div className="col-md-4">
                                {cuPoDetails.dispatchCompanyName && (
                                    <p><strong>Dispatch Company:</strong> {cuPoDetails.dispatchCompanyName}</p>
                                )}
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Terms of Delivery</h5>
                                    </div>
                                    <div className="card-body">
                                        <p>{cuPoDetails.termsOfDelivery || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5> Mode/Terms of Payment</h5>
                                    </div>
                                    <div className="card-body">
                                        <p>{cuPoDetails.termsOfPayment || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="">
                                    <tr>
                                        <th>#</th>
                                        <th>Product Name</th>
                                        <th>Company</th>
                                        <th>HSN No.</th>
                                        {/* <th>Warranty</th> */}
                                        <th>Quantity</th>
                                        <th>Gst(%)</th>
                                        <th>Rate(₹)</th>
                                        <th>Amount(₹)</th>
                                        <th>GST Amount (₹)</th>
                                        <th>Total Amount(₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuPoDetails.products?.length > 0 ? (
                                        cuPoDetails.products.map((product, index) => {
                                            const { baseAmount, gstAmount } = calculateGstBreakdown(product.totalAmount, product.gst);
                                            const baseRate = baseAmount / product.quantity;

                                            return (
                                                <tr key={product._id || index}>
                                                    <td>{index + 1}</td>
                                                    {/* <td>{product.name || 'N/A'}</td> */}
                                                    <td>
                                                        <div>{product.name || 'N/A'}</div>
                                                        {product.poAutoRemarks && (
                                                            <div className="text-muted small fst-italic">
                                                                {product.poAutoRemarks.length > 80
                                                                    ? `${product.poAutoRemarks.slice(0, 80)}...`
                                                                    : product.poAutoRemarks}
                                                            </div>
                                                        )}
                                                        {product.poRemarks && (
                                                            <div className="text-muted small fst-italic">
                                                                {product.poRemarks}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{product.companyName || "N/A"}</td>
                                                    <td>{product.hsnNo || 'N/A'}</td>
                                                    {/* <td>{product.warrantyName || 'N/A'}</td> */}
                                                    <td>{product.quantity || 'N/A'}</td>
                                                    <td>{product.gst || 'N/A'}</td>
                                                    <td>{formatCurrency(baseRate)}</td>
                                                    <td>{formatCurrency(baseAmount)}</td>
                                                    <td>{formatCurrency(gstAmount)}</td>
                                                    <td>{formatCurrency(product.totalAmount)}</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="9" className="text-end"><strong>Grand Total(₹):</strong></td>
                                        <td>
                                            <strong>
                                                {formatCurrency(cuPoDetails.totalAmount)}
                                            </strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Additional Information</h5>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Total Quantity:</strong> {cuPoDetails.totalQuantity || '0'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => handleDownload(cuPoDetails?._id)}
                            >
                                {cuPoDownloadLoading ? (
                                    <>
                                        <i className="ti ti-loader text-primary me-1" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <i className="ti ti-arrow-down text-primary me-1" />
                                        Download PO
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(CUSTOMER_URLS.PO_LIST)}
                            >
                                <i className="fas fa-arrow-left me-2"></i> Back to PO List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ImageModal
                isOpen={modalState.isOpen}
                imageUrl={modalState.imageUrl}
                altText={modalState.altText}
                title={modalState.title}
                onClose={closeImageModal}
            />
        </div>
    )
}

export default ViewPo