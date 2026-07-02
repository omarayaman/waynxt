"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Sun, Users } from "lucide-react";
import type { Place } from "@/types/places";
import {
  formatCrowd,
  formatSeason,
  formatSuitableAge,
  formatSuitableFor,
  parseCommaTags,
} from "@/lib/placeLabels";
import { PlaceSection } from "./PlaceSection";

interface PlaceOverviewSectionProps {
  place: Place;
}

const DESCRIPTION_LIMIT = 320;

export function PlaceOverviewSection({ place }: PlaceOverviewSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const suitableFor = parseCommaTags(place.suitable_for).map(formatSuitableFor);
  const suitableAge = parseCommaTags(place.suitable_age).map(formatSuitableAge);
  const isLongDescription = place.description.length > DESCRIPTION_LIMIT;
  const displayDescription =
    expanded || !isLongDescription
      ? place.description
      : `${place.description.slice(0, DESCRIPTION_LIMIT).trim()}…`;

  const metaItems = [
    { icon: Clock, text: `${place.duration_needed}h visit` },
    { icon: Sun, text: formatSeason(place.best_season) },
    { icon: Users, text: formatCrowd(place.crowd_level) },
  ];

  return (
    <PlaceSection title="Overview">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#888]"
        >
          {metaItems.map(({ icon: Icon, text }, index) => (
            <span key={text} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <span className="mr-4 hidden text-[#333] sm:inline">·</span>
              )}
              <Icon size={14} className="text-[#DFD616]" />
              <span className="capitalize text-[#ccc]">{text}</span>
            </span>
          ))}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={expanded ? "full" : "truncated"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl text-base leading-[1.8] text-[#b0b0b0] md:text-lg md:leading-[1.85]"
            >
              {displayDescription}
            </motion.p>
          </AnimatePresence>

          {isLongDescription && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#DFD616] transition-colors hover:text-[#EAE121]"
            >
              {expanded ? "Show less" : "Read more"}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>
          )}
        </motion.div>

        {(suitableFor.length > 0 || suitableAge.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3 border-t border-[#1a1a1a] pt-6"
          >
            {suitableFor.length > 0 && (
              <p className="text-sm leading-relaxed">
                <span className="font-medium text-[#666]">Great for </span>
                <span className="text-[#DFD616]">
                  {suitableFor.join(" · ")}
                </span>
              </p>
            )}
            {suitableAge.length > 0 && (
              <p className="text-sm leading-relaxed">
                <span className="font-medium text-[#666]">Ages </span>
                <span className="text-[#aaa]">{suitableAge.join(" · ")}</span>
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </PlaceSection>
  );
}
