'use client';

import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { AccountOverview } from '@/features/settings/components/AccountOverview';
import { ProfileSection } from '@/features/settings/components/ProfileSection';
import { LlmUsageCard } from '@/features/settings/components/LlmUsageCard';
import { LanguageCard } from '@/features/settings/components/LanguageCard';
import { AccountSection } from '@/features/settings/components/AccountSection';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{children}</h2>;
}

export default function SettingsPage() {
  const txt = useText();
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-fade-in">
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
    <div className="animate-fade-in space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{txt(t.settings.title)}</h1>
        <p className="text-sm text-zinc-500 mt-1">{txt(t.settings.subtitle)}</p>
      </div>

      {/* Account card — full width */}
      <section>
        <SectionLabel>{txt(t.settings.accountInfo)}</SectionLabel>
        <AccountOverview />
      </section>

      {/* Two-column: Profile | Language + AI */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <SectionLabel>{txt(t.settings.profile)}</SectionLabel>
          <ProfileSection />
        </section>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <SectionLabel>{txt(t.settings.language)}</SectionLabel>
            <LanguageCard />
          </section>
          <section>
            <SectionLabel>{txt(t.settings.llmUsage)}</SectionLabel>
            <LlmUsageCard />
          </section>
        </div>
      </div>

      {/* Account management — full width, bottom */}
      <section>
        <SectionLabel>{txt(t.settings.account)}</SectionLabel>
        <AccountSection />
      </section>
    </div>
  );
}
