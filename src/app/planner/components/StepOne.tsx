import React from "react";
import { useTripStore } from "@/store/useTripStore";
import {
  Landmark,
  Umbrella,
  Utensils,
  Heart,
  Church,
  TreePine,
  Mountain,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import OptionCard from "./OptionCard";
import StepSection from "./StepSection";
import StepFooter from "./StepFooter";

export default function StepOne() {
  const { interests, toggleInterest, whoIsTraveling, setWhoIsTraveling, nextStep } = useTripStore();

  const interestOptions = [
    { id: "History", label: "History", desc: "Pharaohs & temples", icon: <Landmark size={18} strokeWidth={1.5} /> },
    { id: "Beach", label: "Beach", desc: "Red Sea & Med coast", icon: <Umbrella size={18} strokeWidth={1.5} /> },
    { id: "Food", label: "Food", desc: "Markets & cuisine", icon: <Utensils size={18} strokeWidth={1.5} /> },
    { id: "Wellness", label: "Wellness", desc: "Spas & healing", icon: <Heart size={18} strokeWidth={1.5} /> },
    { id: "Religious", label: "Religious", desc: "Mosques, churches", icon: <Church size={18} strokeWidth={1.5} /> },
    { id: "Nature", label: "Nature", desc: "Deserts & oases", icon: <TreePine size={18} strokeWidth={1.5} /> },
    { id: "Adventure", label: "Adventure", desc: "Diving, hiking", icon: <Mountain size={18} strokeWidth={1.5} /> },
  ];

  const whoOptions = [
    { id: "Solo", label: "Solo", desc: "Just me", icon: <User size={18} strokeWidth={1.5} /> },
    { id: "Couple", label: "Couple", desc: "Romantic escape", icon: <Heart size={18} strokeWidth={1.5} /> },
    { id: "Family", label: "Family", desc: "With kids or parents", icon: <Users size={18} strokeWidth={1.5} /> },
    { id: "Friends", label: "Friends", desc: "Group adventure", icon: <UsersRound size={18} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 min-h-0 space-y-4 overflow-hidden">
        <StepSection
          title="What excites you?"
          subtitle="Select the experiences you're looking for. Tap as many as you like."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {interestOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={interests.includes(option.id)}
                onClick={() => toggleInterest(option.id)}
                compact
              />
            ))}
          </div>
        </StepSection>

        <StepSection
          title="Who's coming along?"
          subtitle="This shapes the vibe of your recommendations."
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {whoOptions.map((option) => (
              <OptionCard
                key={option.id}
                {...option}
                isActive={whoIsTraveling === option.id}
                onClick={() => setWhoIsTraveling(option.id)}
                compact
              />
            ))}
          </div>
        </StepSection>
      </div>

      <StepFooter
        backDisabled
        onContinue={nextStep}
        continueDisabled={interests.length === 0 || !whoIsTraveling}
      />
    </div>
  );
}
