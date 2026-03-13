import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "../../../context/ApiContext";
import PageHeader from "../../../ui/admin/PageHeader";
import { Pagination, Search } from "../../../components/Form";
import { Link } from "react-router";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import DropDown from "../../../components/Form/DropDown";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import Swal from "sweetalert2";
import TableFilter from "../../../components/TableFilter/TableFilter";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { getModuleKey } from "../../../config/DataFile";

const DealerList = () => {
  const { get, deleteById, post } = useApi();
  const [entity, setEntity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const adminStorage = getAdminStorage();

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
    columnsConfig.forEach((col) => (defaultState[col.key] = true));
    return defaultState;
  };
  const [visibleColumns, setVisibleColumns] = useState(
    getDefaultVisibleColumns
  );

  // const [visibleColumns, setVisibleColumns] = useState(() => {
  //     const initialState = {};
  //     columnsConfig.forEach((col) => (initialState[col.key] = true));
  //     return initialState;
  // });

  useEffect(() => {
    if (loading === true) {
      getDealerData();
    }
  }, [loading]);

  const getDealerData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `/admin/get-dealer?firmId=${adminStorage.DX_AD_FIRM}`
      );
      const { data, success } = response;
      if (success) {
        setEntity(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    setLoading(true);
  };

  const commentsData = useMemo(() => {
    let computedComments = entity || [];
    if (search) {
      computedComments = computedComments.filter(
        (it) =>
          it.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          it.email?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);

  // Status actions moved to ViewDealer page

  const handleDelete = async (elem) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${elem.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await deleteById(`/admin/delete-dealer`, elem._id);
        if (response.success) {
          Swal.fire("Deleted!", `${elem.name} has been deleted.`, "success");
          setLoading(true);
        } else {
          Swal.fire(
            "Error!",
            response.message || "Failed to delete dealer.",
            "error"
          );
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error!",
          error?.response?.data?.message ||
            "Something went wrong while deleting.",
          "error"
        );
      }
    }
  };

  const handleStatusUpdate = async (elem, status) => {
    const actionLabel = status === 2 ? 'Approve' : status === 3 ? 'Reject' : 'Pending';
    const confirmButtonColor = status === 2 ? '#28a745' : status === 3 ? '#dc3545' : '#ffc107';
    const confirmResult = await Swal.fire({
      title: `${actionLabel} this dealer?`,
      text: `Are you sure you want to set ${elem?.name} to ${actionLabel.toLowerCase()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${actionLabel}`,
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await post(`/admin/update-dealer-status/${elem?._id}?status=${status}`);
        if (response.success) {
          Swal.fire('Updated!', `${elem?.name} status updated to ${actionLabel}.`, 'success');
          setLoading(true); 
        } else {
          Swal.fire('Error!', response.message || 'Something went wrong.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong while updating status.', 'error');
      }
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Dealer List"}
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
                    to={ADMIN_URLS.MANAGE_DEALER}
                    className="btn btn-primary"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Dealer
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner text="" size="md" />
          ) : (
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
                    {commentsData?.map((elem, i) => (
                      <tr key={elem?._id}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        {visibleColumns.name && <td>{elem.name}</td>}
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
                              <Link
                                className="dropdown-item"
                                to={ADMIN_URLS.VIEW_DEALER}
                                state={elem}
                              >
                                <i className="ti ti-eye text-blue" /> View
                              </Link>
                              <Link
                                className="dropdown-item"
                                to={ADMIN_URLS.MANAGE_DEALER}
                                state={elem}
                              >
                                <i className="ti ti-edit text-blue" /> Edit
                              </Link>
                              <Link
                                className="dropdown-item"
                                onClick={() => handleDelete(elem)}
                              >
                                <i className="ti ti-trash text-danger" /> Delete
                              </Link>
                              {elem.status === 1 && (
                                <>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleStatusUpdate(elem, 2)}
                                  >
                                    <i className="ti ti-check text-success" /> Approve
                                  </button>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleStatusUpdate(elem, 3)}
                                  >
                                    <i className="ti ti-x text-danger" /> Reject
                                  </button>
                                </>
                              )}
                              
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {commentsData?.length === 0 ? (
                      <tr>
                        <td colSpan="999">
                          <div className="no-table-data">No Data Found!</div>
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
                        <DropDown
                          limit={limit}
                          onLimitChange={(val) => setlimit(val)}
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

export default DealerList;
