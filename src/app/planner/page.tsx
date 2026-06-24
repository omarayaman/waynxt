"use client";

import React from "react";
import WhoIsTravelingCard from "./components/WhoIsTravelingCard";
import InterestsCard from "./components/InterestsCard";
import BudgetAndLengthCard from "./components/BudgetAndLengthCard";
import VibeAndSeasonCard from "./components/VibeAndSeasonCard";
import AgeGroupCard from "./components/AgeGroupCard";

export default function PlannerPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden flex flex-col items-center py-12 px-4 md:px-6">
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Header Section */}
        <div className="w-full text-left mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#DFD616] mb-2 tracking-wide">
            Customize your journey
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Design your ideal trip according to your personal preferences.
          </p>
        </div>

        {/* Bento Box Grid - 3 Rows */}
        <div className="w-full flex flex-col gap-4">
          
          {/* Row 1: Interests & Who's Traveling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InterestsCard />
            <WhoIsTravelingCard />
          </div>

          {/* Row 2: Budget/Length & Vibe/Season */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BudgetAndLengthCard />
            <VibeAndSeasonCard />
          </div>

          {/* Row 3: Age Group (Full Width) */}
          <div className="grid grid-cols-1 gap-4">
            <AgeGroupCard />
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="w-full flex items-center justify-between mt-12 border-t border-gray-800 pt-8 pb-4">
          <button className="flex items-center gap-3 border-2 border-[#DFD616] text-[#DFD616] hover:bg-[#DFD616]/10 font-bold py-3 px-8 rounded-full transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-lg">Previous</span>
          </button>

          <button className="flex items-center gap-3 bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-extrabold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)] transform hover:-translate-y-1">
            <span className="text-lg tracking-wide">Discover Next Destination</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
