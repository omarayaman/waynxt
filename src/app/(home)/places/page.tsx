"use client";

import React, { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { usePlacesStore } from "@/store/usePlacesStore";
import { usePlaces } from "@/hooks/usePlaces";
import { Pagination } from "@/components/Pagination";
import { useCategories } from "@/hooks/useCategories";
import {
  Search,
  Sparkles,
  Landmark,
  Waves,
  Diamond,
  Moon,
  Building2,
  SlidersHorizontal,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Map,
  Loader2,
  Tent,
  TreePine,
  Utensils,
  Activity,
  Sun,
  Clock,
  X,
} from "lucide-react";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import { InteractiveMap } from "@/components/MapWrapper";

// We keep the static All Experiences icon for the "all" button
const ALL_EXPERIENCES = { id: "all", label: "All Experiences", icon: Sparkles };

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  history: Landmark,
  adventure: Tent,
  beach: Sun,
  nature: TreePine,
  religious: Building2,
  food: Utensils,
  wellness: Activity,
  // fallbacks
  historical: Landmark,
  coastal: Waves,
  hidden_gems: Diamond,
  nightlife: Moon,
  museums: Building2,
};

const BUDGET_LEVELS = [
  { id: "low", label: "Budget" },
  { id: "medium", label: "Mid-range" },
  { id: "high", label: "Premium" },
];

const ALL_EGYPT_CITIES = [
  "Cairo",
  "Aswan",
  "Luxor",
  "Hurghada",
  "Alexandria",
  "Sharm El-Sheikh",
  "Dahab",
  "Marsa Alam",
  "Giza",
  "Fayoum",
  "Siwa",
  "Nuweiba",
  "Taba",
  "Port Said",
  "Ismailia",
  "Suez",
  "Al Arish",
  "Marsa Matrouh",
  "Ain Sokhna",
  "El Gouna",
  "Saint Catherine",
  "Safaga",
  "Al Quseir",
  "Soma Bay",
  "Makadi Bay",
  "Ras Sedr",
  "Minya",
  "Asyut",
  "Sohag",
];

const SUITABLE_FOR = [
  { id: "family", label: "Family" },
  { id: "couple", label: "Couple" },
  { id: "solo", label: "Solo" },
  { id: "friends", label: "Friends" },
];

const SEASONS = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
  { id: "winter", label: "Winter" },
];

const CROWD_LEVELS = [
  { id: "quiet", label: "Quiet" },
  { id: "moderate", label: "Moderate" },
  { id: "crowded", label: "Crowded" },
];

