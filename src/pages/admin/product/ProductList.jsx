import React, { useEffect, useMemo, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import ADMIN_URLS from '../../../config/routesFile/admin.routes';
import { Link } from 'react-router';
import DropDown from '../../../components/Form/DropDown';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import ProductFilter from '../../../components/Admin/Product/ProductFilter';
import Swal from 'sweetalert2';
import moment from 'moment';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getModuleKey } from '../../../config/DataFile';

const ProductList = () => {

    const { get, deleteById } = useApi();
    const [entity, setEntity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const adminStorage = getAdminStorage();
    const [filters, setFilters] = useState({
        categoryName: [],
        companyName: [],
        status: [],
        priceStatus: []
    });

    const columnsConfig = [
        { key: "name", label: "Name" },
        { key: "categoryName", label: "Category" },
        { key: "companyName", label: "Company" },
        { key: "price", label: "Dealer Price(₹)" },
        { key: "customerPrice", label: "Customer Price(₹)" },
        { key: "companyPrice", label: "Company Price(₹)" },
        { key: "createdAt", label: "Date" },
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

    useEffect(() => {
        if (loading === true) {
            getProductData()
        }
    }, [loading]);

    const getProductData = async () => {
        try {
            setLoading(true)
            const response = await get(`/admin/get-products?firmId=${adminStorage.DX_AD_FIRM}`);
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

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        setLoading(true);
        setFilters({
            categoryName: [],
            companyName: [],
            status: [],
            priceStatus: []
        });
    };

    const handleFilterChange = (key, value, isChecked) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (isChecked) {
                newFilters[key] = [...newFilters[key], value];
            } else {
                newFilters[key] = newFilters[key].filter(v => v !== value);
            }
            return newFilters;
        });
        setCurrentPage(1);
    };

    const getPriceStats = () => {
        if (!entity || !entity.length) return {};

        const stats = {
            total: entity.length,
            missingPrice: 0,
            missingCustomerPrice: 0,
            missingCompanyPrice: 0,
            zeroPrice: 0,
            zeroCustomerPrice: 0,
            zeroCompanyPrice: 0
        };

        entity.forEach(item => {
            if (!item.price || item.price === 0) stats.missingPrice++;
            if (!item.customerPrice || item.customerPrice === 0) stats.missingCustomerPrice++;
            if (!item.companyPrice || item.companyPrice === 0) stats.missingCompanyPrice++;
            if (item.price === 0) stats.zeroPrice++;
            if (item.customerPrice === 0) stats.zeroCustomerPrice++;
            if (item.companyPrice === 0) stats.zeroCompanyPrice++;
        });

        return stats;
    };

    const priceStats = useMemo(getPriceStats, [entity]);

    const commentsData = useMemo(() => {
        let computedComments = entity || [];
        if (search) {
            computedComments = computedComments.filter((it) =>
                it.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                it.serialNo?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }

        if (filters.categoryName.length > 0) {
            computedComments = computedComments.filter(item =>
                filters.categoryName.includes(item.categoryName))
        }
        if (filters.companyName.length > 0) {
            computedComments = computedComments.filter(item =>
                filters.companyName.includes(item.companyName))
        }
        if (filters.status.length > 0) {
            computedComments = computedComments.filter(item =>
                filters.status.includes(item.status))
        }

        if (filters.priceStatus.length > 0) {
            computedComments = computedComments.filter(item => {
                return filters.priceStatus.some(condition => {
                    switch (condition) {
                        case 'missingPrice':
                            return !item.price && item.price !== 0;
                        case 'zeroPrice':
                            return item.price === 0;
                        case 'missingCustomerPrice':
                            return !item.customerPrice && item.customerPrice !== 0;
                        case 'zeroCustomerPrice':
                            return item.customerPrice === 0;
                        case 'missingCompanyPrice':
                            return !item.companyPrice && item.companyPrice !== 0;
                        case 'zeroCompanyPrice':
                            return item.companyPrice === 0;
                        case 'hasAllPrices':
                            return item.price && item.price !== 0 &&
                                item.customerPrice && item.customerPrice !== 0 &&
                                item.companyPrice && item.companyPrice !== 0;
                        default:
                            return true;
                    }
                });
            });
        }

        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity, filters]);

    const handleDelete = async (elem) => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete ${elem.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirmResult.isConfirmed) {
            try {
                const response = await deleteById(`/admin/delete-product`, elem._id);
                if (response.success) {
                    Swal.fire("Deleted!", `${elem.name} has been deleted.`, "success");
                    setLoading(true);
                } else {
                    Swal.fire("Error!", response.message || "Failed to delete product.", "error");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", error?.response?.data?.message || "Something went wrong while deleting.", "error");
            }
        }
    };

    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader
                    name={"Product List"}
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
                                    <Search onSearch={(value) => {
                                        setSearch(value);
                                        setCurrentPage(1);
                                    }} />
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
                                    <div className="dropdown me-2"></div>
                                    <Link to={ADMIN_URLS.MANAGE_PRODUCT} className="btn btn-primary">
                                        <i className="ti ti-square-rounded-plus me-2" />
                                        Add Products
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loading ? <LoadingSpinner text='' size='md' /> : (
                        <div className="card-body">
                            <ProductFilter
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                                toggleColumn={toggleColumn}
                                columnsConfig={columnsConfig}
                                entity={entity}
                                onFilterChange={handleFilterChange}
                                onResetFilters={handleRefresh}
                                moduleKey={moduleKey}
                                priceStats={priceStats}
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
                                                {visibleColumns.name && <td>{elem.name}</td>}
                                                {visibleColumns.categoryName && <td>{elem.categoryName}</td>}
                                                {visibleColumns.companyName && <td>{elem.companyName}</td>}
                                                {visibleColumns.price && (
                                                    <td className={(!elem.price || elem.price === 0) ? 'text-danger' : ''}>
                                                        {elem.price || 'N/A'}
                                                    </td>
                                                )}
                                                {visibleColumns.customerPrice && (
                                                    <td className={(!elem.customerPrice || elem.customerPrice === 0) ? 'text-danger' : ''}>
                                                        {elem.customerPrice || 'N/A'}
                                                    </td>
                                                )}
                                                {visibleColumns.companyPrice && (
                                                    <td className={(!elem.companyPrice || elem.companyPrice === 0) ? 'text-danger' : ''}>
                                                        {elem.companyPrice || 'N/A'}
                                                    </td>
                                                )}
                                                {visibleColumns.createdAt && <td>{moment(elem.createdAt).format("DD-MM-YYYY")}</td>}
                                                {visibleColumns.status && (
                                                    <td>
                                                        {elem.status ? (
                                                            <span className="badge bg-success">Active</span>
                                                        ) : (
                                                            <span className="badge bg-danger">Inactive</span>
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
                                                            <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_PRODUCT} state={elem}>
                                                                <i className="ti ti-edit text-blue" /> Edit
                                                            </Link>
                                                            <Link className="dropdown-item" onClick={() => handleDelete(elem)}>
                                                                <i className="ti ti-trash text-danger" /> Delete
                                                            </Link>
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

export default ProductList