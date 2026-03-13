import React from 'react'
import WarrantyStatusChecker from './WarrantyCheck/WarrantyCheck'
import moment from 'moment'

const ServiceDetailsTabs = ({
    activeTab,
    customerInstallations,
    selectedProductDetails,
    selectedInstallationDetails,
    service,
    amc,
}) => {
    return (
        <>

            <div className="card-body p-0">
                {/* Customer Installation History Tab */}
                {activeTab === 'installations' && customerInstallations.length > 0 && (
                    <div className="p-4">
                        <div className="custom-table table-responsive" style={{ minHeight: "0px" }}>
                            <table className="table table-hover">
                                <thead className="">
                                    <tr>
                                        <th className="fw-semibold">Report No</th>
                                        <th className="fw-semibold">Equipment</th>
                                        <th className="fw-semibold">Model</th>
                                        <th className="fw-semibold">Serial No</th>
                                        <th className="fw-semibold">Install Date</th>
                                        <th className="fw-semibold">Engineer</th>
                                        <th className="fw-semibold">Warranty</th>
                                        {/* <th className="fw-semibold text-center">Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerInstallations?.map((installation) => (
                                        <tr key={installation._id} className={installation.serialNoId === service.serialNoId ? 'table-primary' : ''}>
                                            <td className="">
                                                <span className='fw-medium text-primary'> {installation.reportNo}</span>
                                            </td>
                                            <td>{installation.equipmentName}</td>
                                            <td>{installation.productModel}</td>
                                            <td>
                                                <span className="text-primary">{installation.productSerialNo}</span>
                                            </td>
                                            {/* <td>{new Date(installation.physicalInstallDate).toLocaleDateString()}</td> */}
                                            <td>{installation?.physicalInstallDate ? moment(installation?.physicalInstallDate).format("DD-MM-YYYY") : "-"}</td>
                                            <td>{installation.engineerName}</td>
                                            <td>
                                                <span className="badge bg-info">{installation.installWarranty}</span>
                                            </td>
                                            {/* <td className="text-center">
                                                            <span className={`badge ${installation.status === 1 ? 'bg-success' : 'bg-warning'}`}>
                                                                {installation.status === 1 ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Product Details Tab */}
                {activeTab === 'product' && selectedProductDetails && (
                    <div className="p-4">
                        <div className="row g-4">
                            {/* Product Information */}
                            <div className="col-lg-8">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-tag text-primary"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Product Name</div>
                                                <div className="fw-bold">{selectedProductDetails.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-barcode text-success"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Serial Number</div>
                                                <div className="fw-bold">{selectedProductDetails.companySerialNo}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-building text-warning"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Company</div>
                                                <div className="fw-bold">{selectedProductDetails.companyName}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-hashtag text-info"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">HSN Number</div>
                                                <div className="fw-bold">{selectedProductDetails.hsnNo}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-file-invoice text-danger"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">PO Number</div>
                                                <div className="fw-bold">{selectedProductDetails.poNo}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-calendar text-secondary"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Invoice Date</div>
                                                <div className="fw-bold">
                                                    {selectedProductDetails.companyInvoiceDate ? moment(selectedProductDetails.companyInvoiceDate).format("DD-MM-YYYY") : "N/A"}
                                                    {/* {new Date(selectedProductDetails.companyInvoiceDate).toLocaleDateString()} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Images */}
                            <div className="col-lg-4">
                                <h6 className="fw-bold mb-3">
                                    <i className="fas fa-images me-2 text-primary"></i>Product Images
                                </h6>
                                {selectedProductDetails.images && selectedProductDetails.images.length > 0 ? (
                                    <div className="row g-2">
                                        {selectedProductDetails.images.slice(0, 4).map((image, index) => (
                                            <div key={image._id} className="col-6">
                                                <div className="position-relative">
                                                    <img
                                                        src={image.url}
                                                        alt={image.originalName}
                                                        className="img-fluid rounded shadow-sm"
                                                        style={{
                                                            height: '80px',
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => window.open(image.url, '_blank')}
                                                    />
                                                    <div className="position-absolute top-0 end-0 p-1">
                                                        <span className="badge bg-dark bg-opacity-75 small">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedProductDetails.images.length > 4 && (
                                            <div className="col-12 text-center mt-2">
                                                <small className="text-muted">
                                                    +{selectedProductDetails.images.length - 4} more images
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted p-4 border-2 border-dashed rounded">
                                        <i className="fas fa-image fs-2 mb-2"></i>
                                        <div>No images available</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Installation Details Tab */}
                {activeTab === 'installation' && selectedInstallationDetails && (
                    <div className="p-4">
                        <div className="row g-4">
                            {/* Installation Info */}
                            <div className="col-lg-8">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-clipboard-list text-success"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Report Number</div>
                                                <div className="fw-bold  text-muted">{selectedInstallationDetails.reportNo}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-user-tie text-success"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Install Engineer</div>
                                                <div className="fw-bold  text-muted">{selectedInstallationDetails.engineerName}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-calendar-check text-success"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Install Date</div>
                                                <div className="fw-bold  text-muted">
                                                    {selectedInstallationDetails.physicalInstallDate ? moment(selectedInstallationDetails.physicalInstallDate).format("DD-MM-YYYY") : "-"}
                                                    {/* {new Date(selectedInstallationDetails.physicalInstallDate).toLocaleDateString()} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded">
                                            <div className="flex-shrink-0">
                                                <i className="fas fa-shield-alt text-success"></i>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-semibold text-muted small">Warranty Period</div>
                                                <div className="fw-bold text-muted">{selectedInstallationDetails.installWarranty}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Installation Remarks */}
                                {selectedInstallationDetails.engineerRemarks && (
                                    <div className="mt-4">
                                        <div className="alert alert-info border-0 shadow-sm">
                                            <div className="d-flex align-items-start">
                                                <i className="fas fa-comment-dots text-info me-3 mt-1"></i>
                                                <div>
                                                    <div className="fw-semibold mb-2">Installation Remarks</div>
                                                    <div>{selectedInstallationDetails.engineerRemarks}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Installation Images */}
                            <div className="col-lg-4">
                                <h6 className="fw-bold mb-3">
                                    <i className="fas fa-camera me-2 text-success"></i>Installation Images
                                </h6>
                                <div className="row g-3">
                                    {selectedInstallationDetails.productSerialNoImage && (
                                        <div className="col-12">
                                            <div className="card border-0 shadow-sm">
                                                <img
                                                    src={selectedInstallationDetails.productSerialNoImage}
                                                    alt="Product Serial"
                                                    className="card-img-top"
                                                    style={{
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(selectedInstallationDetails.productSerialNoImage, '_blank')}
                                                />
                                                <div className="card-body py-2 px-3">
                                                    <small className="text-muted fw-semibold">Product Serial Image</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {selectedInstallationDetails.customerSignature && (
                                        <div className="col-12">
                                            <div className="card border-0 shadow-sm">
                                                <img
                                                    src={selectedInstallationDetails.customerSignature}
                                                    alt="Customer Signature"
                                                    className="card-img-top"
                                                    style={{
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(selectedInstallationDetails.customerSignature, '_blank')}
                                                />
                                                <div className="card-body py-2 px-3">
                                                    <small className="text-muted fw-semibold">Customer Signature</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Warranty/AMC Tab */}
                {activeTab === 'warranty' && amc && (
                    <div className="p-4">
                        <WarrantyStatusChecker installationData={selectedInstallationDetails} amcData={amc} />
                    </div>
                )}
            </div>
        </>
    )
}

export default ServiceDetailsTabs