"use client";

import React from "react";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isLoading,
  placeholder = "Ask about a place, trip, or destination...",
}: ChatInputProps) {
  return (
    <div className="shrink-0 border-t border-[#1A1A1A] bg-[#050505] px-4 py-4 md:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="relative mx-auto max-w-3xl"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-full border border-[#222222] bg-[#111111] py-4 pl-6 pr-16 text-sm text-white placeholder:text-[#666666] transition-colors focus:border-[#DFD616]/50 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled || isLoading}
          className={`absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${
            value.trim() && !isLoading && !disabled
              ? "bg-[#DFD616] text-black hover:bg-[#EAE121]"
              : "bg-[#2A280D] text-[#DFD616]"
          }`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} className="ml-0.5" />
          )}
        </button>
      </form>
      <p className="mx-auto mt-3 max-w-3xl text-center text-[10px] text-[#555555]">
        <span className="font-semibold text-[#DFD616]">WAYNX</span> AI provides verified information. Always check official sources before travel.
      </p>
    </div>
  );
}
