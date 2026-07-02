export type TravelCompanion = 'solo' | 'couple' | 'family' | 'friends';
export type BudgetLevel = 'low' | 'medium' | 'high';
export type AgeGroup = 'teen' | 'adult' | 'senior';
export type CrowdPreference = 'crowded' | 'quiet' | 'no_preference';
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface UserPreferences {
  interests?: string[];
  travel_companion?: TravelCompanion;
  budget?: BudgetLevel;
  age_group?: AgeGroup;
  crowd_preference?: CrowdPreference;
  season?: Season;
}

export interface SavedPlaceProfile {
  id: string;
  place_id: number;
  place_name: string;
  location: string;
  saved_at: string;
  category?: string;
  thumbnail_url?: string;
}

/** Raw shape returned by GET /users/saved-places when place relation is included */
export interface SavedPlaceApiItem {
  id: number | string;
  place_id: number;
  created_at: string;
  place_name?: string;
  location?: string;
  saved_at?: string;
  place?: {
    id: number;
    name: string;
    city: string;
    category?: string;
    thumbnail_url?: string;
  };
}

export interface SavedPlacesResponse {
  data: SavedPlaceProfile[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  auth_provider?: string;
  avatar_url?: string;
  city?: string;
  role: string;
  explorer_points: number;
  badge_type?: string;
  preferences?: UserPreferences;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  destinations_visited: number;
  ai_plans_created: number;
  explorer_points: number;
  saved_places_count: number;
  chat_sessions_count: number;
}
