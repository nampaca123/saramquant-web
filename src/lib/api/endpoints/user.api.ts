import { api } from '../client';
import type { UserResponse, ProfileResponse, ProfileUpdateRequest } from '@/types';

export const userApi = {
  me: () => api<UserResponse>('/api/user/me'),

  updateProfile: (body: ProfileUpdateRequest) =>
    api<ProfileResponse>('/api/user/profile', { method: 'PATCH', body }),

  deleteAccount: () => api<void>('/api/user/me', { method: 'DELETE' }),
} as const;
