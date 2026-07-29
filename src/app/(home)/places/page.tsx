"use client";

import React, { useState, Suspense } from "react";
import { Search, Sparkles, Map, Loader2, X } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";
import { usePlaces } from "@/hooks/usePlaces";

import { PlacesSidebar } from "./components/PlacesSidebar";
import { PlacesHeader } from "./components/PlacesHeader";
import { PlacesCategoryDock } from "./components/PlacesCategoryDock";
import { PlacesActiveFilters } from "./components/PlacesActiveFilters";
import { PlacesGrid } from "./components/PlacesGrid";
import { InteractiveMap } from "@/components/MapWrapper";

function PlacesPageContent() {
  const { search, setSearch, activeCategory, activeCities, activeBudgets, activeSuitableFor, activeSeason, activeCrowdLevel, activeAge } = usePlacesStore();
  const { places, meta, isLoading, isLoadingMore, error, hasMore, loadMore, animateFromIndex } = usePlaces();

  const [showMap, setShowMap] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const hasActiveFilters =
    activeCities.length > 0 ||
    activeBudgets.length > 0 ||
    activeSuitableFor !== "" ||
    activeSeason !== "" ||
    activeCrowdLevel !== "" ||
    activeAge !== "" ||
    (activeCategory !== "all" && activeCategory !== "");

  const activeSidebarFiltersCount =
    activeCities.length +
    activeBudgets.length +
    (activeSuitableFor !== "" ? 1 : 0) +
    (activeAge !== "" ? 1 : 0) +
    (activeSeason !== "" ? 1 : 0) +
    (activeCrowdLevel !== "" ? 1 : 0);

  return (
    <div className="h-[100dvh] bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-poppins flex flex-col overflow-hidden">
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-4 xl:px-4 pt-[70px] pb-4 flex flex-col overflow-hidden">
        
        {/* Top Header Row (Title, Search, Sort) */}
        <div className="flex flex-col w-full z-40 bg-white dark:bg-[#050505]">
          <PlacesHeader 
            meta={meta} 
            placesCount={places.length}
            isLoading={isLoading} 
            setIsMobileFiltersOpen={setIsMobileFiltersOpen} 
            activeSidebarFiltersCount={activeSidebarFiltersCount}
            showMap={showMap}
            setShowMap={setShowMap}
          />
          <PlacesCategoryDock />
        </div>

        {/* Two-Column Content Layout */}
        <div className="w-full flex-1 flex gap-4 lg:gap-6 min-h-0 overflow-hidden mt-2">
          {/* Left: Advanced Filters Sidebar */}
          <PlacesSidebar 
            isMobileFiltersOpen={isMobileFiltersOpen} 
            setIsMobileFiltersOpen={setIsMobileFiltersOpen} 
            activeSidebarFiltersCount={activeSidebarFiltersCount}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Right Main Area */}
          <div className="flex-1 min-w-0 h-full flex flex-col relative lg:pr-2">
            
            {hasActiveFilters && (
              <div className="shrink-0 mb-4 z-20 relative">
                <PlacesActiveFilters />
              </div>
            )}

            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 lg:pr-4 pb-28 relative">
              {/* Scroll Gradient Mask for Grid */}
              <div className="sticky top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-[#050505] to-transparent pointer-events-none z-20 -mt-2" />

              {error && (
                <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <PlacesGrid 
                places={places} 
                isLoading={isLoading} 
                isLoadingMore={isLoadingMore} 
                hasMore={hasMore} 
                loadMore={loadMore} 
                animateFromIndex={animateFromIndex} 
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#050505] flex flex-col pt-[70px]">
          {/* Map Header with Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#222222] bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <Map size={20} className="text-[#F7EA00]" />
              <h3 className="font-bold text-gray-900 dark:text-white text-lg font-sans">Interactive Map</h3>
            </div>
            <button 
              onClick={() => setShowMap(false)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          {/* Map Container */}
          <div className="flex-1 w-full h-full relative">
            <InteractiveMap places={places} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-white dark:bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>}>
      <PlacesPageContent />
    </Suspense>
  );
}
