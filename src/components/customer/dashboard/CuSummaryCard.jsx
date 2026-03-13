import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'

const CuSummaryCard = ({
    summary,
}) => {
    return (
        <>
            {/* Summary Cards */}
            <Row className="mb-4 dashboard-summary-cards">
                <Col lg={4} md={4}>
                    <Card className="summary-card dealer-summary-card summary-card-po">
                        <Card.Body>
                            <Card.Title>Purchase Orders</Card.Title>
                            <dl className="summary-list">
                                <div className="summary-total-row">
                                    <dt className="summary-total-label">Total</dt>
                                    <dd className="summary-total-value">{summary.purchaseOrders?.total || 0}</dd>
                                </div>
                                <div className="summary-divider" />
                                <div className="summary-subcounts">
                                    <div className="summary-subcount">
                                        <span className="summary-label">Pending</span>
                                        <span className="summary-value">{summary.purchaseOrders?.pending || 0}</span>
                                    </div>
                                    <div className="summary-subcount">
                                        <span className="summary-label">Approved</span>
                                        <span className="summary-value">{summary.purchaseOrders?.approved || 0}</span>
                                    </div>
                                    <div className="summary-subcount">
                                        <span className="summary-label">Rejected</span>
                                        <span className="summary-value">{summary.purchaseOrders?.rejected || 0}</span>
                                    </div>
                                </div>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={4}>
                    <Card className="summary-card dealer-summary-card summary-card-installations">
                        <Card.Body>
                            <Card.Title>Installations</Card.Title>
                            <dl className="summary-list">
                                <div className="summary-total-row">
                                    <dt className="summary-total-label">Total</dt>
                                    <dd className="summary-total-value">{summary.installations?.total || 0}</dd>
                                </div>
                                <div className="summary-divider" />
                                <div className="summary-subcounts">
                                    <div className="summary-subcount">
                                        <span className="summary-label">Pending</span>
                                        <span className="summary-value">{summary.installations?.pending || 0}</span>
                                    </div>
                                    <div className="summary-subcount">
                                        <span className="summary-label">Approved</span>
                                        <span className="summary-value">{summary.installations?.approved || 0}</span>
                                    </div>
                                    <div className="summary-subcount">
                                        <span className="summary-label">Rejected</span>
                                        <span className="summary-value">{summary.installations?.rejected || 0}</span>
                                    </div>
                                </div>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={4}>
                    <Card className="summary-card dealer-summary-card summary-card-services">
                        <Card.Body>
                            <Card.Title>Services</Card.Title>
                            <dl className="summary-list">
                                <div className="summary-total-row">
                                    <dt className="summary-total-label">Total</dt>
                                    <dd className="summary-total-value">{summary.services?.total || 0}</dd>
                                </div>
                                <div className="summary-divider" />
                                <div className="summary-subcounts">
                                    <div className="summary-subcount">
                                        <span className="summary-label">Pending</span>
                                        <span className="summary-value">{summary.services?.pending || 0}</span>
                                    </div>
                                    <div className="summary-subcount">
                                        <span className="summary-label">Completed</span>
                                        <span className="summary-value">{summary.services?.completed || 0}</span>
                                    </div>
                                    <div className="summary-subcount">
                                        <span className="summary-label">In Progress</span>
                                        <span className="summary-value">{summary.services?.inProgress || 0}</span>
                                    </div>
                                </div>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={4}>
                    <Card className="summary-card dealer-summary-card summary-card-trials">
                        <Card.Body>
                            <Card.Title>Demo Units</Card.Title>

                            <dl className="summary-list">
                                <div className="summary-total-row">
                                    <dt className="summary-total-label">Total</dt>
                                    <dd className="summary-total-value">
                                        {summary?.trialOrder?.totalTrials || 0}
                                    </dd>
                                </div>

                                <div className="summary-divider" />
                                <div className="summary-subcounts">
                                    <div className="summary-subcount">
                                        <span className="summary-label">Running</span>
                                        <span className="summary-value">
                                            {summary?.trialOrder?.runningTrials || 0}
                                        </span>
                                    </div>

                                    <div className="summary-subcount">
                                        <span className="summary-label">Completed</span>
                                        <span className="summary-value">
                                            {summary?.trialOrder?.completedTrials || 0}
                                        </span>
                                    </div>
                                </div>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CuSummaryCard