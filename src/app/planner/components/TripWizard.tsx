"use client";

import React from "react";
import { useTripStore } from "@/store/useTripStore";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export default function TripWizard() {
  const { step } = useTripStore();

  const steps = [
    { num: 1, label: "TRIP" },
    { num: 2, label: "STYLE" },
    { num: 3, label: "TIMING" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col font-poppins mt-2">
      
      {/* Top Stepper */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-6 md:gap-8">
          {steps.map((s, idx) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-3">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                      isCompleted || isActive
                        ? "border-[#F7EA00] text-[#F7EA00]" 
                        : "border-gray-600 text-gray-600"
                    }`}
                  >
                    {isCompleted ? "✓" : s.num}
                  </div>
                  <span className={`text-[10px] tracking-widest uppercase font-semibold ${
                    isActive ? "text-[#F7EA00]" : "text-gray-500"
                  }`}>
                    {s.label}
                  </span>
                </div>
                
                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div className="w-16 md:w-24 h-px bg-gray-700 -mt-6"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Card Container */}
      <div className="bg-[#111111] border border-gray-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative">
        <div className="text-[#F7EA00] text-sm font-bold tracking-widest uppercase mb-8">
          STEP 0{step} / 3
        </div>

        {/* Dynamic Step Content */}
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
      </div>
      
    </div>
  );
}
