import { useEffect } from "react";
import { toast } from "react-toastify";
import TableFieldFilter from "./TableFieldFilter";

const TableFilter = ({
    visibleColumns,
    setVisibleColumns,
    columnsConfig,
    moduleKey,
    isHideSave = false,
    filterConfig = null,
    filterState = {},
    onFilterChange = null,
    filterDropdownLabel = "Filter"
}) => {

    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

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
                        {!isHideSave && (
                            <div className="mt-3 text-end">
                                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                                    <i className="ti ti-device-floppy me-1" />
                                    Save Settings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {filterConfig && (
                    <TableFieldFilter
                        filterConfig={filterConfig}
                        filterState={filterState}
                        onFilterChange={onFilterChange}
                        dropdownLabel={filterDropdownLabel}
                    />
                )}
            </div>
        </div>
    )
}

export default TableFilter