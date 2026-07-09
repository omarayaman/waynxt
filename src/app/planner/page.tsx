"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import PlannerBackground from "./components/PlannerBackground";
import TripWizard from "./components/TripWizard";

export default function PlannerPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground font-poppins dark:bg-black">
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
