import React from 'react';

const CustomerPagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPages = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                        <a className="page-link" href="#" onClick={(e) => handleClick(e, i)}>
                            {i}
                        </a>
                    </li>
                );
            }
        } else {
            // Always show first two pages
            pages.push(renderPageItem(1));
            pages.push(renderPageItem(2));

            if (currentPage > 4) {
                pages.push(renderEllipsis('start'));
            }

            const start = Math.max(3, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(renderPageItem(i));
                }
            }

            if (currentPage < totalPages - 3) {
                pages.push(renderEllipsis('end'));
            }

            pages.push(renderPageItem(totalPages - 1));
            pages.push(renderPageItem(totalPages));
        }

        return pages;
    };

    const renderPageItem = (page) => (
        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <a className="page-link" href="#" onClick={(e) => handleClick(e, page)}>
                {page}
            </a>
        </li>
    );

    const renderEllipsis = (key) => (
        <li key={`ellipsis-${key}`} className="page-item disabled">
            <a className="page-link" href="javascript:void(0);">
                <i className="fas fa-ellipsis-h"></i>
            </a>
        </li>
    );

    const handleClick = (e, page) => {
        e.preventDefault();
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <nav aria-label="Page navigation" className="pagination-style-4">
            <ul className="pagination mb-0 flex-wrap justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        type='button'
                        onClick={(e) => handleClick(e, currentPage - 1)}
                    >
                        Prev
                    </button>
                </li>

                {renderPages()}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link text-primary"
                        type='button'
                        onClick={(e) => handleClick(e, currentPage + 1)}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default CustomerPagination;
