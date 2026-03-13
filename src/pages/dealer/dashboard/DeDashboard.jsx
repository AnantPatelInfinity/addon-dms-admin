import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerDashboard } from '../../../middleware/dashboard/dashboard';
import { getDealerStorage } from '../../../components/LocalStorage/DealerStorage';
import { Container, Button, Alert } from 'react-bootstrap';
import './DashboardSummaryCards.css';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import DashHeader from '../../../components/Dealer/Dashboard/DashHeader';
import DeSummaryCard from '../../../components/Dealer/Dashboard/DeSummaryCard';
import DeCharts from '../../../components/Dealer/Dashboard/DeCharts';
import DeRecentActivity from '../../../components/Dealer/Dashboard/DeRecentActivity.JSX';

const DeDashboard = () => {
  const dispatch = useDispatch();
  const dealerStorage = getDealerStorage();

  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  };

  const defaultRange = getDefaultDateRange();

  const [appliedStartDate, setAppliedStartDate] = useState(defaultRange.startDate);
  const [appliedEndDate, setAppliedEndDate] = useState(defaultRange.endDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!showDatePicker) return;
    const handleClickOutside = (event) => {
      const picker = document.getElementById('dealer-dashboard-date-picker');
      if (picker && !picker.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const {
    dashboardData,
    dashboardError,
    dashboardLoading,
  } = useSelector((state) => state.dealerDashboard);

  useEffect(() => {
    const payload = {
      firmId: dealerStorage.DX_DL_FIRM_ID,
      dealerId: dealerStorage.DL_ID,
      startDate: appliedStartDate,
      endDate: appliedEndDate
    }
    dispatch(getDealerDashboard(payload))
  }, [appliedStartDate, appliedEndDate])

  const summary = dashboardData?.summary || {};
  const charts = dashboardData?.charts || {};
  const recent = dashboardData?.recentActivity || {};

  if (dashboardLoading && !dashboardData) {
    return (
      <LoadingSpinner size="md" />
    );
  }

  if (dashboardError && !dashboardData) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>{dashboardError || "No Data Available"}</Alert.Heading>
          <p>Unable to load dashboard data. Please try again later.</p>
          <Button variant="outline-primary" size="sm" onClick={refreshData}>
            <RefreshCw size={16} className="me-1" /> Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 dealer-dashboard">

      <DashHeader
        defaultRange={defaultRange}
        setAppliedStartDate={setAppliedStartDate}
        setAppliedEndDate={setAppliedEndDate}
        setShowDatePicker={setShowDatePicker}
        showDatePicker={showDatePicker}
      />
      {dashboardData && (
        <>
          <DeSummaryCard summary={summary} />
          <DeCharts charts={charts} />
          <DeRecentActivity recent={recent} />
        </>
      )}
    </Container>
  );
};

export default DeDashboard;
