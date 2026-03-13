import React from 'react'
import { Card, Row, Col } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PieController,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels, PieController);

const CuCharts = ({
    charts,
}) => {

    // Chart data
    const poStatusData = {
        labels: charts.poStatusDistribution?.map(item => item.status) || [],
        datasets: [{
            data: charts.poStatusDistribution?.map(item => item.count) || [],
            backgroundColor: ['#f39c12', '#27ae60', '#e74c3c'],
        }]
    };
    const installationStatusData = {
        labels: charts.installationStatusDistribution?.map(item => item.status) || [],
        datasets: [{
            data: charts.installationStatusDistribution?.map(item => item.count) || [],
            backgroundColor: ['#27ae60', '#e74c3c'],
        }]
    };
    const serviceStatusData = {
        labels: charts.serviceStatusDistribution?.map(item => item.status) || [],
        datasets: [{
            data: charts.serviceStatusDistribution?.map(item => item.count) || [],
            backgroundColor: ['#f39c12', '#27ae60', '#e74c3c', '#2980b9', '#8e44ad'],
            label: 'Service Status',
        }]
    };

    // Chart options to hide built-in legend
    const chartOptions = {
        plugins: {
            legend: { display: false },
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    const barChartOptions = {
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'top',
                color: '#222f3e',
                font: {
                    weight: 'bold',
                    size: 12,
                },
                formatter: function (value) {
                    return value;
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                    color: '#34495e',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    font: {
                        size: 11
                    },
                    color: '#7f8c8d',
                },
            },
        },
        elements: {
            bar: {
                borderRadius: 6,
                borderSkipped: false,
                backgroundColor: serviceStatusData.datasets[0].backgroundColor,
            },
        },
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 10,
                left: 20,
            },
        },
        barPercentage: 0.8,
        categoryPercentage: 0.7,
    };

    // Helper to render custom legend
    const renderLegend = (labels, colors) => (
        <div className="`dealer`-dashboard-chart-legend">
            {labels.map((label, idx) => (
                <div className="dealer-dashboard-chart-legend-item" key={label}>
                    <span className="dealer-dashboard-chart-legend-color" style={{ backgroundColor: colors[idx] }} />
                    <span className="dealer-dashboard-chart-legend-label">{label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <>
            {/* Status Charts */}
            <Row className="mb-4 dealer-dashboard-charts-row">
                <Col md={6}>
                    <Card className="dealer-dashboard-chart-card">
                        <Card.Body>
                            <Card.Title>PO Status</Card.Title>
                            <div className="dealer-dashboard-chart-wrapper">
                                <Pie data={poStatusData} options={chartOptions} width={120} height={120} />
                            </div>
                            {renderLegend(
                                poStatusData.labels,
                                poStatusData.datasets[0].backgroundColor
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="dealer-dashboard-chart-card">
                        <Card.Body>
                            <Card.Title>Installation Status</Card.Title>
                            <div className="dealer-dashboard-chart-wrapper">
                                <Pie data={installationStatusData} options={chartOptions} width={120} height={120} />
                            </div>
                            {renderLegend(
                                installationStatusData.labels,
                                installationStatusData.datasets[0].backgroundColor
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card className="dealer-dashboard-chart-card dealer-dashboard-bar-chart-card">
                        <Card.Body style={{ minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Card.Title>Service Status</Card.Title>
                            <div className="responsive-bar-chart-wrapper bar-chart-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, width: '100%' }}>
                                <Bar
                                    data={{
                                        labels: serviceStatusData.labels,
                                        datasets: [{
                                            ...serviceStatusData.datasets[0],
                                            backgroundColor: serviceStatusData.datasets[0].backgroundColor,
                                            borderWidth: 0,
                                        }],
                                    }}
                                    options={barChartOptions}
                                />
                            </div>
                            <div className="dealer-dashboard-bar-legend mt-3">
                                {renderLegend(
                                    serviceStatusData.labels,
                                    serviceStatusData.datasets[0].backgroundColor
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    )
}

export default CuCharts