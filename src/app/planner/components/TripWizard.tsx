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
    <div className="flex-1 min-h-0 min-w-0 flex flex-col font-poppins w-full">
      {/* Stepper */}
      <div className="shrink-0 flex items-center justify-center mb-3 sm:mb-4">
        <div className="flex items-center w-full max-w-md">
          {steps.map((s, idx) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;

            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isCompleted || isActive
                        ? "border-[#F7EA00] bg-[#F7EA00]/10 text-[#F7EA00]"
                        : "border-gray-700 text-gray-600"
                    }`}
                  >
                    {isCompleted ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[10px] tracking-wide uppercase font-medium ${
                      isActive ? "text-[#F7EA00]" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-3 mb-5 rounded-full transition-colors ${
                      step > s.num ? "bg-[#F7EA00]/50" : "bg-gray-800"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard card — glass, lets map show through */}
      <div className="flex-1 min-h-0 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 sm:p-5 flex flex-col">
        <div className="text-[#F7EA00] text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4 shrink-0">
          Step 0{step} / 3
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
        </div>
      </div>
    </div>
  );
}
