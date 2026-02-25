import { api } from '../client';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  verificationId: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface VerifyEmailRequest {
  email: string;
  code: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET';
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  verificationId: string;
}

export const authApi = {
  signup: (body: SignupRequest) => api<void>('/api/auth/signup', { method: 'POST', body }),

  login: (body: LoginRequest) => api<void>('/api/auth/login', { method: 'POST', body }),

  sendVerification: (body: { email: string }) =>
    api<void>('/api/auth/send-verification', { method: 'POST', body }),

  forgotPassword: (body: { email: string }) =>
    api<void>('/api/auth/forgot-password', { method: 'POST', body }),

  verifyEmail: (body: VerifyEmailRequest) =>
    api<{ verificationId: string }>('/api/auth/verify-email', { method: 'POST', body }),

  resetPassword: (body: ResetPasswordRequest) =>
    api<void>('/api/auth/reset-password', { method: 'POST', body }),

  refresh: () => api<void>('/api/auth/refresh', { method: 'POST' }),

  logout: () => api<void>('/api/auth/logout', { method: 'POST' }),

  logoutAll: () => api<void>('/api/auth/logout-all', { method: 'POST' }),

  oauthUrl: (provider: 'google' | 'kakao') =>
    `/oauth2/authorization/${provider}`,
} as const;
