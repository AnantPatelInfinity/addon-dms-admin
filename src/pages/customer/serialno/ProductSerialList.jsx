import React, { useEffect, useMemo, useState } from 'react'
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage"
import { useDispatch, useSelector } from 'react-redux';
import { getCuPoProductReceive, getCuPoSerialItems, resetCuPoProductReceive } from "../../../middleware/customerUser/poItems/poItems"
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import TableFilter from '../../../components/TableFilter/TableFilter';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import Swal from 'sweetalert2';

const ProductSerialList = () => {

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    
    const customerStorage = getCustomerStorage()

    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState('normal'); 

    const normalColumnsConfig = [
        { key: "name", label: "Product Name" },
        { key: "companyName", label: "Company Name" },
        { key: "companySerialNo", label: "Serial Number" },
        { key: "customerPoNo", label: "Customer PO No" },
        { key: "poVoucherNo", label: "PO Voucher No" },

        // { key: "poAdminInvoice", label: "Admin Invoice" },
        { key: "poCompanyDispatch", label: "Company Dispatch PDF" },
        { key: "action", label: "Action" },
    ];

    const groupedColumnsConfig = [
        { key: "name", label: "Product Name" },
        { key: "companyName", label: "Company Name" },
        { key: "companySerialNo", label: "Serial Numbers" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(() => {
        const initialState = {};
        normalColumnsConfig.forEach((col) => (initialState[col.key] = true));
        return initialState;
    });

    const { 
        poSerialNo,
        poSerialNoLoading,
        poSerialNoError,
        
        cuPoProductReceive,
        cuPoProductReceiveMessage,
        cuPoProductReceiveError
    } = useSelector((state) => state?.customerPoItems);

    useEffect(() => {
        fetchSerialNo();
    }, []);

    useEffect(() => {
        if(cuPoProductReceiveMessage){
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: cuPoProductReceiveMessage,
                confirmButtonColor: '#198754'
            }).then(() => {
                fetchSerialNo();
            });
            dispatch(resetCuPoProductReceive())
        }
        if(cuPoProductReceiveError){
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: cuPoProductReceiveError,
                confirmButtonColor: '#d33'
            });
            dispatch(resetCuPoProductReceive())
        }
    }, [cuPoProductReceiveMessage, cuPoProductReceiveError])

    const fetchSerialNo = () => {
        const formData = new URLSearchParams();
        formData.append("customerId", customerStorage?.CU_ID);
        formData.append("firmId", customerStorage.DX_CU_FIRM_ID);
        dispatch(getCuPoSerialItems(formData));
    }

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        fetchSerialNo();
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'normal' ? 'grouped' : 'normal');
        setCurrentPage(1);
    };

    const groupedSerialNumbers = useMemo(() => {
        if (!poSerialNo) return [];

        const grouped = {};

        poSerialNo.forEach(item => {
            const key = `${item.companyId}_${item.nameId}`;
            if (!grouped[key]) {
                grouped[key] = {
                    _id: item._id,
                    name: item.name,
                    companyName: item.companyName,
                    companySerialNo: [item.companySerialNo],
                    companyId: item.companyId,
                    nameId: item.nameId
                };
            } else {
                // Add serial number if it's not already present
                if (!grouped[key].companySerialNo.includes(item.companySerialNo)) {
                    grouped[key].companySerialNo.push(item.companySerialNo);
                }
            }
        });

        return Object.values(grouped);
    }, [poSerialNo]);

    const getCurrentColumnsConfig = () => {
        return viewMode === 'normal' ? normalColumnsConfig : groupedColumnsConfig;
    };


    const getFilteredData = () => {
        const data = viewMode === 'normal' ? poSerialNo : groupedSerialNumbers;

        if (!data) return [];

        let filteredData = [...data];

        if (search) {
            filteredData = filteredData.filter((it) => {
                const searchLower = search.toLowerCase();
                return (
                    it.name?.toLowerCase()?.includes(searchLower) ||
                    it.companyName?.toLowerCase()?.includes(searchLower) ||
                    (viewMode === 'normal'
                        ? it.companySerialNo?.toLowerCase()?.includes(searchLower) ||
                        it.poNo?.toLowerCase()?.includes(searchLower) ||
                        it.poVoucherNo?.toLowerCase()?.includes(searchLower)
                        : it.companySerialNo?.some(sn => sn?.toLowerCase()?.includes(searchLower))
                    )
                )
            });
        }

        return filteredData;
    };


    const commentsData = useMemo(() => {
        const filteredData = getFilteredData();
        setTotalItems(filteredData?.length);
        return filteredData?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, poSerialNo, groupedSerialNumbers, viewMode]);

    // Function to render serial numbers as numbered list in grouped view
    const renderSerialNumbers = (serialNumbers) => {
        return (
            <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0 }}>
                {serialNumbers.map((sn, index) => (
                    <li key={index}>{sn}</li>
                ))}
            </ol>
        );
    };

    const handleProductReceive = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to mark this product as received?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, receive it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(getCuPoProductReceive(id));
            }
        });
    }


    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader
                    name={"Order History List"}
                    count={getFilteredData()?.length}
                    handleRefresh={handleRefresh}
                />

                {poSerialNoLoading && (
                    <div className="text-center py-4">
                        <LoadingSpinner text="" size="md" />
                    </div>
                )}

                {poSerialNoError && (
                    <div className="alert alert-danger text-center" role="alert">
                        {poSerialNoError || "Something went wrong while fetching data."}
                    </div>
                )}

                {!poSerialNoLoading && !poSerialNoError && (
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
                                <div className="col-sm-8 text-end">
                                    <button
                                        className="btn btn-primary"
                                        onClick={toggleViewMode}
                                    >
                                        {viewMode === 'normal' ? 'Group View' : 'Normal View'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <TableFilter
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                                columnsConfig={getCurrentColumnsConfig()}
                                isHideSave={true}
                            />
                            <div className=" custom-table table-responsive" style={{ minHeight: "0px" }}>
                                <table className="table">
                                    <thead className="thead-light text-center">
                                        <tr>
                                            <th>Sr.</th>
                                            {getCurrentColumnsConfig().map(col => visibleColumns[col.key] && <th key={col.key}>{col.label}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {commentsData?.map((elem, i) => (
                                            <tr key={elem?._id}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                {visibleColumns.name && <td>{elem.name}</td>}
                                                {visibleColumns.companyName && <td>{elem.companyName}</td>}
                                                {visibleColumns.companySerialNo && (
                                                    <td>
                                                        {viewMode === 'grouped'
                                                            ? renderSerialNumbers(elem.companySerialNo)
                                                            : elem.companySerialNo}
                                                    </td>
                                                )}
                                                {viewMode === 'normal' && visibleColumns.customerPoNo && <td>{elem.poNo}</td>}
                                                {viewMode === 'normal' && visibleColumns.poVoucherNo && <td>{elem.poVoucherNo}</td>}
                                                {/* {viewMode === 'normal' && visibleColumns.poAdminInvoice && (
                                                    <td className="">
                                                        <a
                                                            href={elem.poAdminInvoice}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                                                            title="Download Admin Invoice"
                                                        >
                                                            <i className="ti ti-download me-1"></i>
                                                            <span>Invoice</span>
                                                        </a>
                                                    </td>
                                                )}  */}

                                                {viewMode === 'normal' && visibleColumns.poCompanyDispatch && (
                                                    <td className="">
                                                        <a
                                                            href={elem.poCompanyDispatch}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
                                                            title="Download Dispatch Document"
                                                        >
                                                            <i className="ti ti-download me-1"></i>
                                                            <span>Dispatch</span>
                                                        </a>
                                                    </td>
                                                )}
                                                
                                                <td>
                                                    {elem.poStatus === 6 ? (
                                                        <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleProductReceive(elem.poId)}
                                                        >
                                                        <i className="ti ti-check me-1 fw-bolder text-success" /> 
                                                        Receive Product
                                                        </button>
                                                    ) : elem.poStatus === 7 ? (
                                                        <button className="btn btn-sm btn-success" disabled>
                                                        <i className="ti ti-check me-1 fw-bolder text-white" /> Product Received
                                                        </button>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                        {commentsData?.length === 0 && (
                                            <tr>
                                                <td colSpan={Object.keys(visibleColumns).filter(k => visibleColumns[k]).length + 2}>
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

export default ProductSerialList