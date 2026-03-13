import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext';

import {
    Container,
    Button,
    Alert,
} from 'react-bootstrap';
import { RefreshCw } from 'lucide-react';
import './Dashboard.css';
import SummaryCards from '../../../components/Admin/Dashboard/SummaryCards';
import Charts from '../../../components/Admin/Dashboard/Charts';
import RecentActivity from '../../../components/Admin/Dashboard/RecentActivity';
import { getAdminStorage } from '../../../components/LocalStorage/AdminStorage';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import DashHeader from '../../../components/Admin/Dashboard/DashHeader';
import TrialProductSummary from '../../../components/Admin/Dashboard/TrialProductSummary';

const Dashboard = () => {

    const { get } = useApi();
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // 30 days ago
        endDate: new Date().toISOString().split('T')[0] // today
    });

    const adminStorage = getAdminStorage();

    const getDashboardData = async (startDate = dateRange.startDate, endDate = dateRange.endDate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await get(`/admin/get-admin-dashboard?firmId=${adminStorage?.DX_AD_FIRM}&startDate=${startDate}&endDate=${endDate}`);
            setDashboardData(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const refreshData = () => {
        getDashboardData(dateRange.startDate, dateRange.endDate);
    };

    if (loading && !dashboardData) {
        return (
            <LoadingSpinner size="md" />
        );
    }

    if (error && !dashboardData) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="text-center">
                    <Alert.Heading>{error || "No Data Available"}</Alert.Heading>
                    <p>Unable to load dashboard data. Please try again later.</p>
                    <Button variant="outline-primary" size="sm" onClick={refreshData}>
                        <RefreshCw size={16} className="me-1" /> Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Container fluid className="dashboard-container py-4 px-4 bg-light">
                <DashHeader
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    getDashboardData={getDashboardData}
                    loading={loading}
                    lastUpdated={lastUpdated}
                    refreshData={refreshData} />

                {dashboardData && (
                    <>
                        <SummaryCards dashboardData={dashboardData} />
                        <Charts dashboardData={dashboardData} />
                        <RecentActivity dashboardData={dashboardData} />
                        <TrialProductSummary dashboardData={dashboardData} />
                    </>
                )}
            </Container>
        </>
    )
}

export default Dashboard