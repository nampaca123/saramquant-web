'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CallbackHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get('error');

  useEffect(() => {
    if (!error) {
      router.replace('/home');
      return;
    }
    const timeout = setTimeout(() => router.replace('/'), 3000);
    return () => clearTimeout(timeout);
  }, [error, router]);

  if (!error) return null;

  const message =
    error === 'DUPLICATE_EMAIL'
      ? `This email is already linked to ${params.get('existing_provider') ?? 'another provider'}.`
      : 'Login failed. Redirecting...';

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-red-600">{message}</p>
      <p className="mt-2 text-xs text-zinc-400">Redirecting to login...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
