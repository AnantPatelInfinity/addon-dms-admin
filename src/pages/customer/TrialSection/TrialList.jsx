import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../ui/admin/PageHeader";
import { Pagination, Search } from "../../../components/Form";
import DropDown from "../../../components/Form/DropDown";
import { Link } from "react-router";
import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import TableFilter from "../../../components/TableFilter/TableFilter";
import moment from "moment";
import { getModuleKey } from "../../../config/DataFile";
import { useDispatch, useSelector } from "react-redux";
import {
    cuTrialReceivedData,
    cuTrialReturnData,
    downloadCuTrial,
    getCuTrialData,
    resetDeDownloadTrial,
    viewCuTrialData,
} from "../../../middleware/customerUser/trialOrder/trialOrder";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import { toast } from "react-toastify";
import { downloadTrialError } from "../../../slices/dealerTrial.slice";
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage";
import { getTrialBadge } from "../../../config/setup";
import Swal from "sweetalert2";
import { cuTrialReceivedReset, cuTrialReturnReset } from "../../../slices/customer/trialOrder.slice";

const TrialList = () => {
    const dispatch = useDispatch();

    const {
        trialList,
        trialListLoading,

        downloadTrial,
        downloadTrialMessage,
        downladTrialError,

        cuTrialReceivedMessage,
        cuTrialReceivedError,
        cuTrialReturnMessage,
        cuTrialReturnError,
    } = useSelector((state) => state.customerTrial);

    useEffect(() => {
        if (downloadTrialMessage) {
            window.open(downloadTrial?.pdfUrl, "_blank")
            toast.success(downloadTrialMessage);
            dispatch(resetDeDownloadTrial());
        }
        if (downloadTrialError) {
            toast.error(downladTrialError);
            dispatch(resetDeDownloadTrial());
        }
        if (cuTrialReceivedMessage) {
            toast.success(cuTrialReceivedMessage);
            dispatch(cuTrialReceivedReset());
            fetchTrialList()
        }
        if (cuTrialReceivedError) {
            toast.error(cuTrialReceivedError);
            dispatch(cuTrialReceivedReset());
            fetchTrialList()
        }
        if (cuTrialReturnMessage) {
            toast.success(cuTrialReturnMessage);
            dispatch(cuTrialReturnReset());
            fetchTrialList()
        }
        if (cuTrialReturnError) {
            toast.error(cuTrialReturnError);
            dispatch(cuTrialReturnReset());
            fetchTrialList()
        }
    }, [
        downloadTrialMessage,
        downloadTrialError,
        cuTrialReceivedMessage,
        cuTrialReceivedError,
        cuTrialReturnMessage,
        cuTrialReturnError,
    ]);

    const fetchTrialList = () => {
        dispatch(
            getCuTrialData({
                firmId: getCustomerStorage()?.DX_CU_FIRM_ID,
                customerId: getCustomerStorage()?.CU_ID,
            })
        );
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [filterState, setFilterState] = useState({});

    const columnsConfig = [
        { key: "trialNo", label: "Demo Unit No." },
        { key: "productName", label: "Product" },
        // { key: "customerName", label: "Customer Name" },
        // { key: "customerPhone", label: "Customer Mobile" },
        { key: "trialStartDate", label: "Start Date" },
        { key: "trialEndDate", label: "End Date" },
        { key: "trialDuration", label: "Demo Unit Duration" },
        { key: "status", label: "Status" },
        // { key: "entryType", label: "Entry Type" },
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
        getDefaultVisibleColumns
    );

    useEffect(() => {
        const payload = {
            customerId: getCustomerStorage()?.CU_ID,
            firmId: getCustomerStorage()?.DX_CU_FIRM_ID,
            page: currentPage,
            limit: limit,
            search: search,
        }
        dispatch(getCuTrialData(payload));
    }, [
        dispatch,
        currentPage,
        limit,
        search,
        getCustomerStorage()?.DX_CU_FIRM_ID,
        getCustomerStorage()?.CU_ID,
    ]);

    const entity = trialList?.data || [];
    const totalItems = trialList?.total || entity.length || 0;

    const getUniqueOptions = (field) => {
        const values = entity.map((item) => {
            switch (field) {
                case "customerName":
                    return item?.customerId?.name;
                case "customerPhone":
                    return item?.customerId?.phone;
                case "trialStartDate":
                    return item?.startDate
                        ? moment(item.startDate).format("YYYY-MM-DD")
                        : "-";
                case "trialEndDate":
                    return item?.endDate
                        ? moment(item.endDate).format("YYYY-MM-DD")
                        : "-";
                case "productName":
                    return item?.productName;
                case "status":
                    return item?.status;
                case "entryType":
                    return item?.entryType;
                default:
                    return item[field];
            }
        });
        return Array.from(new Set(values.filter((v) => v && v !== "-")));
    };

    const filterConfig = useMemo(
        () =>
            columnsConfig.map((f) => ({
                ...f,
                options: getUniqueOptions(f.key),
            })),
        [entity]
    );

    // Apply filter state
    const filteredData = useMemo(() => {
        let data = entity;

        filterConfig.forEach((f) => {
            const selected = filterState[f.key];
            if (selected?.length > 0) {
                data = data.filter((it) => {
                    let value;
                    switch (f.key) {
                        case "customerName":
                            value = it.customerId?.name;
                            break;
                        case "customerPhone":
                            value = it.customerId?.phone;
                            break;
                        case "trialStartDate":
                            value = it.startDate
                                ? moment(it.startDate).format("YYYY-MM-DD")
                                : "-";
                            break;
                        case "trialEndDate":
                            value = it.endDate
                                ? moment(it.endDate).format("YYYY-MM-DD")
                                : "-";
                            break;
                        case "status":
                            value = it.status;
                            break;
                        case "entryType":
                            value = it.entryType;
                            break;
                        default:
                            value = it[f.key];
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
        setLimit(10);
        dispatch(
            getCuTrialData({
                firmId: getCustomerStorage()?.DX_CU_FIRM_ID,
                customerId: getCustomerStorage()?.CU_ID,
            })
        );
    };

    const formatTrialDays = (startDate, endDate) => {
        if (!startDate) return "-";
        const end = endDate ? moment(endDate) : moment();
        const days = Math.max(1, end.diff(moment(startDate), "days"));
        return `${days} day${days !== 1 ? "s" : ""}`;
    };

    const handleTrialDownload = (id) => {
        dispatch(downloadCuTrial(id));
    };

    const getUpdateButtonText = (status) => {
        if (status === "DISPATCHED") {
            return "Confirm Demo";
        }

        if (status === "RECEIVED_BY_CUSTOMER") {
            return "Return Demo";
        }

        return null;
    };

    const handleUpdateDemoStatus = async (status, id) => {
        let nextStatus = "";
        let action = null;
        let title = "";
        let defaultRemarks = ""

        if (status === "DISPATCHED") {
            nextStatus = "RECEIVED_BY_CUSTOMER";
            action = cuTrialReceivedData;
            title = "Customer Receive";
            defaultRemarks = "Demonstration unit Received By customer."
        }
        else if (status === "RECEIVED_BY_CUSTOMER") {
            nextStatus = "RETURNED_BY_CUSTOMER";
            action = cuTrialReturnData;
            title = "Return Demo Unit";
            defaultRemarks = "Demonstration Unit Returned By Customer"
        }
        else {
            Swal.fire({
                icon: "info",
                title: "No Action Available",
                text: "Demo unit status cannot be updated at this stage."
            });
            return;
        }

        const { value: remarks } = await Swal.fire({
            title: title,
            text: "Please enter remarks",
            input: "textarea",
            inputPlaceholder: "Enter remarks here...",
            inputAttributes: {
                "aria-label": "Remarks"
            },
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#0d6efd",
        });

        dispatch(
            action(id, {
                status: nextStatus,
                remarks: remarks || defaultRemarks,
                userType: "CUSTOMER",
                userId: getCustomerStorage().CU_ID
            })
        );


    };


    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader
                    name="Demo Unit List"
                    count={entity?.length}
                    handleRefresh={handleRefresh}
                />

                <div className="card">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-sm-4">
                                <div className="icon-form mb-3 mb-sm-0">
                                    <span className="form-icon">
                                        <i className="ti ti-search" />
                                    </span>
                                    <Search
                                        onSearch={(value) => {
                                            setSearch(value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {trialListLoading ? (
                        <LoadingSpinner text="" size="md" />
                    ) : (
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
                                        {filteredData.length > 0 ? (
                                            filteredData.map((elem, i) => (
                                                <tr key={elem._id || i}>
                                                    <td>{(currentPage - 1) * limit + i + 1}</td>
                                                    {visibleColumns["trialNo"] && <td>{elem.trialNo}</td>}
                                                    {visibleColumns["productName"] && (
                                                        <td>{elem.productName}</td>
                                                    )}
                                                    {/* {visibleColumns["customerName"] && (
                                                        <td className="">
                                                            {`${elem.customerId?.title || ""}  ${elem.customerId?.name || ""
                                                                } ${elem.customerId?.lastName || ""}`.trim() || "-"}
                                                            <br />
                                                            <small>{elem.customerId?.phone}</small>
                                                        </td>
                                                    )} */}
                                                    {/* {visibleColumns["customerPhone"] && (
                                                        <td>{elem.customerId?.phone || "-"}</td>
                                                    )} */}
                                                    {visibleColumns["trialStartDate"] && (
                                                        <td>
                                                            {moment(elem.startDate).format("DD-MM-YYYY")}
                                                        </td>
                                                    )}
                                                    {visibleColumns["trialEndDate"] && (
                                                        <td>{moment(elem.endDate).format("DD-MM-YYYY")}</td>
                                                    )}
                                                    {visibleColumns["trialDuration"] && (
                                                        <td>
                                                            {formatTrialDays(elem.startDate, elem.endDate)}
                                                        </td>
                                                    )}
                                                    {visibleColumns["status"] && (
                                                        <td>
                                                            {getTrialBadge(elem?.status, elem?.entryType)}
                                                        </td>
                                                    )}
                                                    {/* {visibleColumns["entryType"] && (
                                                        <td>
                                                            {elem.entryType === "DEALER" ? (
                                                                <span
                                                                    className="badge badge-pill badge-status"
                                                                    style={{ background: "#6668ec" }}
                                                                >
                                                                    Dealer Entry
                                                                </span>
                                                            ) : (
                                                                <span className="badge badge-pill badge-status bg-primary">
                                                                    Admin Entry
                                                                </span>
                                                            )}
                                                        </td>
                                                    )} */}
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
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <Link
                                                                    className="dropdown-item"
                                                                    to={CUSTOMER_URLS.VIEW_TRIAL}
                                                                    state={elem._id}
                                                                >
                                                                    <i className="ti ti-eye text-indigo" /> View
                                                                </Link>
                                                                {getUpdateButtonText(elem?.status) && (
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => handleUpdateDemoStatus(elem?.status, elem?._id)}
                                                                    >
                                                                        <i className="ti ti-check text-success" /> {getUpdateButtonText(elem?.status)}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleTrialDownload(elem._id)}
                                                                >
                                                                    <i className="ti ti-download text-warning" />{" "}
                                                                    Download Trial
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="999">
                                                    <div className="no-table-data">No Data Found!</div>
                                                </td>
                                            </tr>
                                        )}
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
                                                <DropDown
                                                    limit={limit}
                                                    onLimitChange={(val) => setLimit(val)}
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

export default TrialList;
