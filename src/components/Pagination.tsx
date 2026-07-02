import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 1) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage, '...', totalPages];
  };

  const pages = getPages();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-1 relative z-10">
      <button 
        onClick={handlePrev}
        disabled={currentPage === 1 || disabled}
        className="w-8 h-10 flex items-center justify-center text-[#888888] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
      >
        <ChevronLeft size={20} />
      </button>
      
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`dots-${index}`} className="w-6 h-10 flex items-center justify-center text-[#888888] text-base">
              ...
            </div>
          );
        }
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            disabled={disabled}
            className={`w-8 h-10 flex items-center justify-center text-base font-medium transition-colors bg-transparent ${
              currentPage === page 
                ? "text-[#DFD616] text-xl font-bold" 
                : "text-[#888888] hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        );
      })}

      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
        className="w-8 h-10 flex items-center justify-center text-[#888888] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
