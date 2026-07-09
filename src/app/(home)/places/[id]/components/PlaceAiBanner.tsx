"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buildPlaceAskUrl } from "@/lib/placeAskPrompt";
import { PlaceSection } from "./PlaceSection";

interface PlaceAiBannerProps {
  placeName: string;
  city: string;
}

export function PlaceAiBanner({ placeName, city }: PlaceAiBannerProps) {
  const askHref = buildPlaceAskUrl({ name: placeName, city });

  return (
    <PlaceSection title="Need more details?">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-surface p-6 md:flex-row md:items-center md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Ask AI about {placeName}
            </p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
              Get highlights, visit tips, and itinerary ideas tailored to this
              destination.
            </p>
          </div>
        </div>
        <Link
          href={askHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Ask AI
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </PlaceSection>
  );
}
