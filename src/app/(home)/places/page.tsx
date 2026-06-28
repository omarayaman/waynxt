"use client";

import React, { useState, Suspense } from "react";
import NavbarHome from "../NavbarHome";
import { usePlacesStore } from "@/store/usePlacesStore";
import { usePlaces } from "@/hooks/usePlaces";
import { Pagination } from "@/components/Pagination";
import { 
  Search, Sparkles, Landmark, Waves, Diamond, Moon, Building2, 
  SlidersHorizontal, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, MapPin, Map,
  Loader2
} from "lucide-react";

const FILTER_CATEGORIES = [
  { id: "all", label: "All Experiences", icon: Sparkles },
  { id: "historical", label: "Historical", icon: Landmark },
  { id: "coastal", label: "Coastal", icon: Waves },
  { id: "hidden_gems", label: "Hidden Gems", icon: Diamond },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "museums", label: "Museums", icon: Building2 },
];

const BUDGET_LEVELS = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" }
];

const CITIES = ["Cairo", "Giza", "Luxor", "Aswan"];

const SUITABLE_FOR = [
  { id: "family", label: "Family" },
  { id: "couple", label: "Couple" },
  { id: "solo", label: "Solo" },
  { id: "friends", label: "Friends" }
];

const SEASONS = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
  { id: "winter", label: "Winter" }
];

const CROWD_LEVELS = [
  { id: "quiet", label: "Quiet" },
  { id: "moderate", label: "Moderate" },
  { id: "crowded", label: "Crowded" }
];

const SUITABLE_AGES = [
  { id: "kid", label: "Kids" },
  { id: "teen", label: "Teens" },
  { id: "adult", label: "Adults" },
  { id: "senior", label: "Seniors" }
];

const SORT_OPTIONS = [
  { id: "rating", label: "Rating" },
  { id: "name", label: "Name" },
  { id: "duration_asc", label: "Duration (Shortest)" },
  { id: "duration_desc", label: "Duration (Longest)" }
];

