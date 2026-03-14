import React, { useState } from 'react'
import {
    Row,
    Col,
    Button,
    Form,
    Badge,
} from 'react-bootstrap';
import {
    Clock,
    TrendingUp,
    RefreshCw,
    Calendar,
    ChevronLeft,
    X,
    Filter,
} from 'lucide-react';

const DashHeader = ({ dateRange, setDateRange, getDashboardData, loading, lastUpdated, refreshData }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDateRange, setTempDateRange] = useState(dateRange);
    const [activeFilter, setActiveFilter] = useState(null); // Track active quick filter

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        });
    };

    const handleDateRangeChange = (field, value) => {
        setTempDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyDateRange = () => {
        setDateRange(tempDateRange);
        setShowDatePicker(false);
        setActiveFilter(null); // Clear active filter when custom range is applied
        getDashboardData(tempDateRange.startDate, tempDateRange.endDate);
    };

    const cancelDateRange = () => {
        setTempDateRange(dateRange);
        setShowDatePicker(false);
    };

    const setQuickRange = (days, filterName) => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0];
        const newRange = { startDate, endDate };
        setTempDateRange(newRange);
        setDateRange(newRange);
        setActiveFilter(filterName); // Set active filter
        setShowDatePicker(false);
        getDashboardData(startDate, endDate);
    };

    const clearFilter = () => {
        // Reset to default 30 days range
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const defaultRange = { startDate, endDate };

        setDateRange(defaultRange);
        setTempDateRange(defaultRange);
        setActiveFilter(null);
        setShowDatePicker(false);
        getDashboardData(startDate, endDate);
    };

    // Check if current range is a custom range (not matching any quick filter)
    const isCustomRange = () => {
        const today = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const ninetyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0];

        return !(
            (dateRange.startDate === sevenDaysAgo && dateRange.endDate === today) ||
            (dateRange.startDate === thirtyDaysAgo && dateRange.endDate === today) ||
            (dateRange.startDate === ninetyDaysAgo && dateRange.endDate === today)
        );
    };

    const hasActiveFilter = () => {
        return activeFilter || isCustomRange();
    };

    return (
        <>
            <Row className="mb-4 align-items-start align-lg-items-center">
                <Col lg={6}>
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                            <TrendingUp size={28} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="mb-1 fw-bold" style={{ color: '#212529' }}>
                                Admin Dashboard
                            </h2>
                            <p className="text-muted mb-0">
                                Overview of your business activities and performance
                            </p>
                        </div>
                    </div>
                </Col>
                <Col lg={6} className="text-lg-end mt-3 mt-lg-0">
                    {/* Mobile Filter Row */}
                    <div className="d-flex d-lg-none align-items-center justify-content-between flex-wrap gap-2 mb-2">
                        {/* Active Filter Display - Mobile */}
                        <div className="d-flex align-items-center gap-2">
                            {hasActiveFilter() && (
                                <>
                                    <Badge
                                        bg="primary"
                                        className="d-flex align-items-center px-2 py-1"
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        <Filter size={10} className="me-1" />
                                        {activeFilter || 'Custom'}
                                    </Badge>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="d-flex align-items-center px-2 py-1"
                                        onClick={clearFilter}
                                        style={{
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            padding: '0.25rem 0.5rem'
                                        }}
                                    >
                                        <X size={10} className="me-1" />
                                        Clear
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Last Updated - Mobile */}
                        <small className="text-muted d-flex align-items-center">
                            <Clock size={12} className="me-1" />
                            <span className="d-none d-sm-inline">Updated: </span>
                            {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                    </div>

                    {/* Main Controls Row */}
                    <div className="d-flex align-items-center justify-content-lg-end flex-wrap gap-2">
                        {/* Desktop Filter Display */}
                        <div className="d-none d-lg-flex align-items-center gap-2">
                            {hasActiveFilter() && (
                                <>
                                    <Badge
                                        bg="primary"
                                        className="d-flex align-items-center px-2 py-1"
                                        style={{ fontSize: '0.75rem' }}
                                    >
                                        <Filter size={12} className="me-1" />
                                        {activeFilter || 'Custom Range'}
                                    </Badge>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="d-flex align-items-center px-2 py-1"
                                        onClick={clearFilter}
                                        style={{
                                            borderRadius: '15px',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        <X size={12} className="me-1" />
                                        Clear
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Date Range Picker */}
                        <div className="position-relative flex-grow-1 flex-lg-grow-0">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="d-flex align-items-center justify-content-center w-100 w-lg-auto px-2 px-lg-3 py-2"
                                style={{
                                    borderRadius: '8px',
                                    border: '2px solid #dee2e6',
                                    backgroundColor: '#fff',
                                    minWidth: '280px'
                                }}
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <Calendar size={14} className="me-2 flex-shrink-0" />
                                <span className="fw-medium text-truncate" style={{ fontSize: '0.85rem' }}>
                                    <span className="d-none d-sm-inline">
                                        {formatDateForDisplay(dateRange.startDate)} - {formatDateForDisplay(dateRange.endDate)}
                                    </span>
                                    <span className="d-sm-none">
                                        {new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(dateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </span>
                                <ChevronLeft size={12} className="ms-1 flex-shrink-0" style={{ transform: showDatePicker ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                            </Button>

                            {/* Date Picker Dropdown */}
                            {showDatePicker && (
                                <div
                                    className="position-absolute bg-white border rounded shadow-lg p-3 mt-2"
                                    style={{
                                        right: 0,
                                        left: 0,
                                        zIndex: 1000,
                                        minWidth: '320px',
                                        maxWidth: '400px',
                                        border: '1px solid #dee2e6'
                                    }}
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
                                            <Form.Label className="small fw-medium text-muted" style={{ fontSize: '0.7rem' }}>CHECK IN</Form.Label>
                                            <Form.Control
                                                type="date"
                                                size="sm"
                                                value={tempDateRange.startDate}
                                                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                                className="mb-2"
                                                style={{ fontSize: '0.8rem' }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Form.Label className="small fw-medium text-muted" style={{ fontSize: '0.7rem' }}>CHECK OUT</Form.Label>
                                            <Form.Control
                                                type="date"
                                                size="sm"
                                                value={tempDateRange.endDate}
                                                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                                min={tempDateRange.startDate}
                                                className="mb-2"
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

                        {/* Refresh Button */}
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={refreshData}
                            disabled={loading}
                            className="d-flex align-items-center justify-content-center px-2 px-lg-3 py-2"
                            style={{
                                borderRadius: '8px',
                                minWidth: '45px'
                            }}
                        >
                            <RefreshCw size={14} className={loading ? 'spin' : ''} />
                            <span className="d-none d-lg-inline ms-1">Refresh</span>
                        </Button>

                        {/* Desktop Last Updated */}
                        <div className="d-none d-lg-flex align-items-center">
                            <small className="text-muted">
                                <Clock size={14} className="me-1" />
                                {lastUpdated.toLocaleTimeString()}
                            </small>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default DashHeader