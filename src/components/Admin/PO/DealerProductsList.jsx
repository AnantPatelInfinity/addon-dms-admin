import React from 'react'

const DealerProductsList = ({ dealerProducts }) => {

    return (
        <div className="card">
            <div className="card-header"><h4 className="page-title">Dealer Products List</h4></div>
            <div className="card-body">
                <div className="custom-table table-responsive">
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Sr.</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Company</th>
                                <th>Qty</th>
                                {/* <th>Rate (₹)</th>
                                <th>Amt. (₹)</th>
                                <th>Total (₹)</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {dealerProducts && dealerProducts.length > 0 ? (
                                dealerProducts.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.hsnNo}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.quantity}</td>
                                        {/* <td>{item.rate?.toFixed(2)}</td>
                                        <td>{item.amount?.toFixed(2)}</td>
                                        <td>{item.totalAmount?.toFixed(2)}</td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="16" className="text-center">No products available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DealerProductsList