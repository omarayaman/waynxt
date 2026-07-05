"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoadmapStop } from "@/lib/trip-roadmap";
import {
  computeRoadmapLayout,
  buildCurvedPath,
  buildPartialPath,
  EGYPT_ROADMAP_THEME,
} from "@/lib/trip-roadmap";

interface RoadmapTimelineProps {
  stops: RoadmapStop[];
  activeStopId: string | null;
  onSelectStop: (id: string) => void;
}

export function RoadmapTimeline({ stops, activeStopId, onSelectStop }: RoadmapTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 });

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Ensure a minimum width so nodes don't overlap too much if there are many
      const minWidth = Math.max(rect.width, stops.length * 150);
      setDimensions({ width: minWidth, height: rect.height || 400 });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stops.length]);

  const layout = useMemo(
    () =>
      computeRoadmapLayout({
        count: stops.length,
        width: dimensions.width,
        seed: "waynx-roadmap",
      }),
    [stops.length, dimensions.width]
  );

  const activeIndex = activeStopId
    ? stops.findIndex((s) => s.id === activeStopId)
    : stops.length - 1;

  // Scroll to active node
  useEffect(() => {
    if (scrollRef.current && layout.points[activeIndex]) {
      const p = layout.points[activeIndex];
      const scrollEl = scrollRef.current;
      const scrollLeft = p.x - scrollEl.clientWidth / 2;
      scrollEl.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIndex, layout.points]);

  if (!stops.length) return null;

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-[#1a1a1a] bg-black mb-6 shadow-2xl">
      {/* Header section matching the mockup */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <h2 className="text-xl font-semibold text-[#DFD616] tracking-wide mb-2 font-clash">
          Your unique journey is ready
        </h2>
        <div className="text-[12px] text-[#A67B5B]">
          {stops.length} stops from start to finish
        </div>
      </div>

      <div className="relative px-6">
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollLeft}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#2C2917] text-[#9A9585] hover:text-white hover:bg-[#ffffff10] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleScrollRight}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#2C2917] text-[#9A9585] hover:text-white hover:bg-[#ffffff10] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="h-[2px] flex-1 bg-[#2C2917] mx-4 relative rounded-full">
            <div 
              className="absolute left-0 top-0 h-full bg-[#DFD616] rounded-full transition-all duration-500" 
              style={{ width: `${((activeIndex + 1) / stops.length) * 100}%` }}
            />
          </div>
          <div className="text-[#9A9585] text-xs font-semibold whitespace-nowrap">
            {activeIndex + 1} / {stops.length}
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="w-full relative h-[450px] overflow-hidden"
      >
        <div
          ref={scrollRef}
          className="w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar relative"
          style={{ cursor: "grab" }}
        >
          <div
            className="relative h-full"
            style={{ width: dimensions.width }}
          >
            {/* Background Map lines */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#DFD616" />
                  <stop offset="100%" stopColor="#A67B5B" />
                </linearGradient>
              </defs>

              {/* Full path (muted dashed) */}
              <path
                d={buildCurvedPath(layout.points)}
                fill="none"
                stroke="#2a2418"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Active filled path */}
              {activeIndex > 0 && (
                <path
                  d={buildPartialPath(layout.points, activeIndex)}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  filter="url(#glow)"
                />
              )}
            </svg>

            {/* Nodes */}
            {layout.points.map((p, i) => {
              const stop = stops[i];
              const isActive = stop.id === activeStopId || (!activeStopId && i === stops.length - 1 && activeStopId === null);
              const isPast = i <= activeIndex;
              const imgUrl = stop.activity.place?.thumbnail_url || stop.activity.thumbnail_url || stop.activity.image_url || "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=300&auto=format&fit=crop";

              return (
                <div
                  key={stop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                  style={{ left: p.x, top: p.y }}
                  onClick={() => onSelectStop(stop.id)}
                >
                  <div
                    className={`relative rounded-full border-4 transition-all duration-300 z-10 ${
                      isActive
                        ? "border-[#DFD616] w-24 h-24 shadow-[0_0_25px_rgba(223,214,22,0.6)] scale-110"
                        : isPast
                        ? "border-[#C4A265] w-20 h-20 group-hover:border-[#DFD616]"
                        : "border-[#2a2418] w-20 h-20 opacity-60 group-hover:opacity-100 group-hover:border-[#555]"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={stop.activity.activity_name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    {!isActive && !isPast && (
                      <div className="absolute inset-0 bg-black/50 rounded-full group-hover:bg-black/20 transition-colors" />
                    )}

                    {/* Rating Badge */}
                    {stop.activity.rating > 0 && (
                      <div className="absolute -bottom-2 -right-2 bg-[#111] border border-[#333] rounded-full px-2 py-0.5 flex items-center gap-1 shadow-xl">
                        <Star size={10} className="text-[#DFD616]" fill="currentColor" />
                        <span className="text-[10px] text-white font-bold">{stop.activity.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className={`mt-4 flex flex-col items-center text-center w-36 transition-all ${
                    isActive ? "opacity-100 scale-105" : "opacity-70 group-hover:opacity-100"
                  }`}>
                    <span className="text-[13px] font-bold text-white line-clamp-2 leading-snug">
                      {stop.activity.activity_name}
                    </span>
                    <span className="text-[11px] text-[#A67B5B] mt-1 font-medium">
                      {stop.city} &middot; Day {stop.dayNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2418;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #C4A265;
        }
      `}} />
    </div>
  );
}
