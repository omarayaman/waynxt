"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePopularPlaces } from "@/hooks/usePopularPlaces";
import { PlaceCard } from "./places/components/PlaceCard";

function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#141414]">
      <div className="aspect-[16/10] animate-pulse bg-[#111]" />
      <div className="space-y-2 p-3.5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#111]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#111]" />
      </div>
    </div>
  );
}

export default function FeaturedPlacesSection() {
  const { places, isLoading, error } = usePopularPlaces({ limit: 6 });

  return (
    <section className="w-full bg-[#050505] px-4 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DFD616]/30 bg-[#DFD616]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#DFD616]">
              Top Destinations
            </span>
            <h2 className="mb-3 text-4xl font-bold text-white md:text-[44px]">
              Places worth visiting
            </h2>
            <p className="max-w-[520px] text-base text-gray-400 md:text-lg">
              Hand-picked destinations loved by travelers — explore history,
              nature, and culture across Egypt.
            </p>
          </div>

          <Link
            href="/places"
            className="mt-6 inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#DFD616] transition-colors hover:text-[#EAE121] sm:mt-0"
          >
            View all places
            <ArrowRight size={16} />
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {isLoading
            ? [...Array(6)].map((_, i) => <PlaceCardSkeleton key={i} />)
            : places.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.07, 0.35),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <PlaceCard place={place} />
                </motion.div>
              ))}
        </div>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <Loader2 size={20} className="animate-spin text-[#555]" />
          </div>
        )}

        {!isLoading && places.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/places"
              className="inline-flex items-center gap-3 rounded-xl border border-[#DFD616]/30 bg-[#DFD616]/10 px-8 py-4 text-sm font-bold text-[#DFD616] transition-all hover:bg-[#DFD616] hover:text-[#0a0a0a]"
            >
              Explore All {places.length}+ Places
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
