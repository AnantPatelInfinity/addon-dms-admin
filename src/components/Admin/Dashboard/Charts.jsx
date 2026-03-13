import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { Wrench, HardHat, FileText, ShoppingCart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Charts = ({ dashboardData }) => {

    // Color schemes for charts
    const CHART_COLORS = {
        serviceStatus: '#e5251b', // Blue for service status bar chart
        installationStatus: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'],
        poStatus: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'], // Yellow, Green, Red, Blue
        dealerPoStatus: ['#8b5cf6', '#ec4899', '#14b8a6', '#64748b'] // Purple, Pink, Teal, Gray
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip p-3 bg-white shadow-sm border rounded">
                    <p className="fw-bold mb-1">{label}</p>
                    <p className="mb-0">
                        <span className="me-2" style={{ color: payload[0].fill }}>
                            ■
                        </span>
                        Count: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* Charts Section */}
            <Row className="mb-4 g-4">
                {/* Service Status Distribution */}
                <Col lg={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-semibold">
                                    <Wrench size={20} className="me-2 text-primary" />
                                    Service Status Distribution
                                </h5>
                            </div>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={dashboardData.charts.serviceStatus}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        barSize={30}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                        <XAxis
                                            dataKey="status"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="count"
                                            fill={CHART_COLORS.serviceStatus}
                                            radius={[4, 4, 0, 0]}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Installation Status */}
                <Col lg={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-semibold">
                                    <HardHat size={20} className="me-2 text-warning" />
                                    Installation Status
                                </h5>
                            </div>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.charts.installationStatus}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            innerRadius={60}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                        >
                                            {dashboardData.charts.installationStatus.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CHART_COLORS.installationStatus[index % CHART_COLORS.installationStatus.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                            wrapperStyle={{ paddingLeft: '20px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* PO Status Charts */}
            <Row className="mb-4 g-4">
                <Col lg={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-semibold">
                                    <FileText size={20} className="me-2 text-success" />
                                    Transaction PO Status
                                </h5>
                            </div>
                            <div style={{ height: '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.charts.poStatus.transactionPo}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            innerRadius={50}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                        >
                                            {dashboardData.charts.poStatus.transactionPo.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CHART_COLORS.poStatus[index % CHART_COLORS.poStatus.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-semibold">
                                    <ShoppingCart size={20} className="me-2 text-info" />
                                    Dealer PO Status
                                </h5>
                            </div>
                            <div style={{ height: '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.charts.poStatus.dealerPo}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            innerRadius={50}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                        >
                                            {dashboardData.charts.poStatus.dealerPo.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CHART_COLORS.dealerPoStatus[index % CHART_COLORS.dealerPoStatus.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Charts