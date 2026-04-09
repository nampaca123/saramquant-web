import { api } from '../client';
import type { UserResponse, ProfileResponse, ProfileUpdateRequest } from '@/types';

export const userApi = {
  me: () => api<UserResponse>('/api/user/me'),

  updateProfile: (body: ProfileUpdateRequest) =>
    api<ProfileResponse>('/api/user/profile', { method: 'PATCH', body }),

  uploadProfileImage: async (file: File): Promise<{ profileImageUrl: string }> => {
    const form = new FormData();
    form.append('file', file);
    return api<{ profileImageUrl: string }>('/api/user/profile/image', { method: 'POST', body: form });
  },

  deleteProfileImage: () =>
    api<void>('/api/user/profile/image', { method: 'DELETE' }),

  deactivateAccount: () => api<void>('/api/user/me', { method: 'DELETE' }),
} as const;
