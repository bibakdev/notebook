'use client';

import { useTreeStore } from '../../store/tree-store';
import { findNodeById } from '../../lib/tree-utils';
import { useEffect } from 'react';

export function DeleteConfirmationModal() {
  const pendingDeleteNodeId = useTreeStore((s) => s.pendingDeleteNodeId);
  const cancelDeleteNode = useTreeStore((s) => s.cancelDeleteNode);
  const confirmDeleteNode = useTreeStore((s) => s.confirmDeleteNode);
  const treeData = useTreeStore((s) => s.treeData);

  const node = pendingDeleteNodeId
    ? findNodeById(treeData, pendingDeleteNodeId)
    : null;

  // بستن با Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelDeleteNode();
    };
    if (pendingDeleteNodeId) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [pendingDeleteNodeId, cancelDeleteNode]);

  if (!pendingDeleteNodeId || !node) return null;

  const typeLabel = node.type === 'folder' ? 'پوشه' : 'فایل';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={cancelDeleteNode}
    >
      <div
        className="bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">
          تأیید حذف
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          آیا از حذف {typeLabel} «{node.label}» مطمئن هستید؟
          {node.type === 'folder' &&
            ' با حذف این پوشه، تمام محتوای داخل آن نیز حذف خواهد شد.'}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelDeleteNode}
            className="px-4 py-2 rounded border border-border text-sm hover:bg-muted transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={confirmDeleteNode}
            className="px-4 py-2 rounded bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
