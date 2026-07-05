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
    <div className="shrink-0 mt-4 z-40">
      <div className="relative flex flex-col sm:flex-row gap-4 bg-linear-to-br from-[#111] to-black border border-[#1a1a1a] rounded-2xl p-4 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[#ffffff10] text-[#888] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Image */}
        {(activity.place?.thumbnail_url || activity.thumbnail_url || activity.image_url) && (
          <div className="relative w-full sm:w-[180px] h-[160px] shrink-0 rounded-xl overflow-hidden border border-[#ffffff10]">
            <Image 
              src={activity.place?.thumbnail_url || activity.thumbnail_url || activity.image_url!} 
              alt={activity.activity_name} 
              fill 
              sizes="180px" 
              className="object-cover" 
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 pr-6 sm:pr-2">
          <div className="text-[11px] text-[#888] font-medium mb-1.5">
            Stop {order + 1} of {totalActivities} &middot; {city} &middot; Day {dayNumber}
          </div>
          <h3 className="text-[#DFD616] text-lg sm:text-xl font-bold mb-1.5 truncate pr-4">
            {activity.activity_name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#aaa] mb-3 truncate">
            <MapPin size={14} className="shrink-0" />
            <span>{city} &middot; {activity.activity_type || "Activity"}</span>
          </div>
          <p className="text-[13px] text-[#999] leading-relaxed mb-4 line-clamp-3">
            {activity.description || "Explore this amazing destination."}
          </p>

          {/* Navigation */}
          <div className="flex gap-3 mt-auto">
            <button 
              onClick={onPrev}
              disabled={order === 0}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-[#aaa] rounded-xl py-2.5 text-[13px] font-semibold hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Prev
            </button>
            <button 
              onClick={onNext}
              disabled={order === totalActivities - 1}
              className="flex-1 bg-[#DFD616] text-[#0a0a0a] rounded-xl py-2.5 text-[13px] font-bold hover:bg-[#EAE121] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
