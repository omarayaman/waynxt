"use client";

import React, { useState } from "react";
import NavbarHome from "../NavbarHome";
import { 
  Search, Sparkles, Landmark, Waves, Diamond, Moon, Building2, 
  SlidersHorizontal, Check, ChevronDown, Heart, MapPin, Map 
} from "lucide-react";

interface Place {
  id: string;
  image: string;
  matchScore: number;
  location: string;
  title: string;
  description: string;
  isSaved?: boolean;
}

// All cards will share this single placeholder image for now as requested
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const MOCK_PLACES: Place[] = [
  {
    id: "1",
    image: PLACEHOLDER_IMG,
    matchScore: 98,
    location: "GIZA, EGYPT",
    title: "Pyramids of Giza",
    description: "The only surviving ancient wonder, best experienced at sunrise or sunset.",
    isSaved: true
  },
  {
    id: "2",
    image: PLACEHOLDER_IMG,
    matchScore: 95,
    location: "SHARM EL-SHEIKH",
    title: "Ras Mohammed Reserve",
    description: "World-class pristine coral reefs perfect for diving and snorkeling.",
  },
  {
    id: "3",
    image: PLACEHOLDER_IMG,
    matchScore: 92,
    location: "LUXOR",
    title: "Karnak Temple Complex",
    description: "A vast mix of decayed temples, chapels, and pylons built over centuries.",
  },
  {
    id: "4",
    image: PLACEHOLDER_IMG,
    matchScore: 88,
    location: "CAIRO",
    title: "Khan el-Khalili Bazaar",
    description: "Bustling historic souk filled with spices, jewelry, and authentic crafts.",
  },
  {
    id: "5",
    image: PLACEHOLDER_IMG,
    matchScore: 96,
    location: "WESTERN DESERT",
    title: "Siwa Oasis",
    description: "Remote desert paradise known for its crystal-clear salt lakes and dates.",
  },
  {
    id: "6",
    image: PLACEHOLDER_IMG,
    matchScore: 99,
    location: "GIZA",
    title: "Grand Egyptian Museum",
    description: "The largest archaeological museum in the world housing King Tut's treasures.",
  }
];

const FILTER_CATEGORIES = [
  { id: "all", label: "All Experiences", icon: Sparkles },
  { id: "historical", label: "Historical", icon: Landmark },
  { id: "coastal", label: "Coastal", icon: Waves },
  { id: "hidden_gems", label: "Hidden Gems", icon: Diamond },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "museums", label: "Museums", icon: Building2 },
];

const BUDGETS = ["$", "$$", "$$$", "$$$$"];
const REGIONS = ["Cairo", "Giza", "Luxor", "Aswan", "Red Sea", "North Coast"];
const STYLES = ["Solo Traveler", "Couples / Romantic", "Family Friendly", "Adventure"];

