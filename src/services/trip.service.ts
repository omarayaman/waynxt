import { api } from '@/lib/api';
import { shouldUseMockFallback, getMockFallbackReason, TRIP_CREATE_TIMEOUT_MS, TRIP_READ_TIMEOUT_MS } from '@/lib/api-errors';
import {
  addMockExpense,
  deleteMockExpense,
  deleteMockTrip,
  generateMockTrip,
  getMockTrip,
  isMockTripId,
  updateMockExpense,
  updateMockTrip,
} from '@/lib/mock-trip';
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
  isMock: boolean;
  mockReason?: 'timeout' | 'unreachable' | 'server';
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
    if (isMockTripId(id)) {
      const mock = getMockTrip(id);
      if (!mock) throw new Error('Mock trip not found');
      return mock;
    }

    const response = await api.get(`/trips/${id}`, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async createTrip(input: CreateTripInput): Promise<CreateTripResult> {
    try {
      const response = await api.post('/trips', input, { timeout: TRIP_CREATE_TIMEOUT_MS });
      return {
        trip: response.data.data || response.data,
        isMock: false,
      };
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        const mockTrip = generateMockTrip(input);
        return {
          trip: mockTrip,
          isMock: true,
          mockReason: getMockFallbackReason(error),
        };
      }
      throw error;
    }
  },

  async updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
    if (isMockTripId(id)) {
      const trip = getMockTrip(id);
      if (!trip) throw new Error('Mock trip not found');
      const updated = { ...trip, ...input, updated_at: new Date().toISOString() };
      updateMockTrip(updated);
      return updated;
    }

    const response = await api.put(`/trips/${id}`, input, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async deleteTrip(id: string): Promise<{ message: string }> {
    if (isMockTripId(id)) {
      deleteMockTrip(id);
      return { message: 'trip deleted successfully' };
    }

    const response = await api.delete(`/trips/${id}`, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async regenerateItinerary(id: string): Promise<Trip> {
    if (isMockTripId(id)) {
      const trip = getMockTrip(id);
      if (!trip) throw new Error('Mock trip not found');
      return trip;
    }

    const response = await api.post(`/trips/${id}/regenerate`, undefined, {
      timeout: TRIP_CREATE_TIMEOUT_MS,
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
    if (isMockTripId(tripId)) {
      const trip = getMockTrip(tripId);
      const expenses = trip?.expenses ?? [];
      return {
        data: expenses,
        meta: { page: 1, per_page: perPage, total: expenses.length },
      };
    }

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
    if (isMockTripId(tripId)) {
      return addMockExpense(tripId, {
        amount: input.amount,
        currency: input.currency ?? 'EGP',
        category: input.category,
        description: input.description,
        date: input.date ? new Date(input.date).toISOString() : new Date().toISOString(),
      });
    }

    const response = await api.post(`/trips/${tripId}/expenses`, input, { timeout: TRIP_READ_TIMEOUT_MS });
    return response.data.data || response.data;
  },

  async updateExpense(tripId: string, expenseId: string, input: UpdateExpenseInput): Promise<TripExpense> {
    if (isMockTripId(tripId)) {
      return updateMockExpense(tripId, expenseId, input);
    }

    const response = await api.put(`/trips/${tripId}/expenses/${expenseId}`, input, {
      timeout: TRIP_READ_TIMEOUT_MS,
    });
    return response.data.data || response.data;
  },

  async deleteExpense(tripId: string, expenseId: string): Promise<{ message: string }> {
    if (isMockTripId(tripId)) {
      deleteMockExpense(tripId, expenseId);
      return { message: 'expense deleted successfully' };
    }

    const response = await api.delete(`/trips/${tripId}/expenses/${expenseId}`, {
      timeout: TRIP_READ_TIMEOUT_MS,
    });
    return response.data.data || response.data;
  },

  isMockTrip(id: string): boolean {
    return isMockTripId(id);
  },
};
