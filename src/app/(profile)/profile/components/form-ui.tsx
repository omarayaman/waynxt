"use client";

import React from "react";

interface OptionChipProps {
  label: string;
  desc?: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export function OptionChip({ label, desc, icon, isActive, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
        isActive
          ? "border-[#333] bg-[#161616] text-white"
          : "border-border bg-[#0d0d0d] text-[#888] hover:border-[#2a2a2a] hover:text-[#bbb]"
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>
        <span className="font-medium">{label}</span>
        {desc && <span className="block text-[11px] text-gray-500 mt-0.5">{desc}</span>}
      </span>
    </button>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

export const inputClassName =
  "w-full px-3.5 py-2.5 bg-[#111] rounded-lg border border-[#1f1f1f] text-white placeholder:text-[#555] focus:outline-none focus:border-[#333] transition-colors text-sm";

export const submitButtonClassName =
  "w-full py-2.5 bg-white text-accent-foreground font-medium rounded-lg text-sm hover:bg-[#e5e5e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const dangerButtonClassName =
  "w-full py-2.5 bg-transparent border border-red-500/30 text-red-400 font-medium rounded-lg text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50";
