import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { getModuleKey, getServiceStatusBadge, serviceFilter } from '../../../config/DataFile';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import { downloadDealerServiceHistory, getServiceHistoryList, resetDownloaDealerServiceHistory } from '../../../middleware/serviceReport/serviceReport';
import PageHeader from '../../../ui/admin/PageHeader';
import { getDealerCustomerList } from '../../../middleware/customer/customer';
import { getCompanyList } from '../../../middleware/company/company';
import { getPoSerialItems } from '../../../middleware/PoItems/PoItems';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import TableFilter from '../../../components/TableFilter/TableFilter';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import SerHistoryFilter from '../../../components/Admin/Report/SerHistoryFilter';
import DateTime from '../../../helpers/DateFormat/DateTime';
import { toast } from 'react-toastify';

const ServiceHistory = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [services, setServices] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const dealerStorage = getDealerStorage();
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
        companyData: [],
        customerData: [],
        serialNoData: [],
        statusData: [],
    });

    const { downloadServiceHistoryPdfLoading, downloadServiceHistoryPdf,
        downloadServiceHistoryPdfMessage, downloadServiceHistoryPdfError } = useSelector((state) => state?.serviceReport)

    useEffect(() => {
        if (downloadServiceHistoryPdfMessage) {
            toast.success(downloadServiceHistoryPdfMessage)
            window.open(downloadServiceHistoryPdf?.file, "_blank");
            dispatch(resetDownloaDealerServiceHistory())
        }
        if (downloadServiceHistoryPdfError) {
            toast.error(downloadServiceHistoryPdfError)
            dispatch(resetDownloaDealerServiceHistory())
        }
    }, [downloadServiceHistoryPdfMessage, downloadServiceHistoryPdfError])


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
    const [downloading, setDownloading] = useState(false);

    const { historyList, historyListLoading } = useSelector((state) => state?.serviceReport)
    const { poSerialNo } = useSelector((state) => state?.dealerPoItems);
    const { companyList } = useSelector((state) => state?.company);
    const { customerList } = useSelector((state) => state?.customer);

    useEffect(() => {
        if (historyList) {
            setServices(historyList?.services || []);
            setTotalItems(historyList?.pagination?.totalItems || 0);
        }
    }, [historyList]);

    useEffect(() => {
        getServiceHistory()
    }, [currentPage, limit, filters]);

    useEffect(() => {
        const payload = {
            firmId: dealerStorage.DX_DL_FIRM_ID,
            dealerId: dealerStorage.DL_ID
        }
        dispatch(getDealerCustomerList(dealerStorage.DL_ID));
        dispatch(getCompanyList(payload));
        dispatch(getPoSerialItems(payload));
    }, []);

    useEffect(() => {
        setDropdowns(prev => ({
            ...prev,
            companyData: companyList?.map(company => ({ value: company._id, label: company.name })),
            customerData: customerList?.map(customer => ({ value: customer._id, label: `${customer.title} ${customer.name} ${customer.lastName} ${customer.clinicName ? `(${customer.clinicName})` : ''}` })),
            serialNoData: poSerialNo?.map(serial => ({ value: serial._id, label: serial.companySerialNo })),
            statusData: serviceFilter
        }))
    }, [poSerialNo, companyList, customerList]);

    const getServiceHistory = () => {
        const formData = new URLSearchParams();
        formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
        formData.append("dealerId", dealerStorage.DL_ID);
        formData.append("page", currentPage);
        formData.append("limit", limit);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        dispatch(getServiceHistoryList(formData))
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
        const formData = new URLSearchParams();
        formData.append("firmId", dealerStorage.DX_DL_FIRM_ID);
        formData.append("dealerId", dealerStorage.DL_ID);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        dispatch(downloadDealerServiceHistory(formData))

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
                                        disabled={downloadServiceHistoryPdfLoading}
                                    >
                                        {downloadServiceHistoryPdfLoading ? (
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
                            isDealer={true}
                        />
                    </div>

                    {historyListLoading ? <LoadingSpinner text='' size='md' /> : (
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
                                                    <button type='button' className='btn btn-sm btn-outline-primary' onClick={() => navigate(DEALER_URLS.VIEW_SERVICE, { state: service?._id })}>
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