    import React from 'react';

    const columnOptions = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Mobile No.' },
        { id: 'firmName', label: 'Firm' },
        { id: 'createdAt', label: 'Date' },
        { id: 'status', label: 'Status' },
        { id: 'action', label: 'Action' }
    ];

    const CompanyColumn = ({ visibleColumns, onToggleColumn }) => {
        return (
            <div className="dropdown-menu dropdown-menu-md-end dropdown-md p-3 show">
                <h4 className="mb-2 fw-semibold">Manage Columns</h4>
                <p className="mb-3">Toggle the columns you want to see.</p>
                <div className="border-top pt-3">
                    {columnOptions.map((col) => (
                        <div
                            className="d-flex align-items-center justify-content-between mb-3"
                            key={col.id}
                        >
                            <p className="mb-0 d-flex align-items-center">
                                <i className="ti ti-grip-vertical me-2" />{col.label}
                            </p>
                            <div className="status-toggle">
                                <input
                                    type="checkbox"
                                    id={`col-${col.id}`}
                                    className="check"
                                    checked={visibleColumns[col.id]}
                                    onChange={() => onToggleColumn(col.id)}
                                />
                                <label htmlFor={`col-${col.id}`} className="checktoggle" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    export default CompanyColumn;
