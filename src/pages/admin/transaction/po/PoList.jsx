import React, { useEffect, useMemo, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import PageHeader from '../../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../../components/Form';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { Link } from 'react-router';
import DropDown from '../../../../components/Form/DropDown';
import TableFilter from '../../../../components/TableFilter/TableFilter';
import DateTime from '../../../../helpers/DateFormat/DateTime';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { getModuleKey } from '../../../../config/DataFile';
import Swal from 'sweetalert2';

const PoList = () => {

  const { get, post } = useApi();
  const [entity, setEntity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const adminStorage = getAdminStorage();
  const [downloadingId, setDownloadingId] = useState(null);

  const columnsConfig = [
    { key: "voucherNo", label: "Order No" },
    { key: "poDate", label: "PO Date" },
    { key: "companyName", label: "Company" },
    { key: "destination", label: "Destination" },
    { key: "termsOfDelivery", label: "Terms of Delivery" },
    { key: "termsOfPayment", label: "Terms of Payment" },
    { key: "totalQuantity", label: "Total Qty" },
    { key: "totalAmount", label: "Total Amt." },
    { key: "status", label: "Status" },
  ]

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
      getPoData();
    }
  }, [loading]);

  const getPoData = async () => {
    try {
      setLoading(true)
      const response = await get(`/admin/get-po?firmId=${adminStorage.DX_AD_FIRM}&isDealer=${false}`);
      const { data, success } = response;
      if (success) {
        setEntity(data);
      }
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

  const getUniqueOptions = (field) => {
    if (field === 'status') {
      return ['Pending', 'Admin Invoice', 'Company Invoice', 'Receive Pending', 'Completed', 'Rejected'];
    }
    const values = entity.map(item => {
      if (field === 'poDate') {
        return item.poDate ? item.poDate.split('T')[0] : '-';
      }
      return item[field] ?? '-';
    });
    return Array.from(new Set(values)).filter(v => v && v !== '-');
  };

  const filterFields = [
    { key: "voucherNo", label: "Order No" },
    { key: "poDate", label: "PO Date" },
    { key: "companyName", label: "Company" },
    { key: "destination", label: "Destination" },
    { key: "termsOfDelivery", label: "Terms of Delivery" },
    { key: "termsOfPayment", label: "Terms of Payment" },
    { key: "status", label: "Status" },
  ];

  const filterConfig = useMemo(() =>
    filterFields.map(f => ({
      ...f,
      options: getUniqueOptions(f.key)
    })),
    [entity]
  );

  const [filterState, setFilterState] = useState({});

  const commentsData = useMemo(() => {
    let computedComments = entity || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.voucherNo?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    filterConfig.forEach(f => {
      const selected = filterState[f.key];
      if (selected && selected.length > 0) {
        computedComments = computedComments.filter(it => {
          let value;
          if (f.key === 'poDate') {
            value = it.poDate ? it.poDate.split('T')[0] : '-';
          } else if (f.key === 'status') {
            switch (it.status) {
              case 1: value = 'Pending'; break;
              case 2: value = 'Admin Invoice Pending'; break;
              case 3: value = 'Rejected'; break;
              case 4: value = 'Company Invoice Pending'; break;
              case 5: value = 'Dispatch Details Pending'; break;
              case 6: value = 'Receive Pending'; break;
              case 7: value = 'Completed'; break;
              default: value = '-';
            }
          } else {
            value = it[f.key] ?? '-';
          }
          return selected.includes(value);
        });
      }
    });
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity, filterState, filterConfig]);

  const getStatusBadge = (po) => {
    const badgeClasses = "badge badge-pill badge-status";

    switch (po.status) {
      case 1: // Pending
        return <span className={`${badgeClasses} bg-warning`}>Pending</span>;
      case 2: // Approved (Admin Invoice)
        return <span className={`${badgeClasses} bg-info`}>Admin Invoice Pending</span>;
      case 3: // Rejected
        return <span className={`${badgeClasses} bg-danger`}>Rejected</span>;
      case 4: // Company Invoice Pending 
        return <span className={`${badgeClasses} bg-primary`}>Company Invoice Pending</span>;
      case 5: // Dispatch Details Pending
        return <span className={`${badgeClasses} bg-secondary`}>Dispatch Details Pending</span>;
      case 6: // Received Pending
        return <span className={`${badgeClasses} bg-warning`}>Receive Pending</span>;
      case 7: // Completed
        return <span className={`${badgeClasses} bg-success`}>Completed</span>;
      default:
        return "-";
    }
  };

  const handleDownload = async (pId) => {
    let toastId;
    try {
      setDownloadingId(pId);
      // toastId = toast.loading('Downloading invoice summary...');
      const response = await get(`/admin/download-invoice-summary/${pId}`);
      if(response?.success){
        toast.success(response?.message || "PDF Downloaded successfully!")
        window.open(`${response?.data?.url}?t=${Date.now()}`, '_blank');
      }else{
        toast.error("Download Error!")
      }
      // const { url } = response?.data
      // if (url) {
      //   toast.update(toastId, {
      //     render: 'PDF Downloaded successfully!',
      //     type: 'success',
      //     isLoading: false,
      //     autoClose: 3000
      //   });
      // } else {
      //   throw new Error('Download URL not found in response');
      // }
    } catch (error) {
      console.error('Download error:', error);
      if (toastId) {
        toast.dismiss(toastId);
      }
      toast.error(error?.response?.data?.message || 'Failed to download invoice summary');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePoDownload = async (poId) => {
    try {
      const response = await get(`/admin/download-po-invoice/${poId}`);

      const { data, success, message } = response
      if (success) {
        window.open(data?.file, "_blank")
        toast.success(message)
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleReceiveProduct = async (elem) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to receive ${elem.voucherNo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, receive it!"
    });
    if (confirmResult.isConfirmed) {
      try {
        const response = await post(`/admin/receive-po-product/${elem?._id}`)
        if (response.success) {
          Swal.fire("Received!", `${elem.voucherNo} has been received.`, "success");
          setLoading(true); // refresh list
        } else {
          Swal.fire("Error!", response.message || "Failed to delete customer.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", error?.response?.data?.message || "Something went wrong while receiving.", "error");
      }
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"PO List"} count={entity?.length} handleRefresh={handleRefresh} />

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
                  <Link to={ADMIN_URLS.MANAGE_PO} className="btn btn-primary">
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add PO
                  </Link>
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
                filterConfig={filterConfig}
                filterState={filterState}
                onFilterChange={setFilterState}
                filterDropdownLabel="Filter"
              />
              <div className=" custom-table table-responsive" style={{ minHeight: "290px" }}>
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
                        {visibleColumns.voucherNo && <td>{elem?.voucherNo || "-"}</td>}
                        {visibleColumns.poDate && <td>{elem?.poDate ? <DateTime value={elem?.poDate} format='date' /> : "-"}</td>}
                        {visibleColumns.companyName && <td>{elem?.companyName || "-"}</td>}
                        {visibleColumns.destination && <td>{elem?.destination || "-"}</td>}
                        {visibleColumns.termsOfDelivery && <td>{elem?.termsOfDelivery || "-"}</td>}
                        {visibleColumns.termsOfPayment && <td>{elem?.termsOfPayment || "-"}</td>}
                        {visibleColumns.totalQuantity && <td>{elem?.totalQuantity || "-"}</td>}
                        {visibleColumns.totalAmount && <td>{elem?.totalAmount?.toFixed(2) || "-"}</td>}
                        {visibleColumns.status && (
                          <td>
                            {getStatusBadge(elem)}
                          </td>
                        )}
                        <td style={{ textAlign: "end" }}>
                          <div className="dropdown table-action">
                            <a href="#" className="action-icon" data-bs-toggle="dropdown">
                              <i className="fa fa-ellipsis-v" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <Link className="dropdown-item" to={`${ADMIN_URLS.VIEW_PO}/${elem?._id}`}>
                                <i className="ti ti-eye text-indigo" /> View
                              </Link>
                              {elem?.status === 1 && (
                                <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_PO} state={elem}>
                                  <i className="ti ti-edit text-blue" /> Edit
                                </Link>
                              )}
                              {elem?.status === 6 && (
                                <button type='button' className="dropdown-item" onClick={() => handleReceiveProduct(elem)}>
                                  <i className="ti ti-check text-warning" /> Receive Product
                                </button>
                              )}
                              {elem?.status === 7 && (
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDownload(elem._id)}
                                  disabled={downloadingId === elem._id}
                                >
                                  {downloadingId === elem._id ? (
                                    <>
                                      <i className="ti ti-loader spinner text-info me-1" />
                                      Downloading...
                                    </>
                                  ) : (
                                    <>
                                      <i className="ti ti-arrow-down text-info me-1" />
                                      Download Invoice Summary
                                    </>
                                  )}
                                </button>
                              )}
                              <button
                                type='button'
                                className="dropdown-item"
                                onClick={() => handlePoDownload(elem._id)}
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

export default PoList