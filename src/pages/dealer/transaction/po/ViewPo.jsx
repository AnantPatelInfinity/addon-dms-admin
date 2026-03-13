import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux';
import { getDealerOnePoList, getDePoDownload, resetDePoDownload } from '../../../../middleware/dealerPo/dealerPo';
import { getDealerStorage } from '../../../../components/LocalStorage/DealerStorage';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import DEALER_URLS from '../../../../config/routesFile/dealer.routes';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import ErrorAlert from '../../../../components/ErrorAlert/ErrorAlert';
import ImageModal from '../../../../components/ImageModal/ImageModal';
import { formatDateTime, getStatusBadge } from '../../../../config/setup';
import { toast } from 'react-toastify';

const ViewPo = () => {

    const { state: poId } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dealerStorage = getDealerStorage();

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
        dealerOnePoList: poDetails,
        dealerOnePoListError: error,
        dealerOnePoListLoading: loading,
        dealerOnePoListMessage: message,

        dePoDownloadError,
        dePoDownloadLoading,
        dePoDownloadMessage,
        dePoDownload,
    } = useSelector((state) => state?.dealerPo);

    useEffect(() => {
        if (dePoDownloadMessage) {
            toast.success(dePoDownloadMessage);
            window.open(dePoDownload.file, '_blank');
            dispatch(resetDePoDownload())
        }
        if (dePoDownloadError) {
            toast.error(dePoDownloadError)
            dispatch(resetDePoDownload())
        }
    }, [dePoDownloadError, dePoDownloadMessage, dePoDownload])

    useEffect(() => {
        if (poId) {
            const formData = new URLSearchParams();
            formData.append("dealerId", dealerStorage.DL_ID);
            dispatch(getDealerOnePoList(formData, poId));
        } else {
            navigate(DEALER_URLS.PO_LIST);
        }
    }, [poId, dispatch, dealerStorage.DL_ID, navigate]);

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
        if (!poDetails?.products) return 0;

        return poDetails.products.reduce((total, product) => {
            const { gstAmount } = calculateGstBreakdown(product.totalAmount, product.gst);
            return total + gstAmount;
        }, 0);
    };

    const handleDownload = (poId) => {
        dispatch(getDePoDownload(poId))
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
                            const formData = new URLSearchParams();
                            formData.append("dealerId", dealerStorage.DL_ID);
                            dispatch(getDealerOnePoList(formData, poId));
                        }}
                    />
                </div>
            </div>
        );
    }

    if (!poDetails) {
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
                        { label: "PO List", to: DEALER_URLS.PO_LIST },
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
                                <span className="badge bg-success me-2">PO No: {poDetails.voucherNo || 'N/A'}</span>
                                {getStatusBadge(parseInt(poDetails?.status))}
                            </div>
                        </div>
                    </div>

                    {poDetails.status === 3 && (
                        <div className="alert alert-danger mt-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Rejection Reason:</strong> {poDetails.rejectReason || 'No reason provided'}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Rejected On:</strong> {formatDateTime(poDetails.statusTime)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Dealer Details</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{poDetails.dealerName || 'N/A'}</strong></p>
                                        <p className="mb-1">Email: {poDetails.dealerEmail || 'N/A'}</p>
                                        <p className="mb-1">Phone: {poDetails.dealerPhone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Firm Details</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{poDetails.firmName || 'N/A'}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {poDetails.customerId && (
                            <div className="row mb-4">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-header bg-light">
                                            <h5>Customer Details</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <p className="mb-1"><strong>Name:</strong> {poDetails.customerName || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <p className="mb-1"><strong>Email:</strong> {poDetails.customerEmail || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <p className="mb-1"><strong>Phone:</strong> {poDetails.customerPhone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {poDetails.customerAddress && (
                                                <div className="row mt-2">
                                                    <div className="col-md-12">
                                                        <p className="mb-1"><strong>Address:</strong> {poDetails.customerAddress}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Bill To</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{poDetails.billTo?.mailName || 'N/A'}</strong></p>
                                        <p className="mb-1">{poDetails.billTo?.address || 'N/A'}</p>
                                        <p className="mb-1">{poDetails.billTo?.city || ''}, {poDetails.billTo?.state || ''}, {poDetails.billTo?.pincode || ''}</p>
                                        <p className="mb-1">{poDetails.billTo?.country || ''}</p>
                                        <p className="mb-0">GST: {poDetails.billTo?.gstNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5>Ship To</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1"><strong>{poDetails.shipTo?.mailName || 'N/A'}</strong></p>
                                        <p className="mb-1">{poDetails.shipTo?.address || 'N/A'}</p>
                                        <p className="mb-1">{poDetails.shipTo?.pincode || ''}, {poDetails.shipTo?.state || ''}, {poDetails.shipTo?.country || ''}</p>
                                        <p className="mb-0">GST: {poDetails.shipTo?.gstNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <p><strong>PO Date:</strong> {formatDate(poDetails.poDate)}</p>
                            </div>
                            <div className="col-md-4">
                                <p><strong>Created At:</strong> {formatDateTime(poDetails.createdAt)}</p>
                            </div>
                            <div className="col-md-4">
                                {poDetails.dispatchCompanyName && (
                                    <p><strong>Dispatch Company:</strong> {poDetails.dispatchCompanyName}</p>
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
                                        <p>{poDetails.termsOfDelivery || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-light">
                                        <h5> Mode/Terms of Payment</h5>
                                    </div>
                                    <div className="card-body">
                                        <p>{poDetails.termsOfPayment || 'N/A'}</p>
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
                                    {poDetails.products?.length > 0 ? (
                                        poDetails.products.map((product, index) => {
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
                                                {formatCurrency(poDetails.totalAmount)}
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
                                        <p><strong>Total Quantity:</strong> {poDetails.totalQuantity || '0'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => handleDownload(poDetails?._id)}
                            >
                                {dePoDownloadLoading ? (
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
                                onClick={() => navigate(DEALER_URLS.PO_LIST)}
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