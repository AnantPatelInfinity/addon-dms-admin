import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { downloadCompanyInstallation, getComAllInstallationList, resetCompanyInstallationApprove, resetDownloadInstallation, verifyCompanyInstallation } from '../../../middleware/companyUser/comInstallation/comInstallation';
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import PageHeader from '../../../ui/admin/PageHeader';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { Pagination, Search } from '../../../components/Form';
import { Link } from 'react-router';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import TableFilter from '../../../components/TableFilter/TableFilter';
import DropDown from '../../../components/Form/DropDown';
import DateTime from '../../../helpers/DateFormat/DateTime';
import moment from 'moment';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { getModuleKey } from '../../../config/DataFile';

const InstallationList = () => {

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const dispatch = useDispatch();
  const compayStorage = getCompanyStorage();

  const columnsConfig = [
    { key: "reportNo", label: "Report Number" },
    { key: "customerFirstName", label: "Customer Name" },
    { key: "productSerialNo", label: "Serial Number" },
    { key: "registerDate", label: "Registration Date" },
    { key: "totalInstallDay", label: "Total Installation Days" },
    { key: "rejectReason", label: "Reject Reason" },
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

  const {
    companyInstallationList,
    companyInstallationListError,
    companyInstallationListLoading,

    companyInstallationApproveError,
    companyInstallationApproveMessage,

    downloadInstallation,
    downloadInstallationError,
    downloadInstallationMessage,
  } = useSelector((state) => state?.companyInstallation);

  useEffect(() => {
    if (companyInstallationApproveMessage) {
      toast.success(companyInstallationApproveMessage);
      dispatch(resetCompanyInstallationApprove());
      fetchData();
    }
    if (companyInstallationApproveError) {
      toast.error(companyInstallationApproveError);
      dispatch(resetCompanyInstallationApprove());
    }
  }, [companyInstallationApproveError, companyInstallationApproveMessage]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (downloadInstallationMessage) {
      toast.success(downloadInstallationMessage);
      window.open(downloadInstallation.pdfUrl, '_blank');
      fetchData();
      dispatch(resetDownloadInstallation());
    }

    if (downloadInstallationError) {
      toast.error(downloadInstallationError);
      dispatch(resetDownloadInstallation());
    }
  }, [downloadInstallationMessage, downloadInstallationError]);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("firmId", compayStorage.firmId);
    formData.append("companyId", compayStorage.comId);
    dispatch(getComAllInstallationList(formData));
  }

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData()
  };

  const commentsData = useMemo(() => {
    let computedComments = companyInstallationList || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.reportNo?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, companyInstallationList]);

  const formatInstallationDays = (date) => {
    if (!date) return "-";
    const days = Math.max(1, moment().diff(moment(date), "days"));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const handleStatusUpdate = async (elem, status) => {
    if (status === 2) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to approve this Installation?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const formData = new URLSearchParams();
        formData.append("status", status);
        formData.append("rejectReason", "");
        dispatch(verifyCompanyInstallation(formData, elem?._id));
      }
    } else if (status === 3) {
      const { value: rejectReason } = await Swal.fire({
        title: 'Reject Installation',
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
        dispatch(verifyCompanyInstallation(formData, elem?._id));
      }
    }
  }

  const handleDownload = (installId, dealerId) => {
    dispatch(downloadCompanyInstallation({ isDealer: !!dealerId }, installId))
    if (downloadInstallation?.file) {
      window.open(downloadInstallation?.file, '_blank');
    }
  } 

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"Installation List"} count={companyInstallationList?.length} handleRefresh={handleRefresh} />

        {companyInstallationListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text="" size="md" />
          </div>
        )}

        {companyInstallationListError && (
          <div className="alert alert-danger text-center" role="alert">
            {companyInstallationListError || "Something went wrong while fetching data."}
          </div>
        )}
        {!companyInstallationListLoading && !companyInstallationListError && (
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
                        {visibleColumns["reportNo"] && <td> {elem?.reportNo}</td>}
                        {visibleColumns["customerFirstName"] && <td>{elem?.customerTitle} {elem?.customerFirstName} {elem?.customerLastName}</td>}
                        {visibleColumns["productSerialNo"] && <td>{elem?.productSerialNo}</td>}
                        {visibleColumns["registerDate"] && <td><DateTime value={elem?.registerDate} format='date' /></td>}
                        {visibleColumns["totalInstallDay"] && <td>{formatInstallationDays(elem?.physicalInstallDate)}</td>}
                        {visibleColumns["rejectReason"] && <td>{elem?.rejectReason || "-"}</td>}
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
                              <Link className="dropdown-item" to={COMPANY_URLS.VIEW_INSTALL} state={elem?._id}>
                                <i className="ti ti-eye text-indigo" /> View
                              </Link>
                              {/* {elem?.status !== 2 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 2)}>
                                  <i className="fe fe-check-circle text-success" /> Approve
                                </Link>
                              )}
                              {elem?.status !== 3 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 3)}>
                                  <i className="fa-solid fa-xmark text-danger" /> Rejected
                                </Link>
                              )} */}
                              {elem?.status === 1 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 2)}>
                                  <i className="fe fe-check-circle text-success" /> Approve
                                </Link>
                              )}
                              {elem?.status === 1 && (
                                <Link className="dropdown-item" onClick={() => handleStatusUpdate(elem, 3)}>
                                  <i className="fa-solid fa-xmark text-danger" /> Rejected
                                </Link>
                              )}
                              <button
                                className="dropdown-item"
                                onClick={() => handleDownload(elem._id, elem?.dealerId)}
                              >
                                <i className="ti ti-arrow-down text-info me-1" />
                                Download Installation
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

export default InstallationList