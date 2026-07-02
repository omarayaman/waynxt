"use client";

import React from "react";
import Image from "next/image";
import TripWizard from "./components/TripWizard";

export default function PlannerPage() {
  return (
    <div className="fixed inset-0 text-white overflow-hidden">
      {/* Full-page world map — more visible, Egypt/Africa in frame */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src="/images/worldmap.png"
          alt=""
          fill
          className="object-cover object-[55%_45%] scale-100 opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-black/55" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 py-5 sm:py-6">
        {/* Unified glass panel — header + form feel like one piece */}
        <div className="w-full max-w-7xl h-full max-h-[900px] flex flex-col lg:flex-row rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md shadow-[0_8px_60px_rgba(0,0,0,0.55)] overflow-hidden min-h-0">
          <header className="relative shrink-0 lg:w-[36%] xl:w-[34%] flex flex-col justify-center px-6 sm:px-8 py-6 lg:py-8 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="absolute inset-0 bg-linear-to-br from-[#F7EA00]/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2 border border-[#F7EA00]/40 bg-[#F7EA00]/15 text-[#F7EA00] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase w-fit">
                <span>✨</span> AI Concierge
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-[1.65rem] xl:text-3xl font-clash font-bold leading-tight">
                Design Your Perfect{" "}
                <span className="text-[#F7EA00] drop-shadow-[0_0_28px_rgba(247,234,0,0.35)]">
                  Egyptian Escape
                </span>
              </h1>

              <p className="text-gray-300 font-poppins text-xs sm:text-sm leading-relaxed max-w-sm">
                Tell us your dreams, and our AI will weave them into an unforgettable itinerary.
              </p>
            </div>
          </header>

          <div className="flex-1 min-h-0 min-w-0 flex flex-col p-4 sm:p-5 lg:p-6 bg-black/20">
            <TripWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
