import React from "react";

const EquipmentSection = ({ trial, errors, handleChange, productList = [], handleProductChange }) => {
  return (
    <div className="mb-4">
      <h5 className="section-title mb-3 text-primary">Equipment Details</h5>
      <div className="row">

        <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <select
              className={`form-select ${errors.productId ? "is-invalid" : ""}`}
              name="productId"
              value={trial.productId || ""}
              onChange={handleProductChange}
            >
              <option value="">Select Product</option>
              {productList.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <label>
              Product <span className="text-danger">*</span>
            </label>
            {errors.productId && (
              <div className="invalid-feedback">{errors.productId}</div>
            )}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.productName ? "is-invalid" : ""
                }`}
              name="productName"
              value={trial.productName}
              onChange={handleChange}
              placeholder="Enter Product Name"
            />
            <label>
              Equipment Name <span className="text-danger">*</span>
            </label>
            {errors.productName && (
              <div className="invalid-feedback">{errors.productName}</div>
            )}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.productModel ? "is-invalid" : ""
                }`}
              name="productModel"
              value={trial.productModel}
              onChange={handleChange}
              placeholder="Enter Product Model"
            />
            <label>
              Product Model <span className="text-danger">*</span>
            </label>
            {errors.productModel && (
              <div className="invalid-feedback">{errors.productModel}</div>
            )}
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.productSerialNo ? "is-invalid" : ""
                }`}
              name="productSerialNo"
              value={trial.productSerialNo}
              onChange={handleChange}
              placeholder="Enter Product Serial No"
            />
            <label>
              Product Serial No <span className="text-danger">*</span>
            </label>
            {errors.productSerialNo && (
              <div className="invalid-feedback">{errors.productSerialNo}</div>
            )}
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.engineerName ? "is-invalid" : ""
                }`}
              name="engineerName"
              value={trial.engineerName}
              onChange={handleChange}
              placeholder="Enter engineer name"
            />
            <label>
              Engineer Name
            </label>

            {errors.engineerName && (
              <div className="invalid-feedback">{errors.engineerName}</div>
            )}
          </div>
        </div>


        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.engineerRemarks ? "is-invalid" : ""
                }`}
              name="engineerRemarks"
              value={trial.engineerRemarks}
              onChange={handleChange}
              placeholder="Enter engineer remarks (max 200 characters)"
              maxLength={200}
            />
            <label>
              Engineer Remarks
              <span className="ms-1">({trial.engineerRemarks?.length || 0}/200)</span>
            </label>

            {errors.engineerRemarks && (
              <div className="invalid-feedback">{errors.engineerRemarks}</div>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.customerRemarks ? "is-invalid" : ""
                }`}
              name="customerRemarks"
              value={trial.customerRemarks}
              onChange={handleChange}
              placeholder="Enter customer remarks (max 200 characters)"
              maxLength={200}
            />
            <label>
              Customer Remarks
              <span className="ms-1">({trial.customerRemarks?.length || 0}/200)</span>
            </label>

            {errors.customerRemarks && (
              <div className="invalid-feedback">{errors.customerRemarks}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentSection;