function PlacesContent() {
  const {
    search, setSearch,
    activeCategory, setCategory,
    activeBudgets, toggleBudget,
    activeCities, toggleCity,
    activeSuitableFor, setSuitableFor,
    activeSeason, setSeason,
    activeCrowdLevel, setCrowdLevel,
    activeAge, setAge,
    sortBy, setSortBy,
    currentPage, setCurrentPage,
    perPage
  } = usePlacesStore();

  const { places, meta, isLoading, error } = usePlaces();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const totalPages = meta ? Math.ceil(meta.total / perPage) : 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
            value={search}
            onChange={handleSearchChange}
            placeholder="Explore Egypt... e.g. 'Luxor temples' or 'Red Sea diving'" 
            className="w-full bg-[#0F0F0F] border border-[#222222] rounded-full py-4 pl-14 pr-16 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#DFD616]/50 transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[#1A1805] border border-[#DFD616]/30 flex items-center justify-center text-[#DFD616] hover:bg-[#2A2608] transition-colors">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Filter Chips Top (Category) */}
        <div className="w-full max-w-[1300px] mt-12 flex flex-wrap items-center justify-start gap-3 md:gap-4">
          {FILTER_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => setCategory(cat.id)}
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
          <div className="w-full lg:w-[280px] shrink-0 bg-[#0a0a0a] border border-[#222222] rounded-3xl p-6 md:p-8 lg:sticky top-24 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <SlidersHorizontal size={20} className="text-[#DFD616]" />
              <h2 className="text-xl font-semibold text-white font-clash">Filters</h2>
            </div>
            <div className="w-full h-px bg-[#222222] mb-8"></div>

            {/* City */}
            <div className="mb-8">
              <h3 className="font-semibold text-white font-clash mb-4">City</h3>
              <div className="flex flex-col gap-3">
                {CITIES.map(r => {
                  const isActive = activeCities.includes(r);
                  return (
                    <div 
                      key={r} 
                      className="flex items-center gap-3 cursor-pointer group" 
                      onClick={() => toggleCity(r)}
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

            {/* Budget Range */}
            <div className="mb-8">
              <h3 className="font-semibold text-white font-clash mb-4">Budget Level</h3>
              <div className="flex items-center gap-2">
                {BUDGET_LEVELS.map(b => {
                  const isActive = activeBudgets.includes(b.id);
                  return (
                    <button 
                      key={b.id}
                      onClick={() => toggleBudget(b.id)}
                      className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                        isActive 
                          ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616] font-bold"
                          : "bg-[#151515] border border-[#333333] text-[#666666] font-medium hover:text-white hover:border-[#555555]"
                      }`}
                    >
                      {b.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Suitable For (Single Select) */}
            <div className="mb-8">
              <h3 className="font-semibold text-white font-clash mb-4">Suitable For</h3>
              <div className="flex flex-wrap gap-2">
                {SUITABLE_FOR.map(s => {
                  const isActive = activeSuitableFor === s.id;
                  return (
                    <button 
                      key={s.id}
                      onClick={() => setSuitableFor(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive 
                          ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616] font-medium"
                          : "bg-[#151515] border border-[#333333] text-[#666666] hover:text-white hover:border-[#555555]"
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Suitable Age (Single Select) */}
            <div className="mb-8">
              <h3 className="font-semibold text-white font-clash mb-4">Age Group</h3>
              <div className="flex flex-wrap gap-2">
                {SUITABLE_AGES.map(a => {
                  const isActive = activeAge === a.id;
                  return (
                    <button 
                      key={a.id}
                      onClick={() => setAge(a.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive 
                          ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616] font-medium"
                          : "bg-[#151515] border border-[#333333] text-[#666666] hover:text-white hover:border-[#555555]"
                      }`}
                    >
                      {a.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Best Season (Single Select) */}
            <div className="mb-8">
              <h3 className="font-semibold text-white font-clash mb-4">Best Season</h3>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map(s => {
                  const isActive = activeSeason === s.id;
                  return (
                    <button 
                      key={s.id}
                      onClick={() => setSeason(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive 
                          ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616] font-medium"
                          : "bg-[#151515] border border-[#333333] text-[#666666] hover:text-white hover:border-[#555555]"
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Crowd Level (Single Select) */}
            <div>
              <h3 className="font-semibold text-white font-clash mb-4">Crowd Level</h3>
              <div className="flex flex-wrap gap-2">
                {CROWD_LEVELS.map(c => {
                  const isActive = activeCrowdLevel === c.id;
                  return (
                    <button 
                      key={c.id}
                      onClick={() => setCrowdLevel(c.id)}
                      className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs transition-colors ${
                        isActive 
                          ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616] font-bold"
                          : "bg-[#151515] border border-[#333333] text-[#666666] font-medium hover:text-white hover:border-[#555555]"
                      }`}
                    >
                      {c.label}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
          
          {/* Right Side: Cards Grid */}
          <div className="flex-1 w-full min-h-[500px]">
            {/* Grid Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 relative z-20">
              <h2 className="text-xl text-white font-medium">
                Discover <span className="text-[#DFD616]">Egypt</span>
                {!isLoading && meta && (
                  <span className="text-[#666666] text-sm font-normal ml-3">Showing {meta.total} places</span>
                )}
              </h2>
              
              <div className="flex items-center gap-2 text-sm relative">
                <span className="text-[#666666]">Sort by:</span>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-[#111111] border border-[#222222] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors text-xs font-medium min-w-[140px] justify-between"
                >
                  {SORT_OPTIONS.find(s => s.id === sortBy)?.label || "Select sort"}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Sort Dropdown Menu */}
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#111111] border border-[#222222] rounded-xl shadow-xl overflow-hidden z-50">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          sortBy === opt.id 
                            ? "bg-[#1A1805] text-[#DFD616]" 
                            : "text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
              {isLoading ? (
                // Skeletons
                [...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-[380px] rounded-[2rem] bg-[#111111] border border-[#222222] animate-pulse"></div>
                ))
              ) : places.length === 0 ? (
                // Empty state
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#666666]">
                  <Search size={40} className="mb-4 opacity-20" />
                  <p className="text-lg">No places found matching your filters.</p>
                  <button 
                    onClick={() => usePlacesStore.getState().resetFilters()}
                    className="mt-4 text-[#DFD616] hover:underline text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                // Places
                places.map((place) => (
                  <div key={place.id} className="group relative w-full h-[380px] rounded-[2rem] overflow-hidden border border-[#222222] hover:border-[#DFD616]/50 transition-all duration-300 cursor-pointer">
                    {/* Background Image */}
                    <img 
                      src={place.thumbnail_url || "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={place.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                      <div className="bg-[#DFD616] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                        <Sparkles size={12} strokeWidth={2.5} />
                        {place.rating > 0 ? `${place.rating} Rating` : 'New'}
                      </div>
                      <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                        <Heart size={14} />
                      </button>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-5 left-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 text-[#DFD616] mb-1.5">
                        <MapPin size={12} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{place.city}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 font-clash">{place.name}</h3>
                      
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-start gap-2">
                        <Sparkles size={14} className="text-[#DFD616] shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
              disabled={isLoading} 
            />

            {/* View Interactive Map Button */}
            <div className="mt-12 flex justify-center relative z-10">
              <button className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)]">
                <Map size={16} strokeWidth={2.5} />
                View Interactive Map
              </button>
            </div>
            
          </div>

        </div>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}} />
    </div>
  );
}

export default function ExplorePlacesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 size={32} className="animate-spin text-[#DFD616]" />
      </div>
    }>
      <PlacesContent />
    </Suspense>
  );
}
