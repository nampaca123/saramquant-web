'use client';

import { useRouter } from 'next/navigation';
import { Settings, User, Globe, Languages, Shield, Sparkles } from 'lucide-react';
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

function SectionHeader({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-zinc-400" />
      <h2 className="text-sm font-semibold text-zinc-600">{title}</h2>
    </div>
  );
}

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
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-gold" />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{txt(t.settings.title)}</h1>
          <p className="text-xs text-zinc-500">{txt(t.settings.subtitle)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left column — identity & system info */}
        <div className="space-y-4">
          <SectionHeader icon={User} title={txt(t.settings.accountInfo)} />
          <AccountOverview />

          <SectionHeader icon={Sparkles} title={txt(t.settings.llmUsage)} />
          <LlmUsageCard />

          <SectionHeader icon={Shield} title={txt(t.settings.account)} />
          <AccountSection />
        </div>

        {/* Right column — editable preferences */}
        <div className="space-y-4">
          <SectionHeader icon={Globe} title={txt(t.settings.profile)} />
          <ProfileSection />

          <SectionHeader icon={Languages} title={txt(t.settings.language)} />
          <LanguageCard />
        </div>
      </div>
    </div>
  );
}
