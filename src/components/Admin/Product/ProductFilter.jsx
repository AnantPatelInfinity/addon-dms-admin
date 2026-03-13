import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductFilter = ({
    visibleColumns,
    setVisibleColumns,
    toggleColumn,
    columnsConfig,
    entity,
    onFilterChange,
    onResetFilters,
    moduleKey,
    priceStats,
}) => {
    const [searchTerm, setSearchTerm] = useState({
        category: '',
        company: ''
    });

    const [checkedFilters, setCheckedFilters] = useState({
        categoryName: [],
        companyName: [],
        status: [],
        priceStatus: []
    });

    const getFilterOptions = (key) => {
        if (!entity || !entity.length) return [];
        const uniqueValues = [...new Set(entity.map(item => item[key]))];
        return uniqueValues.filter(Boolean).map(value => ({
            label: value,
            value: value
        }));
    };

    const categoryOptions = getFilterOptions('categoryName');
    const companyOptions = getFilterOptions('companyName');
    const statusOptions = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
    ];
    const priceStatusOptions = [
        { label: 'Missing Dealer Price', value: 'missingPrice', count: priceStats?.missingPrice },
        // { label: 'Zero Dealer Price', value: 'zeroPrice', count: priceStats?.zeroPrice },
        { label: 'Missing Customer Price', value: 'missingCustomerPrice', count: priceStats?.missingCustomerPrice },
        // { label: 'Zero Customer Price', value: 'zeroCustomerPrice', count: priceStats?.zeroCustomerPrice },
        { label: 'Missing Company Price', value: 'missingCompanyPrice', count: priceStats?.missingCompanyPrice },
        // { label: 'Zero Company Price', value: 'zeroCompanyPrice', count: priceStats?.zeroCompanyPrice },
        {
            label: 'Has All Prices', value: 'hasAllPrices', count: priceStats?.total - Math.max(
                priceStats?.missingPrice || 0,
                priceStats?.missingCustomerPrice || 0,
                priceStats?.missingCompanyPrice || 0
            )
        }
    ];

    const handleSearchChange = (type, value) => {
        setSearchTerm(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleCheckboxChange = (key, value, isChecked) => {
        setCheckedFilters(prev => {
            const newChecked = { ...prev };
            if (isChecked) {
                newChecked[key] = [...newChecked[key], value];
            } else {
                newChecked[key] = newChecked[key].filter(v => v !== value);
            }
            return newChecked;
        });
        onFilterChange(key, value, isChecked);
    };

    const handleReset = () => {
        setSearchTerm({ category: '', company: '' });
        setCheckedFilters({
            categoryName: [],
            companyName: [],
            status: [],
            priceStatus: []
        });
        onResetFilters();
    };

    const filteredCategoryOptions = categoryOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.category.toLowerCase())
    );

    const filteredCompanyOptions = companyOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm.company.toLowerCase())
    );

    const handleSave = () => {
        localStorage.setItem(`columns-${moduleKey}`, JSON.stringify(visibleColumns));
        toast.success('Column settings saved successfully');
    };

    useEffect(() => {
        const saved = localStorage.getItem(`columns-${moduleKey}`);
        if (saved) {
            setVisibleColumns(JSON.parse(saved));
        }
    }, [moduleKey, setVisibleColumns]);

    return (
        <div className="d-flex align-items-center justify-content-end flex-wrap row-gap-2 mb-4">
            <div className="d-flex align-items-center flex-wrap row-gap-2">
                {/* Manage Columns */}
                <div className="dropdown me-2">
                    <a href="#" className="btn bg-soft-purple text-purple" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                        <i className="ti ti-columns-3 me-2" />Column Settings
                    </a>
                    <div className="dropdown-menu dropdown-menu-md-end dropdown-md p-3">
                        <h4 className="mb-2 fw-semibold">Column Settings (User Define)</h4>
                        <p className="mb-3">Toggle the visibility of table columns below:</p>
                        <div className="border-top pt-3">
                            {columnsConfig.map((col) => (
                                <div key={col.key} className="d-flex align-items-center justify-content-between mb-3">
                                    <p className="mb-0 d-flex align-items-center">
                                        <i className="ti ti-grip-vertical me-2" />{col.label}
                                    </p>
                                    <div className="status-toggle">
                                        <input
                                            type="checkbox"
                                            id={`col-${col.key}`}
                                            className="check"
                                            checked={visibleColumns[col.key]}
                                            onChange={() => toggleColumn(col.key)}
                                        />
                                        <label htmlFor={`col-${col.key}`} className="checktoggle" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-end">
                            <button className="btn btn-sm btn-primary" onClick={handleSave}>
                                <i className="ti ti-device-floppy me-1" />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>

                <div className="form-sorts dropdown me-2">
                    <a href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                        <i className="ti ti-filter-share me-2" />Filter
                    </a>
                    <div className="filter-dropdown-menu dropdown-menu dropdown-menu-md-end p-3">
                        <div className="filter-set-view">
                            <div className="filter-set-head">
                                <h4><i className="ti ti-filter-share me-2" />Filter</h4>
                            </div>
                            <div className="accordion" id="filterAccordion">
                                {categoryOptions.length > 0 && (
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <a href="#" className="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseCategory">Category</a>
                                        </div>
                                        <div id="collapseCategory" className="filter-set-contents accordion-collapse collapse" data-bs-parent="#filterAccordion">
                                            <div className="filter-content-list">
                                                <div className="mb-2 icon-form">
                                                    <span className="form-icon"><i className="ti ti-search" /></span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search Category"
                                                        value={searchTerm.category}
                                                        onChange={(e) => handleSearchChange('category', e.target.value)}
                                                    />
                                                </div>
                                                <ul>
                                                    {filteredCategoryOptions.length > 0 ? (
                                                        filteredCategoryOptions.map((option) => (
                                                            <li key={option.value}>
                                                                <label className="checkboxs">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checkedFilters.categoryName.includes(option.value)}
                                                                        onChange={(e) => handleCheckboxChange('categoryName', option.value, e.target.checked)}
                                                                    />
                                                                    <span className="checkmarks" /> {option.label}
                                                                </label>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-muted">No categories found</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {companyOptions.length > 0 && (
                                    <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                            <a href="#" className="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseCompany">Company</a>
                                        </div>
                                        <div id="collapseCompany" className="filter-set-contents accordion-collapse collapse" data-bs-parent="#filterAccordion">
                                            <div className="filter-content-list">
                                                <div className="mb-2 icon-form">
                                                    <span className="form-icon"><i className="ti ti-search" /></span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search Company"
                                                        value={searchTerm.company}
                                                        onChange={(e) => handleSearchChange('company', e.target.value)}
                                                    />
                                                </div>
                                                <ul>
                                                    {filteredCompanyOptions.length > 0 ? (
                                                        filteredCompanyOptions.map((option) => (
                                                            <li key={option.value}>
                                                                <label className="checkboxs">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checkedFilters.companyName.includes(option.value)}
                                                                        onChange={(e) => handleCheckboxChange('companyName', option.value, e.target.checked)}
                                                                    />
                                                                    <span className="checkmarks" /> {option.label}
                                                                </label>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-muted">No companies found</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <a href="#" className="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseStatus">Status</a>
                                    </div>
                                    <div id="collapseStatus" className="filter-set-contents accordion-collapse collapse" data-bs-parent="#filterAccordion">
                                        <div className="filter-content-list">
                                            <ul>
                                                {statusOptions.map((option) => (
                                                    <li key={option.value}>
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedFilters.status.includes(option.value)}
                                                                onChange={(e) => handleCheckboxChange('status', option.value, e.target.checked)}
                                                            />
                                                            <span className="checkmarks" /> {option.label}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <a href="#" className="collapsed" data-bs-toggle="collapse" data-bs-target="#collapsePriceStatus">Price Status</a>
                                    </div>
                                    <div id="collapsePriceStatus" className="filter-set-contents accordion-collapse collapse" data-bs-parent="#filterAccordion">
                                        <div className="filter-content-list">
                                            <ul>
                                                {priceStatusOptions.map((option) => (
                                                    <li key={option.value}>
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedFilters.priceStatus.includes(option.value)}
                                                                onChange={(e) => handleCheckboxChange('priceStatus', option.value, e.target.checked)}
                                                            />
                                                            <span className="checkmarks" />
                                                            {option.label}
                                                            <span className="badge bg-secondary ms-2">{option.count}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-reset-btns">
                                    <div className="row">
                                        <div className="col-12">
                                            <button type="button" className="btn btn-light w-100" onClick={handleReset}>
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="view-icons">
                    <a href="projects.html" className="active"><i className="ti ti-list-tree" /></a>
                    <a href="project-grid.html"><i className="ti ti-grid-dots" /></a>
                </div> */}
            </div>
        </div>
    );
};

export default ProductFilter;
