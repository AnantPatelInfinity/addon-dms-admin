import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ServiceDetailsTabs from '../../Admin/Service/ServiceDetailsTabs';

const ServiceDetails = ({
  service,
  filterSerialNo
}) => {

  const { installationList } = useSelector((state) => state?.dealerInstallation);
  const { poSerialNo } = useSelector((state) => state?.dealerPoItems);
  const { amcList } = useSelector((state) => state?.dealerAmc);
  const [activeTab, setActiveTab] = useState('installations');

  const getCustomerInstallations = () => {
    if (!service.customerId || !installationList) return [];
    return installationList?.filter(
      installation => installation.customerId === service.customerId
    );
  };

  const getSelectedInstallationDetails = () => {
    if (!service.serialNoId || !installationList) return null;
    return installationList?.find(
      installation => installation.serialNoId === service.serialNoId
    );
  };

  const getSelectedProductDetails = () => {
    if (!service.serialNoId || !poSerialNo) return null;
    return poSerialNo?.find(
      product => product._id === service.serialNoId
    );
  };

  const customerInstallations = getCustomerInstallations();
  const selectedInstallationDetails = getSelectedInstallationDetails();
  const selectedProductDetails = getSelectedProductDetails();

  return (
    <>
      {service.customerId && (filterSerialNo?.length > 0) && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light border-0">
            <div className="d-block d-md-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark fw-bold">
                <i className="fas fa-info-circle me-2 text-primary"></i>Customer & Product Information
              </h5>

              <div className="d-block d-md-none mt-3">
                <select
                  className="form-select form-select-sm"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                >
                  {customerInstallations.length > 0 && (
                    <option value="installations">
                      📋 Installations ({customerInstallations.length})
                    </option>
                  )}
                  {selectedProductDetails && (
                    <option value="product">
                      ⚙️ Product Details
                    </option>
                  )}
                  {selectedInstallationDetails && (
                    <option value="installation">
                      🔧 Installation Info
                    </option>
                  )}
                  <option value="warranty">
                    🛡️ Warranty/AMC Status
                  </option>
                </select>
              </div>

              <ul className="nav nav-pills nav-sm d-none d-md-flex flex-nowrap" role="tablist">
                {customerInstallations.length > 0 && (
                  <li className="nav-item">
                    <button
                      className={`nav-link px-3 py-1 ${activeTab === 'installations' ? 'active' : ''}`}
                      onClick={() => setActiveTab('installations')}
                    >
                      <i className="fas fa-history me-1"></i>Installations
                    </button>
                  </li>
                )}
                {selectedProductDetails && (
                  <li className="nav-item">
                    <button
                      className={`nav-link px-3 py-1 ${activeTab === 'product' ? 'active' : ''}`}
                      onClick={() => setActiveTab('product')}
                    >
                      <i className="fas fa-cog me-1"></i>Product
                    </button>
                  </li>
                )}
                {selectedInstallationDetails && (
                  <li className="nav-item">
                    <button
                      className={`nav-link px-3 py-1 ${activeTab === 'installation' ? 'active' : ''}`}
                      onClick={() => setActiveTab('installation')}
                    >
                      <i className="fas fa-wrench me-1"></i>Installation
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={`nav-link px-3 py-1 ${activeTab === 'warranty' ? 'active' : ''}`}
                    onClick={() => setActiveTab('warranty')}
                  >
                    <i className="fas fa-shield-alt me-1"></i>Warranty/AMC
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <ServiceDetailsTabs
            activeTab={activeTab}
            customerInstallations={customerInstallations}
            selectedProductDetails={selectedProductDetails}
            selectedInstallationDetails={selectedInstallationDetails}
            service={service}
            amc={amcList}
          />
        </div>
      )}
    </>
  )
}

export default ServiceDetails