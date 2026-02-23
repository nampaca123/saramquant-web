'use client';

import Image from 'next/image';
import { Mail, User, Lock } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import type { AuthProvider } from '@/types';

interface AccountInfoCardProps {
  email: string;
  name: string;
  provider: AuthProvider;
}

const PROVIDER_META: Record<AuthProvider, { label: string; icon?: string }> = {
  GOOGLE: { label: 'Google', icon: '/image/provider/google.png' },
  KAKAO: { label: 'Kakao', icon: '/image/provider/kakao.png' },
  MANUAL: { label: 'Email' },
};

function ProviderIcon({ provider }: { provider: AuthProvider }) {
  const meta = PROVIDER_META[provider];

  if (meta.icon) {
    return (
      <Image
        src={meta.icon}
        alt=""
        width={16}
        height={16}
        draggable={false}
        className="shrink-0 rounded-sm pointer-events-none select-none"
      />
    );
  }

  return <Lock className="h-4 w-4 text-zinc-300 shrink-0" />;
}

export function AccountInfoCard({ email, name, provider }: AccountInfoCardProps) {
  const txt = useText();

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 space-y-3">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
        {txt(t.onboarding.accountInfo)}
      </p>
      <div className="flex items-center gap-3">
        <Mail className="h-4 w-4 text-zinc-300 shrink-0" />
        <span className="text-sm text-zinc-400 truncate">{email}</span>
      </div>
      <div className="flex items-center gap-3">
        <User className="h-4 w-4 text-zinc-300 shrink-0" />
        <span className="text-sm text-zinc-400">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <ProviderIcon provider={provider} />
        <span className="text-sm text-zinc-400">{PROVIDER_META[provider].label}</span>
      </div>
    </div>
  );
}
