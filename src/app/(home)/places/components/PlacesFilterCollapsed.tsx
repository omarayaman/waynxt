"use client";

import {PanelLeftOpen, RotateCcw} from "lucide-react";
import {usePlacesStore} from "@/store/usePlacesStore";
import {
  BUDGET_LEVELS,
  CROWD_LEVELS,
  SEASONS,
  SUITABLE_AGES,
  SUITABLE_FOR,
} from "../constants";

interface PlacesFilterCollapsedProps {
  onExpand: () => void;
  onReset: () => void;
  activeFilterCount: number;
}

function CompactSection({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="py-2.5 border-b border-[#141414] last:border-0">
      <p className="text-[9px] font-medium text-[#555] uppercase tracking-wider mb-1.5">{title}</p>
      {children}
    </div>
  );
}

function MiniChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`w-full px-1 py-1 rounded text-[10px] font-medium transition-colors truncate ${
        active
          ? "bg-[#DFD616]/10 text-[#DFD616] ring-1 ring-[#DFD616]/30"
          : "text-[#666] hover:text-[#bbb] ring-1 ring-[#222] hover:ring-[#333]"
      }`}>
      {label}
    </button>
  );
}

function ActiveValue({value}: {value: string | null}) {
  return (
    <p className={`text-[11px] leading-snug ${value ? "text-[#ccc]" : "text-[#444]"}`}>
      {value ?? "Any"}
    </p>
  );
}

export function PlacesFilterCollapsed({
  onExpand,
  onReset,
  activeFilterCount,
}: PlacesFilterCollapsedProps) {
  const {
    activeCities,
    activeBudgets,
    toggleBudget,
    activeSuitableFor,
    activeAge,
    activeSeason,
    activeCrowdLevel,
  } = usePlacesStore();

  const styleLabel = SUITABLE_FOR.find((s) => s.id === activeSuitableFor)?.label ?? null;
  const ageLabel = SUITABLE_AGES.find((a) => a.id === activeAge)?.label ?? null;
  const seasonLabel = SEASONS.find((s) => s.id === activeSeason)?.label ?? null;
  const crowdLabel = CROWD_LEVELS.find((c) => c.id === activeCrowdLevel)?.label ?? null;

  const cityPreview =
    activeCities.length === 0
      ? null
      : activeCities.length <= 2
        ? activeCities.join(", ")
        : `${activeCities.slice(0, 2).join(", ")} +${activeCities.length - 2}`;

  return (
    <div className="flex flex-col h-full px-2 pt-2 pb-2">
      <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-[#141414] shrink-0">
        <button
          type="button"
          onClick={onExpand}
          className="p-1 rounded-md text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          aria-label="Expand filters">
          <PanelLeftOpen size={14} />
        </button>
        <span className="text-[10px] text-[#666] font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="text-[9px] text-[#DFD616] tabular-nums font-medium">{activeFilterCount}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto filters-scroll py-1 min-h-0">
        <CompactSection title="City">
          <ActiveValue value={cityPreview} />
        </CompactSection>

        <CompactSection title="Budget">
          <div className="flex flex-col gap-1">
            {BUDGET_LEVELS.map((b) => (
              <MiniChip
                key={b.id}
                label={b.label}
                active={activeBudgets.includes(b.id)}
                onClick={() => toggleBudget(b.id)}
              />
            ))}
          </div>
        </CompactSection>

        <CompactSection title="Style">
          <ActiveValue value={styleLabel} />
        </CompactSection>

        <CompactSection title="Age">
          <ActiveValue value={ageLabel} />
        </CompactSection>

        <CompactSection title="Season">
          <ActiveValue value={seasonLabel} />
        </CompactSection>

        <CompactSection title="Crowd">
          <ActiveValue value={crowdLabel} />
        </CompactSection>
      </div>

      <div className="pt-2.5 border-t border-[#141414] shrink-0 space-y-1.5">
        <button
          type="button"
          onClick={onReset}
          disabled={activeFilterCount === 0}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] text-[#555] hover:text-[#aaa] disabled:opacity-30 disabled:pointer-events-none transition-colors">
          <RotateCcw size={10} />
          Reset
        </button>
        <button
          type="button"
          onClick={onExpand}
          className="w-full py-1.5 rounded-lg bg-[#141414] text-[10px] text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors">
          More filters
        </button>
      </div>
    </div>
  );
}