const SUITABLE_AGES = [
  { id: "kid", label: "Kids" },
  { id: "teen", label: "Teens" },
  { id: "adult", label: "Adults" },
  { id: "senior", label: "Seniors" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated" },
  { id: "name", label: "Name A-Z" },
  { id: "duration_asc", label: "Shortest Visit" },
  { id: "duration_desc", label: "Longest Visit" },
];

function PlacesContent() {
  const {
    search,
    setSearch,
    activeCategory,
    setCategory,
    activeBudgets,
    toggleBudget,
    activeCities,
    toggleCity,
    activeSuitableFor,
    setSuitableFor,
    activeSeason,
    setSeason,
    activeCrowdLevel,
    setCrowdLevel,
    activeAge,
    setAge,
    sortBy,
    setSortBy,
    resetFilters,
  } = usePlacesStore();

  const hasActiveFilters =
    activeCities.length > 0 ||
    activeBudgets.length > 0 ||
    activeSuitableFor !== "" ||
    activeSeason !== "" ||
    activeCrowdLevel !== "" ||
    activeAge !== "" ||
    (activeCategory !== "all" && activeCategory !== "");

  const activeSidebarFiltersCount =
    activeCities.length +
    activeBudgets.length +
    (activeSuitableFor !== "" ? 1 : 0) +
    (activeAge !== "" ? 1 : 0) +
    (activeSeason !== "" ? 1 : 0) +
    (activeCrowdLevel !== "" ? 1 : 0);

  const { places, meta, isLoading, isLoadingMore, error, hasMore, loadMore, animateFromIndex } = usePlaces();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const displayedCities = showAllCities
    ? ALL_EGYPT_CITIES
    : ALL_EGYPT_CITIES.slice(0, 5);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !isLoadingMore
        ) {
          loadMore();
        }
      },
      { root: scrollContainerRef.current, rootMargin: "400px", threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, hasMore, loadMore]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="h-[100dvh] bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-poppins flex flex-col overflow-hidden">
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-4 xl:px-4 pt-[70px] pb-4 flex flex-col overflow-hidden">
        {/* Top Header: Search and Categories */}
        <div className="w-full shrink-0 flex flex-col items-center">
          {/* Search Bar & Map Button */}
          <div className="w-full max-w-[800px] mt-0 flex items-center gap-3 mx-auto">
            <div className="relative flex-1">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#666666]">
                <Search size={20} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Explore Egypt... e.g. 'Luxor temples' or 'Red Sea diving'"
                className="w-full bg-gray-50 dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#222222] rounded-full py-4 pl-14 pr-16 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#666666] focus:outline-none focus:border-[#F7EA00] dark:focus:border-[#F7EA00]/50 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[#F7EA00] dark:bg-[#F7EA00] border border-[#F7EA00] dark:border-[#F7EA00] flex items-center justify-center text-[#0a0a0a] dark:text-[#0a0a0a] hover:bg-[#c2ba12] dark:hover:bg-[#c2ba12] transition-colors shadow-sm">
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
            
            <button 
              onClick={() => setShowMap(true)}
              className="shrink-0 bg-[#F7EA00] dark:bg-[#F7EA00] hover:bg-[#FCDF69] dark:hover:bg-[#FCDF69] text-[#0a0a0a] dark:text-[#0a0a0a] border border-[#F7EA00] dark:border-[#F7EA00] rounded-full h-[54px] w-[54px] sm:w-auto sm:px-4 flex items-center justify-center sm:gap-2 transition-colors shadow-sm font-bold">
              <Map size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline text-sm pr-1">Map View</span>
            </button>
          </div>

          {/* Floating Category Dock */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-[95vw] rounded-[1.25rem] bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1.5 p-1.5 overflow-x-auto custom-scrollbar rounded-[1.25rem]">
              {/* All Experiences Button */}
              <button
                onClick={() => setCategory("all")}
                className={`shrink-0 px-5 py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === "all" || !activeCategory
                    ? "bg-[#F7EA00] dark:bg-[#F7EA00] border border-[#F7EA00] dark:border-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] shadow-sm dark:shadow-[0_0_15px_rgba(223,214,22,0.25)] font-bold"
                    : "bg-transparent border border-transparent text-gray-500 dark:text-[#999999] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <ALL_EXPERIENCES.icon size={16} strokeWidth={1.5} />
                {ALL_EXPERIENCES.label}
              </button>

              {/* Dynamic Categories */}
              {isCategoriesLoading ? (
                <div className="flex gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-28 h-[38px] rounded-xl bg-gray-200 dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                categories.map((cat) => {
                  const isActive = activeCategory === cat.category;
                  const Icon =
                    CATEGORY_ICONS[cat.category.toLowerCase()] || Diamond;

                  return (
                    <button
                      key={cat.category}
                      onClick={() => setCategory(cat.category)}
                      className={`shrink-0 px-5 py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#F7EA00] dark:bg-[#F7EA00] border border-[#F7EA00] dark:border-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] shadow-sm dark:shadow-[0_0_15px_rgba(223,214,22,0.25)] font-bold"
                          : "bg-transparent border border-transparent text-gray-500 dark:text-[#999999] hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="capitalize">{cat.category}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Two-Column Content Layout */}
        <div className="w-full flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Left: Advanced Filters Sidebar */}
          <div className="hidden lg:block w-[180px] xl:w-[220px] shrink-0 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#222222] rounded-3xl h-full overflow-y-auto custom-scrollbar relative">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-gray-50 dark:bg-[#0a0a0a] z-20 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={20} className="text-[#F7EA00] dark:text-[#F7EA00]" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-clash flex items-center gap-2">
                    Filters
                    {activeSidebarFiltersCount > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] text-xs font-bold font-sans">
                        {activeSidebarFiltersCount}
                      </span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={`text-xs font-medium transition-colors ${
                    hasActiveFilters
                      ? "text-[#F7EA00] dark:text-[#F7EA00] hover:text-gray-900 dark:hover:text-white cursor-pointer"
                      : "text-gray-400 dark:text-[#444] cursor-not-allowed"
                  }`}
                >
                  Reset
                </button>
              </div>
              <div className="w-full h-px bg-gray-200 dark:bg-[#222222]"></div>
            </div>

            {/* Scrollable Filters Content */}
            <div className="px-6 pb-6 pt-2">
              {/* City */}
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-white text-xs font-bold tracking-widest uppercase mb-4">
                  CITY
                </h3>
                <div className="flex flex-col gap-3">
                  {displayedCities.map((r) => {
                    const isActive = activeCities.includes(r);
                    return (
                      <div
                        key={r}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => toggleCity(r)}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "border-[#F7EA00] dark:border-[#F7EA00] bg-[#F7EA00] dark:bg-[#F7EA00]"
                              : "border-gray-300 dark:border-[#333333] bg-transparent group-hover:border-gray-400 dark:group-hover:border-[#555555]"
                          }`}
                        >
                          {isActive && (
                            <Check
                              size={14}
                              className="text-[#0a0a0a] stroke-[3]"
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            isActive
                              ? "font-medium text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-[#666666] group-hover:text-gray-700 dark:group-hover:text-[#aaaaaa]"
                          }`}
                        >
                          {r}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {ALL_EGYPT_CITIES.length > 5 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="text-gray-500 dark:text-[#666666] text-xs flex items-center gap-1 mt-4 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {showAllCities
                      ? "Show less"
                      : `Show ${ALL_EGYPT_CITIES.length - 5} more`}
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${showAllCities ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>

              {/* Budget Range */}
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-white text-xs font-bold tracking-widest uppercase mb-4">
                  BUDGET
                </h3>
                <div className="flex flex-col gap-2.5">
                  {BUDGET_LEVELS.map((b) => {
                    const isActive = activeBudgets.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBudget(b.id)}
                        className={`w-fit text-left px-2 py-1 -ml-2 rounded-md text-sm transition-all border ${
                          isActive
                            ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-semibold border-[#F7EA00] dark:border-[#F7EA00]"
                            : "text-gray-500 dark:text-[#888888] border-transparent hover:text-[#F7EA00] dark:hover:text-[#F7EA00] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]"
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suitable For (Single Select) */}
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-white text-xs font-bold tracking-widest uppercase mb-4">
                  TRAVEL STYLE
                </h3>
                <div className="flex flex-col gap-2.5">
                  {SUITABLE_FOR.map((s) => {
                    const isActive = activeSuitableFor === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSuitableFor(s.id)}
                        className={`w-fit text-left px-2 py-1 -ml-2 rounded-md text-sm transition-all border ${
                          isActive
                            ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-semibold border-[#F7EA00] dark:border-[#F7EA00]"
                            : "text-gray-500 dark:text-[#888888] border-transparent hover:text-[#F7EA00] dark:hover:text-[#F7EA00] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suitable Age (Single Select) */}
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-white text-xs font-bold tracking-widest uppercase mb-4">
                  AGE
                </h3>
                <div className="flex flex-col gap-2.5">
                  {SUITABLE_AGES.map((a) => {
                    const isActive = activeAge === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setAge(a.id)}
                        className={`w-fit text-left px-2 py-1 -ml-2 rounded-md text-sm transition-all border ${
                          isActive
                            ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-semibold border-[#F7EA00] dark:border-[#F7EA00]"
                            : "text-gray-500 dark:text-[#888888] border-transparent hover:text-[#F7EA00] dark:hover:text-[#F7EA00] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]"
                        }`}
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Best Season (Single Select) */}
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-white text-xs font-bold tracking-widest uppercase mb-4">
                  SEASON
                </h3>
                <div className="flex flex-col gap-2.5">
                  {SEASONS.map((s) => {
                    const isActive = activeSeason === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSeason(s.id)}
                        className={`w-fit text-left px-2 py-1 -ml-2 rounded-md text-sm transition-all border ${
                          isActive
                            ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-semibold border-[#F7EA00] dark:border-[#F7EA00]"
                            : "text-gray-500 dark:text-[#888888] border-transparent hover:text-[#F7EA00] dark:hover:text-[#F7EA00] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Crowd Level (Single Select) */}
              <div>
                <h3 className="text-gray-800 dark:text-white text-xs font-bold tracking-widest uppercase mb-4">
                  CROWD
                </h3>
                <div className="flex flex-col gap-2.5">
                  {CROWD_LEVELS.map((c) => {
                    const isActive = activeCrowdLevel === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCrowdLevel(c.id)}
                        className={`w-fit text-left px-2 py-1 -ml-2 rounded-md text-sm transition-all border ${
                          isActive
                            ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-semibold border-[#F7EA00] dark:border-[#F7EA00]"
                            : "text-gray-500 dark:text-[#888888] border-transparent hover:text-[#F7EA00] dark:hover:text-[#F7EA00] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Area */}
          <div className="flex-1 h-full flex flex-col relative w-full lg:pr-2">
            {/* Scrollable Content Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-4 pb-28 mt-2">
              {/* Sticky Header Group */}
              <div className="sticky top-0 bg-white dark:bg-[#050505] z-40 py-2 -mt-2 mb-6 flex flex-col gap-4 relative">
                {/* Title & Sort Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h2 className="text-xl text-gray-900 dark:text-white font-medium relative z-10">
                    Discover <span className="text-[#F7EA00] dark:text-[#F7EA00]">Egypt</span>
                    {!isLoading && meta && (
                      <span className="text-gray-500 dark:text-[#666666] text-sm font-normal ml-3">
                        Showing {meta.total} places
                      </span>
                    )}
                  </h2>

                  <div className="flex items-center gap-2 text-sm relative">
                    <span className="text-gray-500 dark:text-[#666666]">Sort by:</span>
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] text-gray-900 dark:text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors text-xs font-medium min-w-[140px] justify-between"
                    >
                      {SORT_OPTIONS.find((s) => s.id === sortBy)?.label ||
                        "Select sort"}
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {/* Sort Dropdown Menu */}
                    {isSortOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] rounded-xl shadow-xl overflow-hidden z-50">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSortBy(opt.id);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                              sortBy === opt.id
                                ? "bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium"
                                : "text-gray-600 dark:text-[#888888] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Filter Chips */}
                {activeSidebarFiltersCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {activeCities.map(city => (
                      <div key={city} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
                        {city}
                        <button onClick={() => toggleCity(city)} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {activeBudgets.map(budget => (
                      <div key={budget} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
                        {BUDGET_LEVELS.find(b => b.id === budget)?.label}
                        <button onClick={() => toggleBudget(budget)} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {activeSuitableFor && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
                        {SUITABLE_FOR.find(s => s.id === activeSuitableFor)?.label}
                        <button onClick={() => setSuitableFor("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    
                    {activeAge && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
                        {SUITABLE_AGES.find(a => a.id === activeAge)?.label}
                        <button onClick={() => setAge("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    
                    {activeSeason && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
                        {SEASONS.find(s => s.id === activeSeason)?.label}
                        <button onClick={() => setSeason("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    
                    {activeCrowdLevel && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
                        {CROWD_LEVELS.find(c => c.id === activeCrowdLevel)?.label}
                        <button onClick={() => setCrowdLevel("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {/* Clear All Button */}
                    <button onClick={resetFilters} className="text-xs text-gray-500 dark:text-[#888888] hover:text-gray-900 dark:hover:text-white ml-2 transition-colors">
                      Clear
                    </button>
                  </div>
                )}
                
                {/* Gradient Shadow Divider */}
                <div className="absolute top-full left-0 right-0 h-6 bg-gradient-to-b from-white dark:from-[#050505] to-transparent pointer-events-none" />
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 relative z-10 w-full pb-10">
                {isLoading ? (
                  // Skeletons
                  [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-[350px] rounded-[2rem] bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-[#222222] animate-pulse"
                    ></div>
                  ))
                ) : places.length === 0 ? (
                  // Empty state
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 dark:text-[#666666]">
                    <Search size={40} className="mb-4 opacity-20" />
                    <p className="text-lg">
                      No places found matching your filters.
                    </p>
                    <button
                      onClick={() => usePlacesStore.getState().resetFilters()}
                      className="mt-4 text-[#F7EA00] dark:text-[#F7EA00] hover:underline text-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  // Places
                  places.map((place, index) => {
                    const isNew = index >= animateFromIndex;
                    return (
                      <Link
                        href={`/places/${place.id}`}
                        key={place.id}
                        style={isNew ? { animationDelay: `${(index - animateFromIndex) * 100}ms` } : {}}
                        className={`group relative w-full h-[350px] block rounded-[2rem] overflow-hidden border border-gray-200 dark:border-[#222222] hover:border-[#F7EA00] dark:hover:border-[#F7EA00]/50 transition-all duration-300 cursor-pointer ${
                          isNew ? "animate-slide-stack" : ""
                        }`}
                      >
                        {/* Background Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          place.thumbnail_url ||
                          "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={place.name}
                        loading={index < 4 ? "eager" : "lazy"}
                        fetchPriority={index < 4 ? "high" : "auto"}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                        <div className="bg-[#F7EA00] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                          <Sparkles size={12} strokeWidth={2.5} />
                          {place.rating > 0 ? `${place.rating} Rating` : "New"}
                        </div>
                        <SavePlaceButton placeId={place.id} />
                      </div>

                      {/* Bottom Content */}
                      <div className="absolute bottom-5 left-4 right-4 z-10">
                        <h3 className="text-xl font-bold text-white mb-2 font-clash">
                          {place.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-gray-300 dark:text-[#888] text-xs font-medium">
                          <span className="flex items-center gap-1.5 text-gray-300 dark:text-[#ccc]">
                            <MapPin size={12} className="text-[#F7EA00]" />{" "}
                            {place.city}
                          </span>

                          {place.category && <span>&middot;</span>}
                          {place.category &&
                            (() => {
                              const CatIcon =
                                CATEGORY_ICONS[place.category.toLowerCase()] ||
                                Sparkles;
                              return (
                                <span className="flex items-center gap-1.5 capitalize text-gray-300 dark:text-[#ccc]">
                                  <CatIcon
                                    size={12}
                                    className="text-[#F7EA00]"
                                  />{" "}
                                  {place.category}
                                </span>
                              );
                            })()}

                          {place.category && place.budget_level && (
                            <span>&middot;</span>
                          )}
                          {place.budget_level && (
                            <span className="flex items-center gap-1.5 capitalize text-gray-300 dark:text-[#ccc]">
                              <Diamond size={12} className="text-[#F7EA00]" />{" "}
                              {place.budget_level}
                            </span>
                          )}

                          {(place.category || place.budget_level) &&
                            place.duration_needed > 0 && <span>&middot;</span>}
                          {place.duration_needed > 0 && (
                            <span className="flex items-center gap-1.5 text-gray-300 dark:text-[#ccc]">
                              <Clock size={12} className="text-[#F7EA00]" />{" "}
                              {place.duration_needed}h
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    );
                  })
                )}
              </div>

              {/* Pagination / Sentinel */}
              <div
                ref={sentinelRef}
                className="w-full h-10 flex items-center justify-center mt-4 mb-8"
              >
                {isLoadingMore && (
                  <Loader2 size={24} className="animate-spin text-[#F7EA00]" />
                )}
              </div>


            </div>
          </div>
        </div>
      </main>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#050505] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#222]">
            <h2 className="text-xl font-bold flex items-center gap-2 font-clash">
              <Map size={24} className="text-[#F7EA00]" />
              Interactive Map
            </h2>
            <button 
              onClick={() => setShowMap(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#111] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 w-full relative z-0">
            <InteractiveMap places={places} />
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0px;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `,
        }}
      />
    </div>
  );
}

export default function ExplorePlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-white dark:bg-[#050505] flex items-center justify-center text-gray-900 dark:text-white">
          <Loader2 size={32} className="animate-spin text-[#F7EA00]" />
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
