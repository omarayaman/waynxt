"use client";

import React, { useState } from "react";
import { SlidersHorizontal, ChevronDown, Search as SearchIcon, Map, Loader2 } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";
import { SORT_OPTIONS } from "../constants";

interface PlacesHeaderProps {
  meta: any;
  placesCount: number;
  isLoading: boolean;
  setIsMobileFiltersOpen: (val: boolean) => void;
  activeSidebarFiltersCount: number;
  showMap: boolean;
  setShowMap: (val: boolean) => void;
}

export function PlacesHeader({
  meta,
  placesCount,
  isLoading,
  setIsMobileFiltersOpen,
  activeSidebarFiltersCount,
  showMap,
  setShowMap,
}: PlacesHeaderProps) {
  const { sortBy, setSortBy, search, setSearch } = usePlacesStore();
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full items-start lg:items-center mb-2 lg:mb-4 z-40 relative">
      
      {/* Left Column (Matches Sidebar Width): Title */}
      <div className="flex flex-row lg:flex-col justify-between items-center lg:items-start shrink-0 lg:w-[180px] xl:w-[220px] w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-wide font-sans">
            Discover <span className="text-[#F7EA00] dark:text-[#F7EA00]">Egypt</span>
          </h2>
          {meta && (
            <span className={`text-xs text-gray-500 dark:text-[#666666] font-medium transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}>
              {placesCount} of {meta.total}
            </span>
          )}
        </div>
        
        {/* Mobile Filters Toggle (Visible only on mobile) */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="lg:hidden h-10 px-4 rounded-full border border-gray-200 dark:border-[#222222] text-gray-600 dark:text-[#888888] flex items-center gap-2 hover:text-[#F7EA00] hover:border-[#F7EA00] transition-colors text-xs font-medium relative"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeSidebarFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#F7EA00] text-[#0a0a0a] text-[9px] font-bold">
              {activeSidebarFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Right Column (Matches Grid Width): Search & Actions */}
      <div className="flex-1 flex gap-3 min-w-0 w-full items-center">
        
        {/* Search Bar */}
        <div className="flex-1 relative min-w-[150px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#666666]">
            <SearchIcon size={16} strokeWidth={2} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search places..."
            className="w-full bg-transparent border border-gray-200 dark:border-[#222222] rounded-full py-2.5 pl-11 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#666666] focus:outline-none focus:border-[#F7EA00] dark:focus:border-[#F7EA00] transition-colors"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 size={14} className="animate-spin text-[#F7EA00]" />
            </div>
          )}
        </div>

        {/* Actions (Map, Sort) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Map View */}
          <button 
            onClick={() => setShowMap(!showMap)}
            className={`h-10 px-4 rounded-full border flex items-center gap-2 transition-colors text-xs font-medium hidden sm:flex ${
              showMap 
                ? "bg-[#F7EA00] border-[#F7EA00] text-[#0a0a0a]" 
                : "border-gray-200 dark:border-[#222222] text-gray-600 dark:text-[#888888] hover:text-[#F7EA00] hover:border-[#F7EA00]"
            }`}
          >
            <Map size={14} />
            Map
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="h-10 px-4 rounded-full border border-gray-200 dark:border-[#222222] text-gray-600 dark:text-[#888888] flex items-center gap-2 hover:text-[#F7EA00] hover:border-[#F7EA00] transition-colors text-xs font-medium"
            >
              {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Sort"}
              <ChevronDown size={14} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] rounded-xl shadow-xl overflow-hidden z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      sortBy === opt.id
                        ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium"
                        : "text-gray-600 dark:text-[#888888] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
    </div>
  );
}
