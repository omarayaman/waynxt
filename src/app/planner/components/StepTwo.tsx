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
    { id: "Budget", label: "Budget", desc: "Local & economical", icon: <Wallet size={18} strokeWidth={1.5} /> },
    { id: "Mid-range", label: "Mid-range", desc: "Comfort & value", icon: <Banknote size={18} strokeWidth={1.5} /> },
    { id: "Luxury", label: "Luxury", desc: "Premium experiences", icon: <Diamond size={18} strokeWidth={1.5} /> },
  ];

  const ageOptions = [
    { id: "Teen", label: "Teen", desc: "Under 20", icon: <Backpack size={18} strokeWidth={1.5} /> },
    { id: "Adult", label: "Adult", desc: "20–60 years", icon: <User size={18} strokeWidth={1.5} /> },
    { id: "Senior", label: "Senior", desc: "60+ years", icon: <Glasses size={18} strokeWidth={1.5} /> },
  ];

  const crowdOptions = [
    { id: "Lively", label: "Lively", desc: "Popular & vibrant", icon: <Sparkles size={18} strokeWidth={1.5} /> },
    { id: "No preference", label: "No preference", desc: "Anything goes", icon: <Scale size={18} strokeWidth={1.5} /> },
    { id: "Peaceful", label: "Peaceful", desc: "Quiet & secluded", icon: <Moon size={18} strokeWidth={1.5} /> },
  ];

  const canContinue = Boolean(budget && ageGroup && crowdPreference);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 min-h-0 space-y-4 overflow-hidden">
        <StepSection title="What's your budget?" subtitle="Per-day spending comfort level.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {budgetOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={budget === option.id}
                onClick={() => setBudget(option.id)}
              />
            ))}
          </div>
        </StepSection>

        <StepSection title="Age group?" subtitle="Helps calibrate activity intensity.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ageOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={ageGroup === option.id}
                onClick={() => setAgeGroup(option.id)}
              />
            ))}
          </div>
        </StepSection>

        <StepSection title="Crowd preference?" subtitle="Popular hotspots or hidden gems?">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {crowdOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={crowdPreference === option.id}
                onClick={() => setCrowdPreference(option.id)}
              />
            ))}
          </div>
        </StepSection>
      </div>

      <StepFooter onBack={prevStep} onContinue={nextStep} continueDisabled={!canContinue} />
    </div>
  );
}
