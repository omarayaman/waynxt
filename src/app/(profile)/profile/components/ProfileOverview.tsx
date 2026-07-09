"use client";

import React from "react";
import { MapPin, Target, Bookmark, MessageSquare, ChevronRight } from "lucide-react";
import type { UserStats } from "@/types/user";
import type { ProfileSection } from "./ProfileNav";

interface ProfileOverviewProps {
  stats: UserStats | null;
  isLoading: boolean;
  onNavigate: (section: ProfileSection) => void;
}

const statCards = [
  { key: "ai_plans_created" as const, label: "AI plans created", icon: Target, section: "trips" as const },
  { key: "saved_places_count" as const, label: "Saved places", icon: Bookmark, section: "saved-places" as const },
  { key: "chat_sessions_count" as const, label: "Chat sessions", icon: MessageSquare, section: "chat-history" as const },
];

export function ProfileOverview({ stats, isLoading, onNavigate }: ProfileOverviewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-medium text-[#888] mb-4">Activity summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statCards.map(({ key, label, icon: Icon, section }) => {
            const value = stats?.[key] ?? 0;
            const isClickable = Boolean(section);

            const content = (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#161616] flex items-center justify-center">
                    <Icon size={16} className="text-[#666]" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-white tabular-nums">
                      {isLoading ? "—" : value}
                    </p>
                    <p className="text-xs text-[#666] mt-0.5">{label}</p>
                  </div>
                </div>
                {isClickable && (
                  <ChevronRight size={16} className="text-[#444] group-hover:text-[#777] transition-colors" />
                )}
              </>
            );

            if (isClickable) {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onNavigate(section!)}
                  className="group flex items-center justify-between p-4 rounded-xl border border-border bg-[#0d0d0d] hover:border-[#2a2a2a] hover:bg-[#111] transition-colors text-left w-full"
                >
                  {content}
                </button>
              );
            }

            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-[#0d0d0d]"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {stats && stats.explorer_points > 0 && (
        <div className="p-4 rounded-xl border border-border bg-[#0d0d0d]">
          <p className="text-xs text-[#666] mb-1">Explorer points</p>
          <p className="text-2xl font-semibold text-white tabular-nums">
            {stats.explorer_points.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
