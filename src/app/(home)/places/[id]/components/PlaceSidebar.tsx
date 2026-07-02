"use client";

import Link from "next/link";
import { CalendarPlus, Sparkles, Star } from "lucide-react";
import {
  formatBudget,
  formatCrowd,
  formatSeason,
} from "@/lib/placeLabels";
import type { Place } from "@/types/places";

interface PlaceSidebarProps {
  place: Place;
  totalReviews: number;
  askHref: string;
}

export function PlaceSidebar({ place, totalReviews, askHref }: PlaceSidebarProps) {
  const facts = [
    { label: "City", value: place.city },
    { label: "Budget", value: formatBudget(place.budget_level) },
    { label: "Best season", value: formatSeason(place.best_season) },
    { label: "Crowd", value: formatCrowd(place.crowd_level) },
    { label: "Duration", value: `${place.duration_needed} hours` },
  ];

  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="border-b border-[#1a1a1a] p-6">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-[#DFD616]" fill="currentColor" />
          <span className="text-3xl font-bold text-white">
            {place.rating > 0 ? place.rating.toFixed(1) : "—"}
          </span>
          <span className="text-sm text-[#555]">/ 5</span>
        </div>
        <p className="mt-2 text-sm text-[#666]">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      <ul className="divide-y divide-[#1a1a1a]">
        {facts.map((fact) => (
          <li
            key={fact.label}
            className="flex items-center justify-between px-6 py-3.5 text-sm"
          >
            <span className="text-[#666]">{fact.label}</span>
            <span className="font-medium capitalize text-white">{fact.value}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2.5 border-t border-[#1a1a1a] p-6">
        <Link
          href={askHref}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#DFD616] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#EAE121]"
        >
          <Sparkles size={16} />
          Ask AI
        </Link>
        <Link
          href="/planner"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#222] py-3 text-sm font-medium text-[#999] transition-colors hover:border-[#333] hover:text-white"
        >
          <CalendarPlus size={16} />
          Plan a trip
        </Link>
      </div>
    </div>
  );
}
