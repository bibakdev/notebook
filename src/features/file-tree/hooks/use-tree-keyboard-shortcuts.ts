import { useEffect } from 'react';
import { useTreeStore } from '../store/tree-store';

export function useTreeKeyboardShortcuts() {
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const renamingNodeId = useTreeStore((s) => s.renamingNodeId);
  const startRenaming = useTreeStore((s) => s.startRenaming);
  const deleteNode = useTreeStore((s) => s.deleteNode);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // اگر فوکوس روی یک عنصر ویرایشی (input, textarea, contentEditable) باشد کاری نکن
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';
      if (isEditable) return;

      // F2: شروع rename (فقط اگر گره انتخاب شده و در حال rename نیست)
      if (e.key === 'F2' && selectedNodeId && !renamingNodeId) {
        e.preventDefault();
        startRenaming(selectedNodeId);
      }

      // Delete: حذف گره انتخاب شده
      if (e.key === 'Delete' && selectedNodeId) {
        e.preventDefault();
        deleteNode(selectedNodeId);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedNodeId, renamingNodeId, startRenaming, deleteNode]);
}
