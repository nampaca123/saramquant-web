'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { AvatarPicker } from '@/features/onboarding/components/AvatarPicker';
import { AccountInfoCard } from '@/features/onboarding/components/AccountInfoCard';
import { OnboardingForm } from '@/features/onboarding/components/OnboardingForm';

export default function OnboardingPage() {
  const txt = useText();
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">{txt(t.onboarding.heading)}</h1>
          <p className="mt-1 text-sm text-zinc-500">{txt(t.onboarding.headingDesc)}</p>
        </div>

        <div className="mb-8">
          <AvatarPicker
            initialUrl={user?.profile?.profileImageUrl ?? null}
            onFileSelect={setAvatarFile}
          />
        </div>

        {user && (
          <div className="mb-6">
            <AccountInfoCard
              email={user.email}
              name={user.name}
              provider={user.provider}
            />
          </div>
        )}

        <OnboardingForm avatarFile={avatarFile} />
      </div>
    </div>
  );
}
