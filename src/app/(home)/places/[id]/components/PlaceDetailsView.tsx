"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star } from "lucide-react";
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

  return (
    <main className="relative z-10 flex-1 overflow-x-hidden pb-20">
      {/* Hero */}
      <div className="relative h-[48vh] min-h-[360px] max-h-[560px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={place.thumbnail_url || fallbackImage}
          alt={place.name}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/20" />

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

        <div className={`absolute inset-x-0 bottom-0 ${PAGE_GUTTER} pb-8`}>
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs capitalize text-[#ccc] backdrop-blur-sm">
                {place.category}
              </span>
              {place.rating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-[#DFD616] backdrop-blur-sm">
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
                <p className="mt-2 flex items-center gap-1.5 text-sm text-[#aaa] md:text-base">
                  <MapPin size={14} className="text-[#DFD616]" />
                  {place.city}, Egypt
                </p>
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

        <div className="mt-12 border-t border-[#141414] pt-12">
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
    </main>
  );
}
