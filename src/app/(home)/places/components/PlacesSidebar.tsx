"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Check, ChevronDown, X } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";

const BUDGET_LEVELS = [
  { id: "low", label: "Budget" },
  { id: "medium", label: "Mid-range" },
  { id: "high", label: "Premium" },
];

const ALL_EGYPT_CITIES = [
  "Cairo", "Aswan", "Luxor", "Hurghada", "Alexandria", "Sharm El-Sheikh",
  "Dahab", "Marsa Alam", "Giza", "Fayoum", "Siwa", "Nuweiba", "Taba",
  "Port Said", "Ismailia", "Suez", "Al Arish", "Marsa Matrouh",
  "Ain Sokhna", "El Gouna", "Saint Catherine", "Safaga", "Al Quseir",
  "Soma Bay", "Makadi Bay", "Ras Sedr", "Minya", "Asyut", "Sohag",
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
  { id: "teen", label: "Teens" },
  { id: "adult", label: "Adults" },
  { id: "senior", label: "Seniors" },
];

interface PlacesSidebarProps {
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (val: boolean) => void;
  activeSidebarFiltersCount: number;
  hasActiveFilters: boolean;
}

export function PlacesSidebar({
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  activeSidebarFiltersCount,
  hasActiveFilters,
}: PlacesSidebarProps) {
  const {
    activeCities,
    toggleCity,
    activeBudgets,
    toggleBudget,
    activeSuitableFor,
    setSuitableFor,
    activeAge,
    setAge,
    activeSeason,
    setSeason,
    activeCrowdLevel,
    setCrowdLevel,
    resetFilters,
  } = usePlacesStore();

  const [showAllCities, setShowAllCities] = useState(false);

  const displayedCities = showAllCities
    ? ALL_EGYPT_CITIES
    : ALL_EGYPT_CITIES.slice(0, 5);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white dark:bg-[#050505] lg:relative lg:z-auto lg:block lg:w-[180px] xl:w-[220px] shrink-0 lg:bg-gray-50 dark:lg:bg-[#0a0a0a] lg:border border-gray-200 dark:border-[#222222] lg:rounded-3xl h-full overflow-y-auto yellow-scroll transition-transform duration-300 ${
        isMobileFiltersOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
      }`}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden sticky top-0 bg-white dark:bg-[#050505] z-30 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-[#222222]">
        <h2 className="text-xl font-bold font-clash">Filters</h2>
        <button
          onClick={() => setIsMobileFiltersOpen(false)}
          className="p-2 bg-gray-100 dark:bg-[#111111] rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Sticky Header (Desktop) */}
      <div className="hidden lg:block sticky top-0 bg-gray-50 dark:bg-[#0a0a0a] z-20 px-6 pt-6 pb-4">
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
                    {isActive && <Check size={14} className="text-[#0a0a0a] stroke-[3]" />}
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
              {showAllCities ? "Show less" : `Show ${ALL_EGYPT_CITIES.length - 5} more`}
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
  );
}
