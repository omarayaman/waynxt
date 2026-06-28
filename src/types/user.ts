export interface UserPreferences {
  interests: string[];
  travel_companion: string;
  budget: string;
  age_group: string;
  crowd_preference: string;
  season: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  auth_provider: string;
  avatar_url: string;
  city: string;
  role: string;
  explorer_points: number;
  badge_type: string;
  preferences: UserPreferences;
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
