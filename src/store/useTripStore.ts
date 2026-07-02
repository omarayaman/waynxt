import { create } from 'zustand';
import { defaultStartDate, defaultTravelersCount } from '@/lib/trip-mappers';

interface TripState {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

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

  startDate: string;
  setStartDate: (val: string) => void;

  travelersCount: number;
  setTravelersCount: (val: number) => void;

  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
}

const initialState = {
  step: 1,
  interests: [] as string[],
  whoIsTraveling: '',
  budget: '',
  ageGroup: '',
  crowdPreference: '',
  season: '',
  journeyLength: 7,
  startDate: defaultStartDate(),
  travelersCount: 2,
  isCreating: false,
};

export const useTripStore = create<TripState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  reset: () => set({ ...initialState, startDate: defaultStartDate() }),

  toggleInterest: (id) =>
    set((state) => ({
      interests: state.interests.includes(id)
        ? state.interests.filter((i) => i !== id)
        : [...state.interests, id],
    })),

  setWhoIsTraveling: (val) =>
    set({
      whoIsTraveling: val,
      travelersCount: defaultTravelersCount(val),
    }),

  setBudget: (val) => set({ budget: val }),
  setAgeGroup: (val) => set({ ageGroup: val }),
  setCrowdPreference: (val) => set({ crowdPreference: val }),
  setSeason: (val) => set({ season: val }),
  setJourneyLength: (val) => set({ journeyLength: val }),
  setStartDate: (val) => set({ startDate: val }),
  setTravelersCount: (val) => set({ travelersCount: val }),
  setIsCreating: (val) => set({ isCreating: val }),
}));
