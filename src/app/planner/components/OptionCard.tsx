import React from "react";

interface OptionCardProps {
  label: string;
  desc: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  compact?: boolean;
}

export default function OptionCard({
  label,
  desc,
  icon,
  isActive,
  onClick,
  compact = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start rounded-xl border transition-all duration-200 text-left w-full ${
        compact ? "p-3 gap-1" : "p-3.5 gap-1.5"
      } ${
        isActive
          ? "border-[#F7EA00] bg-[#F7EA00]/10 shadow-[0_0_12px_rgba(247,234,0,0.12)]"
          : "border-white/10 bg-black/25 hover:border-white/20 hover:bg-black/35"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`shrink-0 transition-colors ${isActive ? "text-[#F7EA00]" : "text-gray-400"}`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold leading-tight ${isActive ? "text-[#F7EA00]" : "text-white"}`}>
          {label}
        </span>
      </div>
      <span className={`text-xs leading-snug ${isActive ? "text-[#F7EA00]/75" : "text-gray-500"}`}>
        {desc}
      </span>
    </button>
  );
}
