import React from 'react'

const EquipmentSection = ({ installation, errors, handleChange }) => {
    return (
        <div className="mb-4">
            <h5 className="section-title mb-3 text-primary">Equipment Details</h5>
            <div className="row">

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='text'
                            className={`form-control ${errors.equipmentName ? "is-invalid" : ""}`}
                            name="equipmentName"
                            value={installation.equipmentName}
                            onChange={handleChange}
                            placeholder='Enter Equipment Name'
                            disabled
                        />
                        <label>Equipment Name <span className="text-danger">*</span></label>
                        {errors.equipmentName && <div className="invalid-feedback">{errors.equipmentName}</div>}
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='text'
                            className={`form-control ${errors.productModel ? "is-invalid" : ""}`}
                            name="productModel"
                            value={installation.productModel}
                            onChange={handleChange}
                            placeholder='Enter Product Model'
                            disabled
                        />
                        <label>Product Model <span className="text-danger">*</span></label>
                        {errors.productModel && <div className="invalid-feedback">{errors.productModel}</div>}
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='text'
                            className={`form-control ${errors.productSerialNo ? "is-invalid" : ""}`}
                            name="productSerialNo"
                            value={installation.productSerialNo}
                            onChange={handleChange}
                            placeholder='Enter Product Serial No'
                            disabled
                        />
                        <label>Product Serial No <span className="text-danger">*</span></label>
                        {errors.productSerialNo && <div className="invalid-feedback">{errors.productSerialNo}</div>}
                    </div>
                </div>

                <div className="col-lg-8 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='text'
                            className={`form-control ${errors.engineerRemarks ? "is-invalid" : ""}`}
                            name="engineerRemarks"
                            value={installation.engineerRemarks}
                            onChange={handleChange}
                            placeholder="Enter engineer remarks (max 200 characters)"
                            maxLength={200}
                        />
                        <label>Enginner Remarks   <span>({installation.engineerRemarks?.length || 0}/200)</span></label>

                        {errors.engineerRemarks && <div className="invalid-feedback">{errors.engineerRemarks}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EquipmentSection