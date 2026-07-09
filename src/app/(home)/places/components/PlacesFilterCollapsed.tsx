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
    <div className="py-2.5 first:pt-0">
      <p className="text-[9px] font-medium text-[var(--navbar-muted)] uppercase tracking-wider mb-1.5">{title}</p>
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
          ? "bg-accent-subtle text-accent ring-1 ring-accent/40"
          : "text-[var(--navbar-muted)] hover:text-[var(--navbar-foreground)] ring-1 ring-black/15 hover:ring-accent/30"
      }`}>
      {label}
    </button>
  );
}

function ActiveValue({value}: {value: string | null}) {
  return (
    <p className={`text-[11px] leading-snug ${value ? "text-[var(--navbar-foreground)]" : "text-[var(--navbar-muted)]"}`}>
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
    <div className="flex flex-col h-full pt-1 pb-2">
      <div className="flex items-center justify-between gap-1 pb-3 shrink-0">
        <button
          type="button"
          onClick={onExpand}
          className="p-1 rounded-md text-[var(--navbar-muted)] transition-colors hover:bg-black/5 hover:text-[var(--navbar-foreground)]"
          aria-label="Expand filters">
          <PanelLeftOpen size={14} />
        </button>
        <span className="text-[10px] text-[var(--navbar-muted)] font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="text-[9px] text-accent tabular-nums font-medium">{activeFilterCount}</span>
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

      <div className="pt-3 shrink-0 space-y-1.5">
        <button
          type="button"
          onClick={onReset}
          disabled={activeFilterCount === 0}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-[var(--navbar-muted)] transition-colors hover:text-[var(--navbar-foreground)] disabled:opacity-30 disabled:pointer-events-none">
          <RotateCcw size={10} />
          Reset
        </button>
        <button
          type="button"
          onClick={onExpand}
          className="w-full py-1.5 text-[10px] text-[var(--navbar-muted)] transition-colors hover:text-accent">
          More filters
        </button>
      </div>
    </div>
  );
}
