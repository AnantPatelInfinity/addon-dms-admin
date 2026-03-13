import React, { useEffect, useMemo, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import { getModuleKey, getServiceStatus } from '../../../config/DataFile';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { Pagination, Search } from '../../../components/Form';
import { Link } from 'react-router';
import PageHeader from '../../../ui/admin/PageHeader';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import DropDown from '../../../components/Form/DropDown';
import TableFilter from '../../../components/TableFilter/TableFilter';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import DateTime from '../../../helpers/DateFormat/DateTime';
import { getServiceStatusBadge } from '../../../config/DataFile';

const ServiceList = () => {

    const { get, post } = useApi();
    const [entity, setEntity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const adminStorage = getAdminStorage();


    const columnsConfig = [
        { key: "complainNo", label: "Complaint No" },
        { key: "customerName", label: "Customer" },
        { key: "serialNo", label: "Serial No." },
        { key: "engineerName", label: "Engineer" },
        { key: "status", label: "Status" },
        { key: "serviceDate", label: "Service Date" },
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
        if (loading === true) {
            getServiceData()
        }
    }, [loading]);

    const getServiceData = async () => {
        try {
            setLoading(true);
            const response = await post(`/admin/get-service`, { firmId: adminStorage.DX_AD_FIRM });
            const { data, success } = response;
            if (success) {
                setEntity(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const commentsData = useMemo(() => {
        let computedComments = entity || [];
        if (search) {
            computedComments = computedComments.filter((it) =>
                it.complainNo?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        setLoading(true);
    };

    const handleDispatchDownload = async (sId) => {
        try {
            const url = `/admin/download-courier-dispatch/${sId}`
            const payload = {
                isCompany: false
            }
            const response = await post(url, payload)
            const { message, success, data: resData } = response;
            if (success) {
                window.open(resData?.file, "_blank")
                toast.success(message);
            } else {
                toast.error(message)
            }
        } catch (error) {
            console.log("Error in handleDispatchDownload:", error);
            toast.error(error?.response?.data?.message)
        }
    }

    const handleServiceReceipt = async (sId) => {
        try {
            const url = `/admin/download-service-slip/${sId}`
            const payload = {
                isDealer: false
            }
            const response = await post(url, payload);
            const { message, success, data: resData } = response;
            if (success) {
                window.open(resData?.file, "_blank")
                toast.success(message);
            } else {
                toast.error(message)
            }
        } catch (error) {
            console.log("Error in handleDispatchDownload:", error);
            toast.error(error?.response?.data?.message || "Someting went wrong")
        }
    }

    const handleServiceChallan = async (sId) => {
        try {
            const url = `/admin/download-service-challan/${sId}`;
            const response = await get(url);
            const { message, success, data: resData } = response;
            if (success) {
                window.open(resData?.file, "_blank");
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log("Error in handleDispatchDownload:", error);
            toast.error(error?.response?.data?.message || "Someting went wrong");
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader name={"Service List"} count={entity?.length} handleRefresh={handleRefresh} />
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
                                    <Link to={ADMIN_URLS.MANAGE_SERVICE} className="btn btn-primary">
                                        <i className="ti ti-square-rounded-plus me-2" />
                                        Add Service
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
                                                {visibleColumns.complainNo && <td>{elem.complainNo}</td>}
                                                {visibleColumns.customerName && (
                                                    <td>
                                                        {elem.customerTitle} {elem.customerName} {elem.customerLastName}
                                                        <br />
                                                        <small>{elem.customerPhone}</small>
                                                    </td>
                                                )}
                                                {visibleColumns.serialNo && <td>{elem.companySerialNo}</td>}
                                                {visibleColumns.engineerName && (
                                                    <td>{elem.engineerName || 'Not Assigned'}</td>
                                                )}
                                                {visibleColumns.status && <td>
                                                    {getServiceStatusBadge(elem?.status, elem?.isFullProduct)}
                                                </td>}
                                                {visibleColumns.serviceDate && <td><DateTime value={elem.serviceDate} format="date" /> </td>}
                                                {visibleColumns.entryType && (
                                                    <td>
                                                        {(elem?.dealerId) ? (
                                                            <span
                                                                className="badge badge-pill badge-status bg-success"
                                                                style={{ background: "#6668ec" }}
                                                            >
                                                                Dealer Entry
                                                            </span>
                                                        ) : (elem?.isCustomerEntry === true) ?
                                                            <span className="badge badge-pill badge-status bg-warning">
                                                                Customer Entry
                                                            </span>
                                                            : (
                                                                <span className="badge badge-pill badge-status bg-danger">
                                                                    Admin Entry
                                                                </span>
                                                            )}
                                                    </td>
                                                )}
                                                <td className="text-end">
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
                                                            <Link className="dropdown-item" to={ADMIN_URLS.VIEW_SERVICE} state={elem?._id}>
                                                                <i className="ti ti-eye text-indigo" /> View
                                                            </Link>
                                                            {elem?.status === 1 && (
                                                                <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_SERVICE} state={elem}>
                                                                    <i className="ti ti-edit text-blue" /> Edit
                                                                </Link>
                                                            )}
                                                            {/* <Link className="dropdown-item" onClick={() => handleDelete(elem)}>
                                                                <i className="ti ti-trash text-danger" /> Delete
                                                            </Link> */}
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleDispatchDownload(elem._id)}
                                                            >
                                                                <i className="ti ti-arrow-down text-info me-1" />
                                                                Download Dispatch
                                                            </button>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleServiceReceipt(elem._id)}
                                                            >
                                                                <i className="ti ti-arrow-down text-info me-1" />
                                                                Download Service Receipt
                                                            </button>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleServiceChallan(elem._id)}
                                                            >
                                                                <i className="ti ti-arrow-down text-info me-1" />
                                                                Download Service Challan
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

export default ServiceList