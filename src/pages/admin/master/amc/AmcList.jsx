import React, { useEffect, useMemo, useState } from 'react'
import { useApi } from '../../../../context/ApiContext';
import Swal from 'sweetalert2';
import PageHeader from '../../../../ui/admin/PageHeader';
import { Pagination, Search } from '../../../../components/Form';
import ADMIN_URLS from '../../../../config/routesFile/admin.routes';
import { Link } from 'react-router';
import { getAdminStorage } from '../../../../components/LocalStorage/AdminStorage';
import DropDown from '../../../../components/Form/DropDown';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import DateTime from '../../../../helpers/DateFormat/DateTime';

const AmcList = () => {

  const { post, deleteById } = useApi();
  const [entity, setEntity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const adminStorage = getAdminStorage();

  useEffect(() => {
    if (loading === true) {
      getAmcData();
    }
  }, [loading]);

  const getAmcData = async () => {
    try {
      setLoading(true)
      const body = {
        firmId: adminStorage.DX_AD_FIRM
      }
      const response = await post(`/admin/get-amc-warranty`, body);
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
  }

  const commentsData = useMemo(() => {
    let computedComments = entity || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.customerName?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);

  const handleDelete = async (elem) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${elem.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!"
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await deleteById(`/admin/delete-amc-warranty`, elem._id);
        if (response.success) {
          Swal.fire("Deleted!", `${elem.customerName} has been deleted.`, "success");
          setLoading(true);
        } else {
          Swal.fire("Error!", response.message || "Failed to delete product category.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", error?.response?.data?.message || "Something went wrong while deleting.", "error");
      }
    }
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Warranty List"}
          count={entity?.length}
          handleRefresh={handleRefresh}
        />

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
                    to={ADMIN_URLS.MANAGE_AMC}
                    className="btn btn-primary"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add AMC
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {loading ? <LoadingSpinner text='' size='md' /> : (
            <div className="card-body">
              <div className=" custom-table table-responsive ">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Sr.</th>
                      <th>Customer Name</th>
                      <th>Serial No.</th>
                      <th>Company Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) => (
                      <tr key={elem?._id}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        <td>{elem.customerTitle} {elem?.customerName} {elem?.customerLastName}</td>
                        <td>{elem?.serialNo}</td>
                        <td>{elem?.companyName}</td>
                        <td><DateTime value={elem?.startDate} format='date' /></td>
                        <td><DateTime value={elem?.endDate} format='date' /></td>
                        <td>{elem?.warrantyName}</td>
                        <td>
                          {elem?.isExpired === true ? (
                            <span className="badge badge-pill badge-status bg-danger">Expired</span>
                          ) : (
                            <span className="badge badge-pill badge-status bg-success">Active</span>
                          )}
                        </td>
                        <td style={{ textAlign: "end" }}>
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
                              <Link className="dropdown-item" to={ADMIN_URLS.MANAGE_AMC} state={elem}>
                                <i className="ti ti-edit text-blue" /> Edit
                              </Link>
                              <Link className="dropdown-item" onClick={() => handleDelete(elem)}>
                                <i className="ti ti-trash text-danger" /> Delete
                              </Link>
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

export default AmcList