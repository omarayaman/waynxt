"use client";

import { X } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";
import { BUDGET_LEVELS, SUITABLE_FOR, SUITABLE_AGES, SEASONS, CROWD_LEVELS } from "../constants";

interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export function PlacesActiveFilters() {
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

  const activeSidebarFiltersCount =
    activeCities.length +
    activeBudgets.length +
    (activeSuitableFor !== "" ? 1 : 0) +
    (activeAge !== "" ? 1 : 0) +
    (activeSeason !== "" ? 1 : 0) +
    (activeCrowdLevel !== "" ? 1 : 0);

  if (activeSidebarFiltersCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeCities.map((city) => (
        <div key={city} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
          {city}
          <button onClick={() => toggleCity(city)} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      ))}
      
      {activeBudgets.map((budget) => (
        <div key={budget} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
          {BUDGET_LEVELS.find((b) => b.id === budget)?.label}
          <button onClick={() => toggleBudget(budget)} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      ))}
      
      {activeSuitableFor && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
          {SUITABLE_FOR.find((s) => s.id === activeSuitableFor)?.label}
          <button onClick={() => setSuitableFor("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      )}
      
      {activeAge && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
          {SUITABLE_AGES.find((a) => a.id === activeAge)?.label}
          <button onClick={() => setAge("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      )}
      
      {activeSeason && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
          {SEASONS.find((s) => s.id === activeSeason)?.label}
          <button onClick={() => setSeason("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      )}
      
      {activeCrowdLevel && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7EA00] dark:bg-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] font-medium text-xs">
          {CROWD_LEVELS.find((c) => c.id === activeCrowdLevel)?.label}
          <button onClick={() => setCrowdLevel("")} className="hover:text-gray-900 dark:hover:text-white ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
      )}

      <button onClick={resetFilters} className="text-xs text-gray-500 dark:text-[#888888] hover:text-gray-900 dark:hover:text-white ml-2 transition-colors">
        Clear
      </button>
    </div>
  );
}
