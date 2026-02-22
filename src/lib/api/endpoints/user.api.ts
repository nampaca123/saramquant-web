import { api } from '../client';
import { env } from '@/lib/config/env';
import type { UserResponse, ProfileResponse, ProfileUpdateRequest } from '@/types';

export const userApi = {
  me: () => api<UserResponse>('/api/user/me'),

  updateProfile: (body: ProfileUpdateRequest) =>
    api<ProfileResponse>('/api/user/profile', { method: 'PATCH', body }),

  uploadProfileImage: async (file: File): Promise<{ profileImageUrl: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${env.gatewayUrl}/api/user/profile/image`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Gateway-Auth-Key': env.gatewayAuthKey },
      body: form,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  },

  deleteProfileImage: () =>
    api<void>('/api/user/profile/image', { method: 'DELETE' }),

  deleteAccount: () => api<void>('/api/user/me', { method: 'DELETE' }),
} as const;
