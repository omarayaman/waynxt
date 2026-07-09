"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, ArrowUpRight } from "lucide-react";
import type { RoadmapStop } from "@/lib/trip-roadmap";

interface ActivityDetailCardProps {
  stop: RoadmapStop | null;
  totalActivities: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  className?: string;
}

export function ActivityDetailCard({
  stop,
  totalActivities,
  onPrev,
  onNext,
  onClose,
  className = "",
}: ActivityDetailCardProps) {
  if (!stop) return null;

  const { activity, city, dayNumber, order } = stop;
  const placeId = activity.place?.id ?? activity.place_id;
  const placeHref = placeId ? `/places/${placeId}` : null;
  const imageUrl =
    activity.place?.thumbnail_url || activity.thumbnail_url || activity.image_url;

  const content = (
    <>
      {imageUrl && (
        <div className="relative h-36 w-full shrink-0 overflow-hidden border-b border-border dark:border-white/10">
          <Image
            src={imageUrl}
            alt={activity.activity_name}
            fill
            sizes="360px"
            className={`object-cover ${placeHref ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
          />
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
        <h3 className="mb-2 flex items-start gap-2 text-base font-bold leading-snug text-accent lg:text-lg">
          <span>{activity.activity_name}</span>
          {placeHref && (
            <ArrowUpRight
              size={16}
              className="mt-1 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
            />
          )}
        </h3>
        <div className="mb-3 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={13} className="shrink-0" />
          <span>{city} &middot; {activity.activity_type || "Activity"}</span>
        </div>
        <p className="text-[13px] leading-relaxed text-muted">
          {activity.description || "Explore this amazing destination."}
        </p>
        {placeHref && (
          <p className="mt-3 text-[12px] font-semibold text-accent">
            View place details
          </p>
        )}
      </div>
    </>
  );

  return (
    <aside
      className={`flex max-h-[38vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-white/10 backdrop-blur shadow-[0_12px_40px_color-mix(in_srgb,var(--foreground)_10%,transparent)] lg:max-h-full lg:h-full lg:w-[360px] lg:shrink-0 dark:border-white/10 dark:bg-black/50 dark:backdrop-blur-md ${className}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3 dark:border-white/10">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted">
            Stop {order + 1} of {totalActivities}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {city} &middot; Day {dayNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Close activity details"
        >
          <X size={16} />
        </button>
      </div>

      {placeHref ? (
        <Link
          href={placeHref}
          className="group flex min-h-0 flex-1 flex-col overflow-hidden transition-colors hover:bg-surface-elevated/20 dark:hover:bg-white/5"
        >
          {content}
        </Link>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{content}</div>
      )}

      <div className="flex shrink-0 gap-2 border-t border-border p-3 dark:border-white/10">
        <button
          type="button"
          onClick={onPrev}
          disabled={order === 0}
          className="flex-1 rounded-xl border border-border bg-surface-elevated py-2 text-[12px] font-semibold text-muted transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/50"
        >
          &larr; Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={order === totalActivities - 1}
          className="flex-1 rounded-xl bg-accent py-2 text-[12px] font-bold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next &rarr;
        </button>
      </div>
    </aside>
  );
}
