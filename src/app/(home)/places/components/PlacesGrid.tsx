"use client";

import React, { useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { PlaceCard } from "./PlaceCard";
import type { Place } from "@/types/places";
import { usePlacesStore } from "@/store/usePlacesStore";

interface PlacesGridProps {
  places: Place[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  animateFromIndex?: number;
}

export function PlacesGrid({
  places,
  isLoading,
  isLoadingMore,
  hasMore,
  loadMore,
  animateFromIndex = 0,
}: PlacesGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "400px", threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, hasMore, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10 w-full pb-10">
        {isLoading ? (
          // Skeletons
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full h-[350px] rounded-[2rem] bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-[#222222] animate-pulse"
            ></div>
          ))
        ) : places.length === 0 ? (
          // Empty state
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 dark:text-[#666666]">
            <Search size={40} className="mb-4 opacity-20" />
            <p className="text-lg">No places found matching your filters.</p>
            <button
              onClick={() => usePlacesStore.getState().resetFilters()}
              className="mt-4 text-[#F7EA00] dark:text-[#F7EA00] hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          // Places
          places.map((place, index) => (
            <PlaceCard
              key={place.id}
              place={place}
              index={index}
              animateFromIndex={animateFromIndex}
            />
          ))
        )}
      </div>

      {/* Pagination / Sentinel */}
      <div
        ref={sentinelRef}
        className="w-full h-10 flex items-center justify-center mt-4 mb-8"
      >
        {isLoadingMore && (
          <Loader2 size={24} className="animate-spin text-[#F7EA00]" />
        )}
      </div>
    </>
  );
}
