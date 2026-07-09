"use client";

import React from "react";
import { useTripStore } from "@/store/useTripStore";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export default function TripWizard() {
  const { step } = useTripStore();

  const steps = [
    { num: 1, label: "Trip" },
    { num: 2, label: "Style" },
    { num: 3, label: "Timing" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col font-poppins">
      <div className="mb-3 flex shrink-0 items-center justify-center">
        <div className="flex w-full max-w-xs items-center">
          {steps.map((s, idx) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;

            return (
              <React.Fragment key={s.num}>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                      isCompleted || isActive
                        ? "border-foreground bg-surface-elevated text-foreground dark:border-accent dark:bg-accent/10 dark:text-accent"
                        : "border-border bg-surface text-muted dark:border-gray-700 dark:bg-transparent dark:text-gray-600"
                    }`}
                  >
                    {isCompleted ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[9px] font-medium uppercase tracking-wide ${
                      isActive ? "text-foreground dark:text-accent" : "text-muted dark:text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`mx-2 mb-4 h-0.5 flex-1 rounded-full transition-colors ${
                      step > s.num ? "bg-foreground/25 dark:bg-accent/50" : "bg-border dark:bg-gray-800"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated p-3 sm:p-4 dark:border-white/10 dark:bg-black/30 dark:backdrop-blur-sm">
        <div className="mb-2 shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted dark:text-accent">
          Step 0{step} / 3
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
        </div>
      </div>
    </div>
  );
}
