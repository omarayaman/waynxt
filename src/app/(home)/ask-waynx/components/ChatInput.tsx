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

  return (
    <div
      className={
        isCentered
          ? "w-full max-w-2xl"
          : "relative shrink-0 px-4 pb-5 pt-2 md:px-6 md:pb-6"
      }
    >
      {!isCentered && (
        <div
          className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-linear-to-t from-[#050505] to-transparent"
          aria-hidden
        />
      )}

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
          className={
            isCentered
              ? "w-full rounded-full border border-white/8 bg-white/4 py-4 pl-6 pr-14 text-base text-white backdrop-blur-sm placeholder:text-[#666666] transition-colors focus:border-[#DFD616]/30 focus:bg-white/5 focus:outline-none"
              : "w-full rounded-full border border-white/6 bg-[#050505]/80 py-3.5 pl-5 pr-14 text-sm text-white backdrop-blur-sm placeholder:text-[#666666] transition-colors focus:border-[#DFD616]/25 focus:outline-none"
          }
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled || isLoading}
          className={`absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full transition-colors ${
            isCentered ? "h-10 w-10" : "h-9 w-9"
          } ${
            value.trim() && !isLoading && !disabled
              ? "bg-[#DFD616] text-black hover:bg-[#EAE121]"
              : "bg-[#DFD616]/15 text-[#DFD616]"
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
          className={`mx-auto text-center text-[10px] text-[#555555] ${
            isCentered ? "mt-4 max-w-md" : "mt-3 max-w-3xl"
          }`}
        >
          <span className="font-semibold text-[#DFD616]">WAYNX</span> AI provides
          verified information. Always check official sources before travel.
        </p>
      )}
    </div>
  );
}
