import React, { useEffect, useState } from 'react'
import {
    Calendar,
    ChevronLeft,
    X,
    Filter,
    TrendingUp,
    UserLock,
    Eye,
} from 'lucide-react';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import CUSTOMER_URLS from '../../../config/routesFile/customer.routes';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerStorage } from '../../LocalStorage/CustomerStorage';
import { getOneAerbApplicationData, resetOneAerbApplication } from '../../../middleware/customerUser/aerbApplication/aerbApplication';

const DashHeader = ({
    defaultRange,
    setAppliedStartDate,
    setAppliedEndDate,
    setShowDatePicker,
    showDatePicker,
}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(defaultRange.startDate);
    const [endDate, setEndDate] = useState(defaultRange.endDate);
    const [tempDateRange, setTempDateRange] = useState({ startDate: defaultRange.startDate, endDate: defaultRange.endDate });
    const [activeFilter, setActiveFilter] = useState(null);

    const getDateNDaysAgo = (n) => {
        const d = new Date();
        d.setDate(d.getDate() - n + 1); // inclusive of today
        return d.toISOString().slice(0, 10);
    };

    // Helper for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'Select Date';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Select Date';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
        });
    };

    // Date range change handlers
    const handleDateRangeChange = (field, value) => {
        setTempDateRange((prev) => ({ ...prev, [field]: value }));
    };

    const applyDateRange = () => {
        setStartDate(tempDateRange.startDate);
        setEndDate(tempDateRange.endDate);
        setAppliedStartDate(tempDateRange.startDate);
        setAppliedEndDate(tempDateRange.endDate);
        setActiveFilter(null);
        setShowDatePicker(false);
    };

    const cancelDateRange = () => {
        setTempDateRange({ startDate, endDate });
        setShowDatePicker(false);
    };

    const setQuickRange = (days, filterName) => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0];
        setTempDateRange({ startDate, endDate });
        setStartDate(startDate);
        setEndDate(endDate);
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setActiveFilter(filterName);
        setShowDatePicker(false);
    };

    const clearFilter = () => {
        // Default to last 30 days
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        setStartDate(startDate);
        setEndDate(endDate);
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setTempDateRange({ startDate, endDate });
        setActiveFilter(null);
        setShowDatePicker(false);
    };

    const isCustomRange = () => {
        const today = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const ninetyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0];
        return !(
            (startDate === sevenDaysAgo && endDate === today) ||
            (startDate === thirtyDaysAgo && endDate === today) ||
            (startDate === ninetyDaysAgo && endDate === today)
        );
    };

    const hasActiveFilter = () => {
        return activeFilter || isCustomRange();
    };

    useEffect(() => {
        dispatch(getOneAerbApplicationData({ customerId: getCustomerStorage().CU_ID }))
        return () => {
            dispatch(resetOneAerbApplication())
        }
    }, [dispatch, getCustomerStorage().CU_ID])

    const { aerbApplication } = useSelector((state) => state.customerAerbApplication);

    return (
        <>
            <div className="row mb-4 align-items-start align-lg-items-center">
                <div className="col-lg-6">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                            <TrendingUp size={28} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="mb-1 fw-bold" style={{ color: '#212529' }}>
                                Customer Dashboard
                            </h2>
                            <p className="text-muted mb-0">
                                Overview of your Customer Activities and Performance
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 text-lg-end mt-3 mt-lg-0">
                    <div className="d-flex align-items-center justify-content-lg-end flex-wrap gap-2 gap-md-3 filter-bar p-2">
                        {hasActiveFilter() && (
                            <>
                                <span className="badge bg-primary d-flex align-items-center px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                    <Filter size={12} className="me-1" />
                                    {activeFilter || 'Custom Range'}
                                </span>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="d-flex align-items-center px-2 py-1"
                                    onClick={clearFilter}
                                    style={{ borderRadius: '15px', fontSize: '0.75rem' }}
                                >
                                    <X size={12} className="me-1" />
                                    Clear
                                </Button>
                            </>
                        )}
                        <div className="position-relative flex-grow-1 flex-lg-grow-0">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="d-flex align-items-center justify-content-center w-100 w-lg-auto px-2 px-lg-3 py-2"
                                style={{ borderRadius: '8px', border: '2px solid #dee2e6', backgroundColor: '#fff', minWidth: '280px' }}
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <Calendar size={14} className="me-2 flex-shrink-0" />
                                <span className="fw-medium text-truncate" style={{ fontSize: '0.85rem' }}>
                                    <span className="d-none d-sm-inline">
                                        {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                                    </span>
                                    <span className="d-sm-none">
                                        {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                                    </span>
                                </span>
                                <ChevronLeft size={12} className="ms-1 flex-shrink-0" style={{ transform: showDatePicker ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                            </Button>
                            {showDatePicker && (
                                <div
                                    id="dealer-dashboard-date-picker"
                                    className="position-absolute bg-white border rounded shadow-lg p-3 mt-2 dealer-date-dropdown"
                                >
                                    <div className="mb-3">
                                        <h6 className="mb-2 fw-bold" style={{ fontSize: '0.9rem' }}>Select date range</h6>
                                        <div className="d-flex flex-wrap gap-1 gap-sm-2 mb-3">
                                            <Button
                                                variant={activeFilter === 'Last 7 days' ? 'primary' : 'outline-primary'}
                                                size="sm"
                                                className="flex-fill flex-sm-grow-0"
                                                style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                                                onClick={() => setQuickRange(7, 'Last 7 days')}
                                            >
                                                7 days
                                            </Button>
                                            <Button
                                                variant={activeFilter === 'Last 30 days' ? 'primary' : 'outline-primary'}
                                                size="sm"
                                                className="flex-fill flex-sm-grow-0"
                                                style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                                                onClick={() => setQuickRange(30, 'Last 30 days')}
                                            >
                                                30 days
                                            </Button>
                                            <Button
                                                variant={activeFilter === 'Last 90 days' ? 'primary' : 'outline-primary'}
                                                size="sm"
                                                className="flex-fill flex-sm-grow-0"
                                                style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                                                onClick={() => setQuickRange(90, 'Last 90 days')}
                                            >
                                                90 days
                                            </Button>
                                        </div>
                                    </div>
                                    <Row className="g-2">
                                        <Col xs={12} sm={6}>
                                            <label className="small fw-medium text-muted" style={{ fontSize: '0.7rem' }}>CHECK IN</label>
                                            <input
                                                type="date"
                                                size="sm"
                                                value={tempDateRange.startDate}
                                                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                                className="form-control mb-2"
                                                style={{ fontSize: '0.8rem' }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <label className="small fw-medium text-muted" style={{ fontSize: '0.7rem' }}>CHECK OUT</label>
                                            <input
                                                type="date"
                                                size="sm"
                                                value={tempDateRange.endDate}
                                                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                                min={tempDateRange.startDate}
                                                className="form-control mb-2"
                                                style={{ fontSize: '0.8rem' }}
                                            />
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end gap-2 mt-3">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={cancelDateRange}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={applyDateRange}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {aerbApplication?.status === "COMPLETED" ? (
                            <div className="d-flex align-items-center justify-content-end">
                                <Button
                                    variant="outline-primary"
                                    className='px-4'
                                    style={{ borderRadius: "8px" }}
                                    onClick={() => navigate(CUSTOMER_URLS.VIEW_AERB_APPLICATION)}
                                >
                                    <Eye size={17} />
                                    <span className='ms-2'>View AERB Application</span>
                                </Button>
                            </div>
                        ) : ((aerbApplication?.status === "PENDING" || aerbApplication?.status === "REJECTED") && aerbApplication?._id) ? (
                            <div className="d-flex align-items-center justify-content-end">
                                <Button
                                    variant="outline-primary"
                                    className='px-4'
                                    style={{ borderRadius: "8px" }}
                                    onClick={() => navigate(CUSTOMER_URLS.AERB_REGISTRATION)}
                                >
                                    <UserLock size={17} />
                                    <span className='ms-2'>Edit AERB Application</span>
                                </Button>
                            </div>
                        ) : (!aerbApplication?._id && (
                            <div className="d-flex align-items-center justify-content-end">
                                <Button
                                    variant="outline-primary"
                                    className='px-4'
                                    style={{ borderRadius: "8px" }}
                                    onClick={() => navigate(CUSTOMER_URLS.AERB_REGISTRATION)}
                                >
                                    <UserLock size={17} />
                                    <span className='ms-2'>AERB Application</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashHeader