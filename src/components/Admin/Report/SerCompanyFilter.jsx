import React from 'react'
import Select from 'react-select';

const SerCompanyFilter = ({
    showFilters,
    filters,
    dropdowns,
    handleFilterChange,
    daysFilter,
    setDaysFilter,
    setCurrentPage,
    isDealer = false,
    isCompany = false
}) => {

    const daysOptions = [
        { value: "", label: "All Days" },
        { value: "7", label: "7+ Days Pending" },
        { value: "15", label: "15+ Days Pending" },
        { value: "30", label: "30+ Days Pending" }
    ];

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
                <div className="row mt-3 pt-3 border-top">
                    <div className="col-12">
                        <div className="filters-wrapper">
                            <div className="row g-2">
                                {/* Days Filter */}
                                <div className="col-xl-3 col-lg-6 col-md-6">
                                    <label className="form-label small text-muted mb-1">Days Pending</label>
                                    <Select
                                        options={daysOptions}
                                        value={daysOptions.find(option => option.value === daysFilter) || null}
                                        onChange={(option) => {
                                            setDaysFilter(option ? option.value : "");
                                            setCurrentPage(1);
                                        }}
                                        placeholder="Select Days"
                                        isClearable
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={customSelectStyles}
                                        isSearchable={false}
                                    />
                                </div>

                                {/* Dealer Filter */}
                                {!isDealer && (
                                    <div className="col-xl-3 col-lg-6 col-md-6">
                                        <label className="form-label small text-muted mb-1">Dealer</label>
                                        <Select
                                            options={dropdowns.dealerData}
                                            value={dropdowns.dealerData.find(option => option.value === filters.dealerId) || null}
                                            onChange={(option) => handleFilterChange("dealerId", option ? option.value : "")}
                                            placeholder="Select Dealer"
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={customSelectStyles}
                                            isSearchable={true}
                                        />
                                    </div>
                                )}

                                {/* Company Filter */}
                                {!isCompany && (
                                    <div className="col-xl-3 col-lg-6 col-md-6">
                                        <label className="form-label small text-muted mb-1">Company</label>
                                        <Select
                                            options={dropdowns.companyData}
                                            value={dropdowns?.companyData?.find(option => option.value === filters.companyId) || null}
                                            onChange={(option) => handleFilterChange("companyId", option ? option.value : "")}
                                            placeholder="Select Company"
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={customSelectStyles}
                                            isSearchable={true}
                                        />
                                    </div>
                                )}

                                {/* Customer Filter */}
                                <div className="col-xl-3 col-lg-6 col-md-6">
                                    <label className="form-label small text-muted mb-1">Customer</label>
                                    <Select
                                        options={dropdowns.customerData}
                                        value={dropdowns.customerData.find(option => option.value === filters.customerId) || null}
                                        onChange={(option) => handleFilterChange("customerId", option ? option.value : "")}
                                        placeholder="Select Customer"
                                        isClearable
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={customSelectStyles}
                                        isSearchable={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SerCompanyFilter