"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PlaceCard } from "./PlaceCard";
import type { Place } from "@/types/places";

interface PlacesGridProps {
  places: Place[];
  animateFromIndex?: number;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
}

function PlaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#141414] overflow-hidden">
      <div className="aspect-[16/10] bg-[#111] animate-pulse" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 w-3/4 bg-[#111] rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-[#111] rounded animate-pulse" />
      </div>
    </div>
  );
}

export function PlacesGrid({
  places,
  animateFromIndex = 0,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: PlacesGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: "240px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {places.map((place, index) => {
          const shouldAnimate = index >= animateFromIndex;
          const staggerIndex = shouldAnimate ? index - animateFromIndex : 0;

          return (
            <motion.div
              key={place.id}
              initial={shouldAnimate ? { opacity: 0, y: 14, filter: "blur(4px)" } : false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.45,
                delay: Math.min(staggerIndex * 0.05, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <PlaceCard place={place} />
            </motion.div>
          );
        })}

        {isLoadingMore &&
          [...Array(3)].map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <PlaceCardSkeleton />
            </motion.div>
          ))}
      </div>

      {hasMore && <div ref={sentinelRef} className="h-1 w-full" aria-hidden />}
    </>
  );
}
