// src/features/main-content/components/containers/PromptDeleteConfirmationModal.tsx
'use client';

import { usePromptStore } from '../../store/prompt-store';
import { useEffect } from 'react';

export function PromptDeleteConfirmationModal() {
  const pendingDeleteBoxId = usePromptStore((s) => s.pendingDeleteBoxId);
  const pendingDeleteGroupId = usePromptStore((s) => s.pendingDeleteGroupId);
  const cancelDeletePrompt = usePromptStore((s) => s.cancelDeletePrompt);
  const confirmDeletePrompt = usePromptStore((s) => s.confirmDeletePrompt);
  const currentFileId = usePromptStore((s) => s.currentFileId);

  const box = usePromptStore((s) => {
    if (!currentFileId || !pendingDeleteBoxId) return null;
    return s.filesData[currentFileId]?.boxes[pendingDeleteBoxId];
  });
  const group = usePromptStore((s) => {
    if (!currentFileId || !pendingDeleteGroupId) return null;
    return s.filesData[currentFileId]?.groups[pendingDeleteGroupId];
  });

  const isOpen = !!pendingDeleteBoxId || !!pendingDeleteGroupId;

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelDeletePrompt();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, cancelDeletePrompt]);

  if (!isOpen) return null;

  const typeLabel = box ? 'کارت' : 'زون';
  const name = box ? box.title : (group?.title ?? '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={cancelDeletePrompt}
    >
      <div
        className="bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">
          تأیید حذف
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          آیا از حذف {typeLabel} «{name}» مطمئن هستید؟
          {group && ' با حذف این زون، تمام کارت‌های داخل آن نیز حذف خواهند شد.'}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelDeletePrompt}
            className="px-4 py-2 rounded border border-border text-sm hover:bg-muted transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={confirmDeletePrompt}
            className="px-4 py-2 rounded bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
