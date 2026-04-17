interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  resultsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults = 0,
  resultsPerPage = 10,
}: PaginationProps) {
  const startResult =
    totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const renderPageItems = () => {
    const pages = [];
    const siblingCount = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - siblingCount && i <= currentPage + siblingCount)
      ) {
        const isActive = i === currentPage;
        pages.push(
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
            aria-current={isActive ? "page" : undefined}
            disabled={totalPages <= 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
              isActive
                ? "z-10 bg-indigo-500 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:text-white"
                : "text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:text-gray-200 dark:ring-white/10 dark:hover:bg-white/5"
            } ${i > 1 && i < totalPages ? "hidden md:inline-flex" : ""}`}
          >
            {i}
          </button>,
        );
      } else if (
        i === currentPage - siblingCount - 1 ||
        i === currentPage + siblingCount + 1
      ) {
        pages.push(
          <span
            key={`ellipsis-${i}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-white/10 focus:outline-offset-0"
          >
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 dark:border-white/10">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={currentPage === 1 || totalPages <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
        >
          Trước
        </button>
        <button
          disabled={currentPage === totalPages || totalPages <= 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
        >
          Sau
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Hiển thị{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {startResult}
            </span>{" "}
            trên{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {endResult}
            </span>{" "}
            của{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {totalResults}
            </span>{" "}
            kết quả
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              disabled={currentPage === 1 || totalPages <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 dark:text-gray-400 dark:ring-white/10 dark:hover:bg-white/5"
            >
              <span className="sr-only">Trước</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {renderPageItems()}

            <button
              disabled={currentPage === totalPages || totalPages <= 1}
              onClick={() => onPageChange(currentPage + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 dark:text-gray-400 dark:ring-white/10 dark:hover:bg-white/5"
            >
              <span className="sr-only">Sau</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
