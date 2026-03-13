import React, { useEffect, useMemo, useState } from "react";
import { getCompanyStorage } from "../../../components/LocalStorage/CompanyStorage";
import { useDispatch, useSelector } from "react-redux";
import { getModuleKey, statusList } from "../../../config/DataFile";
import PageHeader from "../../../ui/admin/PageHeader";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import {
  DeleteComUser,
  EditComUser,
  getComUserList,
  resetComDeleteUser,
  resetComEditUser,
} from "../../../middleware/companyUser/companyUserList/comUser";
import { Pagination, Search } from "../../../components/Form";
import DropDown from "../../../components/Form/DropDown";
import COMPANY_URLS from "../../../config/routesFile/company.routes";
import { Link, useNavigate, useNavigationType } from "react-router";
import TableFilter from "../../../components/TableFilter/TableFilter";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [search, setSearch] = useState("");

  const compayStorage = getCompanyStorage();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, [currentPage, search, limit]);

  const columnsConfig = [
    { key: "image", label: "image" },
    { key: "name", label: "Name" },
    { key: "email", label: "email" },
    { key: "phone", label: "phone" },
    { key: "role", label: "role" },
    { key: "status", label: "status" },
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

  const {
    comUserError,
    comUserList,
    comUserLoading,

    comDeleteUserError,
    comDeleteUserMessage,

    comEditUserMessage,
    comEditUserError,
  } = useSelector((state) => state.comUser);

  useEffect(() => {
    if (comDeleteUserMessage) {
      toast.success(comDeleteUserMessage);
      dispatch(resetComDeleteUser());
      fetchData();
    }
    if (comDeleteUserError) {
      toast.error(comDeleteUserError);
      dispatch(resetComDeleteUser());
    }
  }, [comDeleteUserMessage, comDeleteUserError]);

  useEffect(() => {
    if (comEditUserMessage) {
      toast.success(comEditUserMessage);
      dispatch(resetComEditUser());
      fetchData();
    }
    if (comEditUserError) {
      toast.error(comEditUserError);
      dispatch(resetComEditUser());
    }
  }, [comEditUserError, comEditUserMessage]);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", compayStorage?.comId);
    formData.append("page", currentPage);
    formData.append("limit", limit);
    formData.append("search", search);
    dispatch(getComUserList(formData));
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData();
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Delete this User?",
      text: "Are you sure you want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    });

    if (confirmResult.isConfirmed) {
      dispatch(DeleteComUser(id));
    }
  };

  const handleStatusUpdate = async (elem, status) => {
    const actionLabel =
      status === 2 ? "Approve" : status === 3 ? "Reject" : "Pending";
    const confirmButtonColor =
      status === 2 ? "#28a745" : status === 3 ? "#dc3545" : "#ffc107";
    const confirmResult = await Swal.fire({
      title: `${actionLabel} this User?`,
      text: `Are you sure you want to set ${
        elem?.name
      } to ${actionLabel.toLowerCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${actionLabel}`,
    });

    if (confirmResult.isConfirmed) {
      dispatch(EditComUser(elem._id, { status }));
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"User List"}
          count={comUserList?.pagination?.totalUsers}
          handleRefresh={handleRefresh}
        />

        {comUserError && (
          <div className="alert alert-danger text-center" role="alert">
            {comUserError || "Something went wrong while fetching data."}
          </div>
        )}

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
                    to={COMPANY_URLS.MANAGE_USERS}
                    className="btn btn-primary"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add User
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
                  {comUserLoading ? (
                    <tr>
                      <td colSpan="10">
                        <div className="text-center py-4">
                          <LoadingSpinner text="" size="md" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    comUserList?.users?.map((elem, i) => (
                      <tr key={elem?._id}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        {visibleColumns.image && (
                          <td>
                            <img
                              height="40"
                              width="40"
                              className="img-fluid"
                              src={elem?.image || "/assets/img/default.jpg"}
                              alt="User Image"
                            />
                          </td>
                        )}
                        {visibleColumns.name && <td>{elem.name || "N/A"}</td>}
                        {visibleColumns.email && <td>{elem.email || "N/A"}</td>}
                        {visibleColumns.phone && <td>{elem.phone || "N/A"}</td>}
                        {visibleColumns.role && <td>{elem.role || "N/A"}</td>}
                        {visibleColumns.status && (
                          <td>  
                            {elem.deleted === true ? (
                              <span className="badge badge-pill badge-status bg-danger">
                                Deleted
                              </span>
                            ) : elem.status === 1 ? (
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
                              <span className="badge badge-pill badge-status bg-secondary">
                                Unknown
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
                            >
                              <i className="fa fa-ellipsis-v" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <Link
                                className="dropdown-item"
                                to={COMPANY_URLS.VIEW_USER}
                                state={elem}
                              >
                                <i className="ti ti-eye text-blue" /> View
                              </Link>
                              <Link
                                className="dropdown-item"
                                to={COMPANY_URLS.MANAGE_USERS}
                                state={elem}
                              >
                                <i className="ti ti-edit text-blue" /> Edit
                              </Link>
                              {!elem.deleted && (
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDelete(elem._id)}
                                >
                                  <i className="ti ti-trash text-danger" /> Delete
                                </button>
                              )}

                              {elem.status === 1 && !elem.deleted && (
                                <>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleStatusUpdate(elem, 2)}
                                  >
                                    <i className="ti ti-check text-success" />{" "}
                                    Approve
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
                    ))
                  )}
                  {comUserList?.users?.length === 0 && (
                    <tr>
                      <td colSpan="10">
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
                  <div className="dataTables_length" id="contracts-list_length">
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
                total={comUserList?.pagination?.totalUsers || 0}
                itemsPerPage={limit}
                currentPage={
                  comUserList?.pagination?.currentPage || currentPage
                }
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
