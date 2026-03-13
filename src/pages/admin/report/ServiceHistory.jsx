import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import PageHeader from '../../../ui/admin/PageHeader';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import { getModuleKey, getServiceStatusBadge, serviceFilter } from '../../../config/DataFile';
import { Pagination, Search } from '../../../components/Form';
import TableFilter from '../../../components/TableFilter/TableFilter';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import DropDown from '../../../components/Form/DropDown';
import SerHistoryFilter from '../../../components/Admin/Report/SerHistoryFilter';
import DateTime from '../../../helpers/DateFormat/DateTime';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const ServiceHistory = () => {

    const navigate = useNavigate();
    const { post, get } = useApi();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const adminStorage = getAdminStorage();
    const [filters, setFilters] = useState({
        search: "",
        dealerId: "",
        companyId: "",
        customerId: "",
        serialNoId: "",
        status: "",
        startDate: "",
        endDate: ""
    });
    const [dropdowns, setDropdowns] = useState({
        dealerData: [],
        companyData: [],
        customerData: [],
        serialNoData: [],
        statusData: [],
    });

    const [downloading, setDownloading] = useState(false);

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
        columnsConfig.forEach(col => defaultState[col.key] = true);
        return defaultState;
    };
    const [visibleColumns, setVisibleColumns] = useState(getDefaultVisibleColumns());

    useEffect(() => {
        getServiceHistory();
    }, [currentPage, limit, filters]);

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const firmId = adminStorage.DX_AD_FIRM;
            const [dealerRes, companyRes, customerRes, serialNoRes] = await Promise.all([
                get(`/admin/get-dealer?firmId=${firmId}`),
                get(`/admin/get-company?firmId=${firmId}&status=2`),
                get(`/admin/get-customer?firmId=${firmId}&status=2`),
                post("/admin/get-serial-no", { firmId: firmId }),
            ]);
            setDropdowns(prev => ({
                ...prev,
                dealerData: dealerRes?.data.map(dealer => ({ value: dealer._id, label: dealer.name })),
                companyData: companyRes?.data.map(company => ({ value: company._id, label: company.name })),
                customerData: customerRes?.data.map(customer => ({ value: customer._id, label: `${customer.title} ${customer.name} ${customer.lastName} ${customer.clinicName ? `(${customer.clinicName})` : ''}` })),
                serialNoData: serialNoRes?.data.map(serial => ({ value: serial._id, label: serial.companySerialNo })),
                statusData: serviceFilter
            }));
        } catch (error) {
            console.log(error, 'fetchDropdowns:')
        }
    }

    const getServiceHistory = async () => {
        try {
            setLoading(true);
            const formData = new URLSearchParams();
            formData.append("firmId", adminStorage.DX_AD_FIRM);
            formData.append("page", currentPage);
            formData.append("limit", limit);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            const response = await post(`/admin/get-service-history`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            const { data, success } = response;
            if (success && data) {
                setServices(data.services || []);
                setTotalItems(data.pagination?.totalItems || 0);
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
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        setLimit(10);
        setFilters({
            search: "",
            dealerId: "",
            companyId: "",
            customerId: "",
            serialNoId: "",
            status: "",
            startDate: "",
            endDate: ""
        });
    }

    const clearFilters = () => {
        setFilters({
            search: "",
            dealerId: "",
            companyId: "",
            customerId: "",
            serialNoId: "",
            status: "",
            startDate: "",
            endDate: ""
        });
        setCurrentPage(1);
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== "");

    const handleDownloadPDF = async () => {
        try {
            setDownloading(true);
            const formData = new URLSearchParams();
            formData.append("firmId", adminStorage.DX_AD_FIRM);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const response = await post("/admin/download-service-history-pdf", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            if (response?.data?.file) {
                toast.success(response?.message || "Service History Pdf downloaded Successfully")
                window.open(response?.data?.file, "_blank");
            } else {
                toast.error("Failed to download PDF. Try Again Later!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Internal Server Error");
        } finally {
            setDownloading(false);
        }
    };


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
                                        <button type="button" className="btn btn-outline-secondary btn-sm"
                                            onClick={clearFilters}
                                        >
                                            <i className="ti ti-refresh me-1"></i>
                                            Clear Filters
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <i className={`ti ti-filter me-1 ${showFilters ? 'ti-filter-minus' : 'ti-filter-plus'}`}></i>
                                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                                        {hasActiveFilters && <span className="badge bg-white text-primary ms-1">●</span>}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={handleDownloadPDF}
                                        disabled={downloading}
                                    >
                                        {downloading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Downloading PDF...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-download me-1"></i>
                                                Download Service PDF
                                            </>
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
                        />
                    </div>

                    {loading ? <LoadingSpinner text='' size='md' /> : (
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
                                            {columnsConfig.map(col => visibleColumns[col.key] && <th key={col.key}>{col.label}</th>)}
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map((service, index) => (
                                            <tr key={service._id}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                {visibleColumns.complainNo && <td>{service.complainNo}</td>}
                                                {visibleColumns.customerName && (
                                                    <td>{`${service.customerTitle || ''} ${service.customerName || ''} ${service.customerLastName || ''}`}</td>
                                                )}
                                                {visibleColumns.companyName && <td>{service.companyName || '-'}</td>}
                                                {visibleColumns.companySerialNo && <td>{service.companySerialNo || '-'}</td>}
                                                {visibleColumns.engineerName && <td>{service.engineerName || '-'}</td>}
                                                {visibleColumns.serviceDate && <td><DateTime value={service.serviceDate} format='date' /></td>}
                                                {visibleColumns.status && <td>
                                                    {getServiceStatusBadge(service?.status, service?.isFullProduct)}
                                                </td>}
                                                {visibleColumns.createdAt && <td><DateTime value={service.createdAt} format='dateTime' /></td>}
                                                <td style={{ textAlign: "end" }}>
                                                    <button type='button' className='btn btn-sm btn-outline-primary' onClick={() => navigate(ADMIN_URLS.VIEW_SERVICE, { state: service?._id })}>
                                                        <i className="ti ti-eye text-indigo me-1" /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {services.length === 0 && (
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
    )
}

export default ServiceHistory