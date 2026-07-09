"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, MapPin, Star, X } from "lucide-react";
import type { TripDestination } from "@/types/trip";
import {
  buildCurvedPath,
  buildPartialPath,
  buildRoadmapStops,
  computeRoadmapLayout,
  getActivityIcon,
  getActivityTypeLabel,
  type RoadmapPoint,
  type RoadmapStop,
} from "@/lib/trip-roadmap";

interface InteractiveRoadmapProps {
  destinations: TripDestination[];
  seed: string;
}

export function InteractiveRoadmap({ destinations, seed }: InteractiveRoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stops = useMemo(() => buildRoadmapStops(destinations), [destinations]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(
    () => computeRoadmapLayout({ count: stops.length, width, seed }),
    [stops.length, width, seed]
  );

  const { points, height, canvasWidth, nodeSize, labelWidth } = layout;
  const pathData = useMemo(() => buildCurvedPath(points), [points]);
  const activePathData = useMemo(
    () => buildPartialPath(points, activeIndex),
    [points, activeIndex]
  );

  const activeStop = activeIndex >= 0 ? stops[activeIndex] ?? null : null;

  const selectIndex = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(index, stops.length - 1)));
    },
    [stops.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        selectIndex(activeIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        selectIndex(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, selectIndex]);

  if (!stops.length) {
    return (
      <div className="rounded-xl border border-[#2a2418] bg-[#0c0a08] py-16 text-center">
        <MapPin size={24} className="text-[#444] mx-auto mb-3" />
        <p className="text-sm text-[#888]">No places to map yet</p>
      </div>
    );
  }

  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const progressPct =
    activeIndex >= 0 && stops.length > 1 ? (activeIndex / (stops.length - 1)) * 100 : 0;
  const labelOffset = nodeSize / 2 + 22;
  const fontScale = nodeSize <= 56 ? "text-[9px]" : nodeSize <= 72 ? "text-[10px]" : "text-[11px]";

  return (
    <div className="space-y-4">
      <div className="text-center px-2">
        <p className="text-accent text-base sm:text-lg font-clash font-bold">
          خطة رحلتك الفريدة جاهزة!
        </p>
        <p className="text-[#777] text-xs mt-1">
          {stops.length} محطات · مسارك الأثري من البداية للنهاية
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5">
          <NavOrb onClick={() => selectIndex(activeIndex - 1)} disabled={activeIndex === 0}>
            <ChevronLeft size={15} />
          </NavOrb>
          <NavOrb
            onClick={() => selectIndex(activeIndex + 1)}
            disabled={activeIndex === stops.length - 1}
          >
            <ChevronRight size={15} />
          </NavOrb>
        </div>
        <div className="flex-1 h-0.5 rounded-full bg-[#1a1610] overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-[#8B7355] via-[#C4A265] to-accent transition-[width] duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-[10px] text-[#666] tabular-nums shrink-0">
          {activeIndex + 1}/{stops.length}
        </span>
      </div>

      {/* Map — fits viewport, no horizontal scroll */}
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl">
        <div
          className="relative w-full border border-[#C4A265]/20 rounded-2xl overflow-hidden"
          style={{ height: height + 24 }}
        >
          <ArchaeologicalBackdrop seed={seed} />

          <OrnateFrame />

          <div className="relative w-full" style={{ height: height + 8 }}>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${canvasWidth} ${height + 8}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pathGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B7355" />
                  <stop offset="50%" stopColor="#C4A265" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
              <path
                d={pathData}
                fill="none"
                stroke="#3d3428"
                strokeWidth={1.5}
                strokeDasharray="3 9"
                strokeLinecap="round"
                opacity={0.55}
              />
              {activePathData && (
                <path
                  d={activePathData}
                  fill="none"
                  stroke="url(#pathGold)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
            </svg>

            {startPoint && (
              <PathLabel
                point={{ x: startPoint.x, y: startPoint.y - labelOffset }}
                text="START"
                sub="بداية الرحلة"
              />
            )}

            {stops.map((stop, index) => (
              <JourneyNode
                key={stop.id}
                stop={stop}
                point={points[index]}
                nodeSize={nodeSize}
                labelWidth={labelWidth}
                fontScale={fontScale}
                isActive={activeIndex === index}
                isHovered={hoveredId === stop.id}
                isDimmed={hoveredId !== null && hoveredId !== stop.id}
                onHover={setHoveredId}
                onSelect={() => selectIndex(index)}
              />
            ))}

            {endPoint && (
              <PathLabel
                point={{ x: endPoint.x, y: endPoint.y - labelOffset }}
                text="FINISH"
                sub="نهاية الرحلة"
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeStop && (
          <StopDetail
            key={activeStop.id}
            stop={activeStop}
            index={activeIndex}
            total={stops.length}
            onClose={() => setActiveIndex(-1)}
            onPrev={() => selectIndex(activeIndex - 1)}
            onNext={() => selectIndex(activeIndex + 1)}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < stops.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Realistic desert-night / archaeological map backdrop */
function ArchaeologicalBackdrop({ seed }: { seed: string }) {
  const stars = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return Array.from({ length: 28 }, (_, i) => ({
      left: `${Math.abs((h * (i + 1)) % 98) + 1}%`,
      top: `${Math.abs((h * (i + 7)) % 55) + 2}%`,
      size: (Math.abs(h + i) % 2) + 1,
      opacity: 0.12 + (Math.abs(h + i * 5) % 25) / 100,
    }));
  }, [seed]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Desert dusk gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#12100e] via-[#0e0c0a] to-[#1a1410]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,162,101,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(80,60,40,0.15),transparent_50%)]" />

      {/* Horizon silhouette — dunes / plateau */}
      <div
        className="absolute bottom-0 inset-x-0 h-[28%] opacity-[0.07]"
        style={{
          background: "linear-gradient(to top, #C4A265 0%, transparent 100%)",
          clipPath:
            "polygon(0% 100%, 0% 60%, 8% 45%, 18% 55%, 28% 35%, 38% 50%, 50% 30%, 62% 48%, 72% 38%, 82% 52%, 92% 42%, 100% 58%, 100% 100%)",
        }}
      />

      {/* Fine sand grain */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sparse stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#E8DCC4]"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}

function OrnateFrame() {
  return (
    <>
      <div className="absolute inset-2 rounded-xl border border-[#C4A265]/12 pointer-events-none" />
      <svg
        className="absolute top-3 left-3 text-[#C4A265]/25 pointer-events-none"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M1 1h8v1.5H2.5v6.5H1V1z" fill="currentColor" />
      </svg>
      <svg
        className="absolute top-3 right-3 text-[#C4A265]/25 pointer-events-none scale-x-[-1]"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M1 1h8v1.5H2.5v6.5H1V1z" fill="currentColor" />
      </svg>
      <svg
        className="absolute bottom-3 right-3 text-[#C4A265]/25 pointer-events-none scale-x-[-1] scale-y-[-1]"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M1 1h8v1.5H2.5v6.5H1V1z" fill="currentColor" />
      </svg>
      <svg
        className="absolute bottom-3 left-3 text-[#C4A265]/25 pointer-events-none scale-y-[-1]"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M1 1h8v1.5H2.5v6.5H1V1z" fill="currentColor" />
      </svg>
    </>
  );
}

function NavOrb({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-full border border-[#3d3428] bg-[#141010] flex items-center justify-center text-[#C4A265] hover:border-[#C4A265]/40 hover:text-accent transition-colors disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function PathLabel({
  point,
  text,
  sub,
}: {
  point: RoadmapPoint;
  text: string;
  sub: string;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
      style={{ left: point.x, top: point.y }}
    >
      <span className="text-[10px] font-bold tracking-[0.15em] text-[#C4A265]">{text}</span>
      <span className="text-[8px] text-[#666] mt-0.5">{sub}</span>
    </div>
  );
}

function JourneyNode({
  stop,
  point,
  nodeSize,
  labelWidth,
  fontScale,
  isActive,
  isHovered,
  isDimmed,
  onHover,
  onSelect,
}: {
  stop: RoadmapStop;
  point: RoadmapPoint;
  nodeSize: number;
  labelWidth: number;
  fontScale: string;
  isActive: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
}) {
  const { activity } = stop;
  const ActivityIcon = getActivityIcon(activity.activity_type);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(stop.id)}
      onMouseLeave={() => onHover(null)}
      className="absolute z-20 flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A265]/40 transition-opacity duration-400"
      style={{
        left: point.x,
        top: point.y,
        transform: "translate(-50%, -50%)",
        opacity: isDimmed ? 0.35 : 1,
      }}
    >
      <div
        className="relative rounded-full transition-transform duration-400"
        style={{
          width: nodeSize,
          height: nodeSize,
          transform: isActive || isHovered ? "scale(1.05)" : "scale(1)",
          boxShadow: isActive
            ? "0 0 24px rgba(196,162,101,0.35), inset 0 0 16px rgba(255,255,255,0.06)"
            : "0 0 12px rgba(196,162,101,0.15)",
        }}
      >
        <div className="absolute inset-0 rounded-full border border-[#C4A265]/60 p-[2px]">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-[#8B7355]/30">
            {activity.image_url ? (
              <Image
                src={activity.image_url}
                alt={activity.activity_name}
                fill
                sizes={`${nodeSize}px`}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#141010] text-[#C4A265]">
                <ActivityIcon size={Math.max(18, nodeSize * 0.35)} />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />
          </div>
        </div>

        {activity.rating != null && nodeSize >= 56 && (
          <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 px-1 py-px rounded-full bg-[#0e0c0a]/90 border border-[#C4A265]/25 text-[8px] text-[#C4A265]">
            <Star size={7} fill="#C4A265" />
            {activity.rating}
          </span>
        )}
      </div>

      <div className="mt-1.5 text-center" style={{ width: labelWidth }}>
        <p className={`${fontScale} font-semibold text-accent leading-tight line-clamp-2`}>
          {activity.activity_name}
        </p>
        <p className="text-[8px] text-[#666] mt-0.5 truncate">
          {stop.city} · يوم {stop.dayNumber}
        </p>
      </div>
    </button>
  );
}

function StopDetail({
  stop,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  stop: RoadmapStop;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const { activity } = stop;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-[#C4A265]/20 overflow-hidden bg-[#0e0c0a]"
    >
      <div className="flex flex-col sm:flex-row">
        {activity.image_url && (
          <div className="relative w-full sm:w-48 h-40 sm:min-h-[160px] shrink-0">
            <Image src={activity.image_url} alt={activity.activity_name} fill sizes="192px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#0e0c0a] hidden sm:block" />
          </div>
        )}
        <div className="flex-1 p-4 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[#666] hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X size={14} />
          </button>

          <p className="text-[10px] tracking-widest text-[#8B7355] mb-1">
            المحطة {index + 1} من {total}
          </p>
          <h3 className="text-base font-clash font-bold text-accent">
            {activity.activity_name}
          </h3>
          <p className="text-xs text-[#666] mt-1 flex items-center gap-1">
            <MapPin size={10} /> {stop.city} · يوم {stop.dayNumber}
          </p>
          <p className="text-[10px] text-[#8B7355] mt-1">
            {getActivityTypeLabel(activity.activity_type)}
            {activity.rating != null && ` · ⭐ ${activity.rating}`}
          </p>

          {activity.description && (
            <p className="text-sm text-[#999] mt-2 leading-relaxed">{activity.description}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#2a2418] text-xs text-[#888]">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} className="text-[#C4A265]" />
              {activity.start_time}–{activity.end_time} · {activity.duration_hours}h
            </span>
            {activity.estimated_cost != null && (
              <span className="text-accent">~{activity.estimated_cost} EGP</span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="flex-1 py-1.5 rounded-lg border border-[#2a2418] text-xs text-[#888] hover:text-[#C4A265] disabled:opacity-30"
            >
              ← السابق
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="flex-1 py-1.5 rounded-lg border border-[#C4A265]/30 bg-[#C4A265]/8 text-xs text-accent disabled:opacity-30"
            >
              التالي →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
