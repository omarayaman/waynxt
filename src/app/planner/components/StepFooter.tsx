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
    <div className="mt-2 flex shrink-0 items-center justify-between border-t border-border pt-4 dark:border-white/10">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled || !onBack}
        className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-gray-400"
      >
        &larr; Back
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm px-5 py-1.5 rounded-lg transition-all duration-300 shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_25%,transparent)] hover:shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_35%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {continueLabel}
      </button>
    </div>
  );
}
