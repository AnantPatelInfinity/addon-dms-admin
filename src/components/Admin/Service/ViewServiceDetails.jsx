import React from 'react'
import DateTime from '../../../helpers/DateFormat/DateTime'
import ViewFormData from './ViewFormData'

const isEmpty = (obj) => !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);

const ViewServiceDetails = ({ comOneService, isDealer = false, isCustomer = false }) => {
    if (!comOneService || isEmpty(comOneService)) {
        return (
            <div className="alert alert-warning mt-3">No service details available.</div>
        );
    }

    return (
        <>
            <div className="row g-4">
                {/* Service Information */}
                <div className="col-lg-6 col-md-12">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-light border-0">
                            <h5 className="card-title mb-0 text-primary">
                                <i className="fas fa-cog me-2"></i>
                                Service Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Service Date:</strong>
                                        <span className="text-dark">
                                            {comOneService?.serviceDate ? <DateTime value={comOneService.serviceDate} format='date' /> : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Warranty Status:</strong>
                                        <span className="text-dark">
                                            {comOneService?.serviceWarrantyStatus === 1 ? (
                                                <span className="badge bg-success">Under Warranty</span>
                                            ) : comOneService?.serviceWarrantyStatus === 2 ? (
                                                <span className="badge bg-info">Under AMC</span>
                                            ) : comOneService?.serviceWarrantyStatus === 3 ? (
                                                <span className="badge bg-warning">Out of Warranty</span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Firm Name:</strong>
                                        <span className="text-dark">{comOneService?.firmName || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Company Name:</strong>
                                        <span className="text-dark">{comOneService?.companyName || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Serial No:</strong>
                                        <span className="text-primary">{comOneService?.companySerialNo || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Model Name:</strong>
                                        <span className="text-primary">{comOneService?.productName || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Installation Date:</strong>
                                        <span className="text-dark">{comOneService?.physicalInstallDate ? <DateTime value={comOneService?.physicalInstallDate} format='date' /> : "N/A"}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Engineer Name:</strong>
                                        <span className="text-dark">{comOneService?.engineerName || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="pb-3">
                                        <strong className="text-muted d-block mb-1">Engineer Remarks:</strong>
                                        <span className="text-dark">{comOneService?.engineerRemarks || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="col-lg-6 col-md-12">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-light border-0">
                            <h5 className="card-title mb-0 text-primary">
                                <i className="fas fa-user me-2"></i>
                                Customer Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Customer Name:</strong>
                                        <span className="text-dark">
                                            {(
                                                (comOneService?.customerTitle || '') +
                                                (comOneService?.customerName ? ' ' + comOneService.customerName : '') +
                                                (comOneService?.customerLastName ? ' ' + comOneService.customerLastName : '')
                                            ).trim() || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Clinic/Hospital Name:</strong>
                                        <span className="text-dark">
                                            {comOneService?.customerClinicName || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border-bottom pb-3 mb-3">
                                        <strong className="text-muted d-block mb-1">Email:</strong>
                                        <span className="text-dark">
                                            {comOneService?.customerEmail ? (
                                                <a href={`mailto:${comOneService.customerEmail}`} className="text-decoration-none">
                                                    {comOneService.customerEmail}
                                                </a>
                                            ) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="pb-3">
                                        <strong className="text-muted d-block mb-1">Phone:</strong>
                                        <span className="text-dark">
                                            {comOneService?.customerPhone ? (
                                                <a href={`tel:${comOneService.customerPhone}`} className="text-decoration-none">
                                                    {comOneService.customerPhone}
                                                </a>
                                            ) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="pb-3">
                                        <strong className="text-muted d-block mb-1">Address:</strong>
                                        <span className="text-dark">
                                            {comOneService?.customerAddress || comOneService?.customerCity ? (
                                                [
                                                    comOneService.customerAddress,
                                                    comOneService.customerAddressTwo,
                                                    comOneService.customerAddressThree,
                                                    comOneService.customerCity,
                                                    comOneService.customerState,
                                                    comOneService.customerPincode ? `- ${comOneService.customerPincode}` : ''
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')
                                            ) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Complain Details Section */}
            <div className="card shadow-sm border-0 mt-4">
                <div className="card-header bg-light border-0">
                    <h5 className="card-title mb-0 text-primary">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Complaint Details
                    </h5>
                </div>
                <div className="card-body">
                    {/* Description */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-dark mb-2">Description:</h6>
                        <div className="p-3 bg-light rounded border-start border-primary border-4">
                            <p className="mb-0">{comOneService?.complainDetails?.description || 'No description provided'}</p>
                        </div>
                    </div>

                    {/* Media Files */}
                    <div className="row g-4">
                        {/* Photos Section */}
                        {Array.isArray(comOneService?.complainDetails?.photos) && comOneService.complainDetails.photos.length > 0 && (
                            <div className="col-12">
                                <h6 className="fw-bold text-dark mb-3">
                                    <i className="fas fa-images me-2"></i>
                                    Photos ({comOneService.complainDetails.photos.length})
                                </h6>
                                <div className="row g-3">
                                    {comOneService.complainDetails.photos.map((photo, index) => (
                                        <div key={photo._id || index} className="col-lg-2 col-md-3 col-sm-4 col-6">
                                            <div className="card border-0 shadow-sm">
                                                <img
                                                    src={photo.url || ''}
                                                    alt={`Photo ${index + 1}`}
                                                    className="card-img-top"
                                                    style={{ height: '120px', objectFit: 'cover', cursor: photo.url ? 'pointer' : 'default' }}
                                                    onClick={() => photo.url && window.open(photo.url, '_blank')}
                                                />
                                                <div className="card-body p-2">
                                                    <small className="text-muted text-truncate d-block">
                                                        {photo.originalName || 'No name'}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos Section */}
                        {Array.isArray(comOneService?.complainDetails?.videos) && comOneService.complainDetails.videos.length > 0 && (
                            <div className="col-12">
                                <h6 className="fw-bold text-dark mb-3">
                                    <i className="fas fa-video me-2"></i>
                                    Videos ({comOneService.complainDetails.videos.length})
                                </h6>
                                <div className="row g-3">
                                    {comOneService.complainDetails.videos.map((video, index) => (
                                        <div key={video._id || index} className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="card border-0 shadow-sm">
                                                <video
                                                    controls
                                                    className="card-img-top"
                                                    style={{ height: '150px', objectFit: 'cover' }}
                                                >
                                                    <source src={video.url || ''} type={video.mimetype || 'video/mp4'} />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <div className="card-body p-2">
                                                    <small className="text-muted text-truncate d-block">
                                                        {video.originalName || 'No name'}
                                                    </small>
                                                    <small className="text-success d-block">
                                                        <i className="fas fa-download me-1"></i>
                                                        {video.size ? (video.size / (1024 * 1024)).toFixed(2) : '0.00'} MB
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Audios Section */}
                        {Array.isArray(comOneService?.complainDetails?.audios) && comOneService.complainDetails.audios.length > 0 && (
                            <div className="col-12">
                                <h6 className="fw-bold text-dark mb-3">
                                    <i className="fas fa-music me-2"></i>
                                    Audio Files ({comOneService.complainDetails.audios.length})
                                </h6>
                                <div className="row g-3">
                                    {comOneService.complainDetails.audios.map((audio, index) => (
                                        <div key={audio._id || index} className="col-lg-4 col-md-6 col-12">
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body">
                                                    <audio controls className="w-100 mb-2">
                                                        <source src={audio.url || ''} type={audio.mimetype || 'audio/mpeg'} />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                    <small className="text-muted text-truncate d-block">
                                                        {audio.originalName || 'No name'}
                                                    </small>
                                                    <small className="text-success d-block">
                                                        <i className="fas fa-download me-1"></i>
                                                        {audio.size ? (audio.size / (1024 * 1024)).toFixed(2) : '0.00'} MB
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ViewFormData comOneService={comOneService} isDealer={isDealer} isCustomer={isCustomer} />

            {/* System Information Section */}
            <div className="card shadow-sm border-0 mt-4">
                <div className="card-header bg-light border-0">
                    <h5 className="card-title mb-0 text-primary">
                        <i className="fas fa-info-circle me-2"></i>
                        System Information
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="pb-3 mb-3">
                                <strong className="text-muted d-block mb-1">Created At:</strong>
                                <span className="text-dark">
                                    {comOneService?.createdAt ? <DateTime value={comOneService.createdAt} format='dateTime' /> : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="pb-3">
                                <strong className="text-muted d-block mb-1">Updated At:</strong>
                                <span className="text-dark">
                                    {comOneService?.updatedAt ? <DateTime value={comOneService.updatedAt} format='dateTime' /> : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewServiceDetails