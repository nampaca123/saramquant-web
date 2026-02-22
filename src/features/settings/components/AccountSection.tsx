'use client';

import { useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useText } from '@/lib/i18n/use-text';
import { useAuth } from '@/providers/AuthProvider';
import { authApi, userApi } from '@/lib/api';
import { t } from '@/lib/i18n/translations';

export function AccountSection() {
  const txt = useText();
  const { clear } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoutAll = async () => {
    await authApi.logoutAll();
    clear();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await userApi.deleteAccount();
      clear();
    } catch { /* handled */ }
    setLoading(false);
  };

  return (
    <>
      <Card className="border-warning/10">
        <h3 className="text-sm font-medium text-zinc-700 mb-3">{txt(t.settings.account)}</h3>
        <div className="space-y-2">
          <Button variant="secondary" size="sm" onClick={handleLogoutAll}>
            <LogOut className="h-4 w-4 mr-2" />
            {txt(t.settings.logoutAll)}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            {txt(t.settings.deleteAccount)}
          </Button>
        </div>
      </Card>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">{txt(t.settings.deleteAccount)}</h3>
        <p className="text-warning font-medium text-sm mb-4">{txt(t.settings.deleteAccountWarning)}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>
            {txt(t.common.cancel)}
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
            {loading ? txt(t.common.loading) : txt(t.common.delete)}
          </Button>
        </div>
      </Modal>
    </>
  );
}
