import { useEffect } from 'react';
import { useTreeStore } from '../store/tree-store';

export function useTreeKeyboardShortcuts() {
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const renamingNodeId = useTreeStore((s) => s.renamingNodeId);
  const startRenaming = useTreeStore((s) => s.startRenaming);
  const requestDeleteNode = useTreeStore((s) => s.requestDeleteNode); // جایگزین deleteNode

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';
      if (isEditable) return;

      if (e.key === 'F2' && selectedNodeId && !renamingNodeId) {
        e.preventDefault();
        startRenaming(selectedNodeId);
      }

      // به جای حذف مستقیم، درخواست حذف می‌دهیم
      if (e.key === 'Delete' && selectedNodeId) {
        e.preventDefault();
        requestDeleteNode(selectedNodeId);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedNodeId, renamingNodeId, startRenaming, requestDeleteNode]);
}
