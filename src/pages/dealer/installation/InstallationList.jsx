import React, { useEffect, useMemo, useState } from 'react'
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import { useDispatch, useSelector } from 'react-redux';
import { downloadInstallationReport, getAllInstallation, resetDownloadInstallation } from '../../../middleware/installation/installation';
import PageHeader from '../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import TableFilter from '../../../components/TableFilter/TableFilter';
import { Link } from 'react-router';
import DateTime from '../../../helpers/DateFormat/DateTime';
import moment from 'moment';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getModuleKey } from '../../../config/DataFile';
import { toast } from 'react-toastify';

const InstallationList = () => {

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const dealerStorage = getDealerStorage();
  const dispatch = useDispatch();

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
    installationList,
    installationListError,
    installationListLoading,

    downloadInstallationLoading,
    downloadInstallation,
    downloadInstallationMessage,
    downloadInstallationError,
  } = useSelector((state) => state?.dealerInstallation);

  useEffect(() => {
    if (downloadInstallationMessage) {
      toast.success(downloadInstallationMessage)
      window.open(downloadInstallation?.pdfUrl, '_blank');
      dispatch(resetDownloadInstallation())
    }
    if (downloadInstallationError) {
      toast.error(downloadInstallationError)
      dispatch(resetDownloadInstallation())
    }
  }, [downloadInstallationMessage, downloadInstallationError])

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("dealerId", dealerStorage?.DL_ID);
    dispatch(getAllInstallation(formData));
  }

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData()
  };

  const commentsData = useMemo(() => {
    let computedComments = installationList || [];
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
  }, [currentPage, search, limit, installationList]);

  const formatInstallationDays = (date) => {
    if (!date) return "-";
    const days = Math.max(1, moment().diff(moment(date), "days"));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const handleDownload = (id) => {
    dispatch(downloadInstallationReport({ isDealer: true }, id))
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"Installation List"} count={installationList?.length} handleRefresh={handleRefresh} />

        {installationListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text="" size="md" />
          </div>
        )}

        {installationListError && (
          <div className="alert alert-danger text-center" role="alert">
            {installationListError || "Something went wrong while fetching data."}
          </div>
        )}

        {!installationListLoading && !installationListError && (
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
                    <Link to={DEALER_URLS.MANAGE_INSTALL} className="btn btn-primary">
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Installation
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
                              <Link className="dropdown-item" to={DEALER_URLS.VIEW_INSTALL} state={elem?._id}>
                                <i className="ti ti-eye text-indigo" /> View
                              </Link>
                              {elem?.status !== 2 && (
                                <Link className="dropdown-item" to={DEALER_URLS.MANAGE_INSTALL} state={elem}>
                                  <i className="ti ti-edit text-blue" /> Edit
                                </Link>
                              )}
                              <button
                                className="dropdown-item"
                                onClick={() => handleDownload(elem._id)}
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