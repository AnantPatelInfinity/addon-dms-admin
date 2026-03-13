import React from 'react';

const SerialNoGridView = ({ serialNos, selectedSerialNoId, onSelect }) => {
    return (
        <div className="serial-grid-view">
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-2">
                {serialNos.map(serial => (
                    <div key={serial._id} className="col">
                        <div
                            className={`card serial-card h-100 ${selectedSerialNoId === serial._id ? 'selected' : ''}`}
                            onClick={() => onSelect(serial._id)}
                        >
                            <div className="card-img-top p-2" style={{ height: '100px' }}>
                                {serial.images?.length > 0 ? (
                                    <img
                                        src={serial.images[0].url}
                                        alt={serial.name}
                                        className="img-fluid h-100 w-100 object-fit-contain"
                                    />
                                ) : (
                                    <div className="no-image-placeholder h-100 d-flex align-items-center justify-content-center">
                                        <i className="fas fa-image fs-4"></i>
                                    </div>
                                )}
                            </div>
                            <div className="card-body p-2">
                                <h6 className="card-title mb-1 text-truncate">{serial.name}</h6>
                                <p className="card-text text-muted small mb-0">
                                    <span className="d-block text-truncate">{serial.companySerialNo}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SerialNoGridView;