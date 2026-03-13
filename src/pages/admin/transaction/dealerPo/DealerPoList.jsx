import React, { useEffect, useMemo, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import { Pagination, Search } from '../../../../components/Form';
import DropDown from '../../../../components/Form/DropDown';
import TableFilter from '../../../../components/TableFilter/TableFilter';
import PageHeader from '../../../../ui/admin/PageHeader';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import DateTime from '../../../../helpers/DateFormat/DateTime';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { getModuleKey } from '../../../../config/DataFile';
import { toast } from 'react-toastify';

const DealerPoList = () => {
  const { get, post } = useApi();
  const [entity, setEntity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const adminStorage = getAdminStorage();

  const columnsConfig = [
    { key: "voucherNo", label: "PO No" },
    { key: "poDate", label: "PO Date" },
    { key: "dealerName", label: "Dealer Name" },
    { key: "firmName", label: "Firm" },
    { key: "customerName", label: "Customer" },
    { key: "shipTo.state", label: "State" },
    { key: "totalQuantity", label: "Total Qty" },
    { key: "totalAmount", label: "Total Amount" },
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
  //   const initialState = {};
  //   columnsConfig.forEach((col) => (initialState[col.key] = true));
  //   return initialState;
  // });

  useEffect(() => {
    if (loading === true) {
      getPoData();
    }
  }, [loading]);

  const getPoData = async () => {
    try {
      setLoading(true)
      const formData = new URLSearchParams();
      formData.append("firmId", adminStorage.DX_AD_FIRM);
      const url = `/admin/get-dealer-po`;
      const response = await post(url, formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      const { data, success } = response;
      if (success) {
        setEntity(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
        it.voucherNo?.toLowerCase()?.includes(search?.toLowerCase()) ||
        it.customerName?.toLowerCase()?.includes(search?.toLowerCase()) ||
        it.dealerName?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);

  const handleStatusUpdate = async (po, status) => {
    const statusTextMap = {
      1: 'set to Pending',
      2: 'Approve',
      3: 'Reject'
    };
    const statusText = statusTextMap[status];

    let rejectReason = "";

    if (status === 3) {
      const { value: reason } = await Swal.fire({
        title: 'Reject Reason',
        input: 'textarea',
        inputLabel: 'Please provide a reason for rejection:',
        inputPlaceholder: 'Enter rejection reason here...',
        inputAttributes: {
          'aria-label': 'Rejection reason'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'You must provide a reason!';
          }
        }
      });

      if (!reason) return;
      rejectReason = reason;
    }

    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${statusText} this PO?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${statusText}`,
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        const formData = {
          status: status,
          rejectReason: status === 3 ? rejectReason : null
        };

        const response = await post(`/admin/approve-dealer-po/${po._id}`, formData);

        if (response.success) {
          Swal.fire("Success", `PO ${statusText} successfully!`, "success");
          setLoading(true);
        } else {
          Swal.fire("Error", response.message || "Something went wrong.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "An error occurred while updating status.", "error");
      }
    }
  };

  const formatAmount = (amount) => {
    return amount ? `₹${amount.toLocaleString('en-IN')}` : "-";
  };

  const handleDownload = async (poId) => {
    try {
      const response = await get(`/admin/download-dealer-po/${poId}`);
      const { data, message, success } = response


      if (success) {
        window.open(data?.file, '_blank');
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error, "Error")
      toast.error(error?.response?.data?.message || "Something went wrong while downloading the file. Please try again later.");
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"Delaer PO List"} count={entity?.length} handleRefresh={handleRefresh} />

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
                        {visibleColumns["voucherNo"] && <td>{elem?.voucherNo || "-"}</td>}
                        {visibleColumns["poDate"] && <td>{elem?.poDate ? <DateTime value={elem?.poDate} format='date' /> : "-"}</td>}
                        {visibleColumns["dealerName"] && <td>{elem?.dealerName || "-"}</td>}
                        {visibleColumns["firmName"] && <td>{elem?.firmName || "-"}</td>}
                        {visibleColumns["customerName"] && <td>{elem?.customerName || "-"}</td>}
                        {visibleColumns["shipTo.state"] && <td>{elem?.shipTo?.state || "-"}</td>}
                        {visibleColumns["totalQuantity"] && <td>{elem?.totalQuantity || "-"}</td>}
                        {visibleColumns["totalAmount"] && <td>{formatAmount(elem?.totalAmount)}</td>}
                        {visibleColumns["status"] && (
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
                              "-"
                            )}
                          </td>
                        )}

                        <td style={{ textAlign: "end" }}>
                          <div className="dropdown table-action">
                            <a href="#" className="action-icon" data-bs-toggle="dropdown">
                              <i className="fa fa-ellipsis-v" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <Link className="dropdown-item" to={`${ADMIN_URLS.VIEW_DEALER_PO}/${elem?._id}`}>
                                <i className="ti ti-eye text-indigo" /> View
                              </Link>
                              {elem?.status !== 1 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 1)}>
                                  <i className="fe fe-check-circle text-warning" /> Pending
                                </Link>
                              )}
                              {elem?.status !== 2 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 2)}>
                                  <i className="fe fe-check-circle text-success" /> Approve
                                </Link>
                              )}
                              {elem?.status !== 3 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 3)}>
                                  <i className="fa-solid fa-xmark text-danger" /> Rejected
                                </Link>
                              )}
                              <button
                                className="dropdown-item"
                                onClick={() => handleDownload(elem._id)}
                              >
                                <i className="ti ti-arrow-down text-info me-1" />
                                Download PO
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {commentsData?.length === 0 && (
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

export default DealerPoList