import React from "react";

interface StepFooterProps {
  onBack?: () => void;
  backDisabled?: boolean;
  onContinue: () => void;
  continueLabel?: React.ReactNode;
  continueDisabled?: boolean;
}

export default function StepFooter({
  onBack,
  backDisabled = false,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
}: StepFooterProps) {
  return (
    <div className="flex justify-between items-center pt-4 mt-auto border-t border-white/10 shrink-0">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled || !onBack}
        className="text-gray-400 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent"
      >
        &larr; Back
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm px-6 py-2 rounded-xl transition-all duration-300 shadow-[0_0_12px_color-mix(in srgb, var(--accent) %, transparent)] hover:shadow-[0_0_18px_color-mix(in srgb, var(--accent) %, transparent)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {continueLabel}
      </button>
    </div>
  );
}
