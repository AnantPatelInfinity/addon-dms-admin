import React from 'react'
import DateTime from '../../../helpers/DateFormat/DateTime'

const ViewFormData = ({ comOneService, isDealer = false, isCustomer = false }) => {
    return (
        <>
            {comOneService?.companyAction?.description && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-building me-2"></i>
                            Company Action
                        </h5>
                    </div> 
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Description:</strong>
                                    <div className="p-3 bg-light rounded border-start border-primary border-4">
                                        <p className="mb-0">{comOneService.companyAction.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Action Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService.companyAction.time} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Courier Admin Dispatch Section */}
            {comOneService?.courierAdminDispatch?.dispatchPdf && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-shipping-fast me-2"></i>
                            Courier Admin Dispatch
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Dispatch PDF:</strong>
                                    <div className="mt-2">
                                        <a
                                            href={comOneService.courierAdminDispatch.dispatchPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="fas fa-file-pdf me-2"></i>
                                            View Dispatch PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {comOneService?.courierAdminDispatch?.description && (
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Description:</strong>
                                        <div className="p-3 bg-light rounded border-start border-primary border-4">
                                            <p className="mb-0">{comOneService?.courierAdminDispatch?.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Dispatch Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService.courierAdminDispatch.time} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Company Receive Details Section */}
            {comOneService?.companyReceiveDetails?.time && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-check-circle me-2"></i>
                            Company Receive Details
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Receive Status:</strong>
                                    <span className={`badge ${comOneService.companyReceiveDetails.isReceive === 2 ? 'bg-success' : 'bg-warning'}`}>
                                        {comOneService.companyReceiveDetails.isReceive === 2 ? 'Received' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            {
                                comOneService?.companyReceiveDetails?.isReceive === 2 && (
                                    <div className="col-12">
                                        <div className="pb-3">
                                            <strong className="text-muted d-block mb-1">Receive Time:</strong>
                                            <span className="text-dark">
                                                <DateTime value={comOneService.companyReceiveDetails.time} format='dateTime' />
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Service Estimate Section */}
            {comOneService?.serviceEstimate?.warrantyType !== null && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-calculator me-2"></i>
                            Service Estimate
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="d-flex align-items-center  mb-3">
                            <i className="fas fa-tools me-2 text-primary"></i>
                            <h5 className="text-primary">
                                {comOneService?.isParts === true ? "Parts Details" : "Full Product"}
                            </h5>
                        </div>
                        {comOneService?.isParts === true && comOneService?.serviceParts?.length > 0 && (
                            <div className="table-responsive mb-4">
                                <table className="table table-bordered align-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Part Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comOneService?.serviceParts?.map((part, index) => (
                                            <tr key={part._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{part.name || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="row g-3">
                            {comOneService.serviceEstimate.description && (
                                <div className="col-12">
                                    <div className="border-bottom pb-2 mb-2">
                                        <strong className="text-muted d-block mb-1">Description:</strong>
                                        <div className="p-3 bg-light rounded border-start border-primary border-4">
                                            <p className="mb-0">{comOneService.serviceEstimate.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row g-3 border-bottom pb-3 mb-3">
                                {comOneService.serviceEstimate.warrantyType === 2 && isDealer && (
                                    <div className="col-md-6">
                                        <strong className="text-muted d-block mb-1">Amount:</strong>
                                        <span className="text-success fw-bold">
                                            ₹{comOneService?.serviceEstimate?.dealerAmount || 0}
                                        </span>
                                    </div>
                                )}
                                {comOneService.serviceEstimate.warrantyType === 2 && isCustomer && (
                                    <div className="col-md-6">
                                        <strong className="text-muted d-block mb-1">Amount:</strong>
                                        <span className="text-success fw-bold">
                                            ₹{comOneService?.serviceEstimate?.customerAmount || 0}
                                        </span>
                                    </div>
                                )}
                                {comOneService.serviceEstimate.warrantyType === 2 && !isDealer && !isCustomer && (
                                    <>
                                        <div className="col-md-6">
                                            <strong className="text-muted d-block mb-1">Dealer Amount:</strong>
                                            <span className="text-success fw-bold">
                                                ₹{comOneService?.serviceEstimate?.dealerAmount || 0}
                                            </span>
                                        </div>
                                        <div className="col-md-6">
                                            <strong className="text-muted d-block mb-1">Customer Amount:</strong>
                                            <span className="text-success fw-bold">
                                                ₹{comOneService?.serviceEstimate?.customerAmount || 0}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {(comOneService.serviceEstimate.warrantyType !== 2 && comOneService?.serviceEstimate?.pdf) && (
                                    <div className="col-md-6">
                                        <strong className="text-muted d-block mb-1">Estimate PDF:</strong>
                                        <div className="mt-2">
                                            <a
                                                href={comOneService.serviceEstimate.pdf}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                <i className="fas fa-file-pdf me-2"></i>
                                                View Estimate PDF
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Warranty Type:</strong>
                                    <span className="text-success fw-bold">
                                        {comOneService.serviceEstimate.warrantyType === 2 ? 'Out Of Warranty' : 'Under Warranty'}
                                    </span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Estimate Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService?.serviceEstimate?.time} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Approval Section */}
            {comOneService?.customerApproval?.isApprove === true && !isDealer && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-user-check me-2"></i>
                            Customer Approval
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Approval Status:</strong>
                                    <span className={`badge ${comOneService.customerApproval.isApprove ? 'bg-success' : 'bg-danger'}`}>
                                        {comOneService.customerApproval.isApprove ? 'Approved' : 'Rejected'}
                                    </span>
                                </div>
                            </div>

                            {!isDealer && !isCustomer && (
                                <>
                                    <div className="col-md-6">
                                        <div className="border-bottom pb-3 mb-3">
                                            <strong className="text-muted d-block mb-1">Approved Dealer Amount:</strong>
                                            <span className="text-success fw-bold">
                                                ₹{comOneService?.customerApproval?.dealerAmount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="border-bottom pb-3 mb-3">
                                            <strong className="text-muted d-block mb-1">Approved Customer Amount:</strong>
                                            <span className="text-success fw-bold">
                                                ₹{comOneService?.customerApproval?.customerAmount}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {isCustomer && (
                                <>
                                    <div className="col-md-6">
                                        <div className="border-bottom pb-3 mb-3">
                                            <strong className="text-muted d-block mb-1">Approved Customer Amount:</strong>
                                            <span className="text-success fw-bold">
                                                ₹{comOneService?.customerApproval?.customerAmount}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {isDealer && (
                                <>
                                    <div className="col-md-6">
                                        <div className="border-bottom pb-3 mb-3">
                                            <strong className="text-muted d-block mb-1">Approved Dealer Amount:</strong>
                                            <span className="text-success fw-bold">
                                                ₹{comOneService?.customerApproval?.dealerAmount}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {comOneService.customerApproval.pdf && (
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Approval PDF:</strong>
                                        <div className="mt-2">
                                            <a
                                                href={comOneService.customerApproval.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                <i className="fas fa-file-pdf me-2"></i>
                                                View Approval PDF
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Approval Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService.customerApproval.time} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Document Section */}
            {!isDealer && (
                <>
                    {comOneService?.paymentDocument?.pdf?.length > 0 && (
                        <div className="card shadow-sm border-0 mt-4">
                            <div className="card-header bg-light border-0">
                                <h5 className="card-title mb-0 text-primary">
                                    <i className="fas fa-credit-card me-2"></i>
                                    Payment Document
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="border-bottom pb-3 mb-3">
                                            <strong className="text-muted d-block mb-1">Payment Documents:</strong>
                                            <div className="mt-2">
                                                {comOneService.paymentDocument.pdf && comOneService.paymentDocument.pdf.length > 0 ? (
                                                    <div className="row g-2">
                                                        {comOneService.paymentDocument.pdf.map((doc, index) => (
                                                            <div key={index} className="col-auto">
                                                                <a
                                                                    href={doc}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-outline-primary btn-sm"
                                                                >
                                                                    <i className="fas fa-file-pdf me-2"></i>
                                                                    Payment Doc {index + 1}
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No payment documents available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Payment Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService.paymentDocument.time} format='dateTime' />
                                    </span>
                                </div>
                            </div> */}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Company Dispatch Section */}
            {comOneService?.companyDispatch?.pdf && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-truck me-2"></i>
                            Company Dispatch
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Dispatch PDF:</strong>
                                    <div className="mt-2">
                                        <a
                                            href={comOneService.companyDispatch.pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="fas fa-file-pdf me-2"></i>
                                            View Dispatch PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {comOneService?.companyDispatch?.description && (
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Description:</strong>
                                        <div className="p-3 bg-light rounded border-start border-primary border-4">
                                            <p className="mb-0">{comOneService.companyDispatch.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Dispatch Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService.companyDispatch.time} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Customer Receive Section */}
            {comOneService?.customerReceive?.time && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="fas fa-user-check me-2"></i>
                            Customer Receive
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Receive Status:</strong>
                                    <span className={`badge ${comOneService.customerReceive.isReceive ? 'bg-success' : 'bg-warning'}`}>
                                        {comOneService.customerReceive.isReceive ? 'Received' : 'Not Received'}
                                    </span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Receive Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService.customerReceive.time} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {comOneService?.installationDetails?.image && (
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-light border-0">
                        <h5 className="card-title mb-0 text-primary">
                            <i className="ti ti-package me-2 mt-1"></i>
                            Spares/Parts Replacement Process Details
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Engineer Name:</strong>
                                    <div className="mt-3">
                                        <span className="fw-bold">
                                            {comOneService?.installationDetails?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="border-bottom pb-3 mb-3">
                                    <strong className="text-muted d-block mb-1">Installation Image:</strong>
                                    <div className="mt-2">
                                        <a
                                            href={comOneService?.installationDetails?.image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="fas fa-file-pdf me-2"></i>
                                            View Installation PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {comOneService?.installationDetails?.description && (
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Description:</strong>
                                        <div className="p-3 bg-light rounded border-start border-primary border-4">
                                            <p className="mb-0">{comOneService?.installationDetails?.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-12">
                                <div className="pb-3">
                                    <strong className="text-muted d-block mb-1">Spares/Parts Replacement Time:</strong>
                                    <span className="text-dark">
                                        <DateTime value={comOneService?.installationDetails?.date} format='dateTime' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewFormData