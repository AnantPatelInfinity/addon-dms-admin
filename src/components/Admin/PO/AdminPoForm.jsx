import moment from 'moment'
import { useApi } from '../../../context/ApiContext';
import { useEffect, useState } from 'react';

const AdminPoForm = ({
    po,
    errors,
    companyData,
    renderInput,
    handleChange,
    dispatchData,
    dealerPoData,
    setDealerPoData,
    data
}) => {

    const { post, } = useApi();

    const getDealerPoData = async (companyId) => {
        try {
            const payload = {
                "companyId": companyId,
                "status": 2 // only approved 
            }
            const url = data?._id ? "/admin/get-dealer-po" : "/admin/get-admin-dealerpo"
            const response = await post(url, payload);
            setDealerPoData(response?.data)
        } catch (error) {
            console.log(error, '222')
        }
    }

    useEffect(() => {
        if (po.companyId) {
            getDealerPoData(po.companyId)
        }
    }, [po.companyId, data?._id]);

    return (
        <>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select name="companyId" value={po.companyId} onChange={handleChange}
                            className={`form-select ${errors.companyId ? "is-invalid" : ""}`}>
                            <option value="">Select Company</option>
                            {companyData.map((e, i) => <option key={i} value={e._id}>{e.name}</option>)}
                        </select>
                        <label>Company <span className="text-danger">*</span></label>
                        {errors.companyId && <div className="invalid-feedback">{errors.companyId}</div>}
                    </div>
                </div>
                {renderInput("PO Date", "poDate", "date")}

                {po.companyId && (
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <select
                                name="dealerPoId"
                                value={po.dealerPoId || ""}
                                onChange={handleChange}
                                className="form-select"
                                disabled={data?._id}
                            >
                                <option value="">Select PO</option>
                                {dealerPoData.map((dealerPo, i) => (
                                    <option key={i} value={dealerPo._id}>
                                        {dealerPo.voucherNo} - {moment(dealerPo.poDate).format('DD/MM/YYYY')}
                                    </option>
                                ))}
                            </select>
                            <label>Dealer/Customer PO</label>
                        </div>
                    </div>
                )}
                {!po.dealerPoId && (
                    <>
                        {renderInput("PO No.", "poNo", "text", false)}
                    </>
                )}
                {renderInput("Destination", "destination")}
                {renderInput("Terms Of Delivery", "termsOfDelivery")}
                {renderInput("Terms Of Payment", "termsOfPayment")}
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            name="expectedDeliveryDate"
                            value={po.expectedDeliveryDate}
                            onChange={handleChange}
                            className={`form-control ${errors.expectedDeliveryDate ? "is-invalid" : ""}`}
                            min={po.poDate > moment().format("YYYY-MM-DD") ? po.poDate : moment().format("YYYY-MM-DD")}
                        />
                        <label>Expected Delivery <span className="text-muted">(after PO/today)</span></label>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select name="dispatchCompanyId" value={po.dispatchCompanyId} onChange={handleChange}
                            className={`form-select ${errors.dispatchCompanyId ? "is-invalid" : ""}`}>
                            <option>Select Dispatch Through</option>
                            {dispatchData?.map((e, i) => <option key={i} value={e._id}>{e.name}</option>)}
                        </select>
                        <label>Dispatch Through <span className="text-danger">*</span></label>
                        {errors.dispatchCompanyId && <div className="invalid-feedback">{errors.dispatchCompanyId}</div>}
                    </div>
                </div>
                {renderInput("Dispatch Doc. No.", "dispatchDocNo", "text", false)}

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-check form-switch mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="isOldData"
                            name="isOldData"
                            checked={!!po.isOldData}
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        name: "isOldData",
                                        value: e.target.checked,
                                    },
                                })
                            }
                        />
                        <label className="form-check-label" htmlFor="isOldData" style={{ fontSize: "18px" }}>
                            Old Data
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPoForm