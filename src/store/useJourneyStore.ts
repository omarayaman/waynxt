import { create } from "zustand";

export type TravelVibe = "Mountain" | "Crowd" | null;

interface JourneyState {
  whoIsTraveling: string | null;
  budget: string | null;
  interests: string[];
  travelVibe: TravelVibe;
  season: string | null;
  journeyLength: number;
  ageGroup: string | null;
  crowdPreference: string | null;

  // Actions
  setWhoIsTraveling: (who: string) => void;
  setBudget: (budget: string) => void;
  toggleInterest: (interest: string) => void;
  setTravelVibe: (vibe: TravelVibe) => void;
  setSeason: (season: string) => void;
  setJourneyLength: (length: number) => void;
  setAgeGroup: (age: string) => void;
  setCrowdPreference: (pref: string) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  whoIsTraveling: "Couple", // Default from UI screenshot
  budget: "Mid-Range",      // Default from UI screenshot
  interests: ["Foodie", "Travel", "Senouy"], // Will be updated to actual categories
  travelVibe: "Mountain",   // Default from UI screenshot
  season: "Sun",            // Default from UI screenshot
  journeyLength: 7,         // Default from UI screenshot
  ageGroup: "Adult",        // Default
  crowdPreference: "Lively", // Default

  setWhoIsTraveling: (who) => set({ whoIsTraveling: who }),
  setBudget: (budget) => set({ budget: budget }),
  toggleInterest: (interest) =>
    set((state) => {
      const isSelected = state.interests.includes(interest);
      if (isSelected) {
        return { interests: state.interests.filter((i) => i !== interest) };
      } else {
        return { interests: [...state.interests, interest] };
      }
    }),
  setTravelVibe: (vibe) => set({ travelVibe: vibe }),
  setSeason: (season) => set({ season: season }),
  setJourneyLength: (length) => set({ journeyLength: length }),
  setAgeGroup: (age) => set({ ageGroup: age }),
  setCrowdPreference: (pref) => set({ crowdPreference: pref }),
}));
