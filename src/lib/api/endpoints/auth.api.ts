import { api } from '../client';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const authApi = {
  signup: (body: SignupRequest) => api<void>('/api/auth/signup', { method: 'POST', body }),

  login: (body: LoginRequest) => api<void>('/api/auth/login', { method: 'POST', body }),

  refresh: () => api<void>('/api/auth/refresh', { method: 'POST' }),

  logout: () => api<void>('/api/auth/logout', { method: 'POST' }),

  logoutAll: () => api<void>('/api/auth/logout-all', { method: 'POST' }),

  oauthUrl: (provider: 'google' | 'kakao') =>
    `/oauth2/authorization/${provider}`,
} as const;
