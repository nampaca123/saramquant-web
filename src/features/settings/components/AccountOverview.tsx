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
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const roleMeta = ROLE_META[user.role];
  const RoleIcon = roleMeta.icon;
  const joinedDate = new Date(user.createdAt).toLocaleDateString();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      await userApi.uploadProfileImage(file);
      await refresh();
    } catch { /* handled */ }
    setUploading(false);
  };

  return (
    <Card>
      {/* Avatar + identity */}
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group relative h-16 w-16 shrink-0 rounded-full bg-zinc-100 ring-2 ring-zinc-200 ring-offset-2 transition-all hover:ring-gold focus:outline-none focus:ring-gold disabled:opacity-50"
        >
          {preview ? (
            <Image src={preview} alt="avatar" fill className="rounded-full object-cover" />
          ) : (
            <User className="mx-auto h-7 w-7 text-zinc-300" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white shadow transition-transform group-hover:scale-110">
            <Camera className="h-3 w-3" />
          </span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        <div className="min-w-0">
          <p className="text-base font-semibold text-zinc-900 truncate">
            {user.profile?.nickname ?? user.name}
          </p>
          <p className="text-sm text-zinc-400 truncate">{user.email}</p>
          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${user.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-500'}`}>
            <RoleIcon className="h-3 w-3" />
            {txt(t.settings[roleMeta.labelKey])}
          </span>
        </div>
      </div>

      {/* Read-only details */}
      <div className="space-y-2.5 rounded-lg bg-zinc-50 p-3">
        <Row icon={<Mail className="h-4 w-4 text-zinc-400" />} label={txt(t.auth.email)} value={user.email} />
        <Row icon={<User className="h-4 w-4 text-zinc-400" />} label={txt(t.auth.name)} value={user.name} />
        <Row icon={<ProviderIcon provider={user.provider} />} label={txt(t.settings.provider)} value={PROVIDER_META[user.provider].label} />
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
      <span className="text-zinc-600 truncate">{value}</span>
    </div>
  );
}
