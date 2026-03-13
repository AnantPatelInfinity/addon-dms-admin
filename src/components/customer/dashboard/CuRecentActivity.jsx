import React from 'react'
import { Card, Row, Col, Table } from 'react-bootstrap';

const CuRecentActivity = ({
    recent,
}) => {
    return (
        <>
            {/* Recent Activity Tables */}
            <Row className="dealer-dashboard-activity-row mb-4">
                <Col md={6}>
                    <Card className="dealer-dashboard-activity-card proerp-table-card">
                        <Card.Body>
                            <Card.Title className="proerp-table-title">Recent Purchase Orders</Card.Title>
                            <Table className="proerp-table" responsive>
                                <thead>
                                    <tr>
                                        <th>Voucher No</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Customer</th>
                                        <th>Products</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.purchaseOrders?.map(po => (
                                        <tr key={po.id}>
                                            <td>{po.voucherNo}</td>
                                            <td>{po.poDate ? new Date(po.poDate).toLocaleDateString() : ''}</td>
                                            <td>{po.status}</td>
                                            <td>{po.customer}</td>
                                            <td>{po.productsCount}</td>
                                        </tr>
                                    ))}
                                    {recent.purchaseOrders?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="dealer-dashboard-activity-card proerp-table-card">
                        <Card.Body>
                            <Card.Title className="proerp-table-title">Recent Installations</Card.Title>
                            <Table className="proerp-table" responsive>
                                <thead>
                                    <tr>
                                        <th>Report No</th>
                                        <th>Equipment</th>
                                        <th>Status</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.installations?.map(inst => (
                                        <tr key={inst.id}>
                                            <td>{inst.reportNo}</td>
                                            <td>{inst.equipmentName}</td>
                                            <td>{inst.status}</td>
                                            <td>{inst.customer} {inst?.clinicName ? `(${inst?.clinicName})` : ''}</td>
                                            <td>{inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : ''}</td>
                                        </tr>
                                    ))}
                                    {recent.installations?.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="dealer-dashboard-activity-card proerp-table-card mb-4">
                <Card.Body>
                    <Card.Title className="proerp-table-title">Recent Services</Card.Title>
                    <Table className="proerp-table" responsive>
                        <thead>
                            <tr>
                                <th>Complain No</th>
                                <th>Status</th>
                                <th>Customer</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.services?.map(srv => (
                                <tr key={srv.id}>
                                    <td>{srv.complainNo}</td>
                                    <td>{srv.status?.replace(/Final\s*/i, '').trim()}</td>
                                    <td>{srv.customer} {srv?.clinicName ? `(${srv?.clinicName})` : ''} </td>
                                    <td>{srv.createdAt ? new Date(srv.createdAt).toLocaleDateString() : ''}</td>
                                </tr>
                            ))}
                            {recent.services?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

        </>
    )
}

export default CuRecentActivity