import React from 'react'

const RenderCoverageInfo = ({ installationObj, lastAmc, coverageStatus }) => {

    if (!installationObj && !lastAmc) return null;

    const getValue = (primary, fallback, suffix = '') =>
        primary ? `${primary}${suffix}` : fallback ? `${fallback}${suffix}` : 'N/A';

    const getDateValue = (primary, fallback) =>
        primary ? new Date(primary).toLocaleDateString() :
            fallback ? new Date(fallback).toLocaleDateString() : 'N/A';

    return (
        <>
            <div className="col-12">
                <div className="card mb-3">
                    <div className="card-header">
                        <h6 className="mb-0">Current Coverage Status</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className='mb-4'>Warranty Information:</h6>
                                <p><strong>Warranty:</strong> {getValue(installationObj?.installWarranty, lastAmc?.warrantyName)}</p>
                                {/* <p><strong>Duration:</strong> {getValue(installationObj?.warrantyDuration, lastAmc?.warrantyDuration, ' months')}</p> */}
                                <p><strong>Installation Date:</strong> {getDateValue(installationObj?.warrantyStartDate, lastAmc?.installationStartDate)}</p>
                                <p><strong>Warranty End Date:</strong> {getDateValue(installationObj?.warrantyEndDate, lastAmc?.installationEndDate)}</p>
                                <p><strong>Status:</strong>
                                    <span className={`badge ${coverageStatus.isUnderWarranty ? 'bg-success' : 'bg-danger'} ms-2`}>
                                        {coverageStatus.isUnderWarranty ? 'Under Warranty' : 'Out of Warranty'}
                                    </span>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <h6 className='mb-4'>AMC Information:</h6>
                                <p><strong>AMC Status:</strong>
                                    <span className={`badge ${coverageStatus.isUnderAMC ? 'bg-success' : 'bg-secondary'} ms-2`}>
                                        {coverageStatus.isUnderAMC ? 'Under AMC' : 'No Active AMC'}
                                    </span>
                                </p>
                                <p><strong>Last AMC Report:</strong> {lastAmc?.reportNo || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className={`alert ${coverageStatus.canCreateAMC ? 'alert-success' : 'alert-warning'}`}>
                                    <i className={`fas ${coverageStatus.canCreateAMC ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                    {coverageStatus.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RenderCoverageInfo