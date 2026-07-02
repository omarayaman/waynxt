import {
  Landmark,
  Mountain,
  Utensils,
  Heart,
  Church,
  TreePine,
  Umbrella,
  User,
  Users,
  UsersRound,
  Wallet,
  Banknote,
  Diamond,
  Backpack,
  Glasses,
  Sparkles,
  Scale,
  Moon,
  Sun,
  Flower2,
  Snowflake,
  Leaf,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  AgeGroup,
  BudgetLevel,
  CrowdPreference,
  Season,
  TravelCompanion,
} from "@/types/user";

export interface SelectOption<T extends string = string> {
  id: T;
  label: string;
  desc?: string;
  icon?: ReactNode;
}

export const INTEREST_OPTIONS: SelectOption[] = [
  { id: "history", label: "History", icon: <Landmark size={16} /> },
  { id: "adventure", label: "Adventure", icon: <Mountain size={16} /> },
  { id: "food", label: "Food", icon: <Utensils size={16} /> },
  { id: "wellness", label: "Wellness", icon: <Heart size={16} /> },
  { id: "religious", label: "Religious", icon: <Church size={16} /> },
  { id: "nature", label: "Nature", icon: <TreePine size={16} /> },
  { id: "beach", label: "Beach", icon: <Umbrella size={16} /> },
];

export const COMPANION_OPTIONS: SelectOption<TravelCompanion>[] = [
  { id: "solo", label: "Solo", desc: "Just me", icon: <User size={16} /> },
  { id: "couple", label: "Couple", desc: "Romantic escape", icon: <Heart size={16} /> },
  { id: "family", label: "Family", desc: "With kids or parents", icon: <Users size={16} /> },
  { id: "friends", label: "Friends", desc: "Group adventure", icon: <UsersRound size={16} /> },
];

export const BUDGET_OPTIONS: SelectOption<BudgetLevel>[] = [
  { id: "low", label: "Budget", desc: "Local & economical", icon: <Wallet size={16} /> },
  { id: "medium", label: "Mid-range", desc: "Comfort & value", icon: <Banknote size={16} /> },
  { id: "high", label: "Luxury", desc: "Premium experiences", icon: <Diamond size={16} /> },
];

export const AGE_OPTIONS: SelectOption<AgeGroup>[] = [
  { id: "teen", label: "Teen", desc: "Under 20", icon: <Backpack size={16} /> },
  { id: "adult", label: "Adult", desc: "20–60 years", icon: <User size={16} /> },
  { id: "senior", label: "Senior", desc: "60+ years", icon: <Glasses size={16} /> },
];

export const CROWD_OPTIONS: SelectOption<CrowdPreference>[] = [
  { id: "crowded", label: "Lively", desc: "Popular & vibrant", icon: <Sparkles size={16} /> },
  { id: "no_preference", label: "No preference", desc: "Anything goes", icon: <Scale size={16} /> },
  { id: "quiet", label: "Peaceful", desc: "Quiet & secluded", icon: <Moon size={16} /> },
];

export const SEASON_OPTIONS: SelectOption<Season>[] = [
  { id: "winter", label: "Winter", icon: <Snowflake size={16} /> },
  { id: "spring", label: "Spring", icon: <Flower2 size={16} /> },
  { id: "summer", label: "Summer", icon: <Sun size={16} /> },
  { id: "autumn", label: "Autumn", icon: <Leaf size={16} /> },
];
