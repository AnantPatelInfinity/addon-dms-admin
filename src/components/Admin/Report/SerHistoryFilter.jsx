import React from 'react'
import Select from 'react-select';

const SerHistoryFilter = ({
    showFilters,
    filters,
    dropdowns,
    handleFilterChange,
    isDealer = false,
    isCompany = false,
}) => {

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '40px',
            height: '40px',
            borderColor: state.isFocused ? '#e5251b' : '#dee2e6', // Changed to red when focused
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(229, 37, 27, 0.25)' : 'none', // Changed to red shadow
            '&:hover': {
                borderColor: '#e5251b' // Changed to red on hover
            }
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '40px',
            padding: '0 8px',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '40px',
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '8px 12px',
            backgroundColor: state.isSelected ? '#e5251b' : state.isFocused ? '#f8f9fa' : 'white', // Changed selected to red
            color: state.isSelected ? 'white' : '#212529'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6c757d'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#212529'
        })
    };

    return (
        <>
            {showFilters && (
                <div className="filter-section bg-light rounded p-3 mb-3">
                    <div className="row g-3">
                        {/* Primary Filters */}
                        <div className="col-12">
                            <h6 className="text-muted">
                                <i className="ti ti-users me-1"></i>
                                Primary Filters
                            </h6>
                        </div>

                        {!isDealer && (<div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">Dealer</label>
                            <Select
                                options={dropdowns.dealerData}
                                value={dropdowns?.dealerData?.find(option => option.value === filters.dealerId) || null}
                                onChange={(option) => handleFilterChange("dealerId", option ? option.value : "")}
                                placeholder="Select Dealer"
                                isClearable
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                        )}
                        {!isCompany && (
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <label className="form-label fw-semibold">Company</label>
                                <Select
                                    options={dropdowns.companyData}
                                    value={dropdowns.companyData.find(option => option.value === filters.companyId) || null}
                                    onChange={(option) => handleFilterChange("companyId", option ? option.value : "")}
                                    placeholder="Select Company"
                                    isClearable
                                    styles={customSelectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        )}

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">Customer</label>
                            <Select
                                options={dropdowns.customerData}
                                value={dropdowns.customerData.find(option => option.value === filters.customerId) || null}
                                onChange={(option) => handleFilterChange("customerId", option ? option.value : "")}
                                placeholder="Select Customer"
                                isClearable
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">Serial No</label>
                            <Select
                                options={dropdowns.serialNoData}
                                value={dropdowns.serialNoData.find(option => option.value === filters.serialNoId) || null}
                                onChange={(option) => handleFilterChange("serialNoId", option ? option.value : "")}
                                placeholder="Select Serial No"
                                isClearable
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        {/* Status and Date Filters */}
                        <div className="col-12 mt-4">
                            <h6 className="text-muted">
                                <i className="ti ti-calendar me-1"></i>
                                Status & Date Filters
                            </h6>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">Status</label>
                            <Select
                                options={dropdowns.statusData}
                                value={dropdowns.statusData.find(option => option.value === filters.status) || null}
                                onChange={(option) => handleFilterChange("status", option ? option.value : "")}
                                placeholder="Select Status"
                                isClearable
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            />
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label fw-semibold">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SerHistoryFilter