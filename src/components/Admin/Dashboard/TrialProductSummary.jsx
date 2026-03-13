import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FlaskConical } from "lucide-react";

const TrialProductSummary = ({ dashboardData }) => {

    const trials = dashboardData?.trialOrderSummary?.summary || [];

    return (
        <Row className="mb-4">
            <Col>
                <Card className="border-0 shadow-sm dashboard-card">
                    <Card.Body>

                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary bg-opacity-10 p-2 rounded me-2">
                                <FlaskConical size={18} className="text-primary" />
                            </div>
                            <h5 className="mb-0 fw-semibold">
                                Demo Units By Product
                            </h5>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Total</th>
                                        <th>Pending</th>
                                        <th>Dispatched</th>
                                        <th>Received</th>
                                        <th>Returned</th>
                                        <th>Completed</th>
                                        <th>Cancelled</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {trials.map((item) => (
                                        <tr key={item.productId}>
                                            <td className="fw-semibold">
                                                {item.productName}
                                            </td>
                                            <td>{item.totalTrials}</td>
                                            <td>{item.createdTrials}</td>
                                            <td>{item.dispatchedTrials}</td>
                                            <td>{item.receivedTrials}</td>
                                            <td>{item.returnedTrials}</td>
                                            <td className="text-success fw-semibold">
                                                {item.completedTrials}
                                            </td>
                                            <td className="text-danger fw-semibold">
                                                {item.cancelledTrials}
                                            </td>
                                        </tr>
                                    ))}

                                    {trials.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                No trial data found
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>

                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default TrialProductSummary;