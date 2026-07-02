import type { UserPreferences } from './user';

export interface TripDestination {
  id: string;
  trip_id: string;
  city: string;
  days_allocated: number;
  category?: string;
  order_in_trip: number;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  preferences?: UserPreferences;
  status: string;
  created_at: string;
  updated_at: string;
  destinations?: TripDestination[];
}

export interface TripsListResponse {
  data: Trip[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}
