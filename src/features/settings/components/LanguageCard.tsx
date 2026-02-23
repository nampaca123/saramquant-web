'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useText } from '@/lib/i18n/use-text';
import { useLanguage } from '@/providers/LanguageProvider';
import { t } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/cn';
import type { Language } from '@/types';

const LANG_OPTIONS: [Language, string][] = [
  ['ko', '한국어'],
  ['en', 'English'],
];

export function LanguageCard() {
  const txt = useText();
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [saved, setSaved] = useState(false);
  const changed = selected !== language;

  const handleSave = () => {
    setLanguage(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card>
      <p className="text-xs text-zinc-500 mb-3">{txt(t.settings.languageDesc)}</p>
      <div className="flex gap-2 mb-3">
        {LANG_OPTIONS.map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setSelected(val); setSaved(false); }}
            className={cn(
              'flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-all',
              selected === val
                ? 'border-gold bg-gold-wash text-gold'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={handleSave} disabled={!changed && !saved}>
          {saved ? (
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" />{txt(t.settings.saved)}</span>
          ) : (
            txt(t.common.save)
          )}
        </Button>
      </div>
    </Card>
  );
}
