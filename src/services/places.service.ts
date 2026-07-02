import { api } from '@/lib/api';
import { 
  ApiResponse, Place, PlacesFilters, Category, City, TrendingSearch, Review,
  CreateReviewPayload, UpdateReviewPayload
} from '@/types/places';

interface ReviewsQueryParams {
  page?: number;
  per_page?: number;
}

export const placesService = {
  async getPlaces(filters: PlacesFilters, signal?: AbortSignal): Promise<ApiResponse<Place[]>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    
    if (filters.city) {
      if (Array.isArray(filters.city)) {
        filters.city.forEach(c => params.append('cities[]', c));
      } else {
        params.append('cities[]', filters.city);
      }
    }
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }

    if (filters.budget_level && filters.budget_level.length > 0) {
      filters.budget_level.forEach(b => params.append('budget_level[]', b));
    }

    if (filters.best_season) params.append('best_season', filters.best_season);
    if (filters.crowd_level) params.append('crowd_level', filters.crowd_level);
    if (filters.suitable_for) params.append('suitable_for', filters.suitable_for);
    if (filters.suitable_age) params.append('suitable_age', filters.suitable_age);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.search) params.append('search', filters.search);

    const { data } = await api.get<ApiResponse<Place[]>>(`/places?${params.toString()}`, {
      signal
    });
    return data;
  },

  async getPopularPlaces(): Promise<ApiResponse<Place[]>> {
    const { data } = await api.get<ApiResponse<Place[]>>('/places/popular');
    return data;
  },

  async searchPlaces(query: string, signal?: AbortSignal): Promise<ApiResponse<Place[]>> {
    const { data } = await api.get<ApiResponse<Place[]>>('/places/search', {
      params: { q: query },
      signal
    });
    return data;
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await api.get<ApiResponse<Category[]>>('/places/categories');
    return data;
  },

  async getCities(): Promise<ApiResponse<City[]>> {
    const { data } = await api.get<ApiResponse<City[]>>('/places/cities');
    return data;
  },

  async getTrendingSearches(): Promise<ApiResponse<TrendingSearch[]>> {
    const { data } = await api.get<ApiResponse<TrendingSearch[]>>('/places/trending');
    return data;
  },

  async getPlaceById(id: number): Promise<ApiResponse<Place>> {
    const { data } = await api.get<ApiResponse<Place>>(`/places/${id}`);
    return data;
  },

  async getPlaceReviews(
    id: number,
    params?: ReviewsQueryParams
  ): Promise<ApiResponse<Review[]>> {
    const { data } = await api.get<ApiResponse<Review[]>>(`/places/${id}/reviews`, {
      params,
    });
    return data;
  },

  async createReview(
    placeId: number,
    payload: CreateReviewPayload
  ): Promise<ApiResponse<Review>> {
    const { data } = await api.post<ApiResponse<Review>>(
      `/places/${placeId}/reviews`,
      payload
    );
    return data;
  },

  async updateReview(
    placeId: number,
    reviewId: string,
    payload: UpdateReviewPayload
  ): Promise<ApiResponse<Review>> {
    const { data } = await api.put<ApiResponse<Review>>(
      `/places/${placeId}/reviews/${reviewId}`,
      payload
    );
    return data;
  },

  async deleteReview(
    placeId: number,
    reviewId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.delete<ApiResponse<{ message: string }>>(
      `/places/${placeId}/reviews/${reviewId}`
    );
    return data;
  },

  async savePlace(id: number): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.post<ApiResponse<{ message: string }>>(`/places/${id}/save`);
    return data;
  },

  async unsavePlace(id: number): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.delete<ApiResponse<{ message: string }>>(`/places/${id}/save`);
    return data;
  },

  async checkSaveStatus(id: number): Promise<ApiResponse<{ is_saved: boolean }>> {
    const { data } = await api.get<ApiResponse<{ is_saved: boolean }>>(`/places/${id}/save`);
    return data;
  },
};
