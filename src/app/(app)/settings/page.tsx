'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Globe, Languages, Shield, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import { ProfileSection } from '@/features/settings/components/ProfileSection';
import { PreferredMarkets } from '@/features/settings/components/PreferredMarkets';
import { AccountSection } from '@/features/settings/components/AccountSection';
import type { Language } from '@/types';

export default function SettingsPage() {
  const txt = useText();
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-xl font-bold text-zinc-900 mb-6">{txt(t.settings.title)}</h1>
        <Card className="text-center py-16">
          <Settings className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900">{txt(t.settings.loginRequired)}</h2>
          <p className="text-sm text-zinc-500 mt-2">{txt(t.settings.loginRequiredSub)}</p>
          <Button variant="primary" size="lg" className="mt-6" onClick={() => router.push('/')}>
            {txt(t.common.login)}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-gold" />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{txt(t.settings.title)}</h1>
          <p className="text-xs text-zinc-500">
            {txt({ ko: '프로필과 환경설정을 관리하세요', en: 'Manage your profile and preferences' })}
          </p>
        </div>
      </div>

      {/* Profile info banner */}
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold text-xl font-bold">
            {user.profile?.nickname?.[0] ?? user.name?.[0] ?? user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-zinc-900 truncate">
              {user.profile?.nickname ?? user.name}
            </p>
            <p className="text-sm text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <SectionHeader icon={User} title={txt(t.settings.profile)} />
          <ProfileSection />

          <SectionHeader icon={Globe} title={txt(t.settings.preferredMarkets)} />
          <PreferredMarkets />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <SectionHeader icon={Languages} title={txt(t.settings.language)} />
          <LanguageCard />

          <SectionHeader icon={Shield} title={txt(t.settings.account)} />
          <AccountSection />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-zinc-400" />
      <h2 className="text-sm font-semibold text-zinc-600">{title}</h2>
    </div>
  );
}

function LanguageCard() {
  const txt = useText();
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [saved, setSaved] = useState(false);
  const changed = selected !== language;

  const handleSave = () => {
    setLanguage(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card>
      <p className="text-xs text-zinc-500 mb-3">
        {txt({ ko: '앱에 표시되는 언어를 선택하세요', en: 'Choose the language displayed in the app' })}
      </p>
      <div className="flex gap-2 mb-3">
        {([['ko', '한국어'], ['en', 'English']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setSelected(val); setSaved(false); }}
            className={cn(
              'flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-all',
              selected === val
                ? 'border-gold bg-gold-wash text-gold'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!changed && !saved}
        >
          {saved ? (
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" />{txt(t.settings.saved)}</span>
          ) : (
            txt(t.common.save)
          )}
        </Button>
      </div>
    </Card>
  );
}
