"use client";

import React, { RefObject } from "react";
import { Loader2, Send } from "lucide-react";

type ChatInputVariant = "centered" | "floating";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  variant?: ChatInputVariant;
  showDisclaimer?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isLoading,
  placeholder = "Ask about a place, trip, or destination...",
  inputRef,
  variant = "floating",
  showDisclaimer = true,
}: ChatInputProps) {
  const isCentered = variant === "centered";

  const inputClassName = isCentered
    ? "w-full rounded-full border border-border bg-surface py-4 pl-6 pr-14 text-base text-foreground shadow-sm placeholder:text-muted transition-colors focus:border-accent/40 focus:outline-none"
    : "w-full rounded-full border border-border bg-surface/90 py-3.5 pl-5 pr-14 text-sm text-foreground shadow-sm backdrop-blur-sm placeholder:text-muted transition-colors focus:border-accent/40 focus:outline-none";

  return (
    <div
      className={
        isCentered
          ? "w-full max-w-2xl"
          : "relative shrink-0 px-4 pb-5 pt-2 md:px-6 md:pb-6"
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={`relative mx-auto ${isCentered ? "w-full" : "max-w-3xl"}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={isCentered}
          className={inputClassName}
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled || isLoading}
          className={`absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full transition-colors ${
            isCentered ? "h-10 w-10" : "h-9 w-9"
          } ${
            value.trim() && !isLoading && !disabled
              ? "bg-accent text-accent-foreground hover:bg-accent-hover"
              : "bg-accent/15 text-accent"
          }`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} className="ml-0.5" />
          )}
        </button>
      </form>

      {showDisclaimer && (
        <p
          className={`mx-auto text-center text-[10px] text-muted ${
            isCentered ? "mt-4 max-w-md" : "mt-3 max-w-3xl"
          }`}
        >
          <span className="font-semibold text-accent">WAYNX</span> AI provides
          verified information. Always check official sources before travel.
        </p>
      )}
    </div>
  );
}
