import React, { useEffect, useMemo, useState } from 'react'
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import { useApi } from '../../../context/ApiContext';
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import { Link } from 'react-router';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import TableFilter from '../../../components/TableFilter/TableFilter';
import DateTime from '../../../helpers/DateFormat/DateTime';
import moment from 'moment';
import { getModuleKey } from '../../../config/DataFile';
import { toast } from 'react-toastify';

const Installation = () => {

    const { post, get } = useApi();
    const [entity, setEntity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const adminStorage = getAdminStorage();
    // const [companyLogo, setCompanyLogo] = useState(null);

    const columnsConfig = [
        { key: "reportNo", label: "Report Number" },
        { key: "customerFirstName", label: "Customer Name" },
        { key: "productSerialNo", label: "Serial Number" },
        { key: "registerDate", label: "Registration Date" },
        { key: "totalInstallDay", label: "Total Installation Days" },
        { key: "rejectReason", label: "Reject Reason" },
        { key: "status", label: "Status" },
        { key: "entryType", label: "Entry Type" },
    ];

    const moduleKey = getModuleKey();

    const getDefaultVisibleColumns = () => {
        const saved = localStorage.getItem(`columns-${moduleKey}`);
        if (saved) return JSON.parse(saved);
        const defaultState = {};
        columnsConfig.forEach(col => defaultState[col.key] = true);
        return defaultState;
    };
    const [visibleColumns, setVisibleColumns] = useState(getDefaultVisibleColumns);

    // const [visibleColumns, setVisibleColumns] = useState(() => {
    //     const initialState = {};
    //     columnsConfig.forEach((col) => (initialState[col.key] = true));
    //     return initialState;
    // });

    useEffect(() => {
        getInstallationData();
    }, []);

    const getInstallationData = async () => {
        try {
            setLoading(true)
            const formData = new URLSearchParams();
            formData.append("firmId", adminStorage.DX_AD_FIRM);
            const response = await post(`/admin/get-installation`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            const { data, success } = response;
            if (success) {
                const dataWithEntryType = data?.map(item => ({
                    ...item,
                    entryType: item.dealerId ? 'Dealer Entry' : 'Admin Entry'
                }));
                setEntity(dataWithEntryType);
                // setEntity(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Filter Config for all columns ---
    // Helper to get unique values for a field from entity
    const getUniqueOptions = (field) => {
        if (field === 'status') {
            return ['Pending', 'Approved', 'Rejected'];
        }
        if (field === 'entryType') {
            return ['Admin Entry', 'Dealer Entry'];
        }
        // For other fields, get unique non-empty values
        const values = entity.map(item => {
            if (field === 'customerFirstName') {
                return [item.customerTitle, item.customerFirstName, item.customerLastName].filter(Boolean).join(' ');
            }
            if (field === 'totalInstallDay') {
                if (!item.physicalInstallDate) return '-';
                const days = Math.max(1, moment().diff(moment(item.physicalInstallDate), "days"));
                return `${days} day${days !== 1 ? 's' : ''}`;
            }
            if (field === 'registerDate') {
                return item.registerDate ? moment(item.registerDate).format('YYYY-MM-DD') : '-';
            }
            return item[field] ?? '-';
        });
        return Array.from(new Set(values)).filter(v => v && v !== '-');
    };

    const filterFields = [
        { key: "reportNo", label: "Report Number" },
        { key: "customerFirstName", label: "Customer Name" },
        { key: "productSerialNo", label: "Serial Number" },
        { key: "registerDate", label: "Registration Date" },
        { key: "totalInstallDay", label: "Total Installation Days" },
        { key: "rejectReason", label: "Reject Reason" },
        { key: "status", label: "Status" },
        { key: "entryType", label: "Entry Type" },
    ];

    const filterConfig = useMemo(() =>
        filterFields.map(f => ({
            ...f,
            options: getUniqueOptions(f.key)
        })),
        [entity]
    );

    const [filterState, setFilterState] = useState({});

    // --- Filtering logic for all fields ---
    const commentsData = useMemo(() => {
        let computedComments = entity || [];
        if (search) {
            computedComments = computedComments.filter((it) =>
                it.reportNo?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        // Apply all field filters
        filterConfig.forEach(f => {
            const selected = filterState[f.key];
            if (selected && selected.length > 0) {
                computedComments = computedComments.filter(it => {
                    let value;
                    if (f.key === 'customerFirstName') {
                        value = [it.customerTitle, it.customerFirstName, it.customerLastName].filter(Boolean).join(' ');
                    } else if (f.key === 'totalInstallDay') {
                        if (!it.physicalInstallDate) value = '-';
                        else {
                            const days = Math.max(1, moment().diff(moment(it.physicalInstallDate), "days"));
                            value = `${days} day${days !== 1 ? 's' : ''}`;
                        }
                    } else if (f.key === 'registerDate') {
                        value = it.registerDate ? moment(it.registerDate).format('YYYY-MM-DD') : '-';
                    } else if (f.key === 'status') {
                        value = it.status === 1 ? 'Pending' : it.status === 2 ? 'Approved' : it.status === 3 ? 'Rejected' : '';
                    } else if (f.key === 'entryType') {
                        value = it.dealerId ? 'Dealer Entry' : 'Admin Entry';
                    } else {
                        value = it[f.key] ?? '-';
                    }
                    return selected.includes(value);
                });
            }
        });
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity, filterState, filterConfig]);

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        getInstallationData()
    };

    const formatInstallationDays = (date) => {
        if (!date) return "-";
        const days = Math.max(1, moment().diff(moment(date), "days"));
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    const handleInstallationDownload = async (id, dealerId) => {
        try {
            const response = await post(`/admin/download-installation-report/${id}`, {
                isDealer: !!dealerId  // true if dealerId is present, false if null or undefined
            });
            const { data, success, message } = response;
            if (success) {
                window.open(data?.pdfUrl, '_blank');
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }


    // const getCompanyDetails = async (companyId) => {
    //     try {
    //       const response = await post(`/admin/get-company/${companyId}`);
    //       const { success, data } = response;
    //       if (success) {
    //         setCompanyLogo(data?.logoUrl); // depends on API field name
    //       }
    //     } catch (err) {
    //       console.error("Error fetching company details:", err);
    //     }
    //   };

    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader name={"Installation List"} count={entity?.length} handleRefresh={handleRefresh} />

                <div className="card">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-sm-4">
                                <div className="icon-form mb-3 mb-sm-0">
                                    <span className="form-icon">
                                        <i className="ti ti-search" />
                                    </span>
                                    <Search onSearch={(value) => {
                                        setSearch(value);
                                        setCurrentPage(1);
                                    }} />
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
                                    <div className="dropdown me-2"></div>
                                    <Link to={ADMIN_URLS.MANAGE_INSTALL} className="btn btn-primary">
                                        <i className="ti ti-square-rounded-plus me-2" />
                                        Add Installation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loading ? <LoadingSpinner text='' size='md' /> : (
                        <div className="card-body">
                            <TableFilter
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                                columnsConfig={columnsConfig}
                                moduleKey={moduleKey}
                                filterConfig={filterConfig}
                                filterState={filterState}
                                onFilterChange={setFilterState}
                                filterDropdownLabel="Filter"
                            />
                            <div className=" custom-table table-responsive ">
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Sr.</th>
                                            {columnsConfig.map(col => visibleColumns[col.key] && <th key={col.key}>{col.label}</th>)}
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) => (
                                            <tr key={elem?._id}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                {visibleColumns["reportNo"] && <td> {elem?.reportNo}</td>}
                                                {visibleColumns["customerFirstName"] && <td>{elem?.customerTitle} {elem?.customerFirstName} {elem?.customerLastName}</td>}
                                                {visibleColumns["productSerialNo"] && <td>{elem?.productSerialNo}</td>}
                                                {visibleColumns["registerDate"] && <td><DateTime value={elem?.registerDate} format='date' /></td>}
                                                {visibleColumns["totalInstallDay"] && <td>{formatInstallationDays(elem?.physicalInstallDate)}</td>}
                                                {visibleColumns["rejectReason"] && <td>{elem?.rejectReason || "-"}</td>}
                                                {visibleColumns.status && (
                                                    <td>
                                                        {elem.status === 1 ? (
                                                            <span className="badge badge-pill badge-status bg-warning">
                                                                Pending
                                                            </span>
                                                        ) : elem.status === 2 ? (
                                                            <span className="badge badge-pill badge-status bg-success">
                                                                Approved
                                                            </span>
                                                        ) : elem.status === 3 ? (
                                                            <span className="badge badge-pill badge-status bg-danger">
                                                                Rejected
                                                            </span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                )}
                                                {visibleColumns["entryType"] && (
                                                    <td>
                                                        {elem.dealerId ? (
                                                            <span className="badge badge-pill badge-status" style={{ background: "#6668ec" }}>
                                                                Dealer Entry
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-pill badge-status bg-primary">
                                                                Admin Entry
                                                            </span>
                                                        )}
                                                    </td>
                                                )}
                                                <td style={{ textAlign: "end" }}>
                                                    <div className="dropdown table-action">
                                                        <a
                                                            href="#"
                                                            className="action-icon"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="true"
                                                        >
                                                            <i className="fa fa-ellipsis-v" />
                                                        </a>
                                                        <div
                                                            className="dropdown-menu dropdown-menu-right "
                                                            data-popper-placement="bottom-start"
                                                        >
                                                            <Link className="dropdown-item" to={ADMIN_URLS.VIEW_INSTALL} state={elem?._id}>
                                                                <i className="ti ti-eye text-indigo" /> View
                                                            </Link>
                                                            {elem?.status !== 2 && !elem.dealerId && (
                                                                <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_INSTALL} state={elem?._id}>
                                                                    <i className="ti ti-edit text-blue" /> Edit
                                                                </Link>
                                                            )}
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleInstallationDownload(elem._id, elem?.dealerId)}
                                                            >
                                                                <i className="ti ti-arrow-down text-info me-1" />
                                                                Download Installation
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {commentsData?.length === 0 ? (
                                            <tr>
                                                <td colSpan="999">
                                                    <div className="no-table-data">
                                                        No Data Found!
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="datatable-length">
                                        <div
                                            className="dataTables_length"
                                            id="contracts-list_length"
                                        >
                                            <label>
                                                Show
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
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

export default Installation