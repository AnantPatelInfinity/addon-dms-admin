import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../../ui/admin/PageHeader";
import { Search } from "../../../components/Form";
import CustomerPagination from "../../../components/customer/CustomerPagination";
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage";
import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";
import { useNavigate } from "react-router";
import TooltipWrapper from "../../../components/Tooltip/TooltipWrapper";
import ProductLoader from "../../../ui/dealer/ProductLoader";
import ProductFilters from "../../../components/Dealer/Product/ProductFilters";

import { getCuProductList } from "../../../middleware/customerUser/customerProduct/product";
import { getCategoryList } from "../../../middleware/customerUser/category/category";
import { getCompanyList } from "../../../middleware/customerUser/company/company";

import {
  addCustomerCart,
  getCustomerCart,
} from "../../../middleware/customerUser/customerCart/cart";
import { addCartReset } from "../../../slices/customer/cart.slice";

import { toast } from "react-toastify";
import { logos } from "../../../config/DataFile";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const { cuProductListLoading, cuProductsList } = useSelector(
    (state) => state?.customerProduct
  );

  const { categoryList } = useSelector((state) => state?.customerProductCategory) || [];
  const { companyList } = useSelector((state) => state?.customerCompany) || [];

  const { addCartLoading, addCartMessage, addCartError } = useSelector(
    (state) => state?.customerCart
  );

  const products = (cuProductsList?.products || []).filter(
    (p) => p.customerPrice && p.customerPrice !== 0
  );
  const pagination = cuProductsList?.pagination || {};
  const customerStorage = getCustomerStorage();


  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("whatsNew");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [filters, setFilters] = useState({
    firmId: customerStorage.DX_CU_FIRM_ID || "",
    companyId: [],
    categoryId: [],
  });
  const [loadingProductId, setLoadingProductId] = useState(null);

  useEffect(() => {
    const fId = {
      firmId: customerStorage.DX_CU_FIRM_ID,
    };
    dispatch(getCategoryList());
    dispatch(getCompanyList(fId));
  }, []);

  useEffect(() => {
    if (!addCartMessage && !addCartError) {
      return;
    }
    if (addCartMessage) {
      toast.success(addCartMessage);
    }
    if (addCartError) {
      toast.error(addCartError);
    }
    dispatch(addCartReset());
    setLoadingProductId(null);
    const formData = new URLSearchParams();
    formData.append("customerId", customerStorage.CU_ID);
    dispatch(getCustomerCart(formData));
  }, [addCartMessage, addCartError]);

  const fetchData = () => {
    const payload = {
      searchText: search,
      sortBy,
      firmId: filters.firmId,
      companyId: JSON.stringify(filters.companyId),
      categoryId: JSON.stringify(filters.categoryId),
      page,
      limit,
    };
    dispatch(getCuProductList(payload));
  };

  const handleAddToCart = (proData) => {
    setLoadingProductId(proData._id);
    const formData = new URLSearchParams();
    formData.append("customerId", customerStorage.CU_ID);
    formData.append("productId", proData._id);
    formData.append("quantity", 1);
    formData.append("price", proData.price);
    formData.append("totalPrice", proData.price);
    dispatch(addCustomerCart(formData));
  };

  useEffect(() => {
    fetchData();
  }, [search, sortBy, page, filters]);

  return (
    <div className="row">
      <div className="col-md-12">
        <PageHeader
          name={"Product List"}
          count={products?.length}
          handleRefresh={fetchData}
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
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="d-flex align-items-center justify-content-end flex-wrap row-gap-2 mb-4">
              <div className="dropdown me-3">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" />
                  Sort
                </a>
                <ul className="dropdown-menu">
                  {[
                    { key: "aToZ", label: "Name: A to Z" },
                    { key: "priceLowToHigh", label: "Price: Low to High" },
                    { key: "priceHighToLow", label: "Price: High to Low" },
                    { key: "whatsNew", label: "Newest First" },
                  ].map((option) => (
                    <li key={option.key}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => {
                          setSortBy(option.key);
                          setPage(1);
                        }}
                      >
                        {option.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="d-flex align-items-center flex-wrap row-gap-2">
                <div className="form-sorts dropdown">
                  <a
                    href="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter-share" /> Filter
                  </a>
                  <div className="filter-dropdown-menu dropdown-menu p-3 dropdown-menu-md-end">
                    <ProductFilters
                      categoryList={categoryList}
                      companyList={companyList}
                      selectedFilters={filters}
                      onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                        setPage(1);
                      }}
                      onReset={() => {
                        setFilters({
                          firmId: customerStorage.DX_CU_FIRM_ID || "",
                          companyId: [],
                          categoryId: [],
                        });
                        setSearch("");
                        setSortBy("whatsNew");
                        setPage(1);
                      }}
                      onApply={fetchData}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {cuProductListLoading ? (
                <ProductLoader />
              ) : products?.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No products found</h5>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    className="col-xxl-3 col-xl-4 col-md-6 mb-4"
                    key={product._id}
                  >
                    <div className="card border h-100">
                      <div className="card-body">
                        <div
                          className="product-box"
                          style={{ textAlign: "center" }}
                        >
                          <img
                            src={product?.images[0]?.url || logos.NO_PRO_IMAGE}
                            alt={product?.images[0]?.fileName}
                            style={{
                              width: product?.images[0]?.url ? "" : "100px",
                            }}
                          />
                        </div>
                        <h5>{product.name}</h5>
                        <small className="text-muted">
                          Company: {product.companyName}
                        </small>
                        <div>
                          <small className="text-muted">
                            Category: {product.categoryName}
                          </small>
                        </div>
                        <div className="row mt-2">
                          <div className="col-12">
                              <strong className="text-muted">
                                Price: ₹{product.customerPrice}
                              </strong>
                          </div>
                        </div>
                        <div className="mt-3 gap-3 d-flex ">
                          <TooltipWrapper tooltip="View Product">
                            <button
                              className="btn btn-soft-secondary"
                              type="button"
                              onClick={() =>
                                naviagte(
                                  `${CUSTOMER_URLS.VIEW_PRODUCT}/${product._id}`
                                )
                              }
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                          </TooltipWrapper>

                          <TooltipWrapper tooltip="Add to Cart">
                            <button
                              className="btn btn-soft-primary"
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              disabled={loadingProductId === product._id}
                            >
                              {loadingProductId === product._id ? (
                                <i className="fa-solid fa-circle-notch fa-spin" />
                              ) : (
                                <i className="fa-solid fa-cart-shopping" />
                              )}
                            </button>
                          </TooltipWrapper>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <CustomerPagination
              currentPage={pagination?.currentPage || 1}
              totalPages={pagination?.totalPages || 1}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
