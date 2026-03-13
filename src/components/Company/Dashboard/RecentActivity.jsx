import React from 'react'
import { Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Receipt, Wrench, Home, ChevronRight } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router'
import COMPANY_URLS from '../../../config/routesFile/company.routes'
import { getRoleFlags } from '../../../config/DataFile'

const RecentActivity = ({
    recentActivities,
    role
}) => {
    const navigate = useNavigate();

    const recentPOs = Array.isArray(recentActivities.purchaseOrders) ? recentActivities.purchaseOrders : [];
    const recentServices = Array.isArray(recentActivities.services) ? recentActivities.services : [];
    const recentInstalls = Array.isArray(recentActivities.installations) ? recentActivities.installations : [];

    const userRole = localStorage.getItem('DX_ROLE');
    const roleFlags = getRoleFlags(userRole)
    const { isCompany, isGeneral, isServices, isAccounts, isInstallations } = roleFlags;

    return (
        <>
            <Row>
            {(isCompany || isGeneral || isAccounts) && (
                <Col md={6} className="mb-3">
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title>Recent POs</Card.Title>
                                <Button variant="link" size="sm" onClick={() => navigate(COMPANY_URLS.PO_LIST)}>
                                    View All <ChevronRight size={16} />
                                </Button>
                            </div>
                            <div className="table-responsive">
                                <table className="dashboard-modern-table">
                                    <thead>
                                        <tr>
                                            <th>Voucher No</th>
                                            <th>Date</th>
                                            <th>Firm</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPOs.map((po, index) => (
                                            <tr key={index}>
                                                <td><Receipt size={14} className="me-1" />{po.voucherNo}</td>
                                                <td>{po.poDate ? moment(po.poDate).format('DD MMM YYYY') : '-'}</td>
                                                <td>{po.firmId?.name || '-'}</td>
                                                <td>
                                                    <Badge bg={po.status === 2 ? 'success' : po.status === 3 ? 'danger' : 'warning'}>
                                                        {po.status === 2 ? 'Approved' : po.status === 3 ? 'Rejected' : 'Pending'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            )}

            {(isCompany || isGeneral || isServices) && (
                <Col md={6} className="mb-3">
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title>Recent Services</Card.Title>
                                <Button variant="link" size="sm" onClick={() => navigate(COMPANY_URLS.SERVICE_LIST)}>
                                    View All <ChevronRight size={16} />
                                </Button>
                            </div>
                            <div className="table-responsive">
                                <table className="dashboard-modern-table">
                                    <thead>
                                        <tr>
                                            <th>Complain No</th>
                                            <th>Date</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentServices.map((service, index) => (
                                            <tr key={index}>
                                                <td><Wrench size={14} className="me-1" />{service.complainNo}</td>
                                                <td>{service.serviceDate ? moment(service.serviceDate).format('DD MMM YYYY') : '-'}</td>
                                                <td>{service?.customerId?.title} {service.customerId?.name || '-'} {service?.customerId?.lastName} {service?.customerId?.clinicName ? `(${service?.customerId?.clinicName})` : ''}</td>
                                                <td>
                                                    <Badge bg={
                                                        service.status === 1 ? 'warning' :
                                                            service.status === 2 ? 'info' :
                                                                service.status === 4 ? 'primary' :
                                                                    service.status === 6 ? 'secondary' : 'light'
                                                    }>
                                                        {service.status === 1 ? 'Pending' :
                                                            service.status === 2 ? 'Company Action' :
                                                                service.status === 4 ? 'Company Receive' :
                                                                    service.status === 6 ? 'Customer Approval' : 'Unknown'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            )}

            {(isCompany || isGeneral || isInstallations) && (
                <Col md={12} className="mb-3">
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title>Recent Installations</Card.Title>
                                <Button variant="link" size="sm" onClick={() => navigate(COMPANY_URLS.INSTALL_LIST)}>
                                    View All <ChevronRight size={16} />
                                </Button>
                            </div>
                            <div className="table-responsive">
                                <table className="dashboard-modern-table">
                                    <thead>
                                        <tr>
                                            <th>Report No</th>
                                            <th>Date</th>
                                            <th>Customer</th>
                                            <th>Product</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentInstalls.map((install, index) => (
                                            <tr key={index}>
                                                <td><Home size={14} className="me-1" />{install.reportNo}</td>
                                                <td>{install.physicalInstallDate ? moment(install.physicalInstallDate).format('DD MMM YYYY') : '-'}</td>
                                                <td>{install?.customerId?.title} {install.customerId?.name || '-'} {install?.customerId?.lastName} {install?.customerId?.clinicName ? `(${install?.customerId?.clinicName})` : ''}</td>
                                                <td>{install.productModel ? `${install.productModel} - ${install.productSerialNo}` : '-'}</td>
                                                <td>
                                                    <Badge bg={install.status === 2 ? 'success' : install.status === 3 ? 'danger' : 'warning'}>
                                                        {install.status === 2 ? 'Approved' : install.status === 3 ? 'Rejected' : 'Pending'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </Row>
        </>
    )
}

export default RecentActivity