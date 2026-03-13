import React from 'react'

const AmcStartDate = ({
    amc,
    handleChange,
    errors,
    coverageStatus,
    installationObj,
    lastAmc,
    editId
}) => {

    const validateStartDate = (startDate) => {

        if(editId) return null

        if (!startDate) return null;

        const amcStartDate = new Date(startDate);
        amcStartDate.setHours(0, 0, 0, 0);

        if (installationObj?.warrantyEndDate) {
            const warrantyEndDate = new Date(installationObj.warrantyEndDate);
            warrantyEndDate.setHours(0, 0, 0, 0);

            if (amcStartDate < warrantyEndDate) {
                return "AMC start date cannot be before warranty end date";
            }
        }
        if (lastAmc?.endDate) {
            const lastAmcEndDate = new Date(lastAmc.endDate);
            lastAmcEndDate.setHours(0, 0, 0, 0);

            if (amcStartDate <= lastAmcEndDate) {
                return `AMC start date must be after the last AMC end date (${lastAmcEndDate.toLocaleDateString()})`;
            }
        }
        return null;
    };

    const getValidStartMinDate = () => {
        const warrantyEnd = installationObj?.warrantyEndDate ? new Date(installationObj.warrantyEndDate) : null;
        const lastAmcEnd = lastAmc?.endDate ? new Date(lastAmc.endDate) : null;

        warrantyEnd?.setHours(0, 0, 0, 0);
        lastAmcEnd?.setHours(0, 0, 0, 0);

        if (warrantyEnd && lastAmcEnd) {
            return (warrantyEnd > lastAmcEnd ? warrantyEnd : lastAmcEnd).toISOString().split("T")[0];
        } else if (warrantyEnd) {
            return warrantyEnd.toISOString().split("T")[0];
        } else if (lastAmcEnd) {
            return lastAmcEnd.toISOString().split("T")[0];
        } else {
            return undefined;
        }
    };

    return (
        <>
            <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                    <input
                        type="date"
                        className={`form-control ${errors.startDate || validateStartDate(amc.startDate) ? "is-invalid" : ""}`}
                        name="startDate"
                        value={amc.startDate}
                        onChange={handleChange}
                        placeholder="Start Date"
                        min={getValidStartMinDate()}
                        disabled={!coverageStatus.canCreateAMC || editId}
                        readOnly={editId}
                    />
                    <label>Start Date <span className="text-danger">*</span></label>
                    {editId && (
                        <small className="text-muted">Start date cannot be modified after creation.</small>
                    )}
                    {(errors.startDate || validateStartDate(amc.startDate)) && (
                        <div className="invalid-feedback">
                            {errors.startDate || validateStartDate(amc.startDate)}
                        </div>
                    )}
                </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                    <input
                        type="date"
                        className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                        name="endDate"
                        value={amc.endDate}
                        onChange={handleChange}
                        placeholder="End Date"
                        readOnly
                    />
                    <label>End Date <span className="text-danger">*</span></label>
                    {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                </div>
            </div>
        </>
    )
}

export default AmcStartDate