import { create } from 'zustand';

interface TripState {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  interests: string[];
  toggleInterest: (id: string) => void;

  whoIsTraveling: string;
  setWhoIsTraveling: (val: string) => void;

  budget: string;
  setBudget: (val: string) => void;

  ageGroup: string;
  setAgeGroup: (val: string) => void;

  crowdPreference: string;
  setCrowdPreference: (val: string) => void;

  season: string;
  setSeason: (val: string) => void;

  journeyLength: number;
  setJourneyLength: (val: number) => void;
}

export const useTripStore = create<TripState>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  interests: [],
  toggleInterest: (id) =>
    set((state) => ({
      interests: state.interests.includes(id)
        ? state.interests.filter((i) => i !== id)
        : [...state.interests, id],
    })),

  whoIsTraveling: "",
  setWhoIsTraveling: (val) => set({ whoIsTraveling: val }),

  budget: "",
  setBudget: (val) => set({ budget: val }),

  ageGroup: "",
  setAgeGroup: (val) => set({ ageGroup: val }),

  crowdPreference: "",
  setCrowdPreference: (val) => set({ crowdPreference: val }),

  season: "",
  setSeason: (val) => set({ season: val }),

  journeyLength: 7,
  setJourneyLength: (val) => set({ journeyLength: val }),
}));
