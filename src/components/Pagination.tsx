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
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
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
    <div className="mt-12 flex items-center justify-center gap-2 relative z-10">
      <button 
        onClick={handlePrev}
        disabled={currentPage === 1 || disabled}
        className="w-10 h-10 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a1a1a] transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-[#888888]">
              ...
            </div>
          );
        }
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            disabled={disabled}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
              currentPage === page 
                ? "bg-[#DFD616] text-[#0a0a0a]" 
                : "bg-[#111111] border border-[#222222] text-[#888888] hover:text-white hover:bg-[#1a1a1a]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        );
      })}

      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
        className="w-10 h-10 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a1a1a] transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
