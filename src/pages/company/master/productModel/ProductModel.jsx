import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { comAllProModelList } from '../../../../middleware/companyUser/comProModel/comProModel';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../../ui/admin/PageHeader';
import { getCompanyStorage } from '../../../../components/LocalStorage/CompanyStorage';
import { Pagination, Search } from '../../../../components/Form';
import DropDown from '../../../../components/Form/DropDown';
import COMPANY_URLS from '../../../../config/routesFile/company.routes';
import { Link } from 'react-router';

const ProductModel = () => {

  const dispatch = useDispatch();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const companyStorage = getCompanyStorage();

  const {
    comProModelListError,
    comProModelListLoading,
    comProModelList
  } = useSelector((state) => state?.comProModel);

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", companyStorage.comId);
    formData.append("status", true);
    dispatch(comAllProModelList(formData))
  }

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData();
  };

  const commentsData = useMemo(() => {
    let computedComments = comProModelList || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.name?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, comProModelList]);

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Product Model List"}
          count={comProModelList?.length}
          handleRefresh={handleRefresh}
        />

        {comProModelListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text="" size="md" />
          </div>
        )}

        {comProModelListError && (
          <div className="alert alert-danger text-center" role="alert">
            {comProModelListError || "Something went wrong while fetching data."}
          </div>
        )}

        {!comProModelListLoading && !comProModelListError && (
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
                    <Link to={COMPANY_URLS.MANAGE_MODEL} className="btn btn-primary">
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Product Model
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className=" custom-table table-responsive ">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Sr.</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) => (
                      <tr key={elem?._id}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        <td>{elem?.name}</td>
                        <td>
                          {elem?.status === true ? (
                            <span className="badge badge-pill badge-status bg-success">Active</span>
                          ) : (
                            <span className="badge badge-pill badge-status bg-danger">Inactive</span>
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
                              <Link className="dropdown-item" to={COMPANY_URLS.MANAGE_MODEL} state={elem}>
                                <i className="ti ti-edit text-blue" /> Edit
                              </Link>
                              {/* <Link className="dropdown-item" onClick={() => handleDelete(elem)}>
                                <i className="ti ti-trash text-danger" /> Delete
                              </Link> */}
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
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductModel