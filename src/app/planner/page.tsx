"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import NavbarHome from "@/app/(home)/NavbarHome";
import TripWizard from "./components/TripWizard";

function PlannerBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src="/images/worldmap.png"
        alt=""
        fill
        className="hidden object-cover object-[55%_45%] opacity-0 dark:block dark:opacity-65"
        priority
      />
      <div className="absolute inset-0 hidden dark:block bg-black/50" />
      <div className="absolute inset-0 hidden bg-linear-to-r from-black/70 via-black/35 to-black/55 dark:block" />
      <div className="absolute inset-0 hidden bg-linear-to-t from-black/80 via-transparent to-black/30 dark:block" />

      <div className="absolute left-1/2 top-[38%] h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[120px] dark:bg-accent/15" />
      <div className="absolute right-[8%] top-[55%] h-[280px] w-[320px] rounded-full bg-accent/8 blur-[90px] dark:bg-[#F7EA00]/10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.09)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_88%)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] dark:mask-[radial-gradient(ellipse_at_center,black_25%,transparent_80%)]" />
    </div>
  );
}

export default function PlannerPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground font-poppins dark:bg-black">
      <NavbarHome className="dark:bg-transparent dark:backdrop-blur-none" />

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
        <PlannerBackground />

        <div className="relative z-10 mx-auto mt-[50] flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_48px_color-mix(in_srgb,var(--foreground)_10%,transparent)] dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-md dark:shadow-[0_8px_60px_rgba(0,0,0,0.55)] lg:flex-row">
          <header className="relative flex shrink-0 flex-col justify-center border-b border-border bg-surface-elevated px-5 py-5 sm:px-6 lg:w-[34%] lg:border-b-0 lg:border-r lg:py-6 dark:border-white/10 dark:bg-black/35">
            <div className="absolute inset-0 hidden bg-linear-to-br from-accent/8 via-transparent to-transparent dark:block" />

            <div className="relative flex flex-col gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground dark:border-accent/30 dark:bg-accent/10 dark:text-accent">
                <Sparkles size={18} />
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted dark:border-accent/40 dark:bg-accent/15 dark:text-accent">
                AI Concierge
              </div>

              <h1 className="font-clash text-lg font-bold leading-tight text-foreground sm:text-xl dark:text-white">
                Design Your Perfect{" "}
                <span className="text-accent drop-shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
                  Egyptian Escape
                </span>
              </h1>

              <p className="max-w-sm text-xs leading-relaxed text-muted sm:text-sm dark:text-gray-300">
                Tell us your dreams, and our AI will weave them into an unforgettable itinerary.
              </p>
            </div>
          </header>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background px-4 py-3 sm:px-5 sm:py-4 dark:bg-black/20">
            <TripWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
