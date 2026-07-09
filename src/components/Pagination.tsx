import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-[#666] tabular-nums order-2 sm:order-1">
        Page <span className="text-[#aaa]">{currentPage}</span> of{" "}
        <span className="text-[#aaa]">{totalPages}</span>
      </p>

      <nav
        className="flex items-center gap-1 order-1 sm:order-2"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          aria-label="Previous page"
          className="flex items-center gap-1 h-9 px-3 rounded-lg border border-border text-xs text-[#888] hover:text-white hover:border-[#444] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-0.5 mx-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-9 h-9 flex items-center justify-center text-[#555] text-xs select-none"
                >
                  ···
                </span>
              );
            }

            const isActive = currentPage === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={disabled}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[36px] h-9 px-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-[#888] hover:text-white hover:bg-[#141414]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          aria-label="Next page"
          className="flex items-center gap-1 h-9 px-3 rounded-lg border border-border text-xs text-[#888] hover:text-white hover:border-[#444] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
