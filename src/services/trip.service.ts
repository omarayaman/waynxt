import { api } from '@/lib/api';
import { TRIP_READ_TIMEOUT_MS } from '@/lib/api-errors';
import type {
  CreateExpenseInput,
  CreateTripInput,
  ExpensesListResponse,
  Trip,
  TripExpense,
  TripsListResponse,
  UpdateExpenseInput,
  UpdateTripInput,
} from '@/types/trip';

export interface CreateTripResult {
  trip: Trip;
}

export const tripService = {
  async listTrips({ page = 1, perPage = 10 }: { page?: number; perPage?: number } = {}): Promise<TripsListResponse> {
    const response = await api.get('/trips', {
      params: { page, per_page: perPage },
      timeout: TRIP_READ_TIMEOUT_MS,
    });
    return {
      data: response.data.data || [],
      meta: response.data.meta || { page, per_page: perPage, total: 0 },
    };
  },

  async getTrip(id: string): Promise<Trip> {
    const response = await api.get(`/trips/${id}`, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async createTrip(input: CreateTripInput): Promise<CreateTripResult> {
    const response = await api.post('/trips', input, { timeout: 120_000 }); // 2-min timeout for AI generation
    return {
      trip: response.data.data || response.data,
    };
  },

  async updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
    const response = await api.put(`/trips/${id}`, input, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async deleteTrip(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/trips/${id}`, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async regenerateItinerary(id: string): Promise<Trip> {
    const response = await api.post(`/trips/${id}/regenerate`, undefined, {
      timeout: 120_000, // 2-min timeout for AI generation
    });
    return response.data.data || response.data;
  },

  async listExpenses({
    tripId,
    page = 1,
    perPage = 50,
  }: {
    tripId: string;
    page?: number;
    perPage?: number;
  }): Promise<ExpensesListResponse> {
    const response = await api.get(`/trips/${tripId}/expenses`, {
      params: { page, per_page: perPage },
      timeout: TRIP_READ_TIMEOUT_MS,
    });
    return {
      data: response.data.data || [],
      meta: response.data.meta || { page, per_page: perPage, total: 0 },
    };
  },

  async createExpense(tripId: string, input: CreateExpenseInput): Promise<TripExpense> {
    const response = await api.post(`/trips/${tripId}/expenses`, input, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async updateExpense(tripId: string, expenseId: string, input: UpdateExpenseInput): Promise<TripExpense> {
    const response = await api.put(`/trips/${tripId}/expenses/${expenseId}`, input, {
      timeout: TRIP_READ_TIMEOUT_MS,
    });
    return response.data.data || response.data;
  },

  async deleteExpense(tripId: string, expenseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/trips/${tripId}/expenses/${expenseId}`, {
      timeout: TRIP_READ_TIMEOUT_MS,
    });
    return response.data.data || response.data;
  },
};
