"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoadmapStop, RoadmapPoint } from "@/lib/trip-roadmap";
import {
  computeRoadmapLayout,
  buildCurvedPath,
  buildPartialPath,
} from "@/lib/trip-roadmap";

const ROADMAP_CANVAS_PAD = { top: 64, bottom: 96, x: 80 } as const;

interface CanvasDimensions {
  width: number;
  height: number;
  innerWidth: number;
}

interface RoadmapTimelineProps {
  stops: RoadmapStop[];
  activeStopId: string | null;
  onSelectStop: (id: string) => void;
}

export function RoadmapTimeline({ stops, activeStopId, onSelectStop }: RoadmapTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 1200,
    height: 400,
    innerWidth: 1056,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const innerWidth = Math.max(
        rect.width - ROADMAP_CANVAS_PAD.x * 2,
        stops.length * 150
      );

      setDimensions({
        width: innerWidth + ROADMAP_CANVAS_PAD.x * 2,
        height: Math.max(rect.height, 320),
        innerWidth,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stops.length]);

  const layout = useMemo(
    () =>
      computeRoadmapLayout({
        count: stops.length,
        width: dimensions.innerWidth,
        seed: "waynx-roadmap",
      }),
    [stops.length, dimensions.innerWidth]
  );

  const displayPoints = useMemo((): RoadmapPoint[] => {
    const layoutBand =
      dimensions.height - ROADMAP_CANVAS_PAD.top - ROADMAP_CANVAS_PAD.bottom;

    return layout.points.map((p) => ({
      x: p.x + ROADMAP_CANVAS_PAD.x,
      y:
        ROADMAP_CANVAS_PAD.top +
        (layout.height > 0 ? (p.y / layout.height) * layoutBand : layoutBand / 2),
    }));
  }, [layout.points, layout.height, dimensions.height]);

  const activeIndex = activeStopId
    ? stops.findIndex((s) => s.id === activeStopId)
    : stops.length - 1;

  // Scroll to active node
  useEffect(() => {
    if (scrollRef.current && displayPoints[activeIndex]) {
      const p = displayPoints[activeIndex];
      const scrollEl = scrollRef.current;
      const scrollLeft = p.x - scrollEl.clientWidth / 2;
      scrollEl.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIndex, displayPoints]);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-border 
    bg-white/80 backdrop-blur-md shadow-[0_12px_48px_color-mix(in_srgb,var(--foreground)_8%,transparent)] dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-md dark:shadow-2xl">
      {/* Header section matching the mockup */}
      <div className="flex shrink-0 flex-col items-center px-4 pb-2 pt-4">
        <h2 className="mb-2 text-center font-clash text-xl font-semibold tracking-wide text-accent">
          Your unique journey is ready
        </h2>
        <div className="text-[12px] text-muted">
          {stops.length} stops from start to finish
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="mb-2 flex shrink-0 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-elevated hover:text-foreground dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleScrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-elevated hover:text-foreground dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="relative mx-4 h-[2px] flex-1 rounded-full bg-border dark:bg-white/10">
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-accent transition-all duration-500" 
              style={{ width: `${((activeIndex + 1) / stops.length) * 100}%` }}
            />
          </div>
          <div className="whitespace-nowrap text-xs font-semibold text-muted">
            {activeIndex + 1} / {stops.length}
          </div>
        </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="relative min-h-0 w-full flex-1"
      >
        <div
          ref={scrollRef}
          className="no-scrollbar relative h-full w-full overflow-x-auto overflow-y-hidden select-none"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            className="relative"
            style={{ width: dimensions.width, height: dimensions.height }}
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
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="#A67B5B" />
                </linearGradient>
              </defs>

              <g>
                {/* Full path (muted dashed) */}
                <path
                  d={buildCurvedPath(displayPoints)}
                  fill="none"
                  stroke="currentColor"
                  className="text-border dark:text-[#2a2418]"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />

                {/* Active filled path */}
                {activeIndex > 0 && (
                  <path
                    d={buildPartialPath(displayPoints, activeIndex)}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                )}
              </g>
            </svg>

            {/* Nodes */}
            {displayPoints.map((p, i) => {
              const stop = stops[i];
              const isActive = stop.id === activeStopId || (!activeStopId && i === stops.length - 1 && activeStopId === null);
              const isPast = i <= activeIndex;
              const imgUrl = stop.activity.place?.thumbnail_url || stop.activity.thumbnail_url || stop.activity.image_url || "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=300&auto=format&fit=crop";

              return (
                <div
                  key={stop.id}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 transform cursor-pointer flex-col items-center group"
                  style={{ left: p.x, top: p.y }}
                  onClick={() => onSelectStop(stop.id)}
                >
                  <div
                    className={`relative rounded-full border-4 transition-all duration-300 z-10 ${
                      isActive
                        ? "border-accent w-24 h-24 shadow-[0_0_25px_color-mix(in srgb, var(--accent) %, transparent)] scale-110"
                        : isPast
                        ? "border-accent/60 w-20 h-20 group-hover:border-accent dark:border-[#C4A265]"
                        : "border-border w-20 h-20 opacity-60 group-hover:opacity-100 group-hover:border-muted dark:border-[#2a2418] dark:group-hover:border-[#555]"
                    }`}
                  >
                    {(i === 0 || i === stops.length - 1) && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-[0_4px_15px_color-mix(in srgb, var(--accent) %, transparent)] flex items-center gap-1 animate-bounce z-20 after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:border-l-[5px] after:border-l-transparent after:border-r-[5px] after:border-r-transparent after:border-t-[5px] after:border-t-[var(--accent)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
                        </svg>
                        {i === 0 ? "Start" : "Finish"}
                      </div>
                    )}
                    <img
                      src={imgUrl}
                      alt={stop.activity.activity_name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    {!isActive && !isPast && (
                      <div className="absolute inset-0 rounded-full bg-foreground/20 transition-colors group-hover:bg-foreground/10 dark:bg-black/50 dark:group-hover:bg-black/20" />
                    )}

                    {/* Rating Badge */}
                    {stop.activity.rating != null && stop.activity.rating > 0 && (
                      <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 shadow-xl dark:border-white/10 dark:bg-black/80">
                        <Star size={10} className="text-accent" fill="currentColor" />
                        <span className="text-[10px] font-bold text-foreground dark:text-white">{stop.activity.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className={`mt-4 flex max-w-[11rem] flex-col items-center px-1 text-center transition-all ${
                    isActive ? "scale-105 opacity-100" : "opacity-90 group-hover:opacity-100 dark:opacity-70"
                  }`}>
                    <span className="break-words text-[13px] font-bold leading-snug text-foreground dark:text-white">
                      {stop.activity.activity_name}
                    </span>
                    <span className="mt-1 text-[11px] font-medium text-muted">
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
