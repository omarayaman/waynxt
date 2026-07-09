"use client";

import React, {Suspense, useEffect, useRef, useState} from "react";
import NavbarHome, {NAVBAR_HEIGHT} from "../NavbarHome";
import {usePlacesStore} from "@/store/usePlacesStore";
import {usePlaces} from "@/hooks/usePlaces";
import {useCategories} from "@/hooks/useCategories";
import {useCities} from "@/hooks/useCities";
import {PlacesGrid} from "./components/PlacesGrid";
import {Modal} from "@/components/Modal";
import {PlacesFilterPanel} from "./components/PlacesFilterPanel";
import {PlacesFilterCollapsed} from "./components/PlacesFilterCollapsed";
import {PlacesActiveFilters} from "./components/PlacesActiveFilters";
import {ALL_EXPERIENCES, CATEGORY_ICONS, SORT_OPTIONS} from "./constants";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  X,
  ChevronDown,
  RotateCcw,
  Diamond,
  PanelLeftClose,
  PanelLeftOpen,
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

  const {places, meta, isLoading, isLoadingMore, error, hasMore, loadMore, animateFromIndex} =
    usePlaces();
  const {categories, isLoading: isCategoriesLoading} = useCategories();
  const {cities, isLoading: isCitiesLoading} = useCities();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [stickyOffset, setStickyOffset] = useState(NAVBAR_HEIGHT + 100);

  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;

    const updateOffset = () => {
      setStickyOffset(NAVBAR_HEIGHT + el.offsetHeight);
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-background text-foreground">
      <NavbarHome className="bg-[var(--navbar-solid)] backdrop-blur-xl" />

      <div style={{paddingTop: NAVBAR_HEIGHT}}>
        {/* Sticky toolbar — pins below fixed navbar on scroll */}
        <div
          ref={toolbarRef}
          className="sticky z-40 w-full bg-[var(--navbar-solid)] backdrop-blur-md border-b border-border"
          style={{top: NAVBAR_HEIGHT}}>
          <div className="w-full px-4 sm:px-5 lg:pr-4 lg:pl-4 py-2.5 space-y-2.5">
            {/* Row 1: title + search + actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block shrink-0">
                <h1 className="text-sm font-medium text-foreground whitespace-nowrap">Places</h1>
                {!isLoading && meta && (
                  <p className="text-[10px] text-muted tabular-nums">
                    {places.length} of {meta.total}
                  </p>
                )}
              </div>

              <div className="relative flex-1 min-w-0">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search places..."
                  className="w-full bg-surface border border-border rounded-lg py-2.5 pl-9 pr-8 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-foreground"
                    aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className={`lg:hidden flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs transition-colors shrink-0 ${
                  activeFilterCount > 0
                    ? "border-accent/30 text-accent hover:border-accent/50"
                    : "border-border text-muted hover:text-foreground hover:border-border"
                }`}
                aria-label="Open filters">
                <SlidersHorizontal size={13} />
                {activeFilterCount > 0 && (
                  <span className="text-[10px] tabular-nums">{activeFilterCount}</span>
                )}
              </button>

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-border text-xs text-muted hover:text-foreground hover:border-border transition-colors">
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label ?? "Sort"}
                  <ChevronDown size={12} />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            sortBy === opt.id ? "text-accent" : "text-muted hover:text-foreground"
                          }`}>
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
                    ? "bg-accent-subtle border border-accent text-accent"
                    : "border border-border text-muted hover:text-foreground hover:border-border"
                }`}>
                <ALL_EXPERIENCES.icon size={14} strokeWidth={1.5} />
                {ALL_EXPERIENCES.label}
              </button>
              {isCategoriesLoading
                ? [...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-24 h-8 rounded-full bg-surface-elevated animate-pulse"
                    />
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
                            ? "bg-accent-subtle border border-accent text-accent"
                            : "border border-border text-muted hover:text-foreground hover:border-border"
                        }`}>
                        <Icon size={14} strokeWidth={1.5} />
                        {cat.category}
                      </button>
                    );
                  })}
            </div>

            <PlacesActiveFilters />
          </div>
        </div>

        {/* Main — sidebar flush left, grid fills to the right edge */}
        <div className="flex w-full">
          <aside
            className={`hidden lg:block shrink-0 bg-[var(--navbar-solid)] transition-[width] duration-300 ease-out ${
              isSidebarOpen ? "w-52" : "w-28"
            }`}>
            <div
              className="sticky flex flex-col px-4 py-4"
              style={{
                top: stickyOffset,
                maxHeight: `calc(100vh - ${stickyOffset}px)`,
              }}>
              {isSidebarOpen ? (
                <>
                  <div className="flex items-center justify-between pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 rounded-md text-[var(--navbar-muted)] transition-colors hover:bg-black/5 hover:text-[var(--navbar-foreground)]"
                        aria-label="Collapse filters">
                        <PanelLeftClose size={14} />
                      </button>
                      <span className="text-xs text-[var(--navbar-muted)]">Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="text-[10px] text-accent tabular-nums">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={resetFilters}
                      disabled={activeFilterCount === 0}
                      className="flex items-center gap-1 text-[11px] text-[var(--navbar-muted)] transition-colors hover:text-[var(--navbar-foreground)] disabled:opacity-30 disabled:pointer-events-none">
                      <RotateCcw size={11} />
                      Reset
                    </button>
                  </div>
                  <div className="filters-scroll overflow-y-auto flex-1 min-h-0">
                    <PlacesFilterPanel cities={cities} citiesLoading={isCitiesLoading} />
                  </div>
                </>
              ) : (
                <PlacesFilterCollapsed
                  onExpand={() => setIsSidebarOpen(true)}
                  onReset={resetFilters}
                  activeFilterCount={activeFilterCount}
                />
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0 px-4 sm:px-5 lg:pr-4 lg:pl-5 py-5 bg-background">
            <section className="min-w-0">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div
                  className={`grid gap-4 ${
                    isSidebarOpen
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  }`}>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border overflow-hidden animate-pulse">
                      <div className="h-[280px] bg-surface-elevated" />
                    </div>
                  ))}
                </div>
              ) : places.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-muted mb-3">No places found</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-accent hover:underline">
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
                  sidebarOpen={isSidebarOpen}
                />
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Mobile filters */}
      <Modal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        title="Filters"
        size="md">
        <div className="flex items-center justify-end -mt-2 mb-3">
          <button
            type="button"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
            className="flex items-center gap-1 text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .filters-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .filters-scroll:hover { scrollbar-color: var(--border) transparent; }
        .filters-scroll::-webkit-scrollbar { width: 3px; }
        .filters-scroll::-webkit-scrollbar-track { background: transparent; }
        .filters-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
        .filters-scroll:hover::-webkit-scrollbar-thumb { background: var(--border); }
      `,
        }}
      />
    </div>
  );
}

export default function ExplorePlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-muted" />
        </div>
      }>
      <PlacesContent />
    </Suspense>
  );
}
