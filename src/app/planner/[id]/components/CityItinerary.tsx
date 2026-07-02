"use client";

import React, { useRef, useEffect } from "react";
import type { TripDestination } from "@/types/trip";
import type { RoadmapStop } from "@/lib/trip-roadmap";
import { MapPin, Clock } from "lucide-react";

interface CityItineraryProps {
  destinations: TripDestination[];
  activeStopId: string | null;
  onSelectStop: (stopId: string) => void;
  stops: RoadmapStop[];
}

export function CityItinerary({ destinations, activeStopId, onSelectStop, stops }: CityItineraryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll active activity into view
  useEffect(() => {
    if (activeStopId && containerRef.current) {
      const activeEl = containerRef.current.querySelector(`[data-activity-id="${activeStopId}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeStopId]);

  return (
    <div className="space-y-4" ref={containerRef}>
      {destinations.map((dest, destIdx) => {
        const days = [...(dest.trip_days ?? [])].sort((a, b) => a.day_number - b.day_number);
        const destColor = destIdx % 2 === 0 ? "#DFD616" : "#FF5D7A"; // Cycle pin colors or use standard gold
        
        return (
          <div key={dest.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* City Header */}
            <div className="flex justify-between items-center p-4 cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(223,214,22,0.5)]" style={{ backgroundColor: "#DFD616" }} />
                <div>
                  <h2 className="text-sm font-bold text-white">{dest.city}</h2>
                  <div className="text-[10px] text-[#666] mt-0.5 capitalize">{dest.theme || "Destination"}</div>
                </div>
              </div>
              <div className="bg-[#1a180e] text-[#DFD616] text-[10px] px-2.5 py-1 rounded-full border border-[#DFD616]/30 font-medium">
                {dest.days_allocated} DAYS
              </div>
            </div>

            {/* Days Block */}
            <div className="px-4 pb-3">
              {days.map((day) => {
                const activities = [...(day.activities ?? [])].sort((a, b) => a.order_in_day - b.order_in_day);
                
                return (
                  <div key={day.id} data-day={day.day_number} className="flex gap-3 mt-1">
                    {/* Day Spine */}
                    <div className="w-8 flex-none flex flex-col items-center pt-2">
                      <div className="text-[9px] text-[#666] font-bold">D{day.day_number}</div>
                      <div className="flex-1 w-[2px] mt-2 mb-1" style={{ background: "repeating-linear-gradient(180deg, #2a2a2a 0 5px, transparent 5px 9px)" }} />
                    </div>

                    {/* Activities List */}
                    <div className="flex-1 flex flex-col gap-2 pb-4 pt-1">
                      {activities.map((activity) => {
                        const isSelected = activeStopId === activity.id;
                        return (
                          <div
                            key={activity.id}
                            data-activity-id={activity.id}
                            onClick={() => onSelectStop(activity.id)}
                            className={`flex justify-between items-center gap-3 rounded-xl p-3 cursor-pointer transition-colors border
                              ${isSelected 
                                ? "bg-[#1B1710] border-[#DFD616]/50 shadow-[0_0_15px_rgba(223,214,22,0.05)]" 
                                : "bg-[#111] border-[#1a1a1a] hover:border-[#333]"
                              }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-1.5 h-1.5 rounded-full flex-none transition-colors ${isSelected ? "bg-[#DFD616]" : "bg-[#333]"}`} />
                              <div className="min-w-0">
                                <div className={`text-xs font-semibold truncate transition-colors ${isSelected ? "text-white" : "text-[#ddd]"}`}>
                                  {activity.activity_name}
                                </div>
                                <div className="text-[9px] text-[#666] mt-0.5 truncate">
                                  {activity.activity_type || "Activity"}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2.5 flex-none text-[10px]">
                              {activity.duration && (
                                <span className={`font-medium ${isSelected ? "text-[#DFD616]" : "text-[#888]"}`}>
                                  {activity.duration}
                                </span>
                              )}
                              <span className="text-[#DFD616]">★ {activity.rating || "4.5"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
