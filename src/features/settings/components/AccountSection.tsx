'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';

export function AccountSection() {
  const txt = useText();
  const { clear } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await userApi.deactivateAccount();
      clear();
    } catch { /* handled */ }
    setLoading(false);
  };

  return (
    <>
      <Card className="p-5">
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            {txt(t.settings.deactivateAccount)}
          </Button>
        </div>
      </Card>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">{txt(t.settings.deactivateAccount)}</h3>
        <p className="text-zinc-600 text-sm mb-4">{txt(t.settings.deactivateWarning)}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>
            {txt(t.common.cancel)}
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeactivate} disabled={loading}>
            {loading ? txt(t.common.loading) : txt(t.settings.deactivateAccount)}
          </Button>
        </div>
      </Modal>
    </>
  );
}
