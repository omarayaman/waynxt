"use client";

import React from "react";
import TripWizard from "./components/TripWizard";

export default function PlannerPage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-x-hidden flex flex-col items-center py-6 px-4 md:px-6">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-6 mt-0">
          <div className="flex items-center gap-2 border border-[#F7EA00]/30 bg-[#F7EA00]/10 text-[#F7EA00] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            <span className="text-sm">✨</span> AI Concierge
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-clash font-bold mb-2 leading-tight">
            Design Your Perfect<br/>
            <span className="text-[#F7EA00] drop-shadow-[0_0_35px_rgba(247,234,0,0.25)]">Egyptian Escape</span>
          </h1>
          
          <p className="text-gray-400 font-poppins text-lg max-w-xl mt-2">
            Tell us your dreams, and our AI will weave them into an unforgettable itinerary.
          </p>
        </div>

        <TripWizard />
      </div>
    </div>
  );
}
