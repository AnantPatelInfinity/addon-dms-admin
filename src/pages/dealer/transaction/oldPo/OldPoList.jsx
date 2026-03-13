import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Search } from "../../../../components/Form";
import DropDown from "../../../../components/Form/DropDown";
import PageHeader from "../../../../ui/admin/PageHeader";
import TableFilter from "../../../../components/TableFilter/TableFilter";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router";
import DEALER_URLS from "../../../../config/routesFile/dealer.routes";
import { getModuleKey } from "../../../../config/DataFile";
import { useDispatch, useSelector } from "react-redux";
import { getDealerOldPoData } from "../../../../middleware/oldPo/dealerOldPo";
import moment from "moment";
import { getDealerStorage } from "../../../../components/LocalStorage/DealerStorage";
import Swal from "sweetalert2";
import { useDealerApi } from "../../../../context/DealerApiContext";
import { toast } from "react-toastify";

const OldPoList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const { deleteById } = useDealerApi();

  const dealerStorage = getDealerStorage();
  const dispatch = useDispatch();

  const { dealerOldPoList, dealerOldPoListLoading, dealerOldPoListError } =
    useSelector((state) => state.dealerOldPo);

  const dealerListData = dealerOldPoList?.data || [];
  const pagination = dealerOldPoList?.pagination || {};

  useEffect(() => {
    if (!dealerStorage?.DL_ID) return;

    dispatch(
      getDealerOldPoData({
        dealerId: dealerStorage.DL_ID,
        page: currentPage,
        limit: limit,
      })
    );
  }, [dealerStorage?.DL_ID, currentPage, limit]);

  useEffect(() => {
    if (pagination?.total) {
      setTotalItems(pagination.total);
    }
  }, [pagination]);

  const columnsConfig = [
    { key: "voucher_no", label: "Voucher No" },
    { key: "po_date", label: "PO Date" },
    { key: "company_name", label: "Company Name" },
    { key: "po_no", label: "PO No." },
    { key: "items_count", label: "PO Items Count" },
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

  const filteredData = useMemo(() => {
    let data = dealerListData;

    if (search) {
      data = data.filter(
        (item) =>
          item.voucher_no?.toLowerCase().includes(search.toLowerCase()) ||
          item.po_no?.toLowerCase().includes(search.toLowerCase()) ||
          item.company_data?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [dealerListData, search]);

  const handleRefresh = () => {
    setSearch("");
    dispatch(
      getDealerOldPoData({
        dealerId: dealerStorage.DL_ID,
        page: currentPage,
        limit: limit,
      })
    );
    setCurrentPage(1);
    setLimit(10);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteById(`/dealer/delete-old-po`, id);

      if (res?.success === true) {
        toast.success(res?.message || "PO Deleted Successfully");

        await Swal.fire({
          title: "Deleted!",
          text: "PO deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        dispatch(
          getDealerOldPoData({
            dealerId: dealerStorage.DL_ID,
            page: currentPage,
            limit: limit,
          })
        );
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Server error while deleting PO"
      );
      console.log("Server error while deleting PO");
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name="Old PO List"
          count={totalItems}
          handleRefresh={handleRefresh}
        />

        {/* Loading  */}
        {dealerOldPoListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text="" size="md" />
          </div>
        )}

        {/* Error  */}
        {dealerOldPoListError && (
          <div className="alert alert-danger text-center">
            {dealerOldPoListError || "Something went wrong."}
          </div>
        )}

        {!dealerOldPoListLoading && !dealerOldPoListError && (
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-sm-4">
                  <div className="icon-form mb-3 mb-sm-0">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <Search
                      onSearch={(val) => {
                        setSearch(val);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="d-flex justify-content-sm-end">
                    <Link
                      to={DEALER_URLS.MANAGE_OLD_PO}
                      className="btn btn-primary"
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Old PO
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
                      filteredData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>

                          {visibleColumns.voucher_no && (
                            <td>{item.voucher_no}</td>
                          )}

                          {visibleColumns.po_date && (
                            <td>{moment(item.po_date).format("DD-MM-YYYY")}</td>
                          )}

                          {visibleColumns.company_name && (
                            <td>{item.company_data?.name}</td>
                          )}

                          {visibleColumns.po_no && <td>{item.po_no}</td>}

                          {visibleColumns.items_count && (
                            <td>{item.items_count}</td>
                          )}

                          <td className="text-end">
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
                                  to={DEALER_URLS.VIEW_OLD_PO}
                                  state={item}
                                  className="dropdown-item"
                                >
                                  <i className="ti ti-eye text-green" /> View
                                </Link>
                                <Link
                                  to={DEALER_URLS.MANAGE_OLD_PO}
                                  state={item}
                                  className="dropdown-item"
                                >
                                  <i className="ti ti-edit text-blue" /> Edit
                                </Link>

                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <i className="ti ti-trash text-danger" />{" "}
                                  Delete
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OldPoList;
