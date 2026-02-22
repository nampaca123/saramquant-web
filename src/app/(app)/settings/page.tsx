'use client';

import { useRouter } from 'next/navigation';
import { Settings2 } from 'lucide-react';
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
      <main className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
        <h1 className="text-xl font-bold text-zinc-900 mb-6">{txt(t.settings.title)}</h1>
        <Card className="text-center py-16">
          <Settings2 className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900">{txt(t.settings.loginRequired)}</h2>
          <p className="text-sm text-zinc-500 mt-2">{txt(t.settings.loginRequiredSub)}</p>
          <Button variant="primary" size="lg" className="mt-6" onClick={() => router.push('/')}>
            {txt(t.common.login)}
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-zinc-900">{txt(t.settings.title)}</h1>

      <ProfileSection />

      <PreferredMarkets />

      {/* Language */}
      <Card>
        <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.settings.language)}</h3>
        <div className="flex gap-2">
          <Button
            variant={language === 'ko' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => language !== 'ko' && toggleLanguage()}
          >
            KO
          </Button>
          <Button
            variant={language === 'en' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => language !== 'en' && toggleLanguage()}
          >
            EN
          </Button>
        </div>
      </Card>

      <AccountSection />
    </main>
  );
}
