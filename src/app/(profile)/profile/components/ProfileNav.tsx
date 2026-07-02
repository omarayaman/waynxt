"use client";

import React from "react";
import {
  LayoutDashboard,
  Bookmark,
  MessageSquare,
  Sliders,
  Map,
  Settings,
} from "lucide-react";

export type ProfileSection =
  | "overview"
  | "saved-places"
  | "chat-history"
  | "preferences"
  | "trips"
  | "settings";

interface ProfileNavProps {
  active: ProfileSection;
  onChange: (section: ProfileSection) => void;
  counts?: {
    savedPlaces?: number;
    chatSessions?: number;
    trips?: number;
  };
}

const items: { id: ProfileSection; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "saved-places", label: "Saved Places", icon: Bookmark },
  { id: "chat-history", label: "Chat History", icon: MessageSquare },
  { id: "preferences", label: "Preferences", icon: Sliders },
  { id: "trips", label: "Trips", icon: Map },
  { id: "settings", label: "Settings", icon: Settings },
];

export function ProfileNav({ active, onChange, counts }: ProfileNavProps) {
  const getCount = (id: ProfileSection) => {
    if (id === "saved-places") return counts?.savedPlaces;
    if (id === "chat-history") return counts?.chatSessions;
    if (id === "trips") return counts?.trips;
    return undefined;
  };

  return (
    <>
      <nav className="hidden lg:flex flex-col gap-1 w-52 shrink-0">
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-[#555]">
          Manage
        </p>
        {items.map(({ id, label, icon: Icon }) => {
          const count = getCount(id);
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#161616] text-white"
                  : "text-[#888] hover:text-[#ccc] hover:bg-[#111]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? "text-[#aaa]" : "text-[#666]"} />
                {label}
              </span>
              {count !== undefined && count > 0 && (
                <span className="text-[11px] text-[#666] tabular-nums">{count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="lg:hidden flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#161616] text-white"
                  : "text-[#777] hover:text-[#bbb]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
