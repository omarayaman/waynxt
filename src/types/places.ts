export interface TripActivity {
  id: string;
  trip_day_id: string;
  place_id: number;
  place: string;
  activity_name: string;
  activity_type: string;
  category: string;
  description: string;
  duration_hours: number;
  start_time: string;
  end_time: string;
  estimated_cost: number;
  order_in_day: number;
  rating: number;
}

export interface SavedPlace {
  id: number;
  user_id: string;
  place: string;
  place_id: number;
  created_at: string;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  city: string;
  category: string;
  thumbnail_url: string;
  rating: number;
  duration_needed: number;
  budget_level: string;
  best_season: string;
  crowd_level: string;
  suitable_for: string;
  suitable_age: string;
  created_at: string;
  saved_by?: SavedPlace[];
  trip_activities?: TripActivity[];
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export interface PlacesFilters {
  page?: number;
  per_page?: number;
  city?: string | string[]; // can be single string or array
  category?: string;
  budget_level?: string[];
  best_season?: string;
  crowd_level?: string;
  suitable_for?: string;
  suitable_age?: string;
  sort_by?: string;
  search?: string;
}

export interface Category {
  category: string;
  count: number;
}

export interface City {
  city: string;
  count: number;
}

export interface TrendingSearch {
  query: string;
  count: number;
}

export interface Review {
  id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}
