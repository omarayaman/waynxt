"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

interface MapRegion {
  id: string;
  name: string;
  cityFilter: string;
  tagline: string;
  description: string;
  highlights: string[];
  position: { top: string; left: string };
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
    position: { top: "41%", left: "57%" },
  },
  {
    id: "alexandria",
    name: "Alexandria",
    cityFilter: "Alexandria",
    tagline: "Pearl of the Mediterranean",
    description:
      "A coastal city of Greek-Roman heritage, grand libraries, and Mediterranean charm on Egypt's northern shore.",
    highlights: ["Bibliotheca Alexandrina", "Qaitbay Citadel", "Montaza Palace"],
    position: { top: "36%", left: "54%" },
  },
  {
    id: "luxor",
    name: "Luxor",
    cityFilter: "Luxor",
    tagline: "World's greatest open-air museum",
    description:
      "Walk through 4,000 years of pharaonic history across the temples of Karnak, the Valley of the Kings, and the Avenue of Sphinxes.",
    highlights: ["Karnak Temple", "Valley of the Kings", "Luxor Temple"],
    position: { top: "47%", left: "58%" },
  },
  {
    id: "aswan",
    name: "Aswan",
    cityFilter: "Aswan",
    tagline: "Gateway to Nubia",
    description:
      "A serene Nile city of granite quarries, colorful Nubian villages, and the majestic Abu Simbel temples.",
    highlights: ["Abu Simbel", "Philae Temple", "Nubian Village"],
    position: { top: "52%", left: "58%" },
  },
  {
    id: "hurghada",
    name: "Hurghada",
    cityFilter: "Hurghada",
    tagline: "Red Sea paradise",
    description:
      "Crystal-clear waters, world-class diving, and golden beaches along Egypt's stunning Red Sea Riviera.",
    highlights: ["Giftun Island", "Diving & Snorkeling", "Marina Boulevard"],
    position: { top: "45%", left: "62%" },
  },
  {
    id: "sharm",
    name: "Sharm El Sheikh",
    cityFilter: "Sharm El Sheikh",
    tagline: "Sinai's crown jewel",
    description:
      "A resort haven between desert mountains and coral reefs — perfect for diving, relaxation, and desert adventures.",
    highlights: ["Ras Mohammed", "Naama Bay", "Mount Sinai"],
    position: { top: "43%", left: "64%" },
  },
  {
    id: "siwa",
    name: "Siwa Oasis",
    cityFilter: "Siwa",
    tagline: "Desert sanctuary",
    description:
      "A hidden Berber oasis in the Western Desert — salt lakes, ancient oracle temples, and starlit desert skies.",
    highlights: ["Temple of the Oracle", "Salt Lakes", "Great Sand Sea"],
    position: { top: "39%", left: "51%" },
  },
];

export default function InteractiveMapSection() {
  const [activeRegion, setActiveRegion] = useState<MapRegion>(MAP_REGIONS[0]);

  const placesUrl = `/places?cities[]=${encodeURIComponent(activeRegion.cityFilter)}`;

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] py-24 px-4">
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DFD616]/30 bg-[#DFD616]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#DFD616]">
            <MapPin size={14} />
            Explore by Region
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-[44px]">
            Discover Egypt, region by region
          </h2>
          <p className="mx-auto max-w-[600px] text-base text-gray-400 md:text-lg">
            Click a destination on the map to explore its wonders — then dive into
            curated places waiting for you.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Map */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[480px]">
              <Image
                src="/images/worldmap.png"
                alt="Interactive map of Egypt"
                fill
                className="object-cover object-[54%_46%] scale-110 opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-br from-[#050505]/60 via-[#050505]/20 to-[#050505]/70" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_44%,rgba(223,214,22,0.08)_0%,transparent_55%)]" />

              {MAP_REGIONS.map((region) => {
                const isActive = activeRegion.id === region.id;

                return (
                  <button
                    key={region.id}
                    type="button"
                    aria-label={`Explore ${region.name}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveRegion(region)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: region.position.top, left: region.position.left }}
                  >
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-10 w-10 animate-ping rounded-full bg-[#DFD616]/30" />
                      </span>
                    )}
                    <span
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "h-5 w-5 border-[#DFD616] bg-[#DFD616] shadow-[0_0_20px_rgba(223,214,22,0.6)]"
                          : "border-white/80 bg-white/90 hover:scale-125 hover:border-[#DFD616] hover:bg-[#DFD616]"
                      }`}
                    />
                    <span
                      className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                        isActive
                          ? "bg-[#DFD616] text-[#0a0a0a]"
                          : "bg-black/70 text-white/80 backdrop-blur-sm"
                      }`}
                    >
                      {region.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile region chips */}
            <div className="flex gap-2 overflow-x-auto border-t border-white/5 p-4 lg:hidden">
              {MAP_REGIONS.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeRegion.id === region.id
                      ? "bg-[#DFD616] text-[#0a0a0a]"
                      : "border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-[#111111] p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRegion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#DFD616]">
                    {activeRegion.tagline}
                  </p>
                  <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                    {activeRegion.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400 md:text-base">
                    {activeRegion.description}
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Must-see highlights
                  </p>
                  <ul className="flex flex-col gap-2">
                    {activeRegion.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-2.5 text-sm text-gray-300"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#DFD616]" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={placesUrl}
                  className="group mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-[#DFD616] px-6 py-3.5 text-sm font-bold text-[#0a0a0a] transition-all hover:bg-[#EAE121] hover:shadow-[0_0_20px_rgba(223,214,22,0.25)]"
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
