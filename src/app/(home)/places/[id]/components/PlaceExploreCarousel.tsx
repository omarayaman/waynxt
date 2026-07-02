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
  Star,
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
    <Link
      href={`/places/${place.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] transition-colors hover:border-[#333]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            place.thumbnail_url ||
            "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 z-10">
          <SavePlaceButton placeId={place.id} className="h-9 w-9" iconSize={16} />
        </div>

        {place.rating > 0 && (
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2.5 py-1 text-sm font-medium text-[#DFD616] backdrop-blur-sm">
            <Star size={13} fill="currentColor" />
            {place.rating}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#DFD616]">
            {place.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-[#777]">
            <MapPin size={14} className="shrink-0 text-[#DFD616]" />
            <span className="text-sm">{place.city}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-sm text-[#666]">
          <span className="capitalize">{place.category}</span>
          <span className="text-[#333]">·</span>
          <span className="capitalize">{place.budget_level}</span>
          <span className="text-[#333]">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} />
            {place.duration_needed}h
          </span>
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
