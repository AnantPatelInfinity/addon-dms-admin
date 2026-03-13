import React from 'react'
import { activeOptionalFields } from '../../../../config/DataFile';

const PoItems = ({ items, proObj }) => {

    const showSerialColumn = proObj?.companyInvoice;
    const activeFields = activeOptionalFields(items)    

    const firstColspan = (showSerialColumn ? 3 : 2) + activeFields.length + 1;
    const secondColspan = 5;

    return (
        <div className="card mb-4">
            <div className="card-header bg-light">
                <h5 className="card-title mb-0">Items</h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="">
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                {proObj?.companyInvoice && (
                                    <th>Machine Serial No.</th>
                                )}
                                {activeFields.map(field => (
                                    <th key={field.key}>{field.label}</th>
                                ))}

                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Rate (₹)</th>
                                <th>Discount</th>
                                <th>Taxable Amount (₹)</th>
                                <th>GST %</th>
                                <th>GST Amount (₹)</th>
                                <th>Total (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    {/* <td>{item.productName}</td> */}
                                    <td>
                                        <div>{item.productName || 'N/A'}</div>
                                        {item.poAutoRemarks && (
                                            <div className="text-muted small fst-italic">
                                                {item.poAutoRemarks.length > 80
                                                    ? `${item.poAutoRemarks.slice(0, 80)}...`
                                                    : item.poAutoRemarks}
                                            </div>
                                        )}
                                        {item.poRemarks && (
                                            <div className="text-muted small fst-italic">
                                                {item.poRemarks}
                                            </div>
                                        )}
                                    </td>
                                    {proObj?.companyInvoice && (
                                        <td className='text-primary'>{item.companySerialNo}</td>
                                    )}

                                     {/* option fields */}
                                     {activeFields.map(data => {
                                        const value = item?.[data.key];
                                        let displayValue = '-';

                                        if (data.isArray) {
                                            displayValue =
                                                Array.isArray(value) && value.length > 0
                                                    ? value.join(', ')
                                                    : '-';
                                        } else if (value) {
                                            displayValue = value;
                                        }

                                        return <td key={data.key}>{displayValue}</td>;
                                    })}
                                   
                                    <td>{item.categoryName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.rate?.toLocaleString('en-IN')}</td>
                                    <td>
                                        {item.discount ? `${item.discount}% (₹${item.discountAmount?.toLocaleString('en-IN')})` : 'N/A'}
                                    </td>
                                    <td>{item.taxableAmount?.toLocaleString('en-IN')}</td>
                                    <td>{item.gst || 0}%</td>
                                    <td>{item.gstAmount?.toLocaleString('en-IN')}</td>
                                    <td>{item.totalAmount?.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="">
                                <td colSpan={firstColspan} className="text-end"><strong>Total</strong></td>
                                <td><strong>{proObj?.totalQuantity}</strong></td>
                                <td colSpan={secondColspan} className="text-end"><strong>Grand Total</strong></td>
                                <td><strong>₹{proObj?.totalAmount?.toLocaleString('en-IN')}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PoItems