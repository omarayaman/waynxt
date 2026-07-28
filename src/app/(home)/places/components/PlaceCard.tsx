import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Diamond, Clock } from "lucide-react";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import { CATEGORY_ICONS } from "../constants";
import type { Place } from "@/types/places";

interface PlaceCardProps {
  place: Place;
  index: number;
  animateFromIndex?: number;
}

export function PlaceCard({ place, index, animateFromIndex = 0 }: PlaceCardProps) {
  const isNew = index >= animateFromIndex;

  return (
    <Link
      href={`/places/${place.id}`}
      style={isNew ? { animationDelay: `${(index - animateFromIndex) * 100}ms` } : {}}
      className={`group relative w-full h-[350px] block rounded-[2rem] overflow-hidden border border-gray-200 dark:border-[#222222] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]/50 transition-all duration-300 cursor-pointer ${
        isNew ? "animate-slide-stack" : ""
      }`}
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          place.thumbnail_url ||
          "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
        alt={place.name}
        loading={index < 4 ? "eager" : "lazy"}
        fetchPriority={index < 4 ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="bg-[#F7EA00] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
          <Sparkles size={12} strokeWidth={2.5} />
          {place.rating && place.rating > 0 ? `${place.rating} Rating` : "New"}
        </div>
        <SavePlaceButton placeId={place.id} />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-5 left-4 right-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2 font-clash">
          {place.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-gray-300 dark:text-[#888] text-xs font-medium">
          <span className="flex items-center gap-1.5 text-gray-300 dark:text-[#ccc]">
            <MapPin size={12} className="text-[#F7EA00]" /> {place.city}
          </span>

          {place.category && <span>&middot;</span>}
          {place.category &&
            (() => {
              const CatIcon =
                CATEGORY_ICONS[place.category.toLowerCase()] || Sparkles;
              return (
                <span className="flex items-center gap-1.5 capitalize text-gray-300 dark:text-[#ccc]">
                  <CatIcon size={12} className="text-[#F7EA00]" /> {place.category}
                </span>
              );
            })()}

          {place.category && place.budget_level && <span>&middot;</span>}
          {place.budget_level && (
            <span className="flex items-center gap-1.5 capitalize text-gray-300 dark:text-[#ccc]">
              <Diamond size={12} className="text-[#F7EA00]" /> {place.budget_level}
            </span>
          )}

          {(place.category || place.budget_level) &&
            place.duration_needed && place.duration_needed > 0 && (
              <span>&middot;</span>
            )}
          {place.duration_needed && place.duration_needed > 0 && (
            <span className="flex items-center gap-1.5 text-gray-300 dark:text-[#ccc]">
              <Clock size={12} className="text-[#F7EA00]" /> {place.duration_needed}h
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
