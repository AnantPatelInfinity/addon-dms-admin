import React, { useEffect, useState } from 'react'
import DateTime from '../../../helpers/DateFormat/DateTime'
import useDynamicEquipmentFields  from "./DynamicEquipmentFields";

const PoData = ({
    companyOnePoList,

    companyPoItemsListError,
    companyPoItemsListLoading,

    productsData,
    setProductsData,
    hasSerialError
}) => {
    const hasItemError = (item) => {
        return hasSerialError && (
            item?.companySerialNo === undefined ||
            item?.companySerialNo === null ||
            item?.companySerialNo?.toString().trim() === ""
        );
    };

    // const serialNumberColSpan = companyOnePoList?.adminInvoice ? 1 : 0;
    // const firstColSpan = 9 + serialNumberColSpan;
    // const secondColSpan = 2;

    // --- compute dynamic columns and footer spans dynamically ---
   
    const validateStatus = [4,5,6,7].includes(companyOnePoList?.status)

    const { renderHeaders, renderRowCells } = useDynamicEquipmentFields({
        productsData,
        setProductsData,
        validateStatus,
      });

      const dynamicHeaders = renderHeaders(); 
      const dynamicColCount = Array.isArray(dynamicHeaders) ? dynamicHeaders.length : (dynamicHeaders ? 1 : 0);
  
      const staticLeftCols = 3;
      const serialCol = validateStatus ? 1 : 0; 
  
      const firstColSpan = staticLeftCols + serialCol + dynamicColCount;
      const secondColSpan = 2;
  

    return (
        <>
            <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-light-subtle">
                            <h6 className="mb-0 fw-semibold">Bill To</h6>
                        </div>
                        {/* <div className="card-body">
                            <h5 className="card-title text-primary">{companyOnePoList?.billTo?.mailName}</h5>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {companyOnePoList?.billTo?.address}
                            </p>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-globe me-2"></i>
                                {companyOnePoList?.billTo?.state}, {companyOnePoList?.billTo?.country}
                            </p>
                            {companyOnePoList?.billTo?.gstNo && (
                                <p className="card-text text-muted mb-0">
                                    <i className="fas fa-file-invoice me-2"></i>
                                    GST: {companyOnePoList?.billTo?.gstNo}
                                </p>
                            )}
                        </div> */}

                        <div className="card-body">
                            {/* <h5 className="card-title text-primary">{companyOnePoList?.companyName}</h5>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {[
                                    companyOnePoList?.companyAddress || "-",
                                    companyOnePoList?.companyAddressTwo || "",
                                    companyOnePoList?.companyAddressThree || "",
                                    companyOnePoList?.companyCity || "-",
                                    companyOnePoList?.companyPincode || "-"
                                ].join(", ")}
                            </p>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-globe me-2"></i>
                                {companyOnePoList?.companyState}, India
                            </p>
                            {companyOnePoList?.companyGstNo && (
                                <p className="card-text text-muted mb-0">
                                    <i className="fas fa-file-invoice me-2"></i>
                                    GST: {companyOnePoList?.companyGstNo}
                                </p>
                            )} */}
                            <h5 className="card-title text-primary">{companyOnePoList?.firmName}</h5>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {[
                                    companyOnePoList?.firmAddress || "-",
                                    companyOnePoList?.firmAddressThree || "",
                                    companyOnePoList?.firmAddressTwo || "",
                                    companyOnePoList?.firmCity || "-",
                                    companyOnePoList?.firmPincode || "-"
                                ].join(", ")}
                            </p>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-globe me-2"></i>
                                {companyOnePoList?.firmState}, India
                            </p>
                            {companyOnePoList?.firmGstNo && (
                                <p className="card-text text-muted mb-0">
                                    <i className="fas fa-file-invoice me-2"></i>
                                    GST: {companyOnePoList?.firmGstNo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-light-subtle">
                            <h6 className="mb-0 fw-semibold">Ship To</h6>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title text-primary">{companyOnePoList?.shipTo?.mailName}</h5>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {companyOnePoList?.shipTo?.address}
                            </p>
                            <p className="card-text text-muted mb-1">
                                <i className="fas fa-globe me-2"></i>
                                {companyOnePoList?.shipTo?.state}, {companyOnePoList?.shipTo?.country}
                            </p>
                            <p className="card-text text-muted mb-0">
                                <i className="fas fa-envelope me-2"></i>
                                {companyOnePoList?.shipTo?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PO Meta Section */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2 text-muted">PO Date</h6>
                            <h5 className="card-title">
                                <DateTime value={companyOnePoList?.poDate} format='date' />
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2 text-muted">Expected Delivery</h6>
                            <h5 className="card-title">
                                <DateTime value={companyOnePoList?.expectedDeliveryDate} format='date' />
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <h6 className="card-subtitle mb-2 text-muted">Dispatch Company</h6>
                            <h5 className="card-title">
                                {companyOnePoList?.dispatchCompanyName || 'N/A'}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold mb-0">Order Items</h5>
                    <span className="badge bg-primary">
                        {productsData?.length} items
                    </span>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Category</th>
                                {validateStatus && <th>Machine Serial No.<span className='text-primary'>*</span> </th>}

                                {/* {renderHeaders()} */}
                                {dynamicHeaders}

                                <th className="text-end">Qty</th>
                                <th className="text-end">Rate</th>
                                <th className="text-end">GST %</th>
                                <th className="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyPoItemsListLoading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <span className="ms-2">Loading items...</span>
                                    </td>
                                </tr>
                            ) : companyPoItemsListError ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-3 text-danger">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        {companyPoItemsListError}
                                    </td>
                                </tr>
                            ) : productsData?.length > 0 ? (
                                productsData?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="fw-semibold">{item.productName}</div>
                                        </td>
                                        <td>{item.categoryName}</td>
                                        {validateStatus && (
                                            <td>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm ${hasItemError(item) ? 'is-invalid' : ''}`}
                                                    value={item.companySerialNo !== null && item.companySerialNo !== undefined ? item.companySerialNo : ''}
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productsData];
                                                        updatedProducts[index] = {
                                                            ...updatedProducts[index],
                                                            companySerialNo: e.target.value
                                                        };
                                                        setProductsData(updatedProducts);
                                                    }}
                                                />
                                                {hasItemError(item) && (
                                                    <div className="invalid-feedback">
                                                        Serial number is required
                                                    </div>
                                                )}
                                            </td>
                                        )}

                                        {renderRowCells(item, index)}
                                        
                                        {/* {validateStatus &&
                                            equipmentAttributes.map((attr) => {
                                            const value = item[attr.key] || '';

                                            return (
                                            <td key={attr._id}>
                                                {attr.inputType === 'checkbox' ? (
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={!!value}
                                                    onChange={(e) => {
                                                    const updated = [...productsData];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        [attr.key]: e.target.checked,
                                                    };
                                                    setProductsData(updated);
                                                    }}
                                                />
                                                ) : attr.inputType === 'select' ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={value}
                                                    onChange={(e) => {
                                                    const updated = [...productsData];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        [attr.key]: e.target.value,
                                                    };
                                                    setProductsData(updated);
                                                    }}
                                                >
                                                    <option value="">Select {attr.label}</option>
                                                    {attr.options.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                ) : (
                                                <input
                                                    type={attr.inputType || 'text'}
                                                    className="form-control form-control-sm"
                                                    value={value}
                                                    onChange={(e) => {
                                                    const updated = [...productsData];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        [attr.key]: e.target.value,
                                                    };
                                                    setProductsData(updated);
                                                    }}
                                                />
                                                )}
                                            </td>
                                            );
                                        })}     */}

                                        {/* {validateStatus && (
                                            <td>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    value={item.dongle !== null && item.dongle !== undefined ? item.dongle : ''}
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productsData];
                                                        updatedProducts[index] = {
                                                            ...updatedProducts[index],
                                                            dongle: e.target.value
                                                        };
                                                        setProductsData(updatedProducts);
                                                    }}
                                                />
                                                
                                            </td>
                                        )}
                                        {validateStatus && (
                                            <td>
                                                <div className="d-flex flex-column gap-1">
                                                {[0, 1].map((i) => (
                                                    <input
                                                    key={i}
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={
                                                        Array.isArray(item.batterySNo)
                                                        ? (item.batterySNo[i] || '')
                                                        : (i === 0 ? item.batterySNo || '' : '')
                                                    }
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productsData];
                                                        const serials = Array.isArray(updatedProducts[index].batterySNo)
                                                        ? [...updatedProducts[index].batterySNo]
                                                        : [updatedProducts[index].batterySNo || '', ''];

                                                        serials[i] = e.target.value.trim();
                                                        updatedProducts[index] = {
                                                        ...updatedProducts[index],
                                                        batterySNo: serials,
                                                        };
                                                        setProductsData(updatedProducts);
                                                    }}
                                                    />
                                                ))}
                                                </div>
                                            </td>
                                        )}
                                        {validateStatus && (
                                            <td>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    value={item.powerBox !== null && item.powerBox !== undefined ? item.powerBox : ''}
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productsData];
                                                        updatedProducts[index] = {
                                                            ...updatedProducts[index],
                                                            powerBox: e.target.value
                                                        };
                                                        setProductsData(updatedProducts);
                                                    }}
                                                />
                                                
                                            </td>
                                        )}
                                        {validateStatus && (
                                            <td>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    value={item.dock !== null && item.dock !== undefined ? item.dock : ''}
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productsData];
                                                        updatedProducts[index] = {
                                                            ...updatedProducts[index],
                                                            dock: e.target.value
                                                        };
                                                        setProductsData(updatedProducts);
                                                    }}
                                                />
                                                
                                            </td>
                                        )}
                                        {validateStatus && (
                                            <td>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    value={item.smps !== null && item.smps !== undefined ? item.smps : ''}
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productsData];
                                                        updatedProducts[index] = {
                                                            ...updatedProducts[index],
                                                            smps: e.target.value
                                                        };
                                                        setProductsData(updatedProducts);
                                                    }}
                                                />
                                                
                                            </td>
                                        )} */}
                                       
                                        <td className="text-end">{item.quantity}</td>
                                        <td className="text-end">₹{item.rate.toLocaleString()}</td>
                                        <td className="text-end">{item.gst || 0}%</td>
                                        <td className="text-end fw-semibold">₹{item.totalAmount.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-3 text-muted">
                                        No items found in this purchase order
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="">
                            <tr>
                                <td colSpan={firstColSpan} className="text-end fw-semibold">Total</td>
                                <td className="text-end fw-semibold">{companyOnePoList?.totalQuantity}</td>
                                <td colSpan={secondColSpan} className="text-end fw-semibold">Grand Total</td>
                                <td className="text-end fw-semibold text-primary">
                                    ₹{companyOnePoList?.totalAmount?.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    )
}

export default PoData