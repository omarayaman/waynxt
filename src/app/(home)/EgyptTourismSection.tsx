"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GsapButton } from "@/components/GsapButton";
import {
  Globe2,
  Landmark,
  Palmtree,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react";

const STATS = [
  {
    icon: Landmark,
    value: "7",
    label: "UNESCO World Heritage Sites",
    detail: "Pyramids, Luxor, Abu Simbel & more",
  },
  {
    icon: Sparkles,
    value: "5,000+",
    label: "Years of Civilization",
    detail: "The world's oldest continuous culture",
  },
  {
    icon: Waves,
    value: "#1",
    label: "Red Sea Diving",
    detail: "Crystal waters & vibrant coral reefs",
  },
  {
    icon: TrendingUp,
    value: "13M+",
    label: "Annual Visitors",
    detail: "A rising global tourism destination",
  },
] as const;

const HIGHLIGHTS = [
  {
    icon: Globe2,
    title: "One country, every experience",
    text: "Ancient temples, desert oases, Nile cruises, and Red Sea beaches — all within reach.",
  },
  {
    icon: Palmtree,
    title: "Year-round sunshine",
    text: "From winter escapes in Luxor to summer diving in Dahab, Egypt welcomes travelers every season.",
  },
] as const;

export default function EgyptTourismSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-24 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-[780px] text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-subtle px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Globe2 size={14} />
            Why Egypt
          </span>
          <h2 className="mb-5 text-4xl font-bold text-foreground md:text-[48px] leading-tight">
            Where history meets adventure —{" "}
            <span className="text-accent">like nowhere else on Earth</span>
          </h2>
          <p className="text-base leading-relaxed text-muted md:text-lg">
            Egypt isn&apos;t just a destination — it&apos;s a journey through time.
            Stand before the last surviving Wonder of the Ancient World, sail the
            Nile at sunset, and dive into waters that have captivated explorers for
            millennia. No other country offers this depth of culture, mystery, and
            natural beauty in a single trip.
          </p>
        </motion.div>

        <div className="mb-14 grid w-full grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group rounded-2xl border border-border bg-surface-elevated p-5 text-center transition-colors hover:border-accent/40 md:p-6"
            >
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 text-accent transition-transform group-hover:scale-110">
                <stat.icon size={20} strokeWidth={1.5} />
              </div>
              <p className="mb-1 text-2xl font-bold text-accent md:text-3xl">
                {stat.value}
              </p>
              <p className="mb-2 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs leading-relaxed text-muted">{stat.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-12 grid w-full gap-6 md:grid-cols-2">
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex gap-5 rounded-2xl border border-border bg-surface-elevated p-6 md:p-8"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent-subtle text-accent">
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <p className="max-w-[560px] text-sm italic leading-relaxed text-muted md:text-base">
            {"\u201cEgypt is not a country you visit once \u2014 it\u2019s a place that stays with you forever.\u201d"}
          </p>
          <GsapButton
            href="/places"
            className="group inline-flex items-center gap-2 bg-accent after:absolute after:inset-0 after:border-2 after:border-accent after:rounded-xl after:pointer-events-none after:z-[10] font-normal dark:font-medium text-sm px-7 py-3.5 rounded-xl dark:shadow-[0_4px_24px_color-mix(in_srgb,var(--accent)_35%,transparent)] dark:hover:shadow-[0_6px_32px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
            innerBgClass="bg-accent dark:bg-[#0a0a0a]"
            blobClass="bg-white dark:bg-accent"
            magneticFill={true}
          >
            Start Your Egyptian Journey
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </GsapButton>
        </motion.div>
      </div>
    </section>
  );
}
