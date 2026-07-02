import { api } from '@/lib/api';
import type { Trip, TripsListResponse } from '@/types/trip';

export const tripService = {
  async listTrips({ page = 1, perPage = 10 }: { page?: number; perPage?: number } = {}): Promise<TripsListResponse> {
    const response = await api.get('/trips', { params: { page, per_page: perPage } });
    return {
      data: response.data.data || [],
      meta: response.data.meta || { page, per_page: perPage, total: 0 },
    };
  },

  async getTrip(id: string): Promise<Trip> {
    const response = await api.get(`/trips/${id}`);
    return response.data.data || response.data;
  },

  async deleteTrip(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/trips/${id}`);
    return response.data.data || response.data;
  },
};