export default function ExplorePlacesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBudgets, setActiveBudgets] = useState<string[]>(["$$", "$$$"]);
  const [activeRegions, setActiveRegions] = useState<string[]>(["Cairo", "Giza", "Luxor"]);
  const [activeStyles, setActiveStyles] = useState<string[]>(["Couples / Romantic"]);

  const toggleBudget = (b: string) => {
    setActiveBudgets(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const toggleRegion = (r: string) => {
    setActiveRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const toggleStyle = (s: string) => {
    setActiveStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-poppins flex flex-col">
      <NavbarHome />

      <main className="flex-1 w-full px-4 pt-24 pb-32 relative z-10 flex flex-col items-center">
        
        {/* Search Bar */}
        <div className="w-full max-w-[800px] mt-16 md:mt-24 relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666666]">
            <Search size={20} strokeWidth={1.5} />
          </div>
          <input 
            type="text" 
            placeholder="Explore Egypt... e.g. 'Luxor temples' or 'Red Sea diving'" 
            className="w-full bg-[#0F0F0F] border border-[#222222] rounded-full py-4 pl-14 pr-16 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#DFD616]/50 transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[#1A1805] border border-[#DFD616]/30 flex items-center justify-center text-[#DFD616] hover:bg-[#2A2608] transition-colors">
            <Sparkles size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Filter Chips Top */}
        <div className="w-full max-w-[1300px] mt-12 flex flex-wrap items-center justify-start gap-3 md:gap-4">
          {FILTER_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616]" 
                    : "bg-transparent border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444]"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Main Content Area: Sidebar + Grid */}
        <div className="w-full max-w-[1300px] mx-auto mt-8 flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left: Advanced Filters Sidebar */}
          <div className="w-full lg:w-[280px] shrink-0 bg-[#0a0a0a] border border-[#222222] rounded-3xl p-6 md:p-8 sticky top-24">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <SlidersHorizontal size={20} className="text-[#DFD616]" />
              <h2 className="text-xl font-semibold text-white font-clash">Advanced Filters</h2>
            </div>
            <div className="w-full h-px bg-[#222222] mb-8"></div>

            {/* AI Match Score */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#DFD616]" />
                  <h3 className="font-semibold text-white font-clash">AI Match Score</h3>
                </div>
                <span className="text-[#DFD616] font-bold text-sm">80%+</span>
              </div>
              {/* Custom Slider Track */}
              <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#DFD616] w-[60%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-[#666666] font-medium">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Budget Range */}
            <div className="mb-10">
              <h3 className="font-semibold text-white font-clash mb-4">Budget Range</h3>
              <div className="flex items-center gap-2">
                {BUDGETS.map(b => {
                  const isActive = activeBudgets.includes(b);
                  return (
                    <button 
                      key={b}
                      onClick={() => toggleBudget(b)}
                      className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                        isActive 
                          ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616] font-bold"
                          : "bg-[#151515] border border-[#333333] text-[#666666] font-medium hover:text-white hover:border-[#555555]"
                      }`}
                    >
                      {b}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Region / City */}
            <div className="mb-10">
              <h3 className="font-semibold text-white font-clash mb-4">Region / City</h3>
              <div className="flex flex-col gap-3">
                {REGIONS.map(r => {
                  const isActive = activeRegions.includes(r);
                  return (
                    <div 
                      key={r} 
                      className="flex items-center gap-3 cursor-pointer group" 
                      onClick={() => toggleRegion(r)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isActive 
                          ? "border-[#DFD616] bg-[#DFD616]" 
                          : "border-[#333333] bg-transparent group-hover:border-[#555555]"
                      }`}>
                        {isActive && <Check size={14} className="text-[#0a0a0a] stroke-[3]" />}
                      </div>
                      <span className={`text-sm transition-colors ${
                        isActive ? "font-medium text-white" : "text-[#666666] group-hover:text-[#aaaaaa]"
                      }`}>
                        {r}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <h3 className="font-semibold text-white font-clash mb-4">Travel Style</h3>
              <div className="flex flex-col gap-3">
                {STYLES.map(s => {
                  const isActive = activeStyles.includes(s);
                  return (
                    <div 
                      key={s} 
                      className="flex items-center gap-3 cursor-pointer group" 
                      onClick={() => toggleStyle(s)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isActive 
                          ? "border-[#DFD616] bg-[#DFD616]" 
                          : "border-[#333333] bg-transparent group-hover:border-[#555555]"
                      }`}>
                        {isActive && <Check size={14} className="text-[#0a0a0a] stroke-[3]" />}
                      </div>
                      <span className={`text-sm transition-colors ${
                        isActive ? "font-medium text-white" : "text-[#666666] group-hover:text-[#aaaaaa]"
                      }`}>
                        {s}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Right Side: Cards Grid */}
          <div className="flex-1 w-full min-h-[500px]">
            {/* Grid Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h2 className="text-xl text-white font-medium">
                Discover <span className="text-[#DFD616]">Egypt</span>
                <span className="text-[#666666] text-sm font-normal ml-3">Showing {MOCK_PLACES.length} places</span>
              </h2>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#666666]">Sort by:</span>
                <button className="bg-[#111111] border border-[#222222] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors text-xs font-medium">
                  Top AI Match
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_PLACES.map((place) => (
                <div key={place.id} className="group relative w-full h-[380px] rounded-[2rem] overflow-hidden border border-[#222222] hover:border-[#DFD616]/50 transition-all duration-300 cursor-pointer">
                  {/* Background Image */}
                  <img 
                    src={place.image} 
                    alt={place.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="bg-[#DFD616] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                      <Sparkles size={12} strokeWidth={2.5} />
                      {place.matchScore}% Match
                    </div>
                    <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                      <Heart size={14} className={place.isSaved ? "fill-white" : ""} />
                    </button>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-5 left-4 right-4 z-10">
                    <div className="flex items-center gap-1.5 text-[#DFD616] mb-1.5">
                      <MapPin size={12} strokeWidth={2.5} />
                      <span className="text-[10px] font-bold tracking-widest uppercase">{place.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-clash">{place.title}</h3>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-start gap-2">
                      <Sparkles size={14} className="text-[#DFD616] shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Interactive Map Button */}
            <div className="mt-12 flex justify-center">
              <button className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)]">
                <Map size={16} strokeWidth={2.5} />
                View Interactive Map
              </button>
            </div>
            
          </div>

        </div>

      </main>
    </div>
  );
}
