'use client';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/common/Header';
import { BottomTabs } from '@/components/common/BottomTabs';
import { Disclaimer } from '@/components/common/Disclaimer';
import { Skeleton } from '@/components/ui/Skeleton';
import { t } from '@/lib/i18n/translations';

function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <Disclaimer text={t.disclaimer.global} />
      <BottomTabs />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
