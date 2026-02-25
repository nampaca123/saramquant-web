'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';
import { isValidEmail, isValidPassword } from '@/lib/validation';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ERROR_MAP: Record<string, keyof typeof t.auth> = {
  RATE_LIMITED: 'errRateLimited',
  INVALID_CODE: 'errInvalidCode',
  INVALID_CODE_FORMAT: 'errInvalidCode',
  CODE_EXPIRED: 'errCodeExpired',
  TOO_MANY_ATTEMPTS: 'errTooManyAttempts',
  EMAIL_NOT_VERIFIED: 'errEmailNotVerified',
  INVALID_RESET_TARGET: 'errInvalidResetTarget',
};

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const txt = useText();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resolveError = useCallback(
    (err: unknown, fallbackKey: keyof typeof t.auth) => {
      if (err instanceof ApiError) {
        const body = err.body as { code?: string } | null;
        const key = body?.code ? ERROR_MAP[body.code] : undefined;
        setError(key ? txt(t.auth[key]) : txt(t.auth[fallbackKey]));
      } else {
        setError(txt(t.auth[fallbackKey]));
      }
    },
    [txt],
  );

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) { setError(txt(t.auth.errInvalidEmail)); return; }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setStep(2);
      setCooldown(60);
    } catch (err) {
      resolveError(err, 'errSendFailed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setCooldown(60);
    } catch (err) {
      resolveError(err, 'errSendFailed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ email, code, purpose: 'PASSWORD_RESET' });
      setVerificationId(res.verificationId);
      setStep(3);
    } catch (err) {
      resolveError(err, 'errVerifyFailed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidPassword(newPassword)) { setError(txt(t.auth.errInvalidPassword)); return; }
    if (newPassword !== confirmPw) { setError(txt(t.auth.errPasswordMismatch)); return; }

    setLoading(true);
    try {
      await authApi.resetPassword({ email, newPassword, verificationId });
      setDone(true);
    } catch (err) {
      resolveError(err, 'errResetFailed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-zinc-700">{txt(t.auth.passwordResetSuccess)}</p>
        <Button onClick={onBack}>{txt(t.common.login)}</Button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <Input
          type="password"
          placeholder={txt(t.auth.newPassword)}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          maxLength={100}
          autoComplete="new-password"
        />
        <Input
          type="password"
          placeholder={txt(t.auth.confirmPassword)}
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          required
          minLength={8}
          maxLength={100}
          autoComplete="new-password"
        />
        {error && <p className="text-sm text-warning">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? txt(t.common.loading) : txt(t.auth.newPassword)}
        </Button>
      </form>
    );
  }

  if (step === 2) {
    return (
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-700 mb-1">
            {txt(t.auth.enterCode)}
          </p>
          <p className="text-xs text-zinc-400 mb-3">
            {txt(t.auth.codeDescription)}
          </p>
        </div>
        <Input
          placeholder="00000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
          maxLength={5}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="text-center text-lg tracking-[0.3em]"
        />
        {error && <p className="text-sm text-warning">{error}</p>}
        <Button type="submit" disabled={loading || code.length !== 5}>
          {loading ? txt(t.common.loading) : txt(t.auth.verifyCode)}
        </Button>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || loading}
          className="text-sm text-zinc-500 hover:text-gold transition-colors disabled:opacity-50"
        >
          {cooldown > 0
            ? `${txt(t.auth.resend)} (${cooldown}s)`
            : txt(t.auth.resend)}
        </button>
        <button
          type="button"
          onClick={() => { setStep(1); setCode(''); setError(''); }}
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          ← {txt(t.common.cancel)}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-700 mb-1">
          {txt(t.auth.forgotPassword)}
        </p>
        <p className="text-xs text-zinc-400 mb-3">
          {txt(t.auth.codeSentToEmail)}
        </p>
      </div>
      <Input
        type="email"
        placeholder={txt(t.auth.email)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      {error && <p className="text-sm text-warning">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? txt(t.common.loading) : txt(t.auth.sendCode)}
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        ← {txt(t.common.cancel)}
      </button>
    </form>
  );
}
