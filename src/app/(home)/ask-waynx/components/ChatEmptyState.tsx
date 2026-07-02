"use client";

import React from "react";
import { MapPin, Sparkles, Route } from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    icon: MapPin,
    label: "Tell me about the Pyramids of Giza",
    prompt: "Tell me about the Pyramids of Giza and what I should know before visiting",
  },
  {
    icon: Route,
    label: "Plan a 3-day Cairo trip",
    prompt: "Help me plan a 3-day trip to Cairo with must-see places",
  },
  {
    icon: MapPin,
    label: "Best museums in Egypt",
    prompt: "What are the best museums to visit in Egypt for history lovers?",
  },
  {
    icon: Route,
    label: "Family-friendly activities",
    prompt: "What are the best family-friendly activities and places in Egypt?",
  },
  {
    icon: MapPin,
    label: "Restaurants near Khan el-Khalili",
    prompt: "Recommend good restaurants near Khan el-Khalili in Cairo",
  },
  {
    icon: Route,
    label: "Luxor day itinerary",
    prompt: "Create a one-day itinerary for exploring Luxor",
  },
];

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export default function ChatEmptyState({ onSelectPrompt, disabled }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1809] text-[#DFD616]">
          <Sparkles size={24} />
        </div>
        <h2 className="mb-2 text-xl font-medium text-white md:text-2xl">
          Ask WAYNX about Egypt
        </h2>
        <p className="max-w-md text-sm text-[#888888]">
          Get help with places, trips, itineraries, and travel tips — all inside your WAYNX experience.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <p className="mb-3 text-xs text-[#666666]">Try asking about:</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SUGGESTED_PROMPTS.map(({ icon: Icon, label, prompt }) => (
            <button
              key={label}
              onClick={() => onSelectPrompt(prompt)}
              disabled={disabled}
              className="flex items-start gap-3 rounded-xl border border-[#222222] bg-[#111111] px-4 py-3 text-left transition-colors hover:border-[#DFD616]/30 hover:bg-[#1A1A1A] disabled:opacity-50"
            >
              <Icon size={16} className="mt-0.5 shrink-0 text-[#DFD616]" />
              <span className="text-[13px] text-[#B0B0B0]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
