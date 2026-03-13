import React, { useEffect, useMemo, useState } from 'react'
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { useDispatch, useSelector } from 'react-redux';
import { approveCompanyPo, downloadCompanyPo, getCompanyPoList, resetCompanyPoDownload } from '../../../middleware/companyUser/companyPo/companyPo';
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import TableFilter from '../../../components/TableFilter/TableFilter';
import DropDown from '../../../components/Form/DropDown';
import { Link } from 'react-router';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import DateTime from '../../../helpers/DateFormat/DateTime';
import Swal from 'sweetalert2';
import { companyPoApproveReset } from '../../../slices/company/companyPo.slice';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getModuleKey } from '../../../config/DataFile';
import { toast } from 'react-toastify';
import { getPoStatusBadge } from '../../../config/setup';

const ComPoList = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const companyStorage = getCompanyStorage();
  const dispatch = useDispatch();

  const columnsConfig = [
    { key: "voucherNo", label: "Order No" },
    { key: "poDate", label: "PO Date" },
    { key: "firmName", label: "Firm" },
    { key: "shipTo.state", label: "State" },
    { key: "totalQuantity", label: "Total Qty" },
    { key: "status", label: "Status" },
    { key: "statusTime", label: "Verification Date" },
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

  const {
    companyPoList,
    companyPoListError,
    companyPoListLoading,

    companyPoApproveMessage,
    companyPoApproveError,

    companyPoDownload,
    companyPoDownloadError,
    companyPoDownloadMessage,
  } = useSelector((state) => state?.companyPo);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (companyPoDownload?.file) {
      window.open(companyPoDownload.file, "_blank")
    }
    if (companyPoDownloadMessage) {
      toast.success(companyPoDownloadMessage);
      dispatch(resetCompanyPoDownload());
      fetchData()
    }
    if (companyPoDownloadError) {
      toast.error(companyPoDownloadError);
      dispatch(resetCompanyPoDownload());
    }
  }, [companyPoDownload?.file, companyPoDownloadMessage, companyPoDownloadError])

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    formData.append("firmId", companyStorage?.firmId);
    dispatch(getCompanyPoList(formData));
  }

  useEffect(() => {
    if (companyPoApproveMessage) {
      Swal.fire('Success!', 'PO status updated successfully.', 'success');
      fetchData();
      dispatch(companyPoApproveReset());
    }
    if (companyPoApproveError) {
      Swal.fire('Error!', companyPoApproveError || 'Something went wrong.', 'error');
      dispatch(companyPoApproveReset());
    }
  }, [companyPoApproveMessage, companyPoApproveError]);

  const commentsData = useMemo(() => {
    let computedComments = companyPoList || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.voucherNo?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, companyPoList]);

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData()
  };

  const handleStatusUpdate = async (elem, status) => {
    if (status === 2) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to approve this PO?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
      });
      if (result.isConfirmed) {
        const formData = new URLSearchParams();
        formData.append("status", status);
        formData.append("rejectReason", "");
        dispatch(approveCompanyPo(formData, elem?._id));
      }
    } else if (status === 3) {
      const { value: rejectReason } = await Swal.fire({
        title: 'Reject PO',
        input: 'textarea',
        inputLabel: 'Reason for Rejection',
        inputPlaceholder: 'Type the reason here...',
        inputAttributes: {
          'aria-label': 'Reason for rejection'
        },
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Rejection reason is required!';
          }
        }
      });

      if (rejectReason) {
        const formData = new URLSearchParams();
        formData.append("status", status);
        formData.append("rejectReason", rejectReason);
        dispatch(approveCompanyPo(formData, elem?._id));
      }
    }
  };

  const getActionLinks = (elem) => {
    if (elem.status === 1) {
      return (
        <>
          <Link className="dropdown-item" to={COMPANY_URLS.VIEW_PO} state={elem?._id}>
            <i className="ti ti-eye text-indigo" /> View
          </Link>
          <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 2)}>
            <i className="fe fe-check-circle text-success" /> Approve
          </Link>
          <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 3)}>
            <i className="fa-solid fa-xmark text-danger" /> Reject
          </Link>
        </>
      );
    } else if (elem.status === 2) {
      return (
        <>
          <Link className="dropdown-item" to={COMPANY_URLS.VIEW_PO} state={elem?._id}>
            <i className="ti ti-eye text-indigo" />
            {elem.adminInvoice && !elem.companyInvoice ? "Add Invoice" : "View Details"}
          </Link>
          {!elem.adminInvoice && (
            <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 3)}>
              <i className="fa-solid fa-xmark text-danger" /> Reject
            </Link>
          )}
        </>
      );
    } else if (elem.status === 3) {
      return (
        <>
          <Link className="dropdown-item" to={COMPANY_URLS.VIEW_PO} state={elem?._id}>
            <i className="ti ti-eye text-indigo" /> View Details
          </Link>
          <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 2)}>
            <i className="fe fe-check-circle text-success" /> Approve
          </Link>
        </>
      );
    } else {
      return (
        <Link className="dropdown-item" to={COMPANY_URLS.VIEW_PO} state={elem?._id}>
          <i className="ti ti-eye text-indigo" /> View Details
        </Link>
      );
    }
  };

  const handleDownload = (poId) => {
    dispatch(downloadCompanyPo(poId))
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"PO List"} count={companyPoList?.length} handleRefresh={handleRefresh} />

        {companyPoListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text='' size='md' />
          </div>
        )}

        {companyPoListError && (
          <div className="alert alert-danger text-center" role="alert">
            {companyPoListError || "Something went wrong while fetching data."}
          </div>
        )}

        {!companyPoListLoading && !companyPoListError && (
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
                        {visibleColumns["poDate"] && <td>{elem?.poDate ? <DateTime value={elem.poDate} format='date' /> : "-"}</td>}
                        {visibleColumns["firmName"] && <td>{elem?.firmName || "-"}</td>}
                        {visibleColumns["shipTo.state"] && <td>{elem?.shipTo?.state || "-"}</td>}
                        {visibleColumns["totalQuantity"] && <td>{elem?.totalQuantity || "-"}</td>}
                        {visibleColumns["status"] && (
                          <td>
                            {getPoStatusBadge(parseInt(elem?.status))}
                          </td>
                        )}
                        {visibleColumns["statusTime"] && <td>{elem?.statusTime ? <DateTime value={elem?.statusTime} format="dateTime" /> : "-"}</td>}
                        <td style={{ textAlign: "end" }}>
                          <div className="dropdown table-action">
                            <a href="#" className="action-icon" data-bs-toggle="dropdown">
                              <i className="fa fa-ellipsis-v" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <Link className="dropdown-item" to={COMPANY_URLS.VIEW_PO} state={elem?._id}>
                                <i className="ti ti-eye text-indigo" /> View Details
                              </Link>
                              {elem?.status === 1 && (
                                <>
                                  <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 2)}>
                                    <i className="fe fe-check-circle text-success" /> Approve
                                  </Link>
                                  <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 3)}>
                                    <i className="fa-solid fa-xmark text-danger" /> Reject
                                  </Link>
                                </>
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

export default ComPoList