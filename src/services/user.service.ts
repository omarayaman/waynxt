import { api } from '@/lib/api';
import {
  UserProfile,
  UserStats,
  UserPreferences,
  SavedPlacesResponse,
  SavedPlaceProfile,
  SavedPlaceApiItem,
} from '@/types/user';

function mapSavedPlaceItem(item: SavedPlaceApiItem): SavedPlaceProfile {
  return {
    id: String(item.id),
    place_id: item.place_id ?? item.place?.id ?? 0,
    place_name: item.place_name ?? item.place?.name ?? 'Unknown place',
    location: item.location ?? item.place?.city ?? '',
    saved_at: item.saved_at ?? item.created_at,
    category: item.place?.category,
    thumbnail_url: item.place?.thumbnail_url,
  };
}

export interface UpdateProfileInput {
  full_name?: string;
  city?: string;
  avatar_url?: string;
}

export interface ChangePasswordInput {
  old_password: string;
  new_password: string;
}

export const userService = {
  async updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
    const response = await api.put('/users/profile', data);
    return response.data.data || response.data;
  },

  async updatePreferences(data: UserPreferences): Promise<UserProfile> {
    const response = await api.put('/users/preferences', data);
    return response.data.data || response.data;
  },

  async changePassword(data: ChangePasswordInput): Promise<{ message: string }> {
    const response = await api.put('/users/password', data);
    return response.data.data || response.data;
  },

  async uploadAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  async getStats(): Promise<UserStats> {
    const response = await api.get('/users/stats');
    return response.data.data || response.data;
  },

  async getSavedPlaces({ page = 1, perPage = 10 }: { page?: number; perPage?: number } = {}): Promise<SavedPlacesResponse> {
    const response = await api.get(`/users/saved-places?page=${page}&per_page=${perPage}`);
    const raw: SavedPlaceApiItem[] = response.data.data || [];
    const data: SavedPlaceProfile[] = raw.map(mapSavedPlaceItem);
    return {
      data,
      meta: response.data.meta || { page, per_page: perPage, total: 0 },
    };
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await api.delete('/users/account');
    return response.data.data || response.data;
  },
};
