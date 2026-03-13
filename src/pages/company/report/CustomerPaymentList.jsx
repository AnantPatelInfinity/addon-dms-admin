import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getModuleKey } from '../../../config/DataFile';
import { getComCustomer } from '../../../middleware/companyUser/comCustomer/comCustomer';
import { getCustomerPaymentList } from '../../../middleware/companyUser/comSerReport/comSerReport';
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import DateTime from '../../../helpers/DateFormat/DateTime';
import TableFilter from '../../../components/TableFilter/TableFilter';
import SerCompanyFilter from '../../../components/Admin/Report/SerCompanyFilter';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

const CustomerPaymentList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const companyStorage = getCompanyStorage();
  const [search, setSearch] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [filters, setFilters] = useState({
    customerId: "",
  });
  const [dropdowns, setDropdowns] = useState({
    customerData: [],
  });

  const columnsConfig = [
    { key: "complainNo", label: "Complaint No" },
    { key: "customerName", label: "Customer Name" },
    { key: "customerPhone", label: "Customer Phone" },
    { key: "companyName", label: "Company" },
    { key: "companySerialNo", label: "Serial No" },
    { key: "serviceDate", label: "Service Date" },
    { key: "engineerName", label: "Engineer" },
    // { key: "dealerName", label: "Dealer" },
    {
      key: "pendingDays",
      label: "Days Pending",
      format: (days) => `${days} day${days !== 1 ? 's' : ''}`
    },
    {
      key: "createdAt",
      label: "Created At",
      format: (date) => moment(date).format('DD/MM/YYYY')
    },
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

  const { customerList } = useSelector((state) => state?.comCustomer);
  const { customerPaymentList, customerPaymentListLoading } = useSelector((state) => state?.comSerReport);

  useEffect(() => {
    if (customerPaymentList) {
      setServices(customerPaymentList?.services || []);
      setTotalItems(customerPaymentList?.pagination?.totalItems || 0);
    }
  }, [customerPaymentList]);

  useEffect(() => {
    getPendingCustomerPayment();
  }, [currentPage, limit, search, daysFilter, filters]);

  useEffect(() => {
    dispatch(getComCustomer());
  }, []);

  useEffect(() => {
    setDropdowns(prev => ({
      ...prev,
      customerData: customerList?.map(customer => ({ value: customer._id, label: `${customer.title} ${customer.name} ${customer.lastName} ${customer.clinicName ? `(${customer.clinicName})` : ''}` })),
    }))
  }, [customerList]);

  const getPendingCustomerPayment = async () => {
    const payload = {
      page: currentPage,
      limit,
      search,
      days: daysFilter,
      firmId: companyStorage.firmId,
      companyId: companyStorage.comId,
      ...filters
    }
    dispatch(getCustomerPaymentList(payload))
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
      customerId: ""
    });
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Pending Customer Payment Services"}
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
              isDealer={true}
              isCompany={true}
            />
          </div>

          {customerPaymentListLoading ? <LoadingSpinner text='' size='md' />
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
                            {visibleColumns.customerName && (
                              <td>{`${service.customerTitle || ''} ${service.customerName || ''} ${service.customerLastName || ''}`}</td>
                            )}
                            {visibleColumns.customerPhone && <td>{service.customerPhone}</td>}
                            {visibleColumns.companyName && <td>{service.companyName}</td>}
                            {visibleColumns.companySerialNo && <td>{service.companySerialNo}</td>}
                            {visibleColumns.serviceDate && <td><DateTime value={service.serviceDate} format='date' /></td>}
                            {visibleColumns.engineerName && <td>{service.engineerName}</td>}
                            {/* {visibleColumns.dealerName && <td>{service.dealerName}</td>} */}
                            {visibleColumns.pendingDays && (
                              <td>
                                <span className={`badge ${service.pendingDays > 30 ? 'bg-danger' : service.pendingDays > 15 ? 'bg-warning' : 'bg-success'}`}>
                                  {service.pendingDays} day{service.pendingDays !== 1 ? 's' : ''}
                                </span>
                              </td>
                            )}
                            {visibleColumns.createdAt && <td><DateTime value={service.createdAt} format='dateTime' /></td>}

                            <td style={{ textAlign: "end" }}>
                              <button type='button' className='btn btn-sm btn-outline-primary' onClick={() => navigate(COMPANY_URLS.VIEW_SERVICE, { state: service?._id })}>
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

export default CustomerPaymentList