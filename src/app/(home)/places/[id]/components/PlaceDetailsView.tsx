"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Map, X } from "lucide-react";
import { InteractiveMap } from "@/components/MapWrapper";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import type { PaginationMeta, Place, Review } from "@/types/places";
import { buildPlaceAskUrl } from "@/lib/placeAskPrompt";
import { PlaceReviewsSection } from "./PlaceReviewsSection";
import { PlaceSidebar } from "./PlaceSidebar";
import { PlaceExploreCarousel } from "./PlaceExploreCarousel";
import { PlaceAiBanner } from "./PlaceAiBanner";
import { PlaceOverviewSection } from "./PlaceOverviewSection";

interface PlaceDetailsViewProps {
  place: Place;
  reviews: Review[];
  reviewsMeta?: PaginationMeta;
  relatedPlaces: Place[];
  cityPlaces: Place[];
}

const PAGE_GUTTER = "px-4 sm:px-5 lg:px-6";

export function PlaceDetailsView({
  place,
  reviews,
  reviewsMeta,
  relatedPlaces,
  cityPlaces,
}: PlaceDetailsViewProps) {
  const totalReviews = reviewsMeta?.total ?? reviews.length;
  const askHref = buildPlaceAskUrl({ name: place.name, city: place.city });
  const fallbackImage =
    "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const duration = 800; // Duration in milliseconds
    const start = window.scrollY;
    const startTime = performance.now();

    function easeInOutQuad(t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    function animateScroll(currentTime: number) {
      const timeElapsed = currentTime - startTime;
      const nextScroll = easeInOutQuad(timeElapsed, start, -start, duration);

      window.scrollTo(0, nextScroll);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, 0); // Ensure it reaches exactly 0
      }
    }

    if (start > 0) {
      requestAnimationFrame(animateScroll);
    }
  }, [place.id]);

  return (
    <main className="relative z-10 flex-1 overflow-x-hidden pb-20">
      {/* Hero */}
      <div className="relative h-[48vh] min-h-[360px] max-h-[560px] w-full overflow-hidden">
        <motion.img
          src={place.thumbnail_url || fallbackImage}
          alt={place.name}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-overlay-from)] via-[var(--hero-overlay-via)] to-black/20" />

        <div className={`absolute inset-x-0 top-0 ${PAGE_GUTTER} pt-5`}>
          <div className="mx-auto max-w-[1280px]">
            <Link
              href="/places"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ArrowLeft size={15} />
              Back
            </Link>
          </div>
        </div>

        <div className={`absolute inset-x-0 bottom-0 ${PAGE_GUTTER} pb-8 `}>
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/70 dark:bg-black/50 px-2.5 py-1 text-xs capitalize font-bold dark:text-white/70 text-black/70 backdrop-blur-sm">
                {place.category}
              </span>
              {place.rating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-black/50 px-2.5 py-1 text-xs font-medium dark:text-white/70 text-black/70 backdrop-blur-sm">
                  <Star size={11} fill="currentColor" />
                  {place.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                  {place.name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60 md:text-base">
                  <MapPin size={14} className="text-accent" />
                  {place.city}, Egypt
                </p>
                <button 
                  onClick={() => setShowMap(true)}
                  className="mt-4 flex w-fit items-center gap-2 rounded-full bg-[#F7EA00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#FCDF69] shadow-sm"
                >
                  <Map size={16} />
                  View on Map
                </button>
              </div>
              <SavePlaceButton
                placeId={place.id}
                className="mb-1 h-11 w-11 border-white/10 bg-black/40"
                iconSize={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`mx-auto max-w-[1280px] ${PAGE_GUTTER}`}>
        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:pt-12">
          <div className="min-w-0 space-y-12">
            <PlaceOverviewSection place={place} />

            <PlaceReviewsSection
              placeId={place.id}
              placeRating={place.rating}
              initialReviews={reviews}
              initialMeta={reviewsMeta}
            />
          </div>

          <aside className="min-w-0">
            <div className="lg:sticky lg:top-24">
              <PlaceSidebar
                place={place}
                totalReviews={totalReviews}
                askHref={askHref}
              />
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-border pt-12">
          <PlaceAiBanner placeName={place.name} city={place.city} />
        </div>
      </div>

      {/* Carousels — full content width, no extra nested padding */}
      <div className="mt-12 space-y-14">
        {cityPlaces.length > 0 && (
          <PlaceExploreCarousel
            title={`More in ${place.city}`}
            subtitle="Other places in the same city"
            places={cityPlaces}
            viewAllHref={`/places?city=${encodeURIComponent(place.city)}`}
          />
        )}

        {relatedPlaces.length > 0 && (
          <PlaceExploreCarousel
            title="Similar places"
            subtitle={`Other ${place.category} destinations`}
            places={relatedPlaces}
            viewAllHref={`/places?category=${encodeURIComponent(place.category)}`}
          />
        )}
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#050505] flex flex-col animate-in fade-in zoom-in-95 duration-200 text-gray-900 dark:text-white pt-[70px]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#222222] bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMap(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white font-medium shadow-sm"
              >
                <ArrowLeft size={18} />
                Back to {place.name}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Map size={20} className="text-accent" />
              <h3 className="font-bold text-gray-900 dark:text-white text-lg font-sans hidden sm:block">Location on Map</h3>
            </div>
          </div>
          <div className="flex-1 w-full relative z-0">
            <InteractiveMap places={[place]} />
          </div>
        </div>
      )}
    </main>
  );
}
