import React from "react";
import { useTripStore } from "@/store/useTripStore";
import {
  Wallet,
  Banknote,
  Diamond,
  Backpack,
  User,
  Glasses,
  Sparkles,
  Scale,
  Moon,
} from "lucide-react";
import OptionCard from "./OptionCard";
import StepSection from "./StepSection";
import StepFooter from "./StepFooter";

export default function StepTwo() {
  const {
    budget,
    setBudget,
    ageGroup,
    setAgeGroup,
    crowdPreference,
    setCrowdPreference,
    nextStep,
    prevStep,
  } = useTripStore();

  const budgetOptions = [
    { id: "Budget", label: "Budget", desc: "Local & economical", icon: <Wallet size={16} strokeWidth={1.5} /> },
    { id: "Mid-range", label: "Mid-range", desc: "Comfort & value", icon: <Banknote size={16} strokeWidth={1.5} /> },
    { id: "Luxury", label: "Luxury", desc: "Premium experiences", icon: <Diamond size={16} strokeWidth={1.5} /> },
  ];

  const ageOptions = [
    { id: "Teen", label: "Teen", desc: "Under 20", icon: <Backpack size={16} strokeWidth={1.5} /> },
    { id: "Adult", label: "Adult", desc: "20–60 years", icon: <User size={16} strokeWidth={1.5} /> },
    { id: "Senior", label: "Senior", desc: "60+ years", icon: <Glasses size={16} strokeWidth={1.5} /> },
  ];

  const crowdOptions = [
    { id: "Lively", label: "Lively", desc: "Popular & vibrant", icon: <Sparkles size={16} strokeWidth={1.5} /> },
    { id: "No preference", label: "No preference", desc: "Anything goes", icon: <Scale size={16} strokeWidth={1.5} /> },
    { id: "Peaceful", label: "Peaceful", desc: "Quiet & secluded", icon: <Moon size={16} strokeWidth={1.5} /> },
  ];

  const canContinue = Boolean(budget && ageGroup && crowdPreference);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        <StepSection title="What's your budget?" subtitle="Per-day spending comfort level.">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {budgetOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={budget === option.id}
                onClick={() => setBudget(option.id)}
                compact
              />
            ))}
          </div>
        </StepSection>

        <StepSection title="Age group?" subtitle="Helps calibrate activity intensity.">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {ageOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={ageGroup === option.id}
                onClick={() => setAgeGroup(option.id)}
                compact
              />
            ))}
          </div>
        </StepSection>

        <StepSection title="Crowd preference?" subtitle="Popular hotspots or hidden gems?">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {crowdOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={crowdPreference === option.id}
                onClick={() => setCrowdPreference(option.id)}
                compact
              />
            ))}
          </div>
        </StepSection>
      </div>

      <StepFooter onBack={prevStep} onContinue={nextStep} continueDisabled={!canContinue} />
    </div>
  );
}
