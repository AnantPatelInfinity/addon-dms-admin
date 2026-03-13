import React from 'react'
import DateTime from '../../../../helpers/DateFormat/DateTime'

const CompanyInvoice = ({ proObj, renderFilePreview }) => {
    return (
        <>
            {/* Combined Company Documents Section */}
            <div className='card mb-4'>
                <div className="card-header">
                    <h5 className="card-title mb-0">Company Documents</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="p-3 h-100">
                                <h6 className="mb-3">Company Invoice
                                    <small className="text-muted mx-2">
                                        <strong>Uploaded On: </strong>
                                        {proObj?.companyInvoiceDate ? (
                                            <DateTime value={proObj.companyInvoiceDate} format="dateTime" />
                                        ) : 'N/A'}
                                    </small>
                                </h6>
                                {proObj?.companyInvoice ? (
                                    <>

                                        {renderFilePreview(
                                            proObj.companyInvoice,
                                            'Company Invoice',
                                            'Company Invoice Preview',
                                            'w-100',
                                            { maxHeight: "250px", maxWidth: '250px' }
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted">No invoice uploaded</p>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="p-3 h-100">
                                <h6 className="mb-3">Dispatch Details
                                <small className="text-muted mx-2">
                                        <strong>Uploaded On: </strong>
                                        {proObj?.companyDispatchDate ? (
                                            <DateTime value={proObj.companyDispatchDate} format="dateTime" />
                                        ) : 'N/A'}
                                    </small>
                                </h6>
                                {proObj?.companyDispatchDetails ? (
                                    renderFilePreview(
                                        proObj.companyDispatchDetails,
                                        'Dispatch Details',
                                        'Dispatch Details Preview',
                                        'w-100',
                                        { maxHeight: "250px", maxWidth: '250px' }
                                    )
                                ) : (
                                    <p className="text-muted">No dispatch details uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyInvoice