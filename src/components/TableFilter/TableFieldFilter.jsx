import React, { useState, useEffect } from "react";

/**
 * TableFieldFilter - Reusable filter dropdown for table fields
 * @param {Array} filterConfig - [{ key, label, options: [string] }]
 * @param {Object} filterState - { [key]: [selectedOptions] }
 * @param {Function} onFilterChange - callback with updated filterState
 * @param {string} dropdownLabel - label for the filter dropdown
 */
const TableFieldFilter = ({
    filterConfig = [],
    filterState = {},
    onFilterChange,
    dropdownLabel = "Filter"
}) => {
    const [localFilters, setLocalFilters] = useState(filterState);
    // Per-field search state
    const [fieldSearch, setFieldSearch] = useState({});

    useEffect(() => {
        setLocalFilters(filterState);
    }, [filterState]);

    const handleCheckbox = (fieldKey, option) => {
        setLocalFilters((prev) => {
            const prevOptions = prev[fieldKey] || [];
            let newOptions;
            if (prevOptions.includes(option)) {
                newOptions = prevOptions.filter((o) => o !== option);
            } else {
                newOptions = [...prevOptions, option];
            }
            const updated = { ...prev, [fieldKey]: newOptions };
            if (onFilterChange) onFilterChange(updated);
            return updated;
        });
    };

    const handleSelectAll = (fieldKey, options, checked) => {
        setLocalFilters((prev) => {
            const updated = {
                ...prev,
                [fieldKey]: checked ? [...options] : []
            };
            if (onFilterChange) onFilterChange(updated);
            return updated;
        });
    };

    // Reset both selections and search terms
    const handleReset = () => {
        const cleared = {};
        filterConfig.forEach(f => { cleared[f.key] = []; });
        setLocalFilters(cleared);
        if (onFilterChange) onFilterChange(cleared);
        setFieldSearch({});
    };

    // Filter options for each field by its search term
    const getFilteredOptions = (field) => {
        const search = fieldSearch[field.key] || "";
        if (!search) return field.options;
        return field.options.filter(option =>
            option.toLowerCase().includes(search.toLowerCase())
        );
    };

    return (
        <div className="dropdown me-2">
            <a href="#" className="btn bg-soft-purple text-purple" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                <i className="ti ti-filter-share me-2" />{dropdownLabel}
            </a>
            <div
                className="dropdown-menu dropdown-menu-md-end dropdown-md p-3"
                style={{
                    minWidth: 320,
                    maxWidth: 380,
                    background: '#f8f9fa',
                    borderRadius: 12,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}
            >
                <h4 className="mb-3 fw-semibold" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8 }}> {dropdownLabel} </h4>
                <div
                    className="border-top pt-3"
                    style={{
                        maxHeight: 340,
                        overflowY: 'auto',
                        background: '#fff',
                        borderRadius: 8,
                        border: '1px solid #ececec',
                        padding: 12,
                    }}
                >
                    {filterConfig.map((field, idx) => {
                        const filteredOptions = getFilteredOptions(field);
                        return (
                            <div
                                key={field.key}
                                className="mb-4 pb-3"
                                style={{
                                    borderBottom: idx !== filterConfig.length - 1 ? '1px solid #f0f0f0' : 'none',
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-semibold" style={{ fontSize: 15 }}>
                                        <i className="ti ti-grip-vertical me-2 text-muted" />{field.label}
                                    </span>
                                    {field.options.length > 0 && (
                                        <div className="form-check form-check-inline ms-auto">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`selectall-${field.key}`}
                                                checked={
                                                    localFilters[field.key]?.length === filteredOptions.length && filteredOptions.length > 0
                                                }
                                                onChange={e => handleSelectAll(field.key, filteredOptions, e.target.checked)}
                                            />
                                            <label className="form-check-label small" htmlFor={`selectall-${field.key}`}>All</label>
                                        </div>  
                                    )}
                                </div>
                                <input
                                    type="text"
                                    className="form-control form-control-sm mb-2"
                                    placeholder={`Search ${field.label}...`}
                                    value={fieldSearch[field.key] || ""}
                                    onChange={e => setFieldSearch(s => ({ ...s, [field.key]: e.target.value }))}
                                    style={{ borderRadius: 6, border: '1px solid #e0e0e0', fontSize: 13 }}
                                />
                                {filteredOptions && filteredOptions.length > 0 ? (
                                    <div style={{ maxHeight: 120, overflowY: filteredOptions.length > 4 ? 'auto' : 'visible', paddingLeft: 2 }}>
                                        {filteredOptions.map((option, idx) => (
                                            <div key={`${option}-${idx}`} className="form-check mb-1" style={{ minWidth: 120, display: 'inline-block', marginRight: 18 }}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`filter-${field.key}-${option}`}
                                                    checked={localFilters[field.key]?.includes(option) || false}
                                                    onChange={() => handleCheckbox(field.key, option)}
                                                    style={{ marginRight: 6 }}
                                                />
                                                <label className="form-check-label" htmlFor={`filter-${field.key}-${option}`} style={{ fontSize: 13, fontWeight: 400 }}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted small" style={{ paddingLeft: 2 }}>No options found.</div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 text-end d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary px-4 py-2"
                        onClick={handleReset}
                        type="button"
                        style={{ borderRadius: 6, fontWeight: 500 }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableFieldFilter; 