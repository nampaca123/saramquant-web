import type { AuthProvider, Gender, InvestmentExperience, Market, UserRole } from './enum.types';

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: string;
  profile: ProfileResponse | null;
}

export interface ProfileResponse {
  nickname: string | null;
  profileImageUrl: string | null;
  gender: Gender | null;
  birthYear: number | null;
  investmentExperience: InvestmentExperience | null;
  preferredMarkets: Market[];
}

export interface ProfileUpdateRequest {
  name?: string;
  gender?: Gender;
  birthYear?: number;
  investmentExperience?: InvestmentExperience;
  preferredMarkets?: Market[];
}
