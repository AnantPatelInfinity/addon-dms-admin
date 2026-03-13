import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Button, Form, Badge } from 'react-bootstrap';

const DashHeader = ({ dateRange, setDateRange, getDashboardData, loading, lastUpdated, refreshData }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDateRange, setTempDateRange] = useState(dateRange);
    const [activeFilter, setActiveFilter] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!showDatePicker) return;
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDatePicker]);

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
        setActiveFilter(null);
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
        setActiveFilter(filterName);
        setShowDatePicker(false);
        getDashboardData(startDate, endDate);
    };

    const clearFilter = () => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        const defaultRange = { startDate, endDate };
        setDateRange(defaultRange);
        setTempDateRange(defaultRange);
        setActiveFilter(null);
        setShowDatePicker(false);
        getDashboardData(startDate, endDate);
    };

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
        <Row className="mb-4 align-items-center">
            <Col md={6}>
                <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                        <span style={{ fontSize: 28, color: '#0d6efd' }}>🏢</span>
                    </div>
                    <div>
                        <h2 className="mb-1 fw-bold" style={{ color: '#212529' }}>
                            Company Dashboard
                        </h2>
                        <p className="text-muted mb-0">
                            Overview of your company activities and performance
                        </p>
                    </div>
                </div>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0">
                <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-2">
                    {hasActiveFilter() && (
                        <>
                            <Badge bg="primary" className="d-flex align-items-center px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                <span role="img" aria-label="filter" className="me-1">🔎</span>
                                {activeFilter || 'Custom Range'}
                            </Badge>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="d-flex align-items-center px-2 py-1"
                                onClick={clearFilter}
                                style={{ borderRadius: '15px', fontSize: '0.75rem' }}
                            >
                                <span role="img" aria-label="clear" className="me-1">❌</span>
                                Clear
                            </Button>
                        </>
                    )}
                    <div className="position-relative flex-grow-1 flex-md-grow-0" ref={dropdownRef}>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className={`d-flex align-items-center justify-content-center w-100 w-md-auto px-2 px-md-3 py-2${showDatePicker ? ' dropdown-open' : ''}`}
                            style={{ borderRadius: '8px', border: '2px solid #dee2e6', backgroundColor: '#fff', minWidth: '220px' }}
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            <span role="img" aria-label="calendar" className="me-2">📅</span>
                            <span className="fw-medium text-truncate" style={{ fontSize: '0.85rem' }}>
                                {formatDateForDisplay(dateRange.startDate)} - {formatDateForDisplay(dateRange.endDate)}
                            </span>
                            <span className={`ms-1 dropdown-arrow${showDatePicker ? ' open' : ''}`}>▼</span>
                        </Button>
                        {showDatePicker && (
                            <div className="company-date-dropdown position-absolute bg-white border rounded shadow-lg p-3 mt-2" style={{ right: 0, left: 0, zIndex: 1000, minWidth: '340px', maxWidth: '400px', border: '1px solid #dee2e6' }}>
                                <div className="mb-3">
                                    <h6 className="mb-2 fw-bold" style={{ fontSize: '0.9rem' }}>Select date range</h6>
                                    <div className="d-flex flex-wrap gap-1 gap-sm-2 mb-3">
                                        <Button
                                            variant={activeFilter === 'Last 7 days' ? 'primary' : 'outline-primary'}
                                            size="sm"
                                            className="flex-fill flex-sm-grow-0 quick-btn"
                                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                                            onClick={() => setQuickRange(7, 'Last 7 days')}
                                        >
                                            7 days
                                        </Button>
                                        <Button
                                            variant={activeFilter === 'Last 30 days' ? 'primary' : 'outline-primary'}
                                            size="sm"
                                            className="flex-fill flex-sm-grow-0 quick-btn"
                                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                                            onClick={() => setQuickRange(30, 'Last 30 days')}
                                        >
                                            30 days
                                        </Button>
                                        <Button
                                            variant={activeFilter === 'Last 90 days' ? 'primary' : 'outline-primary'}
                                            size="sm"
                                            className="flex-fill flex-sm-grow-0 quick-btn"
                                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                                            onClick={() => setQuickRange(90, 'Last 90 days')}
                                        >
                                            90 days
                                        </Button>
                                    </div>
                                </div>
                                <Row className="g-2">
                                    <Col xs={12} sm={6}>
                                        <Form.Label className="small fw-medium text-muted" style={{ fontSize: '0.7rem' }}>START DATE</Form.Label>
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
                                        <Form.Label className="small fw-medium text-muted" style={{ fontSize: '0.7rem' }}>END DATE</Form.Label>
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
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={refreshData}
                        disabled={loading}
                        className="d-flex align-items-center justify-content-center px-2 px-md-3 py-2"
                        style={{ borderRadius: '8px', minWidth: '45px' }}
                    >
                        <span role="img" aria-label="refresh">🔄</span>
                        <span className="d-none d-md-inline ms-1">Refresh</span>
                    </Button>
                    <div className="d-none d-md-flex align-items-center">
                        <small className="text-muted">
                            <span role="img" aria-label="clock" className="me-1">⏰</span>
                            {lastUpdated && lastUpdated.toLocaleTimeString()}
                        </small>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default DashHeader; 