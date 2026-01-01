import React from 'react';

const Pagination = ({ page, pages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="pagination-btn"
            >
                Previous
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`pagination-btn ${page === number ? 'active' : ''}`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
                className="pagination-btn"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
