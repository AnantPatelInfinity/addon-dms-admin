import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { getDealerStorage } from "../../../../components/LocalStorage/DealerStorage";
import { getDealerCustomerList } from "../../../../middleware/customer/customer";
import BreadCrumbs from "../../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../../config/routesFile/dealer.routes";
import { getCompanyList } from "../../../../middleware/company/company";
import useModal from "../../../../components/Modal/useModal";
import OldPoProModal from "../../../../components/Dealer/Po/OldPoProModal";
import { toast } from "react-toastify";
import { useDealerApi } from "../../../../context/DealerApiContext";
import Swal from "sweetalert2";
import moment from "moment";

const initialState = {
  poNo: "",
  poDate: moment().format("YYYY-MM-DD"),
  companyId: "",
};

const ManageOldPo = () => {
  const { post } = useDealerApi();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: data } = useLocation();
  const [oldPoData, setOldPo] = useState(initialState);
  const [poItems, setPoItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const dealerStorage = getDealerStorage();
  const modal = useModal();

  useEffect(() => {
    dispatch(getDealerCustomerList(dealerStorage.DL_ID));
    dispatch(getCompanyList({ firmId: dealerStorage.DX_DL_FIRM_ID }));
  }, []);

  const { companyList } = useSelector((state) => state?.company) || [];

  useEffect(() => {
    if (data?._id) {
      setOldPo({
        companyId: data?.company_data?._id || "",
        poDate: data?.po_date ? moment(data?.po_date).format("YYYY-MM-DD") : "",
        poNo: data?.po_no || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?._id && Array.isArray(data?.items_data)) {
      const mappedItems = data.items_data.map((item) => ({
        ...item,
        productName: item?.productName?.name || "N/A",
        categoryName: item?.category?.name || "",
        companyName: data?.company_data?.name || "",
      }));

      setPoItems(mappedItems);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldPo({ ...oldPoData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateMainForm = () => {
    const newErrors = {};

    if (!oldPoData.companyId) {
      newErrors.companyId = "Company is required";
    }
    if (!oldPoData.poDate) {
      newErrors.poDate = "PO Date is required";
    }
    if (!oldPoData.poNo) {
      newErrors.poNo = "PO No. is required";
    }
    if (poItems.length === 0) {
      newErrors.products = "Please add at least one product";
      toast.error("Please add at least one product");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (itemId, productName) => {
    Swal.fire({
      title: `${productName}?`,
      text: "Delete? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setPoItems(poItems.filter((item) => item._id !== itemId));

        Swal.fire({
          title: "Deleted!",
          text: "PO item deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const prepareInstallationData = () => {
    // Filter only old data products
    const oldDataProducts = poItems.filter((item) => item.isOldData === true);

    return oldDataProducts.map((item) => ({
      firmId: dealerStorage.DX_DL_FIRM_ID,
      firmName: dealerStorage.DX_DL_FIRM_SN || "",
      registerDate: Date.now(),
      installationType: "stock_from_order",
      serialNoId: item._id,
      installWarrantyId: item.xWarrantyId,
      physicalInstallDate: item.xPhyDate,
      engineerName: item.xEngName,
      customerType: "existing",
      customerId: item.xCustomerId,
      equipmentName: item.companyName,
      productModel: item.productName,
      productSerialNo: item.companySerialNo,
      companyId: oldPoData.companyId,
      isOldData: true,
      warrantyStartDate: item.xPhyDate,
      warrantyEndDate: item.xWarrantyEndDate,
      productId: item.productId,
      warrantyId: item.warrantyId,
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    return poItems.reduce(
      (acc, item) => ({
        totalAmount: acc.totalAmount + parseFloat(item.amount || 0),
        totalDiscount: acc.totalDiscount + parseFloat(item.discountAmount || 0),
        totalSpDiscount:
          acc.totalSpDiscount + parseFloat(item.spDiscountAmount || 0),
        totalTaxable: acc.totalTaxable + parseFloat(item.taxableAmount || 0),
        totalGst: acc.totalGst + parseFloat(item.gstAmount || 0),
        grandTotal: acc.grandTotal + parseFloat(item.totalAmount || 0),
      }),
      {
        totalAmount: 0,
        totalDiscount: 0,
        totalSpDiscount: 0,
        totalTaxable: 0,
        totalGst: 0,
        grandTotal: 0,
      }
    );
  };

  const totals = calculateTotals();

  const handleSubmit = async () => {
    if (!validateMainForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const installationItems = prepareInstallationData();

      const payload = {
        firmId: dealerStorage.DX_DL_FIRM_ID,
        poNo: oldPoData.poNo,
        voucherNo: oldPoData.poNo, // Using poNo as voucherNo
        poDate: oldPoData.poDate,
        companyId: oldPoData.companyId,
        dealerId: dealerStorage.DL_ID,
        poItems: poItems,
        installationItems: installationItems,
      };

      const url = data?._id
        ? `/dealer/update-old-po/${data?._id}`
        : `/dealer/manage-old-po`;
      const result = await post(url, payload);
      const { success, message } = result;
      if (success === true) {
        navigate(DEALER_URLS.OLD_PO_LIST);
        toast.success(message);
        setOldPo(initialState);
        setPoItems([]);
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMessage);
      console.error("Old PO Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <BreadCrumbs
            crumbs={[
              { label: "Old PO List", to: DEALER_URLS.OLD_PO_LIST },
              { label: `Old PO ${data?._id ? "Edit" : "Add"}` },
            ]}
          />

          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <h4 className="page-title">
                    Old PO {data?._id ? "Edit" : "Add"}
                  </h4>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-floating mb-3">
                    <select
                      name="companyId"
                      value={oldPoData.companyId}
                      onChange={handleChange}
                      disabled={data?._id ? true : false}
                      className={`form-select ${errors.companyId ? "is-invalid" : ""
                        }`}
                    >
                      <option value="">Select Company</option>
                      {companyList?.map((e, i) => (
                        <option key={i} value={e._id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    <label>
                      Company <span className="text-danger">*</span>
                    </label>
                    {errors.companyId && (
                      <div className="invalid-feedback">{errors.companyId}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className={`form-control ${errors.poDate ? "is-invalid" : ""
                        }`}
                      value={oldPoData?.poDate}
                      name="poDate"
                      onChange={handleChange}
                    />
                    <label>
                      PO Date <span className="text-danger">*</span>
                    </label>
                    {errors.poDate && (
                      <div className="invalid-feedback">{errors.poDate}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${errors.poNo ? "is-invalid" : ""
                        }`}
                      value={oldPoData?.poNo}
                      name="poNo"
                      onChange={handleChange}
                    />
                    <label>
                      PO No. <span className="text-danger">*</span>
                    </label>
                    {errors.poNo && (
                      <div className="invalid-feedback">{errors.poNo}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex gap-2 align-items-center">
                  <h4 className="page-title">Product List</h4>
                </div>
                {oldPoData?.companyId && !data?._id && (
                  <div className="">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setEditId(null);
                        modal.show();
                      }}
                    >
                      <i className="ti ti-square-rounded-plus me-2" /> Add
                      Product{" "}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className=" custom-table table-responsive ">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Sr.</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Company</th>
                      <th>Customer</th>
                      <th>Qty</th>
                      <th>Rate (₹)</th>
                      <th>Amt. (₹)</th>
                      <th>Dis. (%)</th>
                      <th>Dis Amt. (₹)</th>
                      <th>SP Dis. (%)</th>
                      <th>SP Dis. Amt. (₹)</th>
                      <th>Taxable Amt. (₹)</th>
                      <th>GST (%)</th>
                      <th>GST Amt. (₹)</th>
                      <th>Total (₹)</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poItems && poItems?.length > 0 ? (
                      poItems?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div>{item.productName || "N/A"}</div>
                            {item.poAutoRemarks && (
                              <div className="text-muted small fst-italic">
                                {item.poAutoRemarks.length > 80
                                  ? `${item.poAutoRemarks.slice(0, 80)}...`
                                  : item.poAutoRemarks}
                              </div>
                            )}
                            {item.poRemarks && (
                              <div className="text-muted small fst-italic">
                                {item.poRemarks}
                              </div>
                            )}
                          </td>
                          <td>{item.categoryName}</td>
                          <td>{item.companyName}</td>
                          <td>{`${item?.customerData?.title || ""} ${item?.customerData?.name || ""} ${item?.customerData?.lastName || ""}`}</td>
                          <td>{item.quantity}</td>
                          <td>{item.rate}</td>
                          <td>{parseFloat(item.amount).toFixed(2)}</td>
                          <td>{item.discount || 0}</td>
                          <td>{parseFloat(item.discountAmount).toFixed(2)}</td>
                          <td>{item.spDiscount || 0}</td>
                          <td>
                            {parseFloat(item.spDiscountAmount).toFixed(2)}
                          </td>
                          <td>
                            {parseFloat(item.taxableAmount || 0).toFixed(2)}
                          </td>
                          <td>{item.gst || 0}</td>
                          <td>{parseFloat(item.gstAmount).toFixed(2)}</td>
                          <td>{parseFloat(item.totalAmount).toFixed(2)}</td>
                          <td style={{ textAlign: "end" }}>
                            <div className="dropdown table-action">
                              <button
                                className="action-icon"
                                data-bs-toggle="dropdown"
                              >
                                <i className="fa fa-ellipsis-v" />
                              </button>
                              <div className="dropdown-menu dropdown-menu-right">
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setEditId(item._id);
                                    modal.show();
                                  }}
                                >
                                  <i className="ti ti-edit text-blue" /> Edit
                                </button>
                                {!data?._id && (
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleDelete(item._id, item.productName)
                                    }
                                  >
                                    <i className="ti ti-trash text-danger" />{" "}
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="19">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    )}

                    {poItems.length > 0 && (
                      <tr className="table-active fw-bold">
                        <td colSpan="7" className="text-end">
                          Total:
                        </td>
                        <td>{totals.totalAmount.toFixed(2)}</td>
                        <td></td>
                        <td>{totals.totalDiscount.toFixed(2)}</td>
                        <td></td>
                        <td>{totals.totalSpDiscount.toFixed(2)}</td>
                        <td>{totals.totalTaxable.toFixed(2)}</td>
                        <td></td>
                        <td>{totals.totalGst.toFixed(2)}</td>
                        <td>{totals.grandTotal.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(DEALER_URLS.OLD_PO_LIST)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || poItems.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Submitting...
                    </>
                  ) : data?._id ? (
                    "Update Old PO"
                  ) : (
                    "Create Old PO"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OldPoProModal
        modal={modal}
        poItems={poItems}
        setPoItems={setPoItems}
        companyId={oldPoData?.companyId}
        editId={editId}
        setEditId={setEditId}
      />
    </>
  );
};

export default ManageOldPo;
