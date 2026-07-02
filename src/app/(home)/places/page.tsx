"use client";

import React, { Suspense, useState } from "react";
import NavbarHome from "../NavbarHome";
import { usePlacesStore } from "@/store/usePlacesStore";
import { usePlaces } from "@/hooks/usePlaces";
import { useCategories } from "@/hooks/useCategories";
import { useCities } from "@/hooks/useCities";
import { PlacesGrid } from "./components/PlacesGrid";
import { Modal } from "@/components/Modal";
import { PlacesFilterPanel } from "./components/PlacesFilterPanel";
import { PlacesActiveFilters } from "./components/PlacesActiveFilters";
import { ALL_EXPERIENCES, CATEGORY_ICONS, SORT_OPTIONS } from "./constants";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  X,
  ChevronDown,
  RotateCcw,
  Diamond,
} from "lucide-react";

function getCategoryIcon(category: string) {
  const key = category.toLowerCase().replace(/\s+/g, "_");
  return CATEGORY_ICONS[key] || Diamond;
}

function PlacesContent() {
  const {
    search,
    setSearch,
    activeCategory,
    setCategory,
    activeCities,
    activeBudgets,
    activeSuitableFor,
    activeAge,
    activeSeason,
    activeCrowdLevel,
    sortBy,
    setSortBy,
    resetFilters,
  } = usePlacesStore();

  const {
    places,
    meta,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    animateFromIndex,
  } = usePlaces();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { cities, isLoading: isCitiesLoading } = useCities();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (activeCategory && activeCategory !== "all" ? 1 : 0) +
    activeCities.length +
    activeBudgets.length +
    (activeSuitableFor ? 1 : 0) +
    (activeAge ? 1 : 0) +
    (activeSeason ? 1 : 0) +
    (activeCrowdLevel ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <NavbarHome />

      <div className="pt-[88px]">
        {/* Sticky toolbar — pins to very top on scroll */}
        <div className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#141414]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2.5">
            {/* Row 1: title + search + actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block shrink-0">
                <h1 className="text-sm font-medium text-white whitespace-nowrap">Places</h1>
                {!isLoading && meta && (
                  <p className="text-[10px] text-[#555] tabular-nums">
                    {places.length} of {meta.total}
                  </p>
                )}
              </div>

              <div className="relative flex-1 min-w-0">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search places..."
                  className="w-full bg-transparent border border-[#1a1a1a] rounded-lg py-2.5 pl-9 pr-8 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#333] transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#555] hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#1a1a1a] text-xs text-[#888] hover:text-white hover:border-[#333] transition-colors shrink-0"
              >
                <SlidersHorizontal size={13} />
                {activeFilterCount > 0 && (
                  <span className="text-[10px] text-[#DFD616]">{activeFilterCount}</span>
                )}
              </button>

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-[#1a1a1a] text-xs text-[#888] hover:text-white hover:border-[#333] transition-colors"
                >
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label ?? "Sort"}
                  <ChevronDown size={12} />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg shadow-xl overflow-hidden z-50">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            sortBy === opt.id
                              ? "text-[#DFD616]"
                              : "text-[#777] hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Row 2: categories with icons */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`shrink-0 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  activeCategory === "all" || !activeCategory
                    ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616]"
                    : "border border-[#222] text-[#777] hover:text-white hover:border-[#444]"
                }`}
              >
                <ALL_EXPERIENCES.icon size={14} strokeWidth={1.5} />
                {ALL_EXPERIENCES.label}
              </button>
              {isCategoriesLoading
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="shrink-0 w-24 h-8 rounded-full bg-[#111] animate-pulse" />
                  ))
                : categories.map((cat) => {
                    const isActive = activeCategory === cat.category;
                    const Icon = getCategoryIcon(cat.category);
                    return (
                      <button
                        key={cat.category}
                        type="button"
                        onClick={() => setCategory(cat.category)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium capitalize transition-colors ${
                          isActive
                            ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616]"
                            : "border border-[#222] text-[#777] hover:text-white hover:border-[#444]"
                        }`}
                      >
                        <Icon size={14} strokeWidth={1.5} />
                        {cat.category}
                      </button>
                    );
                  })}
            </div>

            <PlacesActiveFilters />
          </div>
        </div>

        {/* Main */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-[108px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#666]">Filters</span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    disabled={activeFilterCount === 0}
                    className="flex items-center gap-1 text-[11px] text-[#555] hover:text-[#aaa] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <RotateCcw size={11} />
                    Reset
                  </button>
                </div>
                <div className="filters-scroll max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
                  <PlacesFilterPanel cities={cities} citiesLoading={isCitiesLoading} />
                </div>
              </div>
            </aside>

            {/* Grid */}
            <section className="flex-1 min-w-0">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-[#141414] overflow-hidden animate-pulse">
                      <div className="aspect-[16/10] bg-[#111]" />
                      <div className="p-3.5 space-y-2">
                        <div className="h-4 w-3/4 bg-[#111] rounded" />
                        <div className="h-3 w-1/2 bg-[#111] rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : places.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-[#666] mb-3">No places found</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-[#DFD616] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <PlacesGrid
                  places={places}
                  animateFromIndex={animateFromIndex}
                  isLoadingMore={isLoadingMore}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                />
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Mobile filters */}
      <Modal isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} title="Filters" size="md">
        <div className="flex items-center justify-end -mt-2 mb-3">
          <button
            type="button"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
            className="flex items-center gap-1 text-xs text-[#666] hover:text-white disabled:opacity-30 transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
        <PlacesFilterPanel
          cities={cities}
          citiesLoading={isCitiesLoading}
          showApplyButton
          onApply={() => setIsFiltersOpen(false)}
        />
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .filters-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .filters-scroll:hover { scrollbar-color: #222 transparent; }
        .filters-scroll::-webkit-scrollbar { width: 3px; }
        .filters-scroll::-webkit-scrollbar-track { background: transparent; }
        .filters-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
        .filters-scroll:hover::-webkit-scrollbar-thumb { background: #222; }
      `}} />
    </div>
  );
}

export default function ExplorePlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#555]" />
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
