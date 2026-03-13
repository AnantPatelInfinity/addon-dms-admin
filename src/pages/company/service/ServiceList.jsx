import React, { useEffect, useMemo, useState } from 'react'
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { useDispatch, useSelector } from 'react-redux';
import { getModuleKey, getServiceStatus, getServiceStatusBadge } from '../../../config/DataFile';
import { comReceiveConfirmation, downloadDispatchPdf, downloadServiceChallan, downloadServicePdf, getComService, 
  resetComConfirmation, resetComDispatchPdf, resetComDownloadService, resetComDownloadServiceChallan } from '../../../middleware/companyUser/comService/comService';
import PageHeader from '../../../ui/admin/PageHeader';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { Pagination, Search } from '../../../components/Form';
import TableFilter from '../../../components/TableFilter/TableFilter';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import DropDown from '../../../components/Form/DropDown';

const ServiceList = () => {

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const companyStorage = getCompanyStorage();
  const dispatch = useDispatch();

  const columnsConfig = [
    { key: "complainNo", label: "Complaint No" },
    { key: "customerName", label: "Customer" },
    { key: "serialNo", label: "Serial No." },
    { key: "engineerName", label: "Engineer" },
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
    comServiceList,
    comServiceListError,
    comServiceListLoading,

    comDispatchPdf,
    comDispatchPdfError,
    comDispatchPdfMessage,

    comReceiveConfirmationError,
    comReceiveConfirmationLoading,
    comReceiveConfirmationMessage,

    comDownloadService,
    comDownloadServiceError,
    comDownloadServiceMessage,

    comDownloadServiceChallan,
    comDownloadServiceChallanError,
    comDownloadServiceChallanMessage,
  } = useSelector((state) => state?.comService);

  useEffect(() => {
    if (comDownloadService?.file) {
      window.open(comDownloadService?.file, "_blank")
    }
    if (comDownloadServiceMessage) {
      toast.success(comDownloadServiceMessage)
      dispatch(resetComDownloadService());
      fetchServiceData();
    }
    if (comDownloadServiceError) {
      toast.error(comDownloadServiceError)
      dispatch(resetComDownloadService())
    }
  }, [comDownloadService, comDownloadServiceMessage, comDownloadServiceError])

  useEffect(() => {
    fetchServiceData();
  }, []);

  useEffect(() => {
    if (comDownloadServiceChallanMessage) {
      toast.success(comDownloadServiceChallanMessage);
      window.open(comDownloadServiceChallan?.file, '_blank');
      dispatch(resetComDownloadServiceChallan());
    }
    if (comDownloadServiceChallanError) {
      toast.error(comDownloadServiceChallanError);
      dispatch(resetComDownloadServiceChallan());
    }
  }, [comDownloadServiceChallanMessage, comDownloadServiceChallanError]);

  useEffect(() => {
    if (comReceiveConfirmationMessage) {
      toast.success(comReceiveConfirmationMessage);
      dispatch(resetComConfirmation());
      fetchServiceData();
    }
    if (comReceiveConfirmationError) {
      toast.error(comReceiveConfirmationError)
      dispatch(resetComConfirmation())
    }
  }, [comReceiveConfirmationMessage, comReceiveConfirmationError]);

  useEffect(() => {
    if (comDispatchPdfMessage) {
      toast.success(comDispatchPdfMessage)
      window.open(comDispatchPdf?.file, "_blank")
      dispatch(resetComDispatchPdf())
    }
    if (comDispatchPdfError) {
      toast.error(comDispatchPdfError)
      dispatch(resetComDispatchPdf())
    }
  }, [comDispatchPdfMessage, comDispatchPdfError])

  const fetchServiceData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage?.comId);
    formData.append("firmId", companyStorage?.firmId);
    dispatch(getComService(formData));
  }

  const commentsData = useMemo(() => {
    let computedComments = comServiceList || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.complainNo?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, comServiceList]);

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchServiceData()
  };

  const handleReceive = (sId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to mark this as received?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const receiveData = {
          isReceive: 2,
          time: Date.now()
        };
        const formData = new URLSearchParams();
        formData.append("companyReceiveDetails", JSON.stringify(receiveData));
        dispatch(comReceiveConfirmation(formData, sId));
      }
    });
  };

  const handleDispatchDownload = (sId) => {
    const payload = {
      isCompany: "true"
    }
    dispatch(downloadDispatchPdf(payload, sId))
  }

  const handleServiceDownload = (sId) => {
    const payload = {
      isDealer: false
    }
    dispatch(downloadServicePdf(payload, sId))
  }

  const handleServiceChallan = (sid) => {
    dispatch(downloadServiceChallan(sid));
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"Service List"} count={comServiceList?.length} handleRefresh={handleRefresh} />

        {comServiceListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text='' size='md' />
          </div>
        )}

        {comServiceListError && (
          <div className="alert alert-danger text-center" role="alert">
            {comServiceListError || "Something went wrong while fetching data."}
          </div>
        )}

        {!comServiceListLoading && !comServiceListError && (
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
                        {visibleColumns.complainNo && <td>{elem.complainNo}</td>}
                        {visibleColumns.customerName && (
                          <td>
                            {elem.customerTitle} {elem.customerName} {elem.customerLastName}
                            <br />
                            <small>{elem.customerPhone}</small>
                          </td>
                        )}
                        {visibleColumns.serialNo && <td>{elem.companySerialNo}</td>}
                        {visibleColumns.engineerName && (
                          <td>{elem.engineerName || 'Not Assigned'}</td>
                        )}
                        {visibleColumns.status && <td>
                            {getServiceStatusBadge(elem?.status, elem?.isFullProduct)}
                          </td>}
                        <td className="text-end">
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
                              <Link className="dropdown-item" to={COMPANY_URLS.VIEW_SERVICE} state={elem?._id}>
                                <i className="ti ti-eye text-indigo" /> View / Edit
                              </Link>
                              {( elem?.status == 6 && elem?.isFullProduct === false &&
                                <Link className="dropdown-item" onClick={() => handleReceive(elem?._id)}>
                                  <i className="fe fe-check-circle text-success" /> Approve Receive
                                </Link>
                              )}
                              <button
                                className="dropdown-item"
                                onClick={() => handleDispatchDownload(elem._id)}
                              >
                                <i className="ti ti-arrow-down text-info me-1" />
                                Download Dispatch
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleServiceDownload(elem._id)}
                              >
                                <i className="ti ti-arrow-down text-info me-1" />
                                Service Receipt
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleServiceChallan(elem._id)}>
                                <i className="ti ti-arrow-down text-info me-1" />
                                Download Service Challan
                              </button>
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

export default ServiceList