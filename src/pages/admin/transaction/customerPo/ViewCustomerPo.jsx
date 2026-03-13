import React, { useEffect, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { useNavigate, useParams } from 'react-router';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import BreadCrumbs from '../../../../components/BreadCrumb/BreadCrumbs';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import { getStatusBadge } from '../../../../config/setup';
import DateTime from '../../../../helpers/DateFormat/DateTime';
import Swal from 'sweetalert2';

const ViewCustomerPo = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const [proObj, setProObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const adminStorage = getAdminStorage();

  useEffect(() => {
    if (loading === true) {
      getPoData();
    }
  }, [loading])

  const getPoData = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      const url = `/admin/get-customer-po/${id}`;
      const response = await post(url, formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      const { data, success, message } = response;
      if (success) {
        if (data) {
          setProObj(data);
        } else {
          setError("Purchase Order not found");
        }
      } else {
        setError(message || "Failed to fetch PO data");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching PO data");
    } finally {
      setLoading(false);
    }
  }

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

  const [isDownload, setDownload] = useState(false);

  const handleDownload = async () => {
    try {
      setDownload(true);
      const response = await get(`/admin/download-customer-po/${id}`);
      const { data, message, success } = response
      if (success) {
        window.open(data?.file, '_blank');
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error, "Error")
      toast.error(error?.response?.data?.message || "Something went wrong while downloading the file. Please try again later.");
    } finally {
      setDownload(false);
    }
  }

  const handleStatusUpdate = async (po, status) => {
    const statusTextMap = {
      1: 'set to Pending',
      2: 'Approve',
      3: 'Reject'
    };
    const statusText = statusTextMap[status];

    let rejectReason = "";

    if (status === 3) {
      const { value: reason } = await Swal.fire({
        title: 'Reject Reason',
        input: 'textarea',
        inputLabel: 'Please provide a reason for rejection:',
        inputPlaceholder: 'Enter rejection reason here...',
        inputAttributes: {
          'aria-label': 'Rejection reason'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'You must provide a reason!';
          }
        }
      });

      if (!reason) return;
      rejectReason = reason;
    }

    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${statusText} this PO?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${statusText}`,
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        const formData = {
          status: status,
          rejectReason: status === 3 ? rejectReason : null
        };

        const response = await post(`/admin/approve-customer-po/${po._id}`, formData);

        if (response.success) {
          Swal.fire("Success", `PO ${statusText} successfully!`, "success");
          setLoading(true);
        } else {
          Swal.fire("Error", response.message || "Something went wrong.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while updating status.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Purchase Order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <div className="col-md-12">
          <BreadCrumbs
            crumbs={[
              { label: "Customer PO List", to: ADMIN_URLS.CUSTOMER_PO_LIST },
              { label: `View Customer PO Details` },
            ]}
          />
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(ADMIN_URLS.CUSTOMER_PO_LIST)}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!proObj) {
    return (
      <div className="row">
        <div className="col-md-12">
          <BreadCrumbs
            crumbs={[
              { label: "Customer PO List", to: ADMIN_URLS.CUSTOMER_PO_LIST },
              { label: `View Customer PO Details` },
            ]}
          />
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            No Purchase Order data available
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(ADMIN_URLS.CUSTOMER_PO_LIST)}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Customer PO List", to: ADMIN_URLS.CUSTOMER_PO_LIST },
            { label: `View Customer PO Details` },
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
                <span className="badge bg-success me-2">PO No: {proObj?.voucherNo || 'N/A'}</span>
                {getStatusBadge(parseInt(proObj?.status))}
              </div>
            </div>
          </div>

          <div className="card-body">
            

            {proObj.customerId && (
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h5>Customer Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="mb-1"><strong>Name:</strong> {proObj.customerName || 'N/A'}</p>
                        </div>
                        <div className="col-md-4">
                          <p className="mb-1"><strong>Email:</strong> {proObj.customerEmail || 'N/A'}</p>
                        </div>
                        <div className="col-md-4">
                          <p className="mb-1"><strong>Phone:</strong> {proObj.customerPhone || 'N/A'}</p>
                        </div>
                      </div>
                      {proObj.customerAddress && (
                        <div className="row mt-2">
                          <div className="col-md-12">
                            <p className="mb-1"><strong>Address:</strong> {proObj.customerAddress}</p>
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
                    <h5>Dealer Details</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-1"><strong>{proObj.dealerName || 'N/A'}</strong></p>
                    <p className="mb-1">Email: {proObj.dealerEmail || 'N/A'}</p>
                    <p className="mb-1">Phone: {proObj.dealerPhone || 'N/A'}</p>
                  </div>
                </div>
              </div> */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5>Firm Details</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-1"><strong>{proObj.firmName || 'N/A'}</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              {/* <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5>Bill To</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-1"><strong>{proObj.billTo?.mailName || 'N/A'}</strong></p>
                    <p className="mb-1">{proObj.billTo?.address || 'N/A'}</p>
                    <p className="mb-1">{proObj.billTo?.city || ''}, {proObj.billTo?.state || ''}, {proObj.billTo?.pincode || ''}</p>
                    <p className="mb-1">{proObj.billTo?.country || ''}</p>
                    <p className="mb-0">GST: {proObj.billTo?.gstNo || 'N/A'}</p>
                  </div>
                </div>
              </div> */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5>Ship To</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-1"><strong>{proObj.shipTo?.mailName || 'N/A'}</strong></p>
                    <p className="mb-1">{proObj.shipTo?.address || 'N/A'}</p>
                    <p className="mb-1">{proObj.shipTo?.pincode || ''}, {proObj.shipTo?.state || ''}, {proObj.shipTo?.country || ''}</p>
                    <p className="mb-0">GST: {proObj.shipTo?.gstNo || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-4">
                <p><strong>PO Date:</strong> <DateTime value={proObj.poDate} format='date' /></p>
              </div>
              <div className="col-md-4">
                <p><strong>Expected Delivery Date:</strong> <DateTime value={proObj.expectedDeliveryDate} format='date' /> </p>
              </div>
              <div className="col-md-4">
                <p><strong>Dispatch Company:</strong> {proObj.dispatchCompanyName || 'N/A'}</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5>Terms of Delivery</h5>
                  </div>
                  <div className="card-body">
                    <p>{proObj.termsOfDelivery || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5> Mode/Terms of Payment</h5>
                  </div>
                  <div className="card-body">
                    <p>{proObj.termsOfPayment || 'N/A'}</p>
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
                    <th>Quantity</th>
                    <th>Gst(%)</th>
                    <th>Rate(₹)</th>
                    <th>Amount(₹)</th>
                    <th>GST Amount (₹)</th>
                    <th>Total Amount(₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {proObj?.products?.length > 0 ? (
                    proObj?.products?.map((product, index) => {
                      const { baseAmount, gstAmount } = calculateGstBreakdown(product.totalAmount, product.gst);
                      const baseRate = baseAmount / product.quantity;

                      return (
                        <tr key={product._id || index}>
                          <td>{index + 1}</td>
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
                        {formatCurrency(proObj.totalAmount)}
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
                    <p><strong>Total Quantity:</strong> {proObj.totalQuantity || '0'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center w-100">
              {/* Left side buttons */}
              <div className="d-flex gap-2">
                {proObj?.status !== 1 && (
                  <button
                    className="btn btn-outline-warning"
                    type="button"
                    onClick={() => handleStatusUpdate(proObj, 1)}
                  >
                    <i className="fe fe-check-circle text-warning" /> Pending
                  </button>
                )}
                {proObj?.status !== 2 && (
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={() => handleStatusUpdate(proObj, 2)}
                  >
                    <i className="fe fe-check-circle text-success" /> Approve
                  </button>
                )}
                {proObj?.status !== 3 && (
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={() => handleStatusUpdate(proObj, 3)}
                  >
                    <i className="fa-solid fa-xmark text-danger" /> Rejected
                  </button>
                )}

                <button className="btn btn-outline-primary" type="button" onClick={handleDownload}>
                  {isDownload ? (
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
              </div>
              <div>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                  <i className="fas fa-arrow-left me-2"></i> Back to PO List
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ViewCustomerPo