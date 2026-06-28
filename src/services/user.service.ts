import { api } from '@/lib/api';
import { UserProfile, UserStats, UserPreferences } from '@/types/user';
import { Place } from '@/types/places';

export interface UpdateProfileInput {
  full_name?: string;
  city?: string;
  avatar_url?: string;
}

export interface ChangePasswordInput {
  old_password?: string;
  new_password?: string;
}

export interface SavedPlacesResponse {
  data: Place[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
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
    return response.data;
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

  async getSavedPlaces(page: number = 1, perPage: number = 10): Promise<SavedPlacesResponse> {
    const response = await api.get(`/users/saved-places?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await api.delete('/users/account');
    return response.data;
  }
};
