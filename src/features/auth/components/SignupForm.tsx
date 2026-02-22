'use client';

import { useState, type FormEvent } from 'react';
import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const txt = useText();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.signup({ email, password, name });
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 409 ? '이미 사용 중인 이메일이에요' : '회원가입에 실패했어요');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        placeholder={txt(t.auth.name)}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
        autoComplete="name"
      />
      <Input
        type="email"
        placeholder={txt(t.auth.email)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder={txt(t.auth.password)}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        maxLength={100}
        autoComplete="new-password"
      />
      {error && <p className="text-sm text-warning">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? txt(t.common.loading) : txt(t.common.signup)}
      </Button>
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-zinc-500 hover:text-gold transition-colors"
      >
        {txt(t.auth.hasAccount)}
      </button>
    </form>
  );
}
