"use client";

import React, { useState, useEffect } from "react";
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
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  return (
    <Link
      href={`/places/${place.id}`}
      onClick={() => setIsClicked(true)}
      style={isNew ? { animationDelay: `${(index - animateFromIndex) * 100}ms` } : {}}
      className={`group relative w-full h-[350px] block rounded-[2rem] overflow-hidden p-[3px] transition-all duration-300 cursor-pointer ${
        isNew ? "animate-slide-stack" : ""
      }`}
    >
      {/* Default static border */}
      <div className={`absolute inset-0 rounded-[2rem] border border-gray-200 dark:border-[#222222] group-hover:border-[#F7EA00] dark:group-hover:border-[#F7EA00]/50 transition-colors z-[1] ${isClicked ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* Animated spinning border on click */}
      <div className={`absolute inset-0 z-[0] transition-opacity duration-300 ${isClicked ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#000_50%,transparent_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#F7EA00_50%,transparent_100%)]" />
      </div>

      {/* Inner Card Content */}
      <div className="relative z-10 w-full h-full rounded-[calc(2rem-3px)] overflow-hidden bg-background">
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

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-300 dark:text-[#888] text-xs font-medium mt-1">
          <span className="flex items-center gap-1.5 text-gray-300 dark:text-[#ccc] whitespace-nowrap">
            <MapPin size={12} className="text-[#F7EA00] shrink-0" /> {place.city}
          </span>

          {place.category &&
            (() => {
              const CatIcon =
                CATEGORY_ICONS[place.category.toLowerCase()] || Sparkles;
              return (
                <span className="flex items-center gap-1.5 capitalize text-gray-300 dark:text-[#ccc] whitespace-nowrap">
                  <CatIcon size={12} className="text-[#F7EA00] shrink-0" /> {place.category}
                </span>
              );
            })()}

          {place.budget_level && (
            <span className="flex items-center gap-1.5 capitalize text-gray-300 dark:text-[#ccc] whitespace-nowrap">
              <Diamond size={12} className="text-[#F7EA00] shrink-0" /> {place.budget_level}
            </span>
          )}

          {place.duration_needed && place.duration_needed > 0 && (
            <span className="flex items-center gap-1.5 text-gray-300 dark:text-[#ccc] whitespace-nowrap">
              <Clock size={12} className="text-[#F7EA00] shrink-0" /> {place.duration_needed}h
            </span>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
}
