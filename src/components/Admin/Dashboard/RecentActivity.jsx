import React from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Activity, Wrench, HardHat, FileText, ShoppingCart, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import ADMIN_URLS from '../../../config/routesFile/admin.routes'

const RecentActivity = ({ dashboardData }) => {

    const navigate = useNavigate()
    // Status colors with better contrast
    const STATUS_COLORS = {
        1: { bg: '#fff3cd', text: '#856404' }, // Pending
        2: { bg: '#cce5ff', text: '#004085' }, // Approved
        3: { bg: '#f8d7da', text: '#721c24' }, // Rejected
        4: { bg: '#d1ecf1', text: '#0c5460' }, // Company Receive
        5: { bg: '#e2e3e5', text: '#383d41' }, // Service Estimation
        6: { bg: '#d4edda', text: '#155724' }, // Customer Approval
        7: { bg: '#d6d8d9', text: '#1b1e21' }, // Company Dispatch
        8: { bg: '#d4edda', text: '#155724' }  // Completed
    };

    const getStatusText = (status) => {
        const statusMap = {
            1: 'Pending',
            2: 'Approved',
            3: 'Rejected',
            4: 'Company Receive',
            5: 'Service Estimation',
            6: 'Customer Approval',
            7: 'Company Dispatch',
            8: 'Completed'
        };
        return statusMap[status] || `Status ${status}`;
    };

    return (
        <>
            {/* Recent Activities */}
            <Row>
                <Col>
                    <Card className="border-0 shadow-sm dashboard-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-semibold section-heading">
                                    <Activity size={20} className="me-2 text-primary" />
                                    Recent Activities
                                </h5>
                            </div>
                            <Row>
                                {/* Recent Services */}
                                <Col lg={6} className="mb-4">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded me-2">
                                            <Wrench size={18} className="text-primary" />
                                        </div>
                                        <h6 className="mb-0 fw-semibold">Services</h6>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Status</th>
                                                    <th>Customer</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData?.recentActivities?.services?.slice(0, 5).map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.title}</td>
                                                        <td>
                                                            <span
                                                                className='badge badge-pill dashboard-badge'
                                                                style={{
                                                                    backgroundColor: STATUS_COLORS[item.status]?.bg,
                                                                    color: STATUS_COLORS[item.status]?.text
                                                                }}
                                                            >
                                                                {getStatusText(item.status)}
                                                            </span>
                                                        </td>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.customer} {item?.clinicName ? `(${item?.clinicName})` : ''}</td>
                                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => navigate(ADMIN_URLS.VIEW_SERVICE, { state: item.id })} aria-label="View service">
                                                                View <ChevronRight size={14} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {dashboardData?.recentActivities?.services?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="text-center">No data found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>

                                {/* Recent POs */}
                                <Col lg={6} className="mb-4">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div className="bg-success bg-opacity-10 p-2 rounded me-2">
                                            <FileText size={18} className="text-success" />
                                        </div>
                                        <h6 className="mb-0 fw-semibold">POs</h6>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Status</th>
                                                    <th>Company</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData?.recentActivities?.pos?.slice(0, 5).map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.title}</td>
                                                        <td>
                                                            <span
                                                                className='badge badge-pill dashboard-badge'
                                                                style={{
                                                                    backgroundColor: STATUS_COLORS[item.status]?.bg,
                                                                    color: STATUS_COLORS[item.status]?.text
                                                                }}
                                                            >
                                                                {getStatusText(item.status)}
                                                            </span>
                                                        </td>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.company}</td>
                                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button variant="link" size="sm" className="p-0 text-decoration-none"
                                                                onClick={() => navigate(`${ADMIN_URLS.VIEW_PO}/${item.id}`)} aria-label="View PO">
                                                                View <ChevronRight size={14} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {dashboardData?.recentActivities?.pos?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="text-center">No data found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {/* Recent Installations */}
                                <Col lg={6} className="mb-4">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div className="bg-warning bg-opacity-10 p-2 rounded me-2">
                                            <HardHat size={18} className="text-warning" />
                                        </div>
                                        <h6 className="mb-0 fw-semibold">Installations</h6>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Status</th>
                                                    <th>Customer</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData?.recentActivities?.installations?.slice(0, 5).map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.title}</td>
                                                        <td>
                                                            <span
                                                                className='badge badge-pill dashboard-badge'
                                                                style={{
                                                                    backgroundColor: STATUS_COLORS[item.status]?.bg,
                                                                    color: STATUS_COLORS[item.status]?.text
                                                                }}
                                                            >
                                                                {getStatusText(item.status)}
                                                            </span>
                                                        </td>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.customer} {item?.clinicName ? `(${item?.clinicName})` : ''}</td>
                                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => navigate(ADMIN_URLS.VIEW_INSTALL, { state: item.id })} aria-label="View installation">
                                                                View <ChevronRight size={14} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {dashboardData?.recentActivities?.installations?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="text-center">No data found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>

                                {/* Recent Dealer POs */}
                                <Col lg={6} className="mb-4">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div className="bg-info bg-opacity-10 p-2 rounded me-2">
                                            <ShoppingCart size={18} className="text-info" />
                                        </div>
                                        <h6 className="mb-0 fw-semibold">Dealer POs</h6>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Status</th>
                                                    <th>Dealer</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData?.recentActivities?.dealerPos?.slice(0, 5).map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.title}</td>
                                                        <td>
                                                            <span
                                                                className='badge badge-pill dashboard-badge'
                                                                style={{
                                                                    backgroundColor: STATUS_COLORS[item.status]?.bg,
                                                                    color: STATUS_COLORS[item.status]?.text
                                                                }}
                                                            >
                                                                {getStatusText(item.status)}
                                                            </span>
                                                        </td>
                                                        <td className="text-truncate" style={{ maxWidth: '180px' }}>{item.dealer}</td>
                                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                                        <td>
                                                            <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => navigate(`${ADMIN_URLS.VIEW_DEALER_PO}/${item.id}`)} aria-label="View dealer PO">
                                                                View <ChevronRight size={14} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {dashboardData?.recentActivities?.dealerPos?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="text-center">No data found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default RecentActivity