"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Landmark, 
  Tent, 
  Sun, 
  TreePine, 
  Building2, 
  Utensils, 
  Activity, 
  Waves, 
  Diamond, 
  Moon
} from "lucide-react";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import type { Place } from "@/types/places";
import { PlaceSection } from "./PlaceSection";

const PAGE_GUTTER = "px-4 sm:px-5 lg:px-6";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  history: Landmark,
  adventure: Tent,
  beach: Sun,
  nature: TreePine,
  religious: Building2,
  food: Utensils,
  wellness: Activity,
  historical: Landmark,
  coastal: Waves,
  hidden_gems: Diamond,
  nightlife: Moon,
  museums: Building2,
};

interface PlaceExploreCarouselProps {
  title: string;
  subtitle: string;
  places: Place[];
  viewAllHref: string;
}

function ExplorePlaceCard({ place }: { place: Place }) {
  return (
    <Link href={`/places/${place.id}`} className="group relative w-full h-[380px] block rounded-[2rem] overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer">
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={place.thumbnail_url || "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
        alt={place.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
      
      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
          <Sparkles size={12} strokeWidth={2.5} />
          {place.rating > 0 ? `${place.rating} Rating` : 'New'}
        </div>
        <SavePlaceButton placeId={place.id} />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-5 left-4 right-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2 font-clash">{place.name}</h3>
        
        <div className="flex flex-wrap items-center gap-2 text-[#888] text-xs font-medium">
          <span className="flex items-center gap-1.5 text-[#ccc]">
            <MapPin size={12} className="text-accent" /> {place.city}
          </span>
          
          {place.category && <span>&middot;</span>}
          {place.category && (() => {
            const CatIcon = CATEGORY_ICONS[place.category.toLowerCase()] || Sparkles;
            return (
              <span className="flex items-center gap-1.5 capitalize">
                <CatIcon size={12} className="text-accent" /> {place.category}
              </span>
            );
          })()}
          
          {place.category && place.budget_level && <span>&middot;</span>}
          {place.budget_level && (
            <span className="flex items-center gap-1.5 capitalize">
              <Diamond size={12} className="text-accent" /> {place.budget_level}
            </span>
          )}
          
          {(place.category || place.budget_level) && place.duration_needed > 0 && <span>&middot;</span>}
          {place.duration_needed > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-accent" /> {place.duration_needed}h
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function PlaceExploreCarousel({
  title,
  subtitle,
  places,
  viewAllHref,
}: PlaceExploreCarouselProps) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);

    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  useEffect(() => {
    if (emblaApi && places.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, places.length]);

  if (places.length === 0) return null;

  return (
    <section className="w-full">
      <div className={`mx-auto max-w-[1280px] ${PAGE_GUTTER}`}>
        <PlaceSection
          title={title}
          subtitle={subtitle}
          action={
            <Link
              href={viewAllHref}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-[var(--accent-hover)]"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          }
        >
          <div className="group/carousel relative">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous places"
              className="absolute -left-1 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition-all hover:border-accent/30 hover:bg-black/90 disabled:pointer-events-none disabled:opacity-0 sm:flex md:-left-2"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next places"
              className="absolute -right-1 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition-all hover:border-accent/30 hover:bg-black/90 disabled:pointer-events-none disabled:opacity-0 sm:flex md:-right-2"
            >
              <ChevronRight size={20} />
            </button>

            <div className="overflow-hidden py-1" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-4 sm:-ml-5">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-[340px] sm:pl-5 md:basis-[360px] lg:basis-[380px]"
                  >
                    <ExplorePlaceCard place={place} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Previous places"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next places"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </PlaceSection>
      </div>
    </section>
  );
}
