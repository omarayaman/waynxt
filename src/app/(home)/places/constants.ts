import {
  Sparkles,
  Landmark,
  Waves,
  Diamond,
  Moon,
  Building2,
  Tent,
  TreePine,
  Utensils,
  Activity,
  Sun,
  type LucideIcon,
} from "lucide-react";

export const ALL_EXPERIENCES = { id: "all", label: "All Experiences", icon: Sparkles };

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  history: Landmark,
  adventure: Tent,
  beach: Sun,
  nature: TreePine,
  religious: Building2,
  food: Utensils,
  wellness: Activity,
  historical: Landmark,
  coastal: Waves,
  hidden_gems: Diamond,
  nightlife: Moon,
  museums: Building2,
};

export const BUDGET_LEVELS = [
  { id: "low", label: "Budget" },
  { id: "medium", label: "Mid-range" },
  { id: "high", label: "Premium" },
];

export const SUITABLE_FOR = [
  { id: "family", label: "Family" },
  { id: "couple", label: "Couple" },
  { id: "solo", label: "Solo" },
  { id: "friends", label: "Friends" },
];

export const SEASONS = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
  { id: "winter", label: "Winter" },
];

export const CROWD_LEVELS = [
  { id: "quiet", label: "Quiet" },
  { id: "moderate", label: "Moderate" },
  { id: "crowded", label: "Busy" },
];

export const SUITABLE_AGES = [
  { id: "teen", label: "Teens" },
  { id: "adult", label: "Adults" },
  { id: "senior", label: "Seniors" },
];

export const SORT_OPTIONS = [
  { id: "rating", label: "Top rated" },
  { id: "name", label: "Name A–Z" },
  { id: "duration_asc", label: "Shortest visit" },
  { id: "duration_desc", label: "Longest visit" },
];
