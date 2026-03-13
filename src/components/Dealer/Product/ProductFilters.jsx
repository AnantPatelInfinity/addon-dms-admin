import React, { useState } from 'react';

const ProductFilters = ({
    categoryList = [],
    companyList = [],
    selectedFilters = {},
    onFilterChange,
    onReset,
    onApply,
}) => {
    const [categorySearch, setCategorySearch] = useState('');
    const [companySearch, setCompanySearch] = useState('');

    const toggleSelection = (type, id) => {
        const currentList = selectedFilters[type] || [];
        const updatedList = currentList.includes(id)
            ? currentList.filter(item => item !== id)
            : [...currentList, id];
        onFilterChange(prev => ({ ...prev, [type]: updatedList }));
    };

    const renderCheckboxList = (list, type, searchTerm) => {
        return list
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(item => (
                <li key={item._id}>
                    <label className="checkboxs">
                        <input
                            type="checkbox"
                            checked={selectedFilters[type]?.includes(item._id)}
                            onChange={() => toggleSelection(type, item._id)}
                        />
                        <span className="checkmarks" /> {item.name}
                    </label>
                </li>
            ));
    };

    return (
        <div className="filter-set-view">
            <div className="filter-set-head mb-2">
                <h5><i className="ti ti-filter-share" /> Filter</h5>
            </div>

            {/* Category Filter */}
            <div className="mb-3">
                <strong>Category</strong>
                <div className="icon-form my-2">
                    <span className="form-icon"><i className="ti ti-search" /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Category"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                    />
                </div>
                <ul className="list-unstyled" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {renderCheckboxList(categoryList, 'categoryId', categorySearch)}
                </ul>
            </div>

            <div className="mb-3">
                <strong>Company</strong>
                <div className="icon-form my-2">
                    <span className="form-icon"><i className="ti ti-search" /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Company"
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                    />
                </div>
                <ul className="list-unstyled" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {renderCheckboxList(companyList, 'companyId', companySearch)}
                </ul>
            </div>
            <div className="row">
                <div className="col-6">
                    <button className="btn btn-light w-100" onClick={onReset}>
                        Reset
                    </button>
                </div>
                <div className="col-6">
                    <button className="btn btn-primary w-100" onClick={onApply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
