import type { UserPreferences } from './user';

export type TripStatus = 'draft' | 'confirmed' | 'completed';

export type ExpenseCategory =
  | 'accommodation'
  | 'food'
  | 'transport'
  | 'activities'
  | 'shopping'
  | 'entertainment'
  | 'other';

export interface TripActivity {
  id: string;
  trip_day_id: string;
  place_id?: number;
  activity_name: string;
  description?: string;
  category?: string;
  duration_hours: number;
  duration?: string;
  start_time?: string;
  end_time?: string;
  estimated_cost?: number;
  rating?: number;
  order_in_day: number;
  activity_type?: string;
  image_url?: string;
  thumbnail_url?: string;
  place?: {
    id: number;
    name: string;
    thumbnail_url?: string;
  };
}

export interface TripDay {
  id: string;
  trip_id: string;
  trip_destination_id?: string;
  day_number: number;
  date: string;
  hours_used?: number;
  activities: TripActivity[];
}

export interface TripDestination {
  id: string;
  trip_id?: string;
  city: string;
  days_allocated: number;
  category?: string;
  theme?: string;
  order_in_trip: number;
  trip_days?: TripDay[];
}

export interface TripExpense {
  id: string;
  trip_id: string;
  amount: number;
  currency: string;
  category?: ExpenseCategory;
  description?: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  preferences?: UserPreferences;
  status: TripStatus | string;
  created_at: string;
  updated_at: string;
  destinations?: TripDestination[];
  expenses?: TripExpense[];
}

export interface TripsListResponse {
  data: Trip[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface ExpensesListResponse {
  data: TripExpense[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateTripInput {
  start_date: string;
  end_date: string;
  travelers_count: number;
  preferences: UserPreferences;
}

export interface UpdateTripInput {
  title?: string;
  travelers_count?: number;
  status?: TripStatus;
}

export interface CreateExpenseInput {
  amount: number;
  currency?: string;
  category?: ExpenseCategory;
  description?: string;
  date?: string;
}

export interface UpdateExpenseInput {
  amount?: number;
  currency?: string;
  category?: ExpenseCategory;
  description?: string;
  date?: string;
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; labelAr: string }[] = [
  { value: 'accommodation', label: 'Accommodation', labelAr: 'إقامة' },
  { value: 'food', label: 'Food & Drinks', labelAr: 'طعام' },
  { value: 'transport', label: 'Transport', labelAr: 'مواصلات' },
  { value: 'activities', label: 'Activities', labelAr: 'أنشطة' },
  { value: 'shopping', label: 'Shopping', labelAr: 'تسوق' },
  { value: 'entertainment', label: 'Entertainment', labelAr: 'ترفيه' },
  { value: 'other', label: 'Other', labelAr: 'أخرى' },
];
