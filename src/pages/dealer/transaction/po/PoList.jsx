import React, { useEffect, useMemo, useState } from 'react'
import { useDealerApi } from '../../../../context/DealerApiContext';
import { getDealerStorage } from '../../../../components/LocalStorage/DealerStorage';
import { Pagination, Search } from '../../../../components/Form';
import DropDown from '../../../../components/Form/DropDown';
import DEALER_URLS from '../../../../config/routesFile/dealer.routes';
import TableFilter from '../../../../components/TableFilter/TableFilter';
import PageHeader from '../../../../ui/admin/PageHeader';
import { Link } from 'react-router';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerPoList, getDePoDownload, resetDePoDownload } from '../../../../middleware/dealerPo/dealerPo';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { getModuleKey } from '../../../../config/DataFile';
import { toast } from 'react-toastify';

const PoList = () => {

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const dealerStorage = getDealerStorage();
  const dispatch = useDispatch();

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

  const {
    dealerPoList,
    dealerPoListLoading,
    dealerPoListError,

    dePoDownloadError,
    dePoDownloadLoading,
    dePoDownloadMessage,
    dePoDownload
  } = useSelector((state) => state?.dealerPo);

  useEffect(() => {
    if (dePoDownloadMessage) {
      toast.success(dePoDownloadMessage);
      window.open(dePoDownload.file, '_blank');
      dispatch(resetDePoDownload())
    }

    if (dePoDownloadError) {
      toast.error(dePoDownloadError)
      dispatch(resetDePoDownload())
    }
  }, [dePoDownloadError, dePoDownloadMessage, dePoDownload])

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("dealerId", dealerStorage?.DL_ID);
    dispatch(getDealerPoList(formData));
  }

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData()
  };

  const commentsData = useMemo(() => {
    let computedComments = dealerPoList || [];
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
  }, [currentPage, search, limit, dealerPoList]);

  const formatAmount = (amount) => {
    return amount ? `₹${amount.toLocaleString('en-IN')}` : "-";
  };

  const handleDownload = (poId) => {
    dispatch(getDePoDownload(poId))
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"PO List"} count={dealerPoList?.length} handleRefresh={handleRefresh} />

        {dealerPoListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text="" size="md" />
          </div>
        )}

        {dealerPoListError && (
          <div className="alert alert-danger text-center" role="alert">
            {dealerPoListError || "Something went wrong while fetching data."}
          </div>
        )}
        {!dealerPoListLoading && !dealerPoListError && (
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
                        {visibleColumns["poDate"] && <td>{elem?.poDate ? moment(elem?.poDate).format("DD-MM-YYYY") : "-"}</td>}
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
                              <Link className="dropdown-item" to={DEALER_URLS.VIEW_PO} state={elem?._id}>
                                <i className="ti ti-eye text-indigo" /> View
                              </Link>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default PoList