import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const navigate = useNavigate();

  const pageItems = useMemo(() => {
    if (totalPages <= 0) return [];

    const pages = [];
    const showPage = (page) => pages.push({ type: "page", number: page });
    const showEllipsis = (key) => pages.push({ type: "ellipsis", key });

    showPage(1);

    if (currentPage > 3) showEllipsis("start");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) showPage(i);

    if (currentPage < totalPages - 2) showEllipsis("end");

    if (totalPages > 1) showPage(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination">
      <div className="flex justify-center items-center mt-8 gap-1.5 sm:gap-2 text-sm flex-nowrap">
        {/* First Page - hidden on small screens */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          className="p-2 sm:p-2.5 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors hidden sm:block"
        >
          <FaAngleDoubleLeft className="text-sm sm:text-base" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 sm:p-2.5 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <FaAngleLeft className="text-sm sm:text-base" />
        </button>

        {/* Page Numbers */}
        {pageItems.map((item, index) => {
          if (item.type === "page") {
            const isCurrent = item.number === currentPage;
            return (
              <button
                key={item.number}
                onClick={() => onPageChange(item.number)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${item.number}`}
                className={`px-3 sm:px-3.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  isCurrent
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {item.number}
              </button>
            );
          }
          return (
            <span
              key={`${item.key}-${index}`}
              className="px-2 sm:px-2.5 py-1 text-gray-500 whitespace-nowrap"
              aria-hidden="true"
            >
              ...
            </span>
          );
        })}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 sm:p-2.5 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <FaAngleRight className="text-sm sm:text-base" />
        </button>

        {/* Last Page - hidden on small screens */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          className="p-2 sm:p-2.5 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors hidden sm:block"
        >
          <FaAngleDoubleRight className="text-sm sm:text-base" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;