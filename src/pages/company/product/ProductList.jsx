import React, { useEffect, useMemo, useState } from 'react'
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage';
import { useDispatch, useSelector } from 'react-redux';
import { getModuleKey } from '../../../config/DataFile';
import PageHeader from '../../../ui/admin/PageHeader';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getComProductList } from '../../../middleware/companyUser/comProduct/comProduct';
import { Pagination, Search } from '../../../components/Form';
import DropDown from '../../../components/Form/DropDown';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import { Link } from 'react-router';
import DateTime from '../../../helpers/DateFormat/DateTime';
import moment from 'moment';
import TableFilter from '../../../components/TableFilter/TableFilter';

const ProductList = () => {

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const compayStorage = getCompanyStorage();
  const dispatch = useDispatch();

  const columnsConfig = [
    { key: "name", label: "Name" },
    { key: "categoryName", label: "Category" },
    { key: "companyName", label: "Company" },
    { key: "companyPrice", label: "Price(₹)" },
    { key: "createdAt", label: "Date" },
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
    comProductList,
    comProductListError,
    comProductListLoading,
  } = useSelector((state) => state.comProduct);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const formData = new URLSearchParams();
    formData.append("companyId", compayStorage?.comId);
    dispatch(getComProductList(formData));
  }

  const commentsData = useMemo(() => {
    let computedComments = comProductList || [];
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
  }, [currentPage, search, limit, comProductList]);

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    setlimit(10);
    fetchData()
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"Product List"} count={comProductList?.length} handleRefresh={handleRefresh} />

        {comProductListLoading && (
          <div className="text-center py-4">
            <LoadingSpinner text='' size='md' />
          </div>
        )}

        {comProductListError && (
          <div className="alert alert-danger text-center" role="alert">
            {comProductListError || "Something went wrong while fetching data."}
          </div>
        )}

        {!comProductListLoading && !comProductListError && (
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
                    <Link to={COMPANY_URLS.MANAGE_PRODUCT} className="btn btn-primary">
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Product
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
                        {visibleColumns.name && <td>{elem.name}</td>}
                        {visibleColumns.categoryName && <td>{elem.categoryName}</td>}
                        {visibleColumns.companyName && <td>{elem.companyName}</td>}
                        {visibleColumns.companyPrice && <td>{elem.companyPrice}</td>}
                        {visibleColumns.createdAt &&
                          <td>{elem.createdAt ? <DateTime value={elem.createdAt} format='date' /> : ""}</td>}
                        {visibleColumns.status && (
                          <td>
                            {elem.status ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </td>
                        )}
                        <td style={{ textAlign: "end" }}>
                          <div className="dropdown table-action">
                            <a href="#" className="action-icon" data-bs-toggle="dropdown">
                              <i className="fa fa-ellipsis-v" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <Link className="dropdown-item" to={COMPANY_URLS.MANAGE_PRODUCT} state={elem}>
                                <i className="ti ti-edit text-blue" /> Edit
                              </Link>
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

export default ProductList