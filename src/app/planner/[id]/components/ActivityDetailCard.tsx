"use client";

import React from "react";
import Image from "next/image";
import { X, Clock, MapPin } from "lucide-react";
import type { RoadmapStop } from "@/lib/trip-roadmap";

interface ActivityDetailCardProps {
  stop: RoadmapStop | null;
  totalActivities: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function ActivityDetailCard({ stop, totalActivities, onPrev, onNext, onClose }: ActivityDetailCardProps) {
  if (!stop) return null;

  const { activity, city, dayNumber, order } = stop;

  return (
    <div className="sticky bottom-4 mt-6 z-40">
      <div className="relative flex flex-col sm:flex-row gap-4 bg-linear-to-br from-[#1B1710] to-[#100E0A] border border-[#C4A265]/40 rounded-2xl p-4 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-[#ffffff10] text-[#888] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Image */}
        {(activity.place?.thumbnail_url || activity.thumbnail_url || activity.image_url) && (
          <div className="relative w-full sm:w-[140px] h-[120px] shrink-0 rounded-xl overflow-hidden border border-[#ffffff10]">
            <Image 
              src={activity.place?.thumbnail_url || activity.thumbnail_url || activity.image_url!} 
              alt={activity.activity_name} 
              fill 
              sizes="140px" 
              className="object-cover" 
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6 sm:pr-0">
          <div className="text-[10.5px] text-[#888] font-medium mb-1">
            Stop {order + 1} of {totalActivities} &middot; {city} &middot; Day {dayNumber}
          </div>
          <h3 className="text-[#DFD616] text-base sm:text-lg font-bold mb-1 truncate">
            {activity.activity_name}
          </h3>
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#aaa] mb-2 truncate">
            <MapPin size={12} className="shrink-0" />
            <span>{city} &middot; {activity.activity_type || "Activity"}</span>
          </div>
          <p className="text-xs text-[#888] leading-relaxed mb-3 line-clamp-3 sm:line-clamp-2">
            {activity.description || "Explore this amazing destination."}
          </p>

          {/* Navigation */}
          <div className="flex gap-2 mt-auto">
            <button 
              onClick={onPrev}
              disabled={order === 0}
              className="flex-1 bg-[#211D10] border border-[#2a2a2a] text-[#aaa] rounded-lg py-2 text-xs font-medium hover:bg-[#2a2515] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Prev
            </button>
            <button 
              onClick={onNext}
              disabled={order === totalActivities - 1}
              className="flex-1 bg-[#DFD616] text-[#0a0a0a] rounded-lg py-2 text-xs font-bold hover:bg-[#EAE121] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
