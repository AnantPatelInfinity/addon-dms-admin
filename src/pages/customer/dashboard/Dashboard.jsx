import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDashboard } from "../../../middleware/customerUser/dashboard/dashboard";
import { getCustomerStorage } from "../../../components/LocalStorage/CustomerStorage";
import { Container, Button, Alert } from "react-bootstrap";
import "../../dealer/dashboard/DashboardSummaryCards.css";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import DashHeader from "../../../components/customer/dashboard/DashHeader";
import CuSummaryCard from "../../../components/customer/dashboard/CuSummaryCard";
import CuRecentActivity from "../../../components/customer/dashboard/CuRecentActivity";
import CuCharts from "../../../components/customer/dashboard/CuCharts";
import { getOneAerbApplicationData, resetAddAerbApplication, resetDeleteAerbApplication, resetEditAerbApplication, resetOneAerbApplication } from "../../../middleware/customerUser/aerbApplication/aerbApplication";
import { toast } from "react-toastify";
import AerbBanner from "../../../components/customer/dashboard/AerbBanner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const customerStorage = getCustomerStorage();

  useEffect(() => {
    dispatch(getOneAerbApplicationData({ customerId: customerStorage.CU_ID }))
  }, [customerStorage.CU_ID])

  const { aerbApplication, addAerbApplicationMessage, addAerbApplicationError,
    editAerbApplicationMessage, editAerbApplicationError,
    deleteAerbApplicationMessage, deleteAerbApplicationError
  } = useSelector((state) => state.customerAerbApplication);

  useEffect(() => {
    if (addAerbApplicationMessage) {
      toast.success(addAerbApplicationMessage)
      dispatch(resetAddAerbApplication())
    }
    if (addAerbApplicationError) {
      toast.error(addAerbApplicationError)
      dispatch(resetAddAerbApplication())
    }
    if (editAerbApplicationMessage) {
      toast.success(editAerbApplicationMessage)
      dispatch(resetEditAerbApplication())
    }
    if (editAerbApplicationError) {
      toast.error(editAerbApplicationError)
      dispatch(resetEditAerbApplication())
    }
    if (deleteAerbApplicationMessage) {
      toast.success(deleteAerbApplicationMessage)
      dispatch(resetDeleteAerbApplication())
      dispatch(getOneAerbApplicationData({ customerId: customerStorage.CU_ID }))
    }
    if (deleteAerbApplicationError) {
      toast.error(deleteAerbApplicationError)
      dispatch(resetDeleteAerbApplication())
      dispatch(getOneAerbApplicationData({ customerId: customerStorage.CU_ID }))
    }

  }, [addAerbApplicationMessage, addAerbApplicationError, editAerbApplicationMessage, editAerbApplicationError, deleteAerbApplicationMessage, deleteAerbApplicationError])

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

  const [appliedStartDate, setAppliedStartDate] = useState(
    defaultRange.startDate
  );
  const [appliedEndDate, setAppliedEndDate] = useState(defaultRange.endDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!showDatePicker) return;
    const handleClickOutside = (event) => {
      const picker = document.getElementById("dealer-dashboard-date-picker");
      if (picker && !picker.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  const { dashboardData, dashboardError, dashboardLoading } = useSelector(
    (state) => state.customerDashboard
  );

  useEffect(() => {
    const payload = {
      firmId: customerStorage.DX_CU_FIRM_ID,
      customerId: customerStorage.CU_ID,
      startDate: appliedStartDate,
      endDate: appliedEndDate,
    };
    dispatch(getCustomerDashboard(payload));
  }, [appliedStartDate, appliedEndDate]);

  const summary = dashboardData?.summary || {};
  const charts = dashboardData?.charts || {};
  const recent = dashboardData?.recentActivity || {};

  if (dashboardLoading && !dashboardData) {
    return <LoadingSpinner size="md" />;
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

      <AerbBanner aerbApplication={aerbApplication} />

      {dashboardData && (
        <>
          <CuSummaryCard summary={summary} />
          <CuCharts charts={charts} />
          <CuRecentActivity recent={recent} />
        </>
      )}
    </Container>
  );
};

export default Dashboard;
