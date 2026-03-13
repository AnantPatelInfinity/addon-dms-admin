import React, { useEffect, useMemo, useState } from 'react'
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import { Pagination, Search } from '../../../components/Form';
import DEALER_URLS from '../../../config/routesFile/dealer.routes';
import moment from 'moment';
import DropDown from '../../../components/Form/DropDown';
import { Link } from 'react-router';
import TableFilter from '../../../components/TableFilter/TableFilter';
import PageHeader from '../../../ui/admin/PageHeader';
import { useDealerApi } from '../../../context/DealerApiContext';

const ProductList = () => {

  const { get } = useDealerApi();
  const [entity, setEntity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const dealerStorage = getDealerStorage();

  const columnsConfig = [
    { key: "serialNo", label: "Serial No." },
    { key: "name", label: "Name" },
    { key: "categoryName", label: "Category" },
    { key: "companyName", label: "Company" },
    { key: "price", label: "Price(₹)" },
    { key: "createdAt", label: "Date" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initialState = {};
    columnsConfig.forEach((col) => (initialState[col.key] = true));
    return initialState;
  });

  useEffect(() => {
    if (loading === true) {
      getProductData()
    }
  }, [loading]);

  const getProductData = async () => {
    try {
      setLoading(true)
      const response = await get(`/dealer/get-products?firmId=${dealerStorage.DX_DL_FIRM_ID}`);
      const { data, success } = response;
      if (success) {
        setEntity(data)
      }
    } catch (error) {
      console.log(error)
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

  const commentsData = useMemo(() => {
    let computedComments = entity || [];
    if (search) {
      computedComments = computedComments.filter((it) =>
        it.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        it.serialNo?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);


  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader name={"Product List"} count={entity?.length} handleRefresh={handleRefresh} />

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
                      {visibleColumns.serialNo && <td>{elem.serialNo}</td>}
                      {visibleColumns.name && <td>{elem.name}</td>}
                      {visibleColumns.categoryName && <td>{elem.categoryName}</td>}
                      {visibleColumns.companyName && <td>{elem.companyName}</td>}
                      {visibleColumns.price && <td>{elem.price}</td>}
                      {visibleColumns.createdAt && <td>{moment(elem.createdAt).format("DD-MM-YYYY")}</td>}
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
                            <Link className="dropdown-item" to={`${DEALER_URLS.VIEW_PRODUCT}/${elem._id}`} >
                              <i className="ti ti-eye text-indigo" /> View
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

        </div>
      </div>
    </div>
  )
}

export default ProductList