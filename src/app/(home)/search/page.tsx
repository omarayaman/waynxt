"use client";

import React from "react";
import NavbarHome from "../NavbarHome";
import { 
  Search, 
  TrendingUp, 
  ScrollText, 
  Palette, 
  Crown, 
  Landmark, 
  TreePine 
} from "lucide-react";

const TRENDING_TAGS = [
  "Pyramids", 
  "Pharaohs", 
  "Cairo museums", 
  "Luxor temples", 
  "Nile cruise", 
  "Ancient Egyptian gods", 
  "Valley of the Kings", 
  "Hieroglyphics"
];

const BROWSE_CATEGORIES = [
  { id: "history", label: "History", icon: ScrollText },
  { id: "art", label: "Art", icon: Palette },
  { id: "pharaohs", label: "Pharaohs", icon: Crown },
  { id: "museums", label: "Museums", icon: Landmark },
  { id: "outdoors", label: "Outdoors", icon: TreePine },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col">
      <NavbarHome />

      <main className="flex-1 w-full px-6 pt-32 pb-24 relative z-10 flex flex-col items-center">
        
        {/* Header Text */}
        <div className="text-center mt-10 md:mt-16 mb-12">
          <h1 className="text-[40px] md:text-[56px] font-medium text-white mb-4">
            Search
          </h1>
          <p className="text-[#888888] text-base md:text-lg">
            Find places, museums, and cultural topics — quickly and clearly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-[800px] relative mb-16">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666666]">
            <Search size={20} strokeWidth={1.5} />
          </div>
          <input 
            type="text" 
            placeholder="Search museums, landmarks, history, culture..." 
            className="w-full bg-[#111111] border border-[#222222] rounded-2xl py-5 pl-14 pr-6 text-base text-white placeholder:text-[#666666] focus:outline-none focus:border-[#DFD616]/50 transition-colors"
          />
        </div>

        {/* Content Container aligned with search bar */}
        <div className="w-full max-w-[800px] flex flex-col gap-16">
          
          {/* Trending Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-[#DFD616]" size={20} strokeWidth={2} />
              <h2 className="text-xl font-medium text-white">Trending</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {TRENDING_TAGS.map((tag) => (
                <button 
                  key={tag}
                  className="px-5 py-2.5 rounded-full bg-[#151515] border border-[#2A2A2A] text-[#CCCCCC] text-sm hover:bg-[#222222] hover:text-white hover:border-[#444444] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Browse Categories Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white">Browse categories</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {BROWSE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button 
                    key={cat.id}
                    className="flex flex-col items-center justify-center gap-4 bg-[#151515] border border-[#2A2A2A] rounded-2xl p-6 hover:bg-[#1A1A1A] hover:border-[#444444] transition-all group h-[140px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#22200A] flex items-center justify-center text-[#DFD616] group-hover:bg-[#2A280D] transition-colors">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-[#CCCCCC] text-sm group-hover:text-white transition-colors">
                      {cat.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

        </div>
      </main>

      {/* Simple Footer just for this page to match image, or we can use the main one. The image shows a simple centered footer. */}
      <footer className="w-full py-8 text-center text-xs text-[#666666] border-t border-[#1A1A1A] mt-auto">
        <span className="text-[#DFD616]">WAYNX</span> — Immersive travel exploration
      </footer>
    </div>
  );
}
