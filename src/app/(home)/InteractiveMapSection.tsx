"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { RegionMap } from "@/components/RegionMap";

interface MapRegion {
  id: string;
  name: string;
  cityFilter: string;
  tagline: string;
  description: string;
  highlights: string[];
  imageUrl: string;
}

const MAP_REGIONS: MapRegion[] = [
  {
    id: "cairo",
    name: "Cairo & Giza",
    cityFilter: "Cairo",
    tagline: "The heart of Egypt",
    description:
      "Home to the Pyramids of Giza, the Egyptian Museum, and the vibrant streets of Islamic Cairo — where ancient wonders meet modern energy.",
    highlights: ["Pyramids of Giza", "Khan el-Khalili", "Citadel of Saladin"],
    imageUrl: "/images/history.png",
  },
  {
    id: "alexandria",
    name: "Alexandria",
    cityFilter: "Alexandria",
    tagline: "Pearl of the Mediterranean",
    description:
      "A coastal city of Greek-Roman heritage, grand libraries, and Mediterranean charm on Egypt's northern shore.",
    highlights: ["Bibliotheca Alexandrina", "Qaitbay Citadel", "Montaza Palace"],
    imageUrl: "/images/alexandria.jpg",
  },
  {
    id: "luxor",
    name: "Luxor",
    cityFilter: "Luxor",
    tagline: "World's greatest open-air museum",
    description:
      "Walk through 4,000 years of pharaonic history across the temples of Karnak, the Valley of the Kings, and the Avenue of Sphinxes.",
    highlights: ["Karnak Temple", "Valley of the Kings", "Luxor Temple"],
    imageUrl: "/images/karnak.png",
  },
  {
    id: "aswan",
    name: "Aswan",
    cityFilter: "Aswan",
    tagline: "Gateway to Nubia",
    description:
      "A serene Nile city of granite quarries, colorful Nubian villages, and the majestic Abu Simbel temples.",
    highlights: ["Abu Simbel", "Philae Temple", "Nubian Village"],
    imageUrl: "/images/aswan.jpg",
  },
  {
    id: "hurghada",
    name: "Hurghada",
    cityFilter: "Hurghada",
    tagline: "Red Sea paradise",
    description:
      "Crystal-clear waters, world-class diving, and golden beaches along Egypt's stunning Red Sea Riviera.",
    highlights: ["Giftun Island", "Diving & Snorkeling", "Marina Boulevard"],
    imageUrl: "/images/hurghada.jpg",
  },
  {
    id: "sharm",
    name: "Sharm El Sheikh",
    cityFilter: "Sharm El Sheikh",
    tagline: "Sinai's crown jewel",
    description:
      "A resort haven between desert mountains and coral reefs — perfect for diving, relaxation, and desert adventures.",
    highlights: ["Ras Mohammed", "Naama Bay", "Mount Sinai"],
    imageUrl: "/images/sharm.jpg",
  },
  {
    id: "siwa",
    name: "Siwa Oasis",
    cityFilter: "Siwa",
    tagline: "Desert sanctuary",
    description:
      "A hidden Berber oasis in the Western Desert — salt lakes, ancient oracle temples, and starlit desert skies.",
    highlights: ["Temple of the Oracle", "Salt Lakes", "Great Sand Sea"],
    imageUrl: "/images/siwa_oasis.jpg",
  },
];

export default function InteractiveMapSection() {
  const [activeRegion, setActiveRegion] = useState<MapRegion>(MAP_REGIONS[0]);

  const placesUrl = `/places?cities[]=${encodeURIComponent(activeRegion.cityFilter)}`;

  return (
    <section className="relative w-full overflow-hidden bg-background py-24 px-4">
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-subtle px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <MapPin size={14} />
            Explore by Region
          </span>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-[44px]">
            Discover Egypt, region by region
          </h2>
          <p className="mx-auto max-w-[600px] text-base text-muted md:text-lg">
            Select a destination to explore its wonders — and interact with the map to discover curated places waiting for you.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.8fr_1fr]">
          {/* Map */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-lg dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-2xl">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[480px] flex-1">
              <RegionMap 
                regions={MAP_REGIONS} 
                activeRegion={activeRegion} 
                onRegionSelect={setActiveRegion} 
              />
            </div>

            {/* Region chips - Now visible on all screens since we removed the floating map buttons */}
            <div className="flex flex-wrap gap-2 justify-center border-t border-border p-4 dark:border-white/5 bg-background/80 backdrop-blur-sm z-10">
              {MAP_REGIONS.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeRegion.id === region.id
                      ? "bg-accent text-accent-foreground"
                      : "border border-border text-muted hover:text-foreground hover:border-accent"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-center rounded-3xl border border-border bg-surface-elevated p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRegion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div className="relative w-full h-40 sm:h-48 mb-2 overflow-hidden rounded-2xl">
                  <Image 
                    src={activeRegion.imageUrl} 
                    alt={activeRegion.name} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
                    {activeRegion.tagline}
                  </p>
                  <h3 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    {activeRegion.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted md:text-base">
                    {activeRegion.description}
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
                    Must-see highlights
                  </p>
                  <ul className="flex flex-col gap-2">
                    {activeRegion.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-2.5 text-sm text-foreground/80"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={placesUrl}
                  className="group mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent-hover hover:shadow-[0_4px_24px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
                >
                  Explore {activeRegion.name.split(" ")[0]}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
