import React, { useEffect, useState } from "react";

const PaginationComponent = ({
    total = 0,
    itemsPerPage = 10,
    currentPage = 1,
    onPageChange,
}) => {

    const [totalPages, setTotalPages] = useState(0);
    const [gotoPage, setGotoPage] = useState("");

    useEffect(() => {
        if (total > 0 && itemsPerPage > 0) {
            setTotalPages(Math.ceil(total / itemsPerPage));
        }
    }, [total, itemsPerPage]);

    const handleGoToPage = () => {
        const page = parseInt(gotoPage, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            onPageChange(page);
            setGotoPage("");
        }
    };

    const generatePagination = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1); // Always show first

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages); // Always show last
        }

        return pages;
    };

    if (totalPages === 0) return null;

    return (

        <div className="col-md-6 pagination-margin">
            <div className="pagination-goto-page align-items-center ">

                {/* Goto Page Input */}
                <div className="">
                    <div className="goto-page d-flex align-items-center justify-content-end mt-2 mt-md-0">
                        <label htmlFor="gotoPage" className="me-2 mb-0">Go to page:</label>
                        <input
                            type="number"
                            id="gotoPage"
                            min="1"
                            max={totalPages}
                            value={gotoPage}
                            onChange={(e) => setGotoPage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleGoToPage();
                            }}
                            className="form-control form-control-sm me-2"
                            style={{ width: "80px" }}
                        />
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={handleGoToPage}
                        >
                            Go
                        </button>
                    </div>
                </div>

                {/* Pagination UI */}
                <div className="">
                    <nav aria-label="Page navigation" className="mt-3">
                        <ul className="pagination mb-3 justify-content-end">
                            {/* Previous Button */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <a
                                    className="page-link"
                                    href="#!"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) onPageChange(currentPage - 1);
                                    }}
                                >
                                    Prev
                                </a>
                            </li>

                            {/* Page Numbers */}
                            {generatePagination().map((page, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
                                >
                                    <a
                                        href="#!"
                                        className="page-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page !== "...") onPageChange(page);
                                        }}
                                    >
                                        {page}
                                    </a>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <a
                                    className="page-link"
                                    href="#!"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) onPageChange(currentPage + 1);
                                    }}
                                >
                                    Next
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default PaginationComponent;
