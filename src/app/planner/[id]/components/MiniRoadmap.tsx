"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { TripDestination } from "@/types/trip";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniRoadmapProps {
  destinations: TripDestination[];
  activeDayNumber: number | null;
  onSelectDay: (dayNumber: number) => void;
}

// Fallback images for famous Egyptian cities
function getCityImage(city: string, firstActivityImage?: string): string {
  if (firstActivityImage) return firstActivityImage;
  const c = city.toLowerCase();
  if (c.includes("cairo")) return "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=300&auto=format&fit=crop"; // Pyramids
  if (c.includes("luxor")) return "https://images.unsplash.com/photo-1599813535948-2b81048f0cb1?q=80&w=300&auto=format&fit=crop"; // Temple
  if (c.includes("aswan")) return "https://images.unsplash.com/photo-1596706798083-d9223126f556?q=80&w=300&auto=format&fit=crop"; // Nile
  if (c.includes("alexandria")) return "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=300&auto=format&fit=crop"; // Citadel
  if (c.includes("hurghada") || c.includes("sharm") || c.includes("dahab")) return "https://images.unsplash.com/photo-1568853241513-e406361a9333?q=80&w=300&auto=format&fit=crop"; // Red Sea
  // Generic beautiful destination
  return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=300&auto=format&fit=crop";
}

export function MiniRoadmap({ destinations, activeDayNumber, onSelectDay }: MiniRoadmapProps) {
  const days = destinations.flatMap((dest) => 
    [...(dest.trip_days ?? [])]
      .sort((a, b) => a.day_number - b.day_number)
      .map(day => ({ dest, day }))
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Optionally scroll to the active day automatically
  useEffect(() => {
    if (!emblaApi || activeDayNumber === null) return;
    const index = days.findIndex(d => d.day.day_number === activeDayNumber);
    if (index !== -1) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, activeDayNumber, days]);

  return (
    <div className="mb-6 relative group">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm text-[#888] font-semibold">Full Trip Route</h3>
        <span className="text-xs text-[#555]">Tap any stop to jump</span>
      </div>
      
      <div className="relative bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl py-4 overflow-hidden px-2">
        {/* Navigation Buttons */}
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#1a1a1a]"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        
        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#1a1a1a]"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Carousel Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {days.map(({ dest, day }, idx) => {
              const isActive = activeDayNumber === day.day_number;
              const firstAct = day.activities?.[0];
              const imgUrl = getCityImage(dest.city, firstAct?.thumbnail_url || firstAct?.image_url);

              return (
                <div 
                  key={day.id} 
                  className="flex-none flex flex-col items-center w-[100px] relative cursor-pointer group/item"
                  onClick={() => onSelectDay(day.day_number)}
                >
                  {/* Connector Line */}
                  {idx < days.length - 1 && (
                    <div 
                      className="absolute top-[32px] -right-[50px] w-[100px] h-[2px] pointer-events-none z-0"
                      style={{
                        background: "repeating-linear-gradient(90deg, #2a2a2a 0 6px, transparent 6px 11px)",
                      }}
                    />
                  )}
                  
                  {/* Ring & Image */}
                  <div 
                    className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center relative z-10 transition-all duration-300 overflow-hidden
                      ${isActive 
                        ? "border-[#DFD616] shadow-[0_0_15px_rgba(223,214,22,0.4)] scale-110" 
                        : "border-[#1a1a1a] bg-[#111] group-hover/item:border-[#DFD616]/50"
                      }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={dest.city} 
                      className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    
                    {/* Dark overlay when not active */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/10 transition-colors" />
                    )}
                  </div>
                  
                  {/* Labels */}
                  <div className={`text-[11px] text-center mt-3 font-semibold transition-colors ${isActive ? "text-[#DFD616]" : "text-[#888] group-hover/item:text-[#ccc]"}`}>
                    {dest.city}
                  </div>
                  <div className="text-[10px] text-[#555] font-medium mt-0.5">
                    Day {day.day_number}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
