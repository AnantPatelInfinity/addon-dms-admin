import { MultiSelect } from 'primereact/multiselect'
import { useSelector } from 'react-redux';

const ProForm = ({
    renderInput,
    renderSelect,
    product,
    setProduct,
    selectedPart,
    setSelectedPart,
    handleChange
}) => {

    const { comCategoryList } = useSelector((state) => state.comCategory);
    const { comUnitList } = useSelector((state) => state?.comUnit);
    const { companyPartsList } = useSelector((state) => state?.comPart);
    const { comSupplyTypeList } = useSelector((state) => state?.comSupplyType);
    const { comWarrantyList } = useSelector((state) => state?.comWarranty);

    return (
        <>
            <div className='row'>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-check mb-3 mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={product.isGst || false}
                            onChange={(e) =>
                                setProduct((prev) => ({
                                    ...prev,
                                    isGst: e.target.checked,
                                    hsnNo: e.target.checked ? prev.hsnNo : "",
                                    gst: e.target.checked ? prev.gst : "",
                                }))
                            }
                            id="isGstCheck"
                        />
                        <label className="form-check-label" htmlFor="isGstCheck">
                            Is GST Applicable
                        </label>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    {renderInput("Gst(%)", "gst", "number", {
                        onKeyDown: (e) =>
                            ["e", "E", "+", "-"].includes(e.key) && e.preventDefault(),
                    }, product.isGst)}
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    {renderInput("HSN Code", "hsnNo", "text", {}, product.isGst)}
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    {renderSelect("Unit", "unitId", comUnitList)}
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    {renderSelect("Category", "categoryId", comCategoryList, true)}
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    {renderSelect("Supply Type", "supplyTypeId", comSupplyTypeList)}
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    {renderSelect("Warranty", "warrantyId", comWarrantyList)}
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <MultiSelect
                            value={selectedPart}
                            options={companyPartsList.map(p => ({ label: p.name, value: p._id }))}
                            onChange={e => setSelectedPart(e.value)} filter maxSelectedLabels={3}
                            className="w-100 form-select" optionLabel="label" placeholder="Select Parts"
                        />
                        <label>Parts</label>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className="col-12">
                    <div className="form-floating mb-3">
                        <textarea
                            type="text"
                            className={`form-control`}
                            name="shortDescription"
                            value={product.shortDescription}
                            onChange={handleChange}
                            placeholder="Short Description"
                        />
                        <label>Short Description</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProForm