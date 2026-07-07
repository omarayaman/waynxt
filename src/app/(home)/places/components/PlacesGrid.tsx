"use client";

import {useEffect, useRef} from "react";
import {motion} from "framer-motion";
import {Loader2} from "lucide-react";
import {PlaceCard} from "./PlaceCard";
import type {Place} from "@/types/places";

interface PlacesGridProps {
  places: Place[];
  animateFromIndex?: number;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
  sidebarOpen?: boolean;
}

function PlaceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#222222] overflow-hidden animate-pulse">
      <div className="h-[280px] bg-[#111]" />
    </div>
  );
}

export function PlacesGrid({
  places,
  animateFromIndex = 0,
  isLoadingMore,
  hasMore,
  onLoadMore,
  sidebarOpen = true,
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
      {rootMargin: "240px", threshold: 0.1},
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <>
      <div
        className={`grid gap-4 ${
          sidebarOpen
            ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }`}>
        {places.map((place, index) => {
          const shouldAnimate = index >= animateFromIndex;
          const staggerIndex = shouldAnimate ? index - animateFromIndex : 0;

          return (
            <motion.div
              key={place.id}
              initial={shouldAnimate ? {opacity: 0, y: 14, filter: "blur(4px)"} : false}
              animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
              transition={{
                duration: 0.45,
                delay: Math.min(staggerIndex * 0.05, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}>
              <PlaceCard place={place} />
            </motion.div>
          );
        })}

        {isLoadingMore &&
          [...Array(3)].map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.3, delay: i * 0.06}}>
              <PlaceCardSkeleton />
            </motion.div>
          ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="w-full h-10 flex items-center justify-center mt-4">
          {isLoadingMore && <Loader2 size={24} className="animate-spin text-[#DFD616]" />}
        </div>
      )}
    </>
  );
}
