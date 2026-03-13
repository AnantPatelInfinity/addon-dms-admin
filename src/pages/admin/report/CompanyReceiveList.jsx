import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import { getModuleKey } from '../../../config/DataFile';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import TableFilter from '../../../components/TableFilter/TableFilter';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import moment from 'moment';
import DateTime from '../../../helpers/DateFormat/DateTime';
import SerCompanyFilter from '../../../components/Admin/Report/SerCompanyFilter';
import { useNavigate } from 'react-router';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';

const CompanyReceiveList = () => {
  const navigate = useNavigate();
  const { post, get } = useApi();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [filters, setFilters] = useState({
    dealerId: "",
    companyId: "",
    customerId: ""
  });
  const adminStorage = getAdminStorage();
  const [dropdowns, setDropdowns] = useState({
    dealerData: [],
    companyData: [],
    customerData: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const columnsConfig = [
    { key: "complainNo", label: "Complaint No" },
    { key: "customerName", label: "Customer Name" },
    { key: "companyName", label: "Company" },
    { key: "companySerialNo", label: "Serial No" },
    { key: "serviceDate", label: "Service Date" },
    {
      key: "daysPending",
      label: "Days Pending",
      format: (days) => `${days} day${days !== 1 ? 's' : ''}`
    },
    {
      key: "companyAdminDisaptchTime",
      label: "Dispatch Date",
      format: (date) => moment(date).format('DD/MM/YYYY')
    },
    // { key: "status", label: "Status" },
  ];

  const moduleKey = getModuleKey();

  const getDefaultVisibleColumns = () => {
    const saved = localStorage.getItem(`columns-${moduleKey}`);
    if (saved) return JSON.parse(saved);
    const defaultState = {};
    columnsConfig.forEach(col => defaultState[col.key] = true);
    return defaultState;
  };
  const [visibleColumns, setVisibleColumns] = useState(getDefaultVisibleColumns());

  useEffect(() => {
    getPendingCompanyServices();
  }, [currentPage, limit, search, daysFilter, filters]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const firmId = adminStorage.DX_AD_FIRM;
      const [dealerRes, companyRes, customerRes] = await Promise.all([
        get(`/admin/get-dealer?firmId=${firmId}`),
        get(`/admin/get-company?firmId=${firmId}&status=2`),
        get(`/admin/get-customer?firmId=${firmId}&status=2`),
      ]);
      setDropdowns(prev => ({
        ...prev,
        dealerData: dealerRes?.data.map(dealer => ({ value: dealer._id, label: dealer.name })),
        companyData: companyRes?.data.map(company => ({ value: company._id, label: company.name })),
        customerData: customerRes?.data.map(customer => ({
          value: customer._id,
          label: `${customer.title} ${customer.name} ${customer.lastName}${customer.clinicName ? ` (${customer.clinicName})` : ''}`
        })),
      }));
    } catch (error) {
      console.log(error, 'fetchDropdowns:')
    }
  }

  const getPendingCompanyServices = async () => {
    try {
      setLoading(true);
      const response = await post(`/admin/company-receive-report`, {
        page: currentPage,
        limit,
        search,
        days: daysFilter,
        firmId: adminStorage.DX_AD_FIRM,
        ...filters
      });

      const { data, success } = response;
      if (success) {
        setServices(data.services);
        setTotalItems(data.pagination.totalItems);
      }
    } catch (error) {
      console.log(error, 'getServiceHistory:')
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  }

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setDaysFilter("");
    setFilters({
      dealerId: "",
      companyId: "",
      customerId: ""
    });
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Pending Company Receive Services"}
          count={totalItems}
          handleRefresh={handleRefresh}
        />

        <div className="card shadow-sm">
          <div className="card-header">
            <div className="row align-items-center g-3">
              <div className="col-lg-4 col-md-6">
                <div className="search-wrapper">
                  <div className="icon-form">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <Search
                      value={search}
                      onSearch={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by complaint no..."
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-8 col-md-6">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="filters-header">
                    <label className="form-label small text-muted mb-0"></label>
                    {(daysFilter || filters.dealerId || filters.companyId || filters.customerId) && (
                      <span className="badge bg-primary ms-2">
                        {[daysFilter, filters.dealerId, filters.companyId, filters.customerId].filter(Boolean).length} active
                      </span>
                    )}
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleRefresh}
                      >
                        <i className="ti ti-refresh me-1"></i>
                        Clear All
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <i className={`ti ti-filter me-1 ${showFilters ? 'ti-filter-minus' : 'ti-filter-plus'}`}></i>
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <SerCompanyFilter
              showFilters={showFilters}
              filters={filters}
              dropdowns={dropdowns}
              handleFilterChange={handleFilterChange}
              daysFilter={daysFilter}
              setDaysFilter={setDaysFilter}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {loading ? <LoadingSpinner text='' size='md' />
            : (
              <div className="card-body">
                <TableFilter
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  columnsConfig={columnsConfig}
                  moduleKey={moduleKey}
                />
                <div className="custom-table table-responsive">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th>Sr.</th>
                        {columnsConfig.map(col => visibleColumns[col.key] && <th key={col.key} className="text-nowrap"> {col.label}  </th>)}
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.length > 0 ? (
                        services.map((service, index) => (
                          <tr key={service._id}>
                            <td> {(currentPage - 1) * limit + index + 1} </td>
                            {visibleColumns.complainNo && (
                              <td> <span className="badge bg-primary">{service.complainNo}</span>   </td>
                            )}
                            {visibleColumns.customerName && <td>{`${service.customerTitle || ''} ${service.customerName || ''} ${service.customerLastName || ''}`}</td>}
                            {visibleColumns.companyName && <td>{service.companyName}</td>}
                            {visibleColumns.companySerialNo && <td>{service.companySerialNo}</td>}
                            {visibleColumns.serviceDate && <td><DateTime value={service.serviceDate} format='date' /></td>}
                            {visibleColumns.daysPending && (
                              <td>
                                <span className={`badge ${service.daysPending > 30 ? 'bg-danger' : service.daysPending > 15 ? 'bg-warning' : 'bg-success'}`}>
                                  {service.daysPending} day{service.daysPending !== 1 ? 's' : ''}
                                </span>
                              </td>
                            )}
                            {visibleColumns.companyAdminDisaptchTime && <td><DateTime value={service.companyAdminDisaptchTime} format='dateTime' /></td>}
                            <td style={{ textAlign: "end" }}>
                              <button type='button' className='btn btn-sm btn-outline-primary' onClick={() => navigate(ADMIN_URLS.VIEW_SERVICE, { state: service?._id })}>
                                <i className="ti ti-eye text-indigo me-1" /> View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={Object.keys(visibleColumns).filter(key => visibleColumns[key]).length + 2}
                            className="text-center py-5"
                          >
                            <div className="text-muted">
                              <i className="ti ti-database-off fs-3 mb-2 d-block"></i>
                              No pending services found
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row align-items-center mt-3 pt-3 border-top">
                  <div className="col-md-6">
                    <div className="datatable-length">
                      <div className="dataTables_length">
                        <label className="d-flex align-items-center gap-2">
                          <span>Show</span>
                          <DropDown
                            limit={limit}
                            onLimitChange={(val) => {
                              setLimit(val);
                              setCurrentPage(1);
                            }}
                          />
                          <span>entries</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex justify-content-end">
                    <Pagination
                      total={totalItems}
                      itemsPerPage={limit}
                      currentPage={currentPage}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default CompanyReceiveList