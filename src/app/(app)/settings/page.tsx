'use client';

import { useRouter } from 'next/navigation';
import { Settings, User, Globe, Languages, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { ProfileSection } from '@/features/settings/components/ProfileSection';
import { PreferredMarkets } from '@/features/settings/components/PreferredMarkets';
import { AccountSection } from '@/features/settings/components/AccountSection';

export default function SettingsPage() {
  const txt = useText();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();

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
          <Card>
            <div className="flex gap-2">
              <Button
                variant={language === 'ko' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => language !== 'ko' && toggleLanguage()}
                className="flex-1"
              >
                한국어
              </Button>
              <Button
                variant={language === 'en' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => language !== 'en' && toggleLanguage()}
                className="flex-1"
              >
                English
              </Button>
            </div>
          </Card>

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
