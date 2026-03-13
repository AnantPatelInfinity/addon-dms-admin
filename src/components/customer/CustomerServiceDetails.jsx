import React, { useState } from 'react';
import WarrantyStatusChecker from '../Admin/Service/WarrantyCheck/WarrantyCheck';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CustomerServiceDetails = ({ service }) => {
    const { poSerialNo } = useSelector((state) => state?.customerPoItems);
    const { installationList } = useSelector((state) => state?.customerInstallation);
    const { amcList } = useSelector((state) => state?.customerAmc);

    const [activeTab, setActiveTab] = useState('product');

    const getSelectedProductDetails = () => {
        if (!service?.serialNoId || !poSerialNo) return null;
        return poSerialNo.find(
            product => product._id === service.serialNoId
        );
    };

    const getSelectedInstallationDetails = () => {
        if (!service?.serialNoId || !installationList) return null;
        return installationList.find(
            installation => installation.serialNoId === service.serialNoId
        );
    };

    const selectedProductDetails = getSelectedProductDetails();
    const selectedInstallationDetails = getSelectedInstallationDetails();

    if (!service?.serialNoId || (!selectedProductDetails && !selectedInstallationDetails)) {
        return null;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-light border-0">
                <div className="d-block d-md-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-dark fw-bold">
                        <i className="fas fa-info-circle me-2 text-primary"></i>Product & Warranty Information
                    </h5>

                    <div className="d-block d-md-none mt-3">
                        <select
                            className="form-select form-select-sm"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                        >
                            {selectedProductDetails && (
                                <option value="product">
                                    ⚙️ Product Details
                                </option>
                            )}
                            <option value="warranty">
                                🛡️ Warranty/AMC Status
                            </option>
                        </select>
                    </div>

                    <ul className="nav nav-pills nav-sm d-none d-md-flex flex-nowrap" role="tablist">
                        {selectedProductDetails && (
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link px-3 py-1 ${activeTab === 'product' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('product')}
                                >
                                    <i className="fas fa-cog me-1"></i>Product
                                </button>
                            </li>
                        )}
                        <li className="nav-item">
                            <button
                                type="button"
                                className={`nav-link px-3 py-1 ${activeTab === 'warranty' ? 'active' : ''}`}
                                onClick={() => setActiveTab('warranty')}
                            >
                                <i className="fas fa-shield-alt me-1"></i>Warranty/AMC
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="card-body p-0">
                {/* Product Details Tab */}
                {activeTab === 'product' && selectedProductDetails && (
                    <div className="p-4">
                        <div className="row g-4">
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
                                                <div className="fw-bold">{selectedProductDetails.companyName || '-'}</div>
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
                                                <div className="fw-bold">{selectedProductDetails.hsnNo || '-'}</div>
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
                                                <div className="fw-bold">{selectedProductDetails.poNo || '-'}</div>
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
                                                    {selectedProductDetails.companyInvoiceDate ? moment(selectedProductDetails.companyInvoiceDate).format("DD-MM-YYYY") : "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Warranty/AMC Tab */}
                {activeTab === 'warranty' && (
                    <div className="p-4">
                        <WarrantyStatusChecker
                            installationData={selectedInstallationDetails}
                            amcData={amcList}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerServiceDetails;
