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
} from "lucide-react";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import type { Place } from "@/types/places";
import { PlaceSection } from "./PlaceSection";

const PAGE_GUTTER = "px-4 sm:px-5 lg:px-6";

interface PlaceExploreCarouselProps {
  title: string;
  subtitle: string;
  places: Place[];
  viewAllHref: string;
}

function ExplorePlaceCard({ place }: { place: Place }) {
  return (
    <Link href={`/places/${place.id}`} className="group relative w-full h-[380px] block rounded-[2rem] overflow-hidden border border-[#222222] hover:border-[#DFD616]/50 transition-all duration-300 cursor-pointer">
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
        <div className="bg-[#DFD616] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
          <Sparkles size={12} strokeWidth={2.5} />
          {place.rating > 0 ? `${place.rating} Rating` : 'New'}
        </div>
        <SavePlaceButton placeId={place.id} />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-5 left-4 right-4 z-10">
        <div className="flex items-center gap-3 text-[#DFD616] mb-1.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-widest uppercase">{place.city}</span>
          </div>
          {place.duration_needed > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-widest uppercase">{place.duration_needed} {place.duration_needed === 1 ? 'Hour' : 'Hours'}</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 font-clash">{place.name}</h3>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-start gap-2">
          <Sparkles size={14} className="text-[#DFD616] shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
            {place.description}
          </p>
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
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#DFD616] transition-colors hover:text-[#EAE121]"
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
              className="absolute -left-1 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition-all hover:border-[#DFD616]/30 hover:bg-black/90 disabled:pointer-events-none disabled:opacity-0 sm:flex md:-left-2"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next places"
              className="absolute -right-1 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition-all hover:border-[#DFD616]/30 hover:bg-black/90 disabled:pointer-events-none disabled:opacity-0 sm:flex md:-right-2"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222] text-white disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next places"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222] text-white disabled:opacity-30"
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
