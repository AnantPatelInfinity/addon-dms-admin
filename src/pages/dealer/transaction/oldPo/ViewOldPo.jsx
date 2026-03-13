import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import BreadCrumbs from "../../../../components/BreadCrumb/BreadCrumbs";
import DEALER_URLS from "../../../../config/routesFile/dealer.routes";
import moment from "moment";

const ViewOldPo = () => {
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const [oldPoData, setOldPo] = useState({
    poNo: "",
    poDate: "",
    companyId: "",
    companyName: "",
  });
  const [poItems, setPoItems] = useState([]);

  useEffect(() => {
    if (data) {
      setOldPo({
        poNo: data.po_no || "",
        poDate: data.po_date ? moment(data.po_date).format("DD-MM-YYYY") : "",
        companyId: data.company_data?._id || "",
        companyName: data.company_data?.name || "",
      });

      if (Array.isArray(data.items_data)) {
        const mappedItems = data.items_data.map((item) => ({
          ...item,
          productName: item?.productName?.name || "N/A",
          categoryName: item?.category?.name || "",
          companyName: data.company_data?.name || "",

          xPhyDate: item.xPhyDate
            ? moment(item.xPhyDate).format("DD-MM-YYYY")
            : "N/A",

          xWarrantyEndDate: item.xWarrantyEndDate
            ? moment(item.xWarrantyEndDate).format("DD-MM-YYYY")
            : "N/A",

          customerName: item.customerData
            ? `${item.customerData.title || ""} ${
                item.customerData.name || ""
              } ${item.customerData.lastName || ""}`
            : "N/A",

        }));

        setPoItems(mappedItems);
      }
    }
  }, [data]);

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


  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "Old PO List", to: DEALER_URLS.OLD_PO_LIST },
            { label: `View Old PO` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <h4 className="page-title">View Old PO</h4>
          </div>

          <div className="card-body">
            <div className="row mb-3">
              <div className="col-lg-4 col-md-6 col-12">
                <label className="form-label fw-bold">Company</label>
                <div>{oldPoData.companyName || "N/A"}</div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <label className="form-label fw-bold">PO Date</label>
                <div>{oldPoData.poDate || "N/A"}</div>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <label className="form-label fw-bold">PO No.</label>
                <div>{oldPoData.poNo || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="page-title">Product List</h4>
          </div>
          <div className="card-body">
            <div className="custom-table table-responsive">
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th>Sr.</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Company</th>
                    <th>Customer</th>
                    <th>Company Serial No</th>
                    <th>Eng Name</th>
                    <th>Physical Date</th>
                    <th>Warranty End Date</th>
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
                  </tr>
                </thead>
                <tbody>
                  {poItems.length > 0 ? (
                    poItems.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div>{item.productName}</div>
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
                        <td>{item.customerName}</td>
                        <td>{item.companySerialNo}</td>
                        <td>{item.xEngName}</td>
                        <td>{item.xPhyDate}</td>
                        <td>{item.xWarrantyEndDate}</td>
                        <td>{item.quantity}</td>
                        <td>{item.rate}</td>
                        <td>{parseFloat(item.amount).toFixed(2)}</td>
                        <td>{item.discount || 0}</td>
                        <td>{parseFloat(item.discountAmount).toFixed(2)}</td>
                        <td>{item.spDiscount || 0}</td>
                        <td>{parseFloat(item.spDiscountAmount).toFixed(2)}</td>
                        <td>
                          {parseFloat(item.taxableAmount || 0).toFixed(2)}
                        </td>
                        <td>{item.gst || 0}</td>
                        <td>{parseFloat(item.gstAmount).toFixed(2)}</td>
                        <td>{parseFloat(item.totalAmount).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="999" className="text-center">
                        No Data Found!
                      </td>
                    </tr>
                  )}

                  {poItems.length > 0 && (
                    <tr className="table-active fw-bold">
                      <td colSpan="11" className="text-end">
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
              >
                Back To Old Po List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOldPo;
