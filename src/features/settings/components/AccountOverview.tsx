'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, User, Mail, Lock, Calendar, Crown, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';
import type { AuthProvider, UserRole } from '@/types';

const PROVIDER_META: Record<AuthProvider, { label: string; icon?: string }> = {
  GOOGLE: { label: 'Google', icon: '/image/provider/google.png' },
  KAKAO: { label: 'Kakao', icon: '/image/provider/kakao.png' },
  MANUAL: { label: 'Email' },
};

const ROLE_META: Record<UserRole, { labelKey: 'roleStandard' | 'roleAdmin'; icon: typeof Crown }> = {
  STANDARD: { labelKey: 'roleStandard', icon: ShieldCheck },
  ADMIN: { labelKey: 'roleAdmin', icon: Crown },
};

function ProviderIcon({ provider }: { provider: AuthProvider }) {
  const meta = PROVIDER_META[provider];
  if (meta.icon) {
    return (
      <Image
        src={meta.icon}
        alt=""
        width={16}
        height={16}
        draggable={false}
        className="shrink-0 rounded-sm pointer-events-none select-none"
      />
    );
  }
  return <Lock className="h-4 w-4 text-zinc-400 shrink-0" />;
}

export function AccountOverview() {
  const txt = useText();
  const { user, refresh } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user?.profile?.profileImageUrl ?? null);
  const [imgError, setImgError] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const roleMeta = ROLE_META[user.role];
  const RoleIcon = roleMeta.icon;
  const parsed = user.createdAt ? new Date(user.createdAt) : null;
  const joinedDate = parsed && !isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : '—';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError(false);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await userApi.uploadProfileImage(file);
      await refresh();
    } catch { /* handled */ }
    setUploading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="group relative h-18 w-18 shrink-0 rounded-full bg-zinc-100 ring-2 ring-zinc-200 ring-offset-2 transition-all hover:ring-gold focus:outline-none focus:ring-gold disabled:opacity-50"
          >
            {preview && !imgError ? (
              <Image
                src={preview}
                alt="avatar"
                fill
                unoptimized
                className="rounded-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <User className="mx-auto h-8 w-8 text-zinc-300" />
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white shadow transition-transform group-hover:scale-110">
              <Camera className="h-3 w-3" />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

          <div className="min-w-0">
            <p className="text-lg font-semibold text-zinc-900 truncate">
              {user.profile?.nickname ?? user.name}
            </p>
            <p className="text-sm text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Role badge — top right */}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shrink-0 ${user.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-500'}`}>
          <RoleIcon className="h-3.5 w-3.5" />
          {txt(t.settings[roleMeta.labelKey])}
        </span>
      </div>

      {/* Detail rows — 2-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 rounded-lg bg-zinc-50 px-5 py-4">
        <Row icon={<Mail className="h-4 w-4 text-zinc-400" />} label={txt(t.auth.email)} value={user.email} />
        <Row icon={<ProviderIcon provider={user.provider} />} label={txt(t.settings.provider)} value={PROVIDER_META[user.provider].label} />
        <Row icon={<User className="h-4 w-4 text-zinc-400" />} label={txt(t.auth.name)} value={user.name} />
        <Row icon={<Calendar className="h-4 w-4 text-zinc-400" />} label={txt(t.settings.joined)} value={joinedDate} />
      </div>
    </Card>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="shrink-0">{icon}</span>
      <span className="text-zinc-400 w-20 shrink-0">{label}</span>
      <span className="text-zinc-700 truncate">{value}</span>
    </div>
  );
}
