import React, { useEffect, useMemo, useState } from 'react'
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import TableFilter from '../../../components/TableFilter/TableFilter';
import PageHeader from '../../../ui/admin/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerCustomerList } from '../../../middleware/customer/customer';
import { Link } from 'react-router';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getModuleKey } from '../../../config/DataFile';

const DealerCustomer = () => {

    const dispatch = useDispatch()
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const dealerStorage = getDealerStorage();

    const columnsConfig = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Mobile No." },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "pincode", label: "Pincode" },
        { key: "status", label: "Status" },
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

    const {
        customerList,
        customerListError,
        customerListLoading,
    } = useSelector((state) => state?.customer);


    useEffect(() => {
        dispatch(getDealerCustomerList(dealerStorage.DL_ID));
    }, [])

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        dispatch(getDealerCustomerList(dealerStorage.DL_ID));
        setlimit(10);
    };

    const commentsData = useMemo(() => {
        let computedComments = customerList || [];
        if (search) {
            computedComments = computedComments.filter((it) =>
                it.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                it.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
                it?.phone?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, customerList]);



    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader name={"Customer List"} count={customerList?.length} handleRefresh={handleRefresh} />

                {customerListLoading && (
                    <div className="text-center py-4">
                        <LoadingSpinner text="" size="md" />
                    </div>
                )}

                {customerListError && (
                    <div className="alert alert-danger text-center" role="alert">
                        {customerListError || "Something went wrong while fetching data."}
                    </div>
                )}

                {!customerListLoading && !customerListError && (
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
                                        <Link to={DEALER_URLS.MANAGE_DE_CUSTOMER} className="btn btn-primary">
                                            <i className="ti ti-square-rounded-plus me-2" />
                                            Add Customer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                                {visibleColumns.name && <td>{elem?.title} {elem.name} {elem?.lastName}</td>}
                                                {visibleColumns.email && <td>{elem.email}</td>}
                                                {visibleColumns.phone && <td>{elem.phone}</td>}
                                                {visibleColumns.address && <td>{elem.address}</td>}
                                                {visibleColumns.city && <td>{elem.city}</td>}
                                                {visibleColumns.state && <td>{elem.state}</td>}
                                                {visibleColumns.pincode && <td>{elem.pincode}</td>}
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
                                                            <Link className="dropdown-item" to={DEALER_URLS.VIEW_DE_CUSTOMER} state={elem}>
                                                                <i className="ti ti-eye text-blue" /> View
                                                            </Link>
                                                            <Link className="dropdown-item" to={DEALER_URLS.MANAGE_DE_CUSTOMER} state={elem}>
                                                                <i className="ti ti-edit text-blue" /> Edit
                                                            </Link>
                                                            {/* <a className="dropdown-item" href="#">
                                                                <i className="ti ti-trash text-danger" /> Delete
                                                            </a> */}
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default DealerCustomer