import { api } from '../client';
import type { HomeSummary } from '@/features/home/types/home.types';

export const homeApi = {
  summary: () => api<HomeSummary>('/api/home/summary'),
} as const;
