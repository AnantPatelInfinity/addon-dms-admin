import React from 'react'
import { Row, Col, ProgressBar, Card } from 'react-bootstrap'
import { Clock, CheckCircle, XCircle, Package, CircleDollarSign, Receipt, Wrench, Home } from 'lucide-react'
import {
    BarChart, Bar, PieChart, Pie, Cell,
    ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import moment from 'moment'
import { getRoleFlags } from '../../../config/DataFile'

const SummaryCards = ({
    counts,
    charts,
    role
}) => {

    const purchaseOrders = counts.purchaseOrders || { total: 0, byStatus: {} };
    const services = counts.services || { total: 0, byStatus: {} };
    const installations = counts.installations || { total: 0, byStatus: {} };
    const installationApproval = charts.installationApproval || { approvedRate: 0 };

    const poTrends = charts.poTrends || { labels: [], data: [] };
    const serviceDistribution = charts.serviceDistribution || { labels: [], data: [] };

    const userRole = localStorage.getItem('DX_ROLE');
    const roleFlags = getRoleFlags(userRole)
    const { isCompany, isGeneral, isServices, isAccounts, isInstallations } = roleFlags;

    const statusColors = {
        'Pending': 'warning',
        'Approved': 'success',
        'Rejected': 'danger',
        'Company Action': 'info',
        'Company Receive': 'primary',
        'Customer Approval': 'secondary'
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];


    return (
        <>
            {/* Summary Cards */}
            <Row className="mb-4">
                {(isCompany || isGeneral || isAccounts) && (
                    <Col md={6} lg={4} className="mb-3">
                        <div className="dashboard-summary-card">
                            <div className="dashboard-summary-accent po" />
                            <div className="dashboard-summary-icon po mb-2"><Receipt size={28} /></div>
                            <div className="dashboard-summary-title">Purchase Orders</div>
                            <div className="dashboard-summary-value">{purchaseOrders.total}</div>
                            <div className="dashboard-summary-badge">Total</div>
                            {Object.entries(purchaseOrders.byStatus).map(([status, count]) => (
                                <div key={status} className="mb-2">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <ProgressBar
                                        className="dashboard-summary-progress"
                                        variant={statusColors[status]}
                                        now={purchaseOrders.total > 0 ? (count / purchaseOrders.total) * 100 : 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                )}

                {(isCompany || isGeneral || isServices) && (
                    <Col md={6} lg={4} className="mb-3">
                        <div className="dashboard-summary-card">
                            <div className="dashboard-summary-accent service" />
                            <div className="dashboard-summary-icon service mb-2"><Wrench size={28} /></div>
                            <div className="dashboard-summary-title">Service Requests</div>
                            <div className="dashboard-summary-value">{services.total}</div>
                            <div className="dashboard-summary-badge">Total</div>
                            {Object.entries(services.byStatus).map(([status, count]) => (
                                <div key={status} className="mb-2">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <ProgressBar
                                        className="dashboard-summary-progress"
                                        variant={statusColors[status]}
                                        now={services.total > 0 ? (count / services.total) * 100 : 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                )}

                {(isCompany || isGeneral || isInstallations) && (
                    <Col md={6} lg={4} className="mb-3">
                        <div className="dashboard-summary-card">
                            <div className="dashboard-summary-accent install" />
                            <div className="dashboard-summary-icon install mb-2"><Home size={28} /></div>
                            <div className="dashboard-summary-title">Installations</div>
                            <div className="dashboard-summary-value">{installations.total}</div>
                            <div className="dashboard-summary-badge">Total</div>
                            <div className="text-center mb-3">
                                <div className="approval-rate">
                                    <h2 className="text-success" style={{ fontSize: '1.5rem', margin: 0 }}>{installationApproval.approvedRate}%</h2>
                                    <small className="text-muted">Approval Rate</small>
                                </div>
                            </div>
                            {Object.entries(installations.byStatus).map(([status, count]) => (
                                <div key={status} className="mb-2">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <ProgressBar
                                        className="dashboard-summary-progress"
                                        variant={statusColors[status]}
                                        now={installations.total > 0 ? (count / installations.total) * 100 : 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                )}
            </Row>

            {(isCompany || isGeneral || isAccounts) && (
                <Row className="mb-4">
                    <Col md={6} className="mb-3">
                        <Card className="dashboard-modern-card">
                            <Card.Body>
                                <Card.Title>PO Trends ({new Date().getFullYear()})</Card.Title>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={poTrends.labels.map((label, index) => ({
                                            name: label,
                                            value: poTrends.data[index]
                                        }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" name="PO Count" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {(isCompany || isGeneral || isServices) && (
                        <Col md={6} className="mb-3">
                            <Card className="dashboard-modern-card">
                                <Card.Body>
                                    <Card.Title>Service Request Status</Card.Title>
                                    <div style={{ height: '300px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={serviceDistribution.labels.map((label, index) => ({
                                                        name: label,
                                                        value: serviceDistribution.data[index]
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {serviceDistribution.labels.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}

        </>
    )
}

export default SummaryCards