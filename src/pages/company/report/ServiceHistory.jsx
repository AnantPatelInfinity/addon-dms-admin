import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  getModuleKey,
  getServiceStatusBadge,
  serviceFilter,
} from "../../../config/DataFile";
import { getCompanyStorage } from "../../../components/LocalStorage/CompanyStorage";
import { getServiceHistoryList } from "../../../middleware/companyUser/comSerReport/comSerReport";
import PageHeader from "../../../ui/admin/PageHeader";
import { getComCustomer } from "../../../middleware/companyUser/comCustomer/comCustomer";
import { getComDealerList } from "../../../middleware/companyUser/comDealer/comDealer";
import { getComSerialNo } from "../../../middleware/companyUser/comSerialNo/comSerialNo";
import { Pagination, Search } from "../../../components/Form";
import DropDown from "../../../components/Form/DropDown";
import COMPANY_URLS from "../../../config/routesFile/company.routes";
import DateTime from "../../../helpers/DateFormat/DateTime";
import TableFilter from "../../../components/TableFilter/TableFilter";
import SerHistoryFilter from "../../../components/Admin/Report/SerHistoryFilter";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const ServiceHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const companyStorage = getCompanyStorage();
  const [filters, setFilters] = useState({
    search: "",
    dealerId: "",
    customerId: "",
    serialNoId: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [dropdowns, setDropdowns] = useState({
    dealerData: [],
    customerData: [],
    serialNoData: [],
    statusData: [],
  });

  const columnsConfig = [
    { key: "complainNo", label: "Complaint No" },
    { key: "customerName", label: "Customer Name" },
    { key: "companyName", label: "Company" },
    { key: "companySerialNo", label: "Serial No" },
    { key: "engineerName", label: "Engineer" },
    { key: "serviceDate", label: "Service Date" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
  ];
  const moduleKey = getModuleKey();

  const getDefaultVisibleColumns = () => {
    const saved = localStorage.getItem(`columns-${moduleKey}`);
    if (saved) return JSON.parse(saved);
    const defaultState = {};
    columnsConfig.forEach((col) => (defaultState[col.key] = true));
    return defaultState;
  };
  const [visibleColumns, setVisibleColumns] = useState(
    getDefaultVisibleColumns()
  );

  const { historyList, historyListLoading } = useSelector(
    (state) => state?.comSerReport
  );
  const { serialNoList } = useSelector((state) => state?.comSerialNo);
  const { dealerList } = useSelector((state) => state?.comDealer);
  const { customerList } = useSelector((state) => state?.comCustomer);

  useEffect(() => {
    if (historyList) {
      setServices(historyList?.services || []);
      setTotalItems(historyList?.pagination?.totalItems || 0);
    }
  }, [historyList]);

  useEffect(() => {
    getServiceHistory();
  }, [currentPage, limit, filters]);

  useEffect(() => {
    const payload = {
      companyId: companyStorage.comId,
      firmId: companyStorage.firmId,
    };
    dispatch(getComCustomer());
    dispatch(getComSerialNo(payload));
    dispatch(getComDealerList());
  }, []);

  useEffect(() => {
    setDropdowns((prev) => ({
      ...prev,
      dealerData: dealerList?.map((dealer) => ({
        value: dealer._id,
        label: dealer.name,
      })),
      customerData: customerList?.map((customer) => ({
        value: customer._id,
        label: `${customer.title} ${customer.name} ${customer.lastName} ${
          customer.clinicName ? `(${customer.clinicName})` : ""
        }`,
      })),
      serialNoData: serialNoList?.map((serial) => ({
        value: serial._id,
        label: serial.companySerialNo,
      })),
      statusData: serviceFilter,
    }));
  }, [serialNoList, dealerList, customerList]);

  const getServiceHistory = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage.comId);
    formData.append("firmId", companyStorage.firmId);
    formData.append("page", currentPage);
    formData.append("limit", limit);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    dispatch(getServiceHistoryList(formData));
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setLimit(10);
    setFilters({
      search: "",
      customerId: "",
      dealerId: "",
      serialNoId: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      customerId: "",
      dealerId: "",
      serialNoId: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Service History List"}
          count={totalItems}
          handleRefresh={handleRefresh}
        />

        <div className="card">
          <div className="card-header">
            <div className="row align-items-center">
              <div className="col-sm-4">
                <div className="icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <Search
                    onSearch={(value) => handleFilterChange("search", value)}
                    placeholder="Search by complaint no, engineer name..."
                  />
                </div>
              </div>
              <div className="col-sm-8">
                <div className="d-flex justify-content-end align-items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearFilters}
                    >
                      <i className="ti ti-refresh me-1"></i>
                      Clear Filters
                    </button>
                  )}
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      showFilters ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i
                      className={`ti ti-filter me-1 ${
                        showFilters ? "ti-filter-minus" : "ti-filter-plus"
                      }`}
                    ></i>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                    {hasActiveFilters && (
                      <span className="badge bg-white text-primary ms-1">
                        ●
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <SerHistoryFilter
              showFilters={showFilters}
              filters={filters}
              dropdowns={dropdowns}
              handleFilterChange={handleFilterChange}
              isCompany={true}
            />
          </div>

          {historyListLoading ? (
            <LoadingSpinner text="" size="md" />
          ) : (
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
                      {columnsConfig.map(
                        (col) =>
                          visibleColumns[col.key] && (
                            <th key={col.key}>{col.label}</th>
                          )
                      )}
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={service._id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        {visibleColumns.complainNo && (
                          <td>{service.complainNo}</td>
                        )}
                        {visibleColumns.customerName && (
                          <td>{`${service.customerTitle || ""} ${
                            service.customerName || ""
                          } ${service.customerLastName || ""}`}</td>
                        )}
                        {visibleColumns.companyName && (
                          <td>{service.companyName || "-"}</td>
                        )}
                        {visibleColumns.companySerialNo && (
                          <td>{service.companySerialNo || "-"}</td>
                        )}
                        {visibleColumns.engineerName && (
                          <td>{service.engineerName || "-"}</td>
                        )}
                        {visibleColumns.serviceDate && (
                          <td>
                            <DateTime
                              value={service.serviceDate}
                              format="date"
                            />
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td>
                            {getServiceStatusBadge(
                              service?.status,
                              service?.isFullProduct
                            )}
                          </td>
                        )}
                        {visibleColumns.createdAt && (
                          <td>
                            <DateTime
                              value={service.createdAt}
                              format="dateTime"
                            />
                          </td>
                        )}
                        <td style={{ textAlign: "end" }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(COMPANY_URLS.VIEW_SERVICE, {
                                state: service?._id,
                              })
                            }
                          >
                            <i className="ti ti-eye text-indigo me-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr>
                        <td
                          colSpan={
                            Object.keys(visibleColumns).filter(
                              (key) => visibleColumns[key]
                            ).length + 2
                          }
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
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="datatable-length">
                    <div className="dataTables_length">
                      <label>
                        Show
                        <DropDown
                          limit={limit}
                          onLimitChange={(val) => {
                            setLimit(val);
                            setCurrentPage(1);
                          }}
                        />
                        entries
                      </label>
                    </div>
                  </div>
                </div>
                <Pagination
                  total={totalItems}
                  itemsPerPage={limit}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceHistory;
