"use client";

import React, { RefObject } from "react";
import { MapPin, Route, Sparkles } from "lucide-react";
import ChatInput from "./ChatInput";

const SUGGESTED_PROMPTS = [
  {
    icon: MapPin,
    label: "Tell me about the Pyramids of Giza",
    prompt:
      "Tell me about the Pyramids of Giza and what I should know before visiting",
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
    prompt:
      "What are the best family-friendly activities and places in Egypt?",
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
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelectPrompt: (prompt: string) => void;
  isLoading?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function ChatEmptyState({
  value,
  onChange,
  onSubmit,
  onSelectPrompt,
  isLoading,
  inputRef,
}: ChatEmptyStateProps) {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[38%] h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_15%,transparent_72%)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-accent/15 bg-accent/8 text-accent">
            <Sparkles size={24} />
          </div>
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Where to next?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
            Ask WAYNX about places, trips, and hidden gems across Egypt — powered
            by AI.
          </p>
        </div>

        <ChatInput
          variant="centered"
          inputRef={inputRef}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          placeholder="Ask anything about Egypt..."
        />

        <div className="mt-10 w-full max-w-2xl">
          <p className="mb-3 text-center text-xs text-muted">
            Or try one of these
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SUGGESTED_PROMPTS.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => onSelectPrompt(prompt)}
                disabled={isLoading}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface-elevated/50 px-4 py-3 text-left transition-colors hover:border-accent/20 hover:bg-accent/5 disabled:opacity-50"
              >
                <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
                <span className="text-[13px] text-foreground/80">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
