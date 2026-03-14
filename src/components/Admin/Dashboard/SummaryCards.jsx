import React from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Zap, FileCheck, Hammer, Truck, CheckCircle, AlertCircle, ArrowRight, Wrench, RefreshCw, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router'


const SummaryCards = ({ dashboardData }) => {

    const navigate = useNavigate()

    return (
        <>
            {/* Summary Cards */}
            <Row className="mb-4 g-4">
                <Col xl={3} lg={6} md={6}>
                    <Card className="h-100 border-0 dashboard-summary-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="dashboard-summary-icon bg-primary">
                                    <Wrench size={28} className="text-red" aria-label="Total Services Icon" />
                                </div>
                                <div className="text-end">
                                    <div className="dashboard-summary-number">{dashboardData?.counts?.services?.total}</div>
                                    <div className="dashboard-summary-label">Total Services</div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-pending">{dashboardData?.counts?.services?.pending}</div>
                                    <div className="dashboard-summary-status-label">Pending</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-progress">{dashboardData?.counts?.services?.inProgress}</div>
                                    <div className="dashboard-summary-status-label">In Progress</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-completed">{dashboardData?.counts?.services?.completed}</div>
                                    <div className="dashboard-summary-status-label">Completed</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6}>
                    <Card className="h-100 border-0 dashboard-summary-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="dashboard-summary-icon bg-success">
                                    <FileCheck size={28} className="text-success" aria-label="Transaction POs Icon" />
                                </div>
                                <div className="text-end">
                                    <div className="dashboard-summary-number">{dashboardData?.counts?.transactionPos?.total}</div>
                                    <div className="dashboard-summary-label">Transaction POs</div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-pending">{dashboardData?.counts?.transactionPos?.pending}</div>
                                    <div className="dashboard-summary-status-label">Pending</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-approved">{dashboardData?.counts?.transactionPos?.approved}</div>
                                    <div className="dashboard-summary-status-label">Approved</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-rejected">{dashboardData?.counts?.transactionPos?.rejected}</div>
                                    <div className="dashboard-summary-status-label">Rejected</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6}>
                    <Card className="h-100 border-0 dashboard-summary-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="dashboard-summary-icon bg-warning">
                                    <Hammer size={28} className="text-warning" aria-label="Installations Icon" />
                                </div>
                                <div className="text-end">
                                    <div className="dashboard-summary-number">{dashboardData?.counts?.installations?.total}</div>
                                    <div className="dashboard-summary-label">Installations</div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-pending">{dashboardData?.counts?.installations?.pending}</div>
                                    <div className="dashboard-summary-status-label">Pending</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-approved">{dashboardData?.counts?.installations?.approved}</div>
                                    <div className="dashboard-summary-status-label">Approved</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-rejected">{dashboardData?.counts?.installations?.rejected}</div>
                                    <div className="dashboard-summary-status-label">Rejected</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6}>
                    <Card className="h-100 border-0 dashboard-summary-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="dashboard-summary-icon bg-info">
                                    <Truck size={28} className="text-info" aria-label="Dealer POs Icon" />
                                </div>
                                <div className="text-end">
                                    <div className="dashboard-summary-number">{dashboardData?.counts?.dealerPos?.total}</div>
                                    <div className="dashboard-summary-label">Dealer POs</div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-pending">{dashboardData?.counts?.dealerPos?.pending}</div>
                                    <div className="dashboard-summary-status-label">Pending</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-approved">{dashboardData.counts.dealerPos.approved}</div>
                                    <div className="dashboard-summary-status-label">Approved</div>
                                </div>
                                <div className="text-center flex-fill">
                                    <div className="dashboard-summary-status dashboard-summary-status-rejected">{dashboardData.counts.dealerPos.rejected}</div>
                                    <div className="dashboard-summary-status-label">Rejected</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm dashboard-card dashboard-quickaction-main">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0 fw-semibold section-heading">
                                    <Zap size={20} className="me-2 text-warning" />
                                    Quick Actions
                                </h5>
                            </div>
                            <Row className="g-3">
                                {dashboardData.fastActions.map((action, index) => (
                                    <Col key={index} xl={3} lg={6} md={6}>
                                        <Card className={`h-100 border-0 dashboard-action-card dashboard-quickaction-card ${action.count > 0 ? 'border-top border-3 border-primary' : ''}`}> {/* Add dashboard-quickaction-card class */}
                                            <Card.Body className="d-flex flex-column align-items-start">
                                                <div className="d-flex align-items-center mb-3 w-100">
                                                    <div className={`dashboard-quickaction-icon ${action.count > 0 ? 'bg-primary' : 'bg-secondary'}`}>
                                                        {action.count > 0 ? (
                                                            <CheckCircle size={22} className="text-primary" />
                                                        ) : (
                                                            <AlertCircle size={22} className="text-secondary" />
                                                        )}
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <div className="dashboard-quickaction-count">{action.count}</div>
                                                        <div className="dashboard-quickaction-label">{action.name}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant={action.count > 0 ? 'primary' : 'outline-secondary'}
                                                    size="sm"
                                                    disabled={action.count === 0}
                                                    className="mt-auto dashboard-action-btn dashboard-quickaction-btn"
                                                    onClick={() => navigate(action.action)}
                                                    aria-label={`Take action: ${action.name}`}
                                                >
                                                    Take Action <ArrowRight size={16} className="ms-1" />
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm dashboard-card mb-5">
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h5 className="fw-semibold mb-0 section-heading">
                            <Wrench size={20} className="me-2 text-primary" />
                            Demo Units Overview
                        </h5>
                    </div>

                    <Row className="g-3">
                        <Col xl={3} md={6}>
                            <div className="trial-card trial-total">
                                <div className="trial-icon bg-primary">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.totalTrials}
                                    </div>
                                    <div className="trial-label">Total Demo Unit</div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={3} md={6}>
                            <div className="trial-card trial-month">
                                <div className="trial-icon bg-info">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.currentMonthTrials}
                                    </div>
                                    <div className="trial-label">Current Month</div>
                                </div>
                            </div>
                        </Col>
                        <Col xl={3} md={6}>
                            <div className="trial-card trial-completed">
                                <div className="trial-icon bg-success">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.completedTrials}
                                    </div>
                                    <div className="trial-label">Completed</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="g-3 my-3">
                        <Col xl={3} md={6}>
                            <div className="trial-card trial-created">
                                <div className="trial-icon bg-info">
                                    <FileCheck size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.createdTrials}
                                    </div>
                                    <div className="trial-label">Pending Demo Units</div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={3} md={6}>
                            <div className="trial-card trial-dispatched">
                                <div className="trial-icon bg-warning">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.dispatchedTrials}
                                    </div>
                                    <div className="trial-label">Dispatched To Customer</div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={3} md={6}>
                            <div className="trial-card trial-received">
                                <div className="trial-icon" style={{ background: "#5363fa" }}>
                                    <ArrowRight size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.receivedTrials}
                                    </div>
                                    <div className="trial-label">Received By Customer</div>
                                </div>
                            </div>
                        </Col>

                        <Col xl={3} md={6}>
                            <div className="trial-card trial-returned">
                                <div className="trial-icon bg-warning">
                                    <RefreshCw size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.returnedTrials}
                                    </div>
                                    <div className="trial-label">Returned By Customer</div>
                                </div>
                            </div>
                        </Col>



                        {/* <Col xl={2} md={6}>
                            <div className="trial-card trial-cancelled">
                                <div className="trial-icon bg-danger">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <div className="trial-number">
                                        {dashboardData?.trialOrderSummary?.data?.cancelledTrials}
                                    </div>
                                    <div className="trial-label">Cancelled</div>
                                </div>
                            </div>
                        </Col> */}
                    </Row>

                </Card.Body>
            </Card>
        </>
    )
}

export default SummaryCards