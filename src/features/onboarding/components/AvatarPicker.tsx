'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, User } from 'lucide-react';
import { useText } from '@/lib/i18n/use-text';
import { t } from '@/lib/i18n/translations';

interface AvatarPickerProps {
  initialUrl: string | null;
  onFileSelect: (file: File) => void;
}

export function AvatarPicker({ initialUrl, onFileSelect }: AvatarPickerProps) {
  const txt = useText();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [imgError, setImgError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    setImgError(false);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative h-24 w-24 rounded-full bg-zinc-100 ring-2 ring-zinc-200 ring-offset-2 transition-all hover:ring-gold focus:outline-none focus:ring-gold"
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
          <User className="mx-auto h-10 w-10 text-zinc-300" />
        )}
        <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white shadow-md transition-transform group-hover:scale-110">
          <Camera className="h-4 w-4" />
        </span>
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <p className="mt-2 text-xs text-zinc-400">{txt(t.onboarding.avatarHint)}</p>
    </div>
  );
}
