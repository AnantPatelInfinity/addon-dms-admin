import React, { useMemo } from 'react'

const DeCartProList = ({ products = [], onRemarkChange }) => {

    const grandTotal = useMemo(() => {
        return products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    }, [products]);

    const calculateGstAmount = (inclusivePrice, gstPercentage) => {
        // Formula: GST Amount = (Inclusive Price * GST%) / (100 + GST%)
        const gstAmount = (inclusivePrice * gstPercentage) / (100 + gstPercentage);
        return parseFloat(gstAmount.toFixed(2));
    };

    const calculateBasePrice = (inclusivePrice, gstPercentage) => {
        // Formula: Base Price = Inclusive Price / (1 + GST%/100)
        return parseFloat((inclusivePrice / (1 + (gstPercentage / 100))).toFixed(2));
    };

    const calculateTotalGst = () => {
        return products.reduce((total, product) => {
            const gstAmount = calculateGstAmount(product.price, product.productDetails.gst);
            return total + (gstAmount * product.quantity);
        }, 0);
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold text-primary">Order Summary</h5>
                    {products?.length > 0 && (
                        <span className="badge bg-primary rounded-pill">
                            {products?.length} {products?.length === 1 ? 'Item' : 'Items'}
                        </span>
                    )}
                </div>

                {products?.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3">Your cart is empty</p>
                        <p className="text-muted">Add products to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="row g-4">
                            {products.map((product, index) => {
                                const details = product?.productDetails;
                                const imageUrl = details.images?.[0]?.url || 'https://via.placeholder.com/150';

                                return (
                                    <div className="col-xl-3 col-lg-4 col-md-6 col-12" key={index}>
                                        <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all" style={{ borderRadius: '12px' }}>
                                            <div className="position-relative">
                                                <div className="ratio ratio-1x1 bg-light" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                                    <img
                                                        src={imageUrl}
                                                        className="p-3"
                                                        style={{
                                                            objectFit: 'contain',
                                                            borderRadius: '12px 12px 0 0'
                                                        }}
                                                        alt={details.name}
                                                    />
                                                </div>
                                                {product?.quantity > 1 && (
                                                    <span className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 rounded-end">
                                                        ×{product?.quantity}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="card-body p-3">
                                                <h6 className="card-title fw-semibold mb-2 text-truncate" title={details?.name}>
                                                    {details?.name} 
                                                </h6>
                                                <div className="product-details" style={{ fontSize: '0.85rem' }}>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-muted">Brand:</span>
                                                        <span className="fw-medium">{details?.companyName}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-muted">Category:</span>
                                                        <span className="fw-medium">{details?.categoryName}</span>
                                                    </div>
                                                    {details?.hsnNo && (
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted">HSN:</span>
                                                            <span className="fw-medium">{details?.hsnNo}</span>
                                                        </div>
                                                    )}
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-muted">Unit:</span>
                                                        <span className="fw-medium">{details?.unitName}</span>
                                                    </div>
                                                   
                                                    {details?.customerPrice && (
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted">MRP:</span>
                                                            <span className="fw-medium" style={{ textDecoration: 'line-through' }}>
                                                                ₹{details?.customerPrice?.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {details.gst > 0 && (
                                                        <>
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span className="text-muted">GST ({details.gst}%):</span>
                                                                <span className="fw-medium">₹{calculateGstAmount(product?.price, details.gst)}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span className="text-muted">Price (incl. GST):</span>
                                                                <span className="fw-medium">₹{product?.price?.toLocaleString()}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="mt-3 pt-3 border-top">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="text-muted fw-medium">Total:</span>
                                                            <span className="fw-bold text-primary">
                                                                ₹{(product.price * product.quantity).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <label className="form-label small">Remarks</label>
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            rows="2"
                                                            value={product?.poRemarks || ''}
                                                            onChange={(e) => onRemarkChange(index, e.target.value)}
                                                            placeholder="Any special instructions..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="text-muted">Taxable Amount(₹):</span>
                                            <span className="fw-bold">₹{
                                                products.reduce((total, product) => {
                                                    const basePrice = calculateBasePrice(product.price, product.productDetails.gst);
                                                    return total + (basePrice * product.quantity);
                                                }, 0).toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="text-muted">Total GST(₹):</span>
                                            <span className="fw-bold">₹{calculateTotalGst().toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                            <span className="text-dark fw-bold">Net Amount(₹):</span>
                                            <span className="text-primary fw-bold">
                                                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default DeCartProList