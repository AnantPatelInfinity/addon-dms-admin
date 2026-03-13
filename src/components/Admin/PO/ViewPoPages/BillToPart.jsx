import React from 'react'
import DateTime from '../../../../helpers/DateFormat/DateTime'

const BillToPart = ({ proObj, renderFilePreview }) => {

    return (
        <>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">Bill From</h5>
                        </div>
                        {/* <div className="card-body">
                            <p className="mb-1"><strong>Name:</strong> {proObj?.billTo?.mailName}</p>
                            <p className="mb-1"><strong>Address:</strong> {proObj?.billTo?.address}</p>
                            <p className="mb-1"><strong>State:</strong> {proObj?.billTo?.state}</p>
                            <p className="mb-1"><strong>Country:</strong> {proObj?.billTo?.country}</p>
                            <p className="mb-1"><strong>GST Type:</strong> {proObj?.billTo?.gstRegisterType}</p>
                            {proObj?.billTo?.gstNo && <p className="mb-1"><strong>GST No:</strong> {proObj?.billTo?.gstNo}</p>}
                        </div> */}
                        <div className="card-body">
                            <p className="mb-1"><strong>Name:</strong> {proObj?.companyName}</p>
                            <p className="mb-1"><strong>Address:</strong> {proObj?.companyAddress} {proObj?.companyAddressThree} {proObj?.companyAddressTwo} {proObj?.companyCity} {proObj?.companyPincode}</p>
                            <p className="mb-1"><strong>State:</strong> {proObj?.companyState}</p>
                            <p className="mb-1"><strong>Country:</strong> India</p>
                            {proObj?.companyGstNo && <p className="mb-1"><strong>GST No:</strong> {proObj?.companyGstNo}</p>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">Ship To</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-1"><strong>Name:</strong> {proObj?.shipTo?.name}</p>
                            <p className="mb-1"><strong>Email:</strong> {proObj?.shipTo?.email}</p>
                            <p className="mb-1"><strong>Address:</strong> {proObj?.shipTo?.address}</p>
                            <p className="mb-1"><strong>State:</strong> {proObj?.shipTo?.state}</p>
                            <p className="mb-1"><strong>Country:</strong> {proObj?.shipTo?.country}</p>
                            <p className="mb-1"><strong>GST Type:</strong> {proObj?.shipTo?.gstRegisterType}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">PO Information</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-1"><strong>PO Date:</strong> <DateTime value={proObj?.poDate} format='date' /></p>
                            <p className="mb-1"><strong>Expected Delivery:</strong> <DateTime value={proObj?.expectedDeliveryDate} format='date' /></p>
                            <p className="mb-1"><strong>Dispatch Company:</strong> {proObj?.dispatchCompanyName}</p>
                            <p className="mb-1"><strong>Dispatch Doc No:</strong> {proObj?.dispatchDocNo}</p>
                            <p className="mb-1"><strong>Terms of Delivery:</strong> {proObj?.termsOfDelivery}</p>
                            <p className="mb-1"><strong>Terms of Payment:</strong> {proObj?.termsOfPayment}</p>
                            <p className="mb-1"><strong>Destination:</strong> {proObj?.destination}</p>
                            <p className="mb-1"><strong>PO Product Received Date:</strong> {proObj?.receivedDate ? <DateTime value={proObj?.receivedDate} format='dateTime' /> : "N/A"}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">Summary</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-1"><strong>Total Items:</strong> {proObj?.totalQuantity}</p>
                            <p className="mb-1"><strong>Total Amount:</strong> ₹{proObj?.totalAmount?.toLocaleString('en-IN')}</p>
                            <p className="mb-1"><strong>Firm:</strong> {proObj?.firmName}</p>
                            <p className="mb-1"><strong>Company:</strong> {proObj?.companyName}</p>
                            {proObj?.signature && (
                                <div className="mt-3">
                                    <p className="mb-1"><strong>Signature & Stamp:</strong></p>
                                    {renderFilePreview(
                                        proObj.signature,
                                        'Signature',
                                        'Signature Preview',
                                        '',
                                        { maxWidth: '250px', maxHeight: '250px' }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BillToPart