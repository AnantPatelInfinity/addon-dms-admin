import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../../../ui/admin/PageHeader';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import { useApi } from '../../../../context/ApiContext';
import { Link } from 'react-router';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { Pagination, Search } from '../../../../components/Form';
import DropDown from '../../../../components/Form/DropDown';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const ProductModel = () => {
    const { post, deleteById } = useApi();
    const [entity, setEntity] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [limit, setlimit] = useState(10);
    const adminStorage = getAdminStorage();

    useEffect(() => {
        if (loading === true) {
            getProModelData();
        }
    }, [loading]);

    const getProModelData = async () => {
        try {
            const formData = {
                "firmId": adminStorage.DX_AD_FIRM
            }
            const result = await post("/admin/get-product-model", formData);
            const { data, success } = result;
            if (success) {
                setEntity(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error, 'Error')
        }
    }

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        setLoading(true);
    };

    const commentsData = useMemo(() => {
        let computedComments = entity || [];
        if (search) {
            computedComments = computedComments.filter((it) =>
                it.name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

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
                const response = await deleteById(`/admin/delete-product-model`, elem._id);
                if (response.success) {
                    Swal.fire("Deleted!", `${elem.name} has been deleted.`, "success");
                    setLoading(true);
                } else {
                    Swal.fire("Error!", response.message || "Failed to delete product category.", "error");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", error?.response?.data?.message || "Something went wrong while deleting.", "error");
            }
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <PageHeader
                    name={"Product Model List"}
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
                            <div className="col-sm-8">
                                <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
                                    <div className="dropdown me-2"></div>
                                    <Link
                                        to={ADMIN_URLS.MANAGE_PRO_MODEL}
                                        className="btn btn-primary"
                                    >
                                        <i className="ti ti-square-rounded-plus me-2" />
                                        Add Product Model
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loading ? <LoadingSpinner text='' size='md' /> : (
                        <div className="card-body">
                            <div className=" custom-table table-responsive ">
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Company</th>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) => (
                                            <tr key={elem?._id}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                <td>{elem?.companyName}</td>
                                                <td>{elem?.name}</td>
                                                <td>
                                                    {elem?.status === true ? (
                                                        <span className="badge badge-pill badge-status bg-success">Active</span>
                                                    ) : (
                                                        <span className="badge badge-pill badge-status bg-danger">Inactive</span>
                                                    )}
                                                </td>
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
                                                            <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_PRO_MODEL} state={elem}>
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

export default ProductModel