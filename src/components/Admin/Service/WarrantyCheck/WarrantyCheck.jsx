import { Badge, Alert, Row, Col } from 'react-bootstrap';
import { Shield, ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { useEffect } from 'react';

const WarrantyStatusChecker = ({ installationData, amcData }) => {

    const getWarrantyStatus = () => {
        const today = new Date();

        // Check AMC first
        if (amcData && amcData.length > 0) {
            const amc = amcData[0];
            const amcEndDate = new Date(amc.endDate);

            if (amcEndDate >= today) {
                return {
                    status: 'under_amc',
                    endDate: amcEndDate,
                    startDate: new Date(amc.startDate),
                    type: amc.warrantyName,
                    duration: amc.warrantyDuration,
                    amount: amc.amount
                };
            } else {
                return {
                    status: 'amc_expired',
                    endDate: amcEndDate
                };
            }
        }

        // Check installation warranty if no AMC
        if (installationData) {
            const warrantyEndDate = new Date(installationData.warrantyEndDate);

            if (warrantyEndDate >= today) {
                return {
                    status: 'under_warranty',
                    endDate: warrantyEndDate,
                    startDate: new Date(installationData.warrantyStartDate),
                    type: installationData.installWarranty
                };
            } else {
                return {
                    status: 'warranty_expired',
                    endDate: warrantyEndDate
                };
            }
        }

        return {
            status: 'unknown',
            message: 'No warranty information available'
        };
    };

    const status = getWarrantyStatus();
    const today = new Date();

    // Render status badge
    const renderStatusBadge = () => {
        const iconSize = 16;
        const iconClass = "me-1";

        switch (status.status) {
            case 'under_warranty':
                return (
                    <Badge bg="success">
                        <ShieldCheck size={iconSize} className={iconClass} />
                        Under Warranty
                    </Badge>
                );
            case 'warranty_expired':
                return (
                    <Badge bg="danger">
                        <ShieldAlert size={iconSize} className={iconClass} />
                        Warranty Expired
                    </Badge>
                );
            case 'under_amc':
                return (
                    <Badge bg="primary">
                        <ShieldCheck size={iconSize} className={iconClass} />
                        Under AMC
                    </Badge>
                );
            case 'amc_expired':
                return (
                    <Badge bg="warning" text="dark">
                        <ShieldAlert size={iconSize} className={iconClass} />
                        AMC Expired
                    </Badge>
                );
            default:
                return (
                    <Badge bg="secondary">
                        <Info size={iconSize} className={iconClass} />
                        Status Unknown
                    </Badge>
                );
        }
    };

    // Render status details
    const renderStatusDetails = () => {
        switch (status.status) {
            case 'under_warranty':
                const warrantyDaysLeft = Math.ceil((status.endDate - today) / (1000 * 60 * 60 * 24));
                return (
                    <div className="mt-3">
                        <Row>
                            <Col md={6}>
                                <p><strong>Warranty Type:</strong> {status.type}</p>
                                <p><strong>Start Date:</strong> {status.startDate.toLocaleDateString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>End Date:</strong> {status.endDate.toLocaleDateString()}</p>
                                <p><strong>Days Remaining:</strong> {warrantyDaysLeft}</p>
                            </Col>
                        </Row>
                    </div>
                );

            case 'under_amc':
                const amcDaysLeft = Math.ceil((status.endDate - today) / (1000 * 60 * 60 * 24));
                return (
                    <div className="mt-3">
                        <Row>
                            <Col md={6}>
                                <p><strong>AMC Type:</strong> {status.type} ({status.duration} months)</p>
                                <p><strong>Start Date:</strong> {status.startDate.toLocaleDateString()}</p>
                                <p><strong>Amount:</strong> ₹{status.amount?.toLocaleString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>End Date:</strong> {status.endDate.toLocaleDateString()}</p>
                                <p><strong>Days Remaining:</strong> {amcDaysLeft}</p>
                            </Col>
                        </Row>
                    </div>
                );

            case 'warranty_expired':
            case 'amc_expired':
                const daysExpired = Math.floor((today - status.endDate) / (1000 * 60 * 60 * 24));
                return (
                    <div className="mt-3">
                        <Alert variant="warning" className="d-flex align-items-center">
                            <ShieldAlert size={20} className="me-2" />
                            <div>
                                <strong>Expired on:</strong> {status.endDate.toLocaleDateString()}
                                <br />
                                <strong>Days since expired:</strong> {daysExpired}
                                {status.status === 'warranty_expired' && (
                                    <div className="mt-2">
                                        Consider purchasing an AMC for continued support.
                                    </div>
                                )}
                            </div>
                        </Alert>
                    </div>
                );

            default:
                return (
                    <Alert variant="secondary" className="mt-3">
                        <Info size={16} className="me-2" />
                        No warranty or AMC information available for this product.
                    </Alert>
                );
        }
    };

    return (
        <div className="warranty-status-checker">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center text-primary">
                    <Shield size={20} className="me-2" />
                    Warranty/AMC Status
                </h5>
                {renderStatusBadge()}
            </div>

            {renderStatusDetails()}

            {installationData && (
                <div className="mt-4">
                    <h5 className='mb-3 text-primary'>Installation Details</h5>
                    <Row>
                        <Col md={6}>
                            <p><strong>Installation Date:</strong> {new Date(installationData.physicalInstallDate).toLocaleDateString()}</p>
                            <p><strong>Report No:</strong> {installationData.reportNo}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Engineer:</strong> {installationData.engineerName}</p>
                            <p><strong>Serial No:</strong> {installationData.productSerialNo}</p>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default WarrantyStatusChecker;