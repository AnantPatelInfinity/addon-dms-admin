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
import moment from 'moment';
import { getModuleKey } from '../../../config/DataFile';
import { toast } from 'react-toastify';
import { getTrialBadge } from '../../../config/setup';
import Swal from 'sweetalert2';

const TrialList = () => {

    const { get, post } = useApi();
    const [entity, setEntity] = useState([]);
    const [loading, setLoading] = useState(true);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);

    const [search, setSearch] = useState("");

    const adminStorage = getAdminStorage();

    const columnsConfig = [
        { key: "trialNo", label: "Demo Unit No." },
        { key: "productName", label: "Product" },
        { key: "customerName", label: "Customer" },
        { key: "trialStartDate", label: "Start Date" },
        { key: "trialEndDate", label: "End Date" },
        { key: "trialDuration", label: "Demo Unit Duration" },
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

    useEffect(() => {
        getTrialData();
    }, [currentPage, limit, search]);

    const getTrialData = async () => {
        try {
            setLoading(true)
            const firmId = adminStorage.DX_AD_FIRM
            const params = new URLSearchParams();
            params.append('firmId', firmId);

            if (search) {
                params.append('search', search);
            }

            const response = await post(`/admin/get-trial-order`, {
                page: currentPage,
                limit: limit,
                search: search,
                firmId: firmId
            });
            setlimit(response?.data?.pagination.limit)
            setCurrentPage(response?.data?.pagination.page)
            setTotalItems(response?.data?.pagination.total)

            const { data } = response?.data;
            if (response?.success) {
                setEntity(data);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filterFields = columnsConfig;

    const getUniqueOptions = (field) => {
        const values = entity.map(item => {
            switch (field) {
                case 'customerName':
                    return [item?.customerId?.name];
                case 'customerPhone':
                    return [item?.customerId?.phone];
                case 'trialStartDate':
                    return item.startDate ? moment(item.startDate).format('YYYY-MM-DD') : '-';
                case 'trialEndDate':
                    return item.endDate ? moment(item.endDate).format('YYYY-MM-DD') : '-';
                case 'productName':
                    return item.productName || '-';
                case 'status':
                    return item.status || '-';
                default:
                    return item[field] ?? '-';
            }
        });
        return Array.from(new Set(values)).filter(v => v && v !== '-');
    };

    const filterConfig = useMemo(() =>
        filterFields.map(f => ({
            ...f,
            options: getUniqueOptions(f.key)
        })),
        [entity]
    );

    const [filterState, setFilterState] = useState({});

    const commentsData = useMemo(() => {

        let data = entity;

        filterConfig.forEach(f => {
            const selected = filterState[f.key];
            if (selected && selected.length > 0) {
                data = data.filter(it => {
                    let value;
                    switch (f.key) {
                        case 'customerName':
                            value = [it?.customerId?.name];
                            break;
                        case 'customerPhone':
                            value = [it?.customerId?.phone];
                            break;
                        case 'trialStartDate':
                            value = it.startDate ? moment(it.startDate).format('DD-MM-YYYY') : '-';
                            break;
                        case 'trialEndDate':
                            value = it.endDate ? moment(it.endDate).format('DD-MM-YYYY') : '-';
                            break;
                        case 'status':
                            value = it.status || '';
                            break;
                        case 'entryType':
                            value = it.entryType;
                            break;
                        default:
                            value = it[f.key] ?? '-';
                    }
                    return selected.includes(value);
                });
            }
        });

        return data;

    }, [entity, filterState, filterConfig]);

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        getTrialData()
    };

    const formatTrialDays = (date) => {
        if (!date) return "-";
        const days = Math.max(1, moment().diff(moment(date), "days"));
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    const handleTrialDownload = async (id, dealerId) => {
        try {
            const response = await get(`/admin/trial-order-slip/${id}`, {
                isDealer: !!dealerId
            });
            const { data, success, message } = response;
            if (success) {
                window.open(data?.pdfUrl, '_blank');
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getUpdateButtonText = (status) => {
        if (status === "CREATED") {
            return "Dispatch Demo";
        }
        if (status === "RETURNED_BY_CUSTOMER") {
            return "Receive Demo";
        }
        return null;
    };

    const handleUpdateDemoStatus = async (status, id) => {
        let nextStatus = "";
        let title = "";
        let buttonColor = "#0d6efd";
        let defaultRemarks = ""

        if (status === "CREATED") {
            nextStatus = "DISPATCHED";
            title = "Dispatch Demo Unit";
            defaultRemarks = "Demonstration unit dispatched to customer."
        }
        else if (status === "RETURNED_BY_CUSTOMER") {
            nextStatus = "COMPLETED";
            title = "Receive Demo Unit From Customer";
            buttonColor = "#dc3545";
            defaultRemarks = "Demonstration unit received back from customer."
        }
        else {
            Swal.fire({
                icon: "info",
                title: "No Action Available",
                text: "Demo unit status cannot be updated."
            });
            return;
        }

        const { value: remarks } = await Swal.fire({
            title: title,
            text: "Add remarks",
            input: "textarea",
            inputPlaceholder: "Enter remarks here...",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            confirmButtonColor: buttonColor
        });

        if (remarks === undefined) return;

        try {
            setLoading(true);

            const response = await post(
                `/admin/update-trial-order-status/${id}`,
                {
                    status: nextStatus,
                    remarks: remarks || defaultRemarks,
                    userType: "ADMIN",
                    userId: getAdminStorage()?.AD_ID,
                }
            );

            if (response?.success) {
                toast.success(response?.message || "Status updated successfully");
                getTrialData()
            } else {
                toast.error(response?.message || "Failed to update status");
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader name={"Demo Unit List"} count={entity?.length} handleRefresh={handleRefresh} />

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
                                    <Link to={ADMIN_URLS.MANAGE_TRIAL} className="btn btn-primary">
                                        <i className="ti ti-square-rounded-plus me-2" />
                                        Add Demo Unit
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
                                            <tr key={elem?._id || i}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                {visibleColumns["trialNo"] && <td>{elem.trialNo}</td>}
                                                {visibleColumns["productName"] && <td>{elem.productName}</td>}
                                                {visibleColumns["customerName"] && <td className=''>
                                                    {`${elem.customerId?.title || ""}  ${elem.customerId?.name || ""} ${elem.customerId?.lastName || ""}`.trim() || "-"}
                                                    <br />
                                                    <small>{elem.customerId?.phone}</small>
                                                </td>}
                                                {visibleColumns["trialStartDate"] && <td>{elem?.startDate ? moment(elem.startDate).format('DD-MM-YYYY') : "-"}</td>}
                                                {visibleColumns["trialEndDate"] && <td>{elem?.endDate ? moment(elem.endDate).format('DD-MM-YYYY') : "-"}</td>}
                                                {visibleColumns["trialDuration"] && <td className='text-center'>{formatTrialDays(elem.startDate, elem.endDate)}</td>}
                                                {visibleColumns["status"] && (
                                                    <td>
                                                        {getTrialBadge(elem?.status, elem.entryType)}
                                                    </td>
                                                )}
                                                {visibleColumns["entryType"] && (
                                                    <td>
                                                        {elem.entryType === "DEALER" ? (
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
                                                            <Link className="dropdown-item" to={`${ADMIN_URLS.VIEW_TRIAL}?id=${elem._id}`} state={elem}>
                                                                <i className="ti ti-eye text-indigo" /> View
                                                            </Link>
                                                            {!elem.dealerId && (
                                                                <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_TRIAL} state={elem}>
                                                                    <i className="ti ti-edit text-success" /> Edit
                                                                </Link>
                                                            )}
                                                            {getUpdateButtonText(elem?.status) && (
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleUpdateDemoStatus(elem?.status, elem?._id)}
                                                                >
                                                                    <i className="ti ti-check text-success" /> {getUpdateButtonText(elem?.status)}
                                                                </button>
                                                            )}
                                                            <button className="dropdown-item" onClick={() => handleTrialDownload(elem._id, elem?.dealerId)}>
                                                                <i className="ti ti-download text-info" /> Download Trial
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

export default TrialList