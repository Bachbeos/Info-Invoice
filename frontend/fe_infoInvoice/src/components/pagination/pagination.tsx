interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageItems = () => {
        const items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(number);
                        }}
                    >
                        {number}
                    </a>
                </li>
            );
        }
        return items;
    };

    return (
        <nav aria-label="Page navigation example" className="d-flex justify-content-between align-items-center p-3 bg-white border-top">
            <span className="text-muted small">Trang {currentPage} / {totalPages}</span>
            <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        aria-label="Previous"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                {renderPageItems()}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        aria-label="Next"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
}