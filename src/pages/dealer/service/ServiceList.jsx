import React, { useEffect, useMemo, useState } from "react";
import { getDealerStorage } from "../../../components/LocalStorage/DealerStorage";
import { useDispatch, useSelector } from "react-redux";
import { getModuleKey, getServiceStatus, getServiceStatusBadge } from "../../../config/DataFile";
import {
  downloadDeServiceChallan,
  downloadDispatchPdf,
  downloadServiceSlip,
  getServiceList,
  resetServiceDownload,
  resetServiceDownloadChallan,
  resetServiceDownloadDispatch,
} from "../../../middleware/service/service";
import PageHeader from "../../../ui/admin/PageHeader";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { Pagination, Search } from "../../../components/Form";
import DropDown from "../../../components/Form/DropDown";
import TableFilter from "../../../components/TableFilter/TableFilter";
import DEALER_URLS from "../../../config/routesFile/dealer.routes";
import { Link } from "react-router";
import { toast } from "react-toastify";

const ServiceList = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const dealerStorage = getDealerStorage();
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
    columnsConfig.forEach((col) => (defaultState[col.key] = true));
    return defaultState;
  };
  const [visibleColumns, setVisibleColumns] = useState(
    getDefaultVisibleColumns
  );

  const {
    serviceList,
    serviceListError,
    serviceListLoading,

    downloadService,
    downloadServiceMessage,
    downloadServiceError,

    downloadDispatch,
    downloadDispatchMessage,
    downloadDispatchError,

    downloadServiceChallan,
    downloadServiceChallanMessage,
    downloadServiceChallanError,
  } = useSelector((state) => state?.service);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (downloadServiceChallanMessage) {
      toast.success(downloadServiceChallanMessage);
      window.open(downloadServiceChallan?.file, "_blank");
      dispatch(resetServiceDownloadChallan());
    }
    if (downloadServiceChallanError) {
      toast.error(downloadServiceChallanError);
      dispatch(resetServiceDownloadChallan());
    }
  }, [downloadServiceChallanMessage, downloadServiceChallanError]);

  useEffect(() => {
    if (downloadServiceMessage) {
      toast.success(downloadServiceMessage);
      window.open(downloadService?.file, "_blank");
      dispatch(resetServiceDownload());
    }
    if (downloadServiceError) {
      toast.error(downloadServiceError);
      dispatch(resetServiceDownload());
    }
  }, [downloadServiceMessage, downloadServiceError]);

  useEffect(() => {
    if (downloadDispatchMessage) {
      toast.success(downloadDispatchMessage);
      window.open(downloadDispatch?.file, "_blank");
      dispatch(resetServiceDownloadDispatch());
    }
    if (downloadDispatchError) {
      toast.error(downloadDispatchError);
      dispatch(resetServiceDownloadDispatch());
    }
  }, [downloadDispatchMessage, downloadDispatchError]);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("dealerId", dealerStorage?.DL_ID);
    dispatch(getServiceList(formData));
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData();
  };

  const commentsData = useMemo(() => {
    let computedComments = serviceList || [];
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
  }, [currentPage, search, limit, serviceList]);

  const handleDispatchDownload = (sId) => {
    const payload = {
      isCompany: false,
    };
    dispatch(downloadDispatchPdf(payload, sId));
  };

  const handleServiceReceipt = (sId) => {
    const payload = {
      isDealer: true,
    };
    dispatch(downloadServiceSlip(payload, sId));
  };

  const handleServiceChallan = (sid) => {
    dispatch(downloadDeServiceChallan(sid));
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Service List"}
          count={serviceList?.length}
          handleRefresh={handleRefresh}
        />

        {serviceListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text="" size="md" />
          </div>
        )}

        {serviceListError && (
          <div className="alert alert-danger text-center" role="alert">
            {serviceListError || "Something went wrong while fetching data."}
          </div>
        )}

        {!serviceListLoading && !serviceListError && (
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
                      to={DEALER_URLS.MANAGE_SERVICE}
                      className="btn btn-primary"
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Service
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
                    {commentsData?.map((elem, i) => (
                      <tr key={elem?._id}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        {visibleColumns.complainNo && (
                          <td>{elem.complainNo}</td>
                        )}
                        {visibleColumns.customerName && (
                          <td>
                            {elem.customerTitle} {elem.customerName}{" "}
                            {elem.customerLastName}
                            <br />
                            <small>{elem.customerPhone}</small>
                          </td>
                        )}
                        {visibleColumns.serialNo && (
                          <td>{elem.companySerialNo}</td>
                        )}
                        {visibleColumns.engineerName && (
                          <td>{elem.engineerName || "Not Assigned"}</td>
                        )}
                        {visibleColumns.status && (
                          <td>
                             {visibleColumns.status && <td>
                              {getServiceStatusBadge(elem?.status, elem?.isFullProduct)}
                          </td>}
                          </td>
                        )}
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
                              <Link
                                className="dropdown-item"
                                to={DEALER_URLS.VIEW_SERVICE}
                                state={elem?._id}
                              >
                                <i className="ti ti-eye text-indigo" /> View
                              </Link>
                              {elem?.status === 1 && (
                                <Link
                                  className="dropdown-item"
                                  to={DEALER_URLS.MANAGE_SERVICE}
                                  state={elem}
                                >
                                  <i className="ti ti-edit text-blue" /> Edit
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
                                onClick={() => handleServiceReceipt(elem._id)}
                              >
                                <i className="ti ti-arrow-down text-info me-1" />
                                Download Service Receipt
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleServiceChallan(elem._id)}
                              >
                                <i className="ti ti-arrow-down text-info me-1" />
                                Download Service Challan
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
