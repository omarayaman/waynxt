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
} from "lucide-react";
import { SavePlaceButton } from "@/components/SavePlaceButton";

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
    currentPage,
    setCurrentPage,
    perPage,
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

  const { places, meta, isLoading, isLoadingMore, error } = usePlaces();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const displayedCities = showAllCities
    ? ALL_EGYPT_CITIES
    : ALL_EGYPT_CITIES.slice(0, 5);

  const totalPages = meta ? Math.ceil(meta.total / perPage) : 1;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !meta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isLoadingMore &&
          currentPage < totalPages &&
          places.length < 150
        ) {
          setCurrentPage(currentPage + 1);
        }
      },
      { rootMargin: "400px", threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, meta, currentPage, totalPages, setCurrentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="h-[100dvh] bg-[#050505] text-white font-poppins flex flex-col overflow-hidden">
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-4 xl:px-4 pt-[70px] pb-4 flex flex-col overflow-hidden">
        {/* Top Header: Search and Categories */}
        <div className="w-full shrink-0 flex flex-col items-center">
          {/* Search Bar */}
          <div className="w-full max-w-[800px] mt-0 relative mx-auto">
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
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Filter Chips Top (Category) */}
          <div className="w-full mt-6 mb-4 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {/* All Experiences Button */}
            <button
              onClick={() => setCategory("all")}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium transition-colors ${
                activeCategory === "all" || !activeCategory
                  ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616]"
                  : "bg-transparent border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444]"
              }`}
            >
              <ALL_EXPERIENCES.icon size={16} strokeWidth={1.5} />
              {ALL_EXPERIENCES.label}
            </button>

            {/* Dynamic Categories */}
            {isCategoriesLoading ? (
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-28 h-10 rounded-full bg-[#111111] border border-[#222222] animate-pulse"
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
                    className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#1A1805] border border-[#DFD616] text-[#DFD616]"
                        : "bg-transparent border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444]"
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

        {/* Two-Column Content Layout */}
        <div className="w-full flex-1 flex gap-6 min-h-0 overflow-hidden">
          {/* Left: Advanced Filters Sidebar */}
          <div className="hidden lg:block w-[180px] xl:w-[220px] shrink-0 bg-[#0a0a0a] border border-[#222222] rounded-3xl h-full overflow-y-auto custom-scrollbar relative">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-[#0a0a0a] z-20 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={20} className="text-[#DFD616]" />
                  <h2 className="text-xl font-semibold text-white font-clash">
                    Filters
                  </h2>
                </div>
                <button
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={`text-xs font-medium transition-colors ${
                    hasActiveFilters
                      ? "text-[#DFD616] hover:text-white cursor-pointer"
                      : "text-[#444] cursor-not-allowed"
                  }`}
                >
                  Reset
                </button>
              </div>
              <div className="w-full h-px bg-[#222222]"></div>
            </div>

            {/* Scrollable Filters Content */}
            <div className="px-6 pb-6 pt-2">
              {/* City */}
              <div className="mb-8">
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
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
                              ? "border-[#DFD616] bg-[#DFD616]"
                              : "border-[#333333] bg-transparent group-hover:border-[#555555]"
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
                              ? "font-medium text-white"
                              : "text-[#666666] group-hover:text-[#aaaaaa]"
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
                    className="text-[#666666] text-xs flex items-center gap-1 mt-4 hover:text-white transition-colors"
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
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
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
                            ? "text-[#DFD616] font-semibold border-[#DFD616]"
                            : "text-[#888888] border-transparent hover:text-[#DFD616] hover:border-[#DFD616]"
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
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
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
                            ? "text-[#DFD616] font-semibold border-[#DFD616]"
                            : "text-[#888888] border-transparent hover:text-[#DFD616] hover:border-[#DFD616]"
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
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
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
                            ? "text-[#DFD616] font-semibold border-[#DFD616]"
                            : "text-[#888888] border-transparent hover:text-[#DFD616] hover:border-[#DFD616]"
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
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
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
                            ? "text-[#DFD616] font-semibold border-[#DFD616]"
                            : "text-[#888888] border-transparent hover:text-[#DFD616] hover:border-[#DFD616]"
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
                <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">
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
                            ? "text-[#DFD616] font-semibold border-[#DFD616]"
                            : "text-[#888888] border-transparent hover:text-[#DFD616] hover:border-[#DFD616]"
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
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 lg:pr-4 pb-6 mt-2">
              {/* Grid Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sticky top-0 bg-[#050505] z-40 py-2 -mt-2">
                <div className="absolute top-full left-0 right-0 h-6 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
                <h2 className="text-xl text-white font-medium relative z-10">
                  Discover <span className="text-[#DFD616]">Egypt</span>
                  {!isLoading && meta && (
                    <span className="text-[#666666] text-sm font-normal ml-3">
                      Showing {meta.total} places
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-2 text-sm relative">
                  <span className="text-[#666666]">Sort by:</span>
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-[#111111] border border-[#222222] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors text-xs font-medium min-w-[140px] justify-between"
                  >
                    {SORT_OPTIONS.find((s) => s.id === sortBy)?.label ||
                      "Select sort"}
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {/* Sort Dropdown Menu */}
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#111111] border border-[#222222] rounded-xl shadow-xl overflow-hidden z-50">
                      {SORT_OPTIONS.map((opt) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 relative z-10 w-full pb-10">
                {isLoading ? (
                  // Skeletons
                  [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-[350px] rounded-[2rem] bg-[#111111] border border-[#222222] animate-pulse"
                    ></div>
                  ))
                ) : places.length === 0 ? (
                  // Empty state
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#666666]">
                    <Search size={40} className="mb-4 opacity-20" />
                    <p className="text-lg">
                      No places found matching your filters.
                    </p>
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
                    <Link
                      href={`/places/${place.id}`}
                      key={place.id}
                      className="group relative w-full h-[350px] block rounded-[2rem] overflow-hidden border border-[#222222] hover:border-[#DFD616]/50 transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                    >
                      {/* Background Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          place.thumbnail_url ||
                          "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={place.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                        <div className="bg-[#DFD616] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
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

                        <div className="flex flex-wrap items-center gap-2 text-[#888] text-xs font-medium">
                          <span className="flex items-center gap-1.5 text-[#ccc]">
                            <MapPin size={12} className="text-[#DFD616]" />{" "}
                            {place.city}
                          </span>

                          {place.category && <span>&middot;</span>}
                          {place.category &&
                            (() => {
                              const CatIcon =
                                CATEGORY_ICONS[place.category.toLowerCase()] ||
                                Sparkles;
                              return (
                                <span className="flex items-center gap-1.5 capitalize">
                                  <CatIcon
                                    size={12}
                                    className="text-[#DFD616]"
                                  />{" "}
                                  {place.category}
                                </span>
                              );
                            })()}

                          {place.category && place.budget_level && (
                            <span>&middot;</span>
                          )}
                          {place.budget_level && (
                            <span className="flex items-center gap-1.5 capitalize">
                              <Diamond size={12} className="text-[#DFD616]" />{" "}
                              {place.budget_level}
                            </span>
                          )}

                          {(place.category || place.budget_level) &&
                            place.duration_needed > 0 && <span>&middot;</span>}
                          {place.duration_needed > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#DFD616]" />{" "}
                              {place.duration_needed}h
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Pagination / Sentinel */}
              <div
                ref={sentinelRef}
                className="w-full h-10 flex items-center justify-center mt-4 mb-8"
              >
                {isLoadingMore && (
                  <Loader2 size={24} className="animate-spin text-[#DFD616]" />
                )}
              </div>

              {/* View Interactive Map Button */}
              <div className="mt-12 flex justify-center relative z-10">
                <button className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)]">
                  <Map size={16} strokeWidth={2.5} />
                  View Interactive Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

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
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
          <Loader2 size={32} className="animate-spin text-[#DFD616]" />
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
