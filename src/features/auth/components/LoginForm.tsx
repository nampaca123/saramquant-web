'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onBack: () => void;
}

export function LoginForm({ onSwitchToSignup, onSwitchToForgotPassword, onBack }: LoginFormProps) {
  const txt = useText();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.login({ email, password });
      router.push('/screener');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? '이메일 또는 비밀번호가 맞지 않아요' : '로그인에 실패했어요');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder={txt(t.auth.email)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <div className="flex flex-col gap-1">
        <Input
          type="password"
          placeholder={txt(t.auth.password)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-xs text-zinc-400 hover:text-gold transition-colors"
          >
            {txt(t.auth.forgotPassword)}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-warning">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? txt(t.common.loading) : txt(t.common.login)}
      </Button>
      <div className="flex items-center gap-3 my-1">
        <div className="h-px flex-1 bg-zinc-100" />
        <span className="text-xs text-zinc-300">or</span>
        <div className="h-px flex-1 bg-zinc-100" />
      </div>
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="text-sm text-zinc-500 hover:text-gold transition-colors"
      >
        {txt(t.auth.noAccount)}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-xs text-zinc-300 hover:text-zinc-500 transition-colors"
      >
        ← {txt(t.common.cancel)}
      </button>
    </form>
  );
}
