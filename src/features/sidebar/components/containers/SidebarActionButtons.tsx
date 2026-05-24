'use client';

import { FilePlus, FolderPlus } from 'lucide-react';
import { useTreeStore } from '@/features/file-tree/store/tree-store';

export function SidebarActionButtons() {
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const treeData = useTreeStore((s) => s.treeData);
  const startAdding = useTreeStore((s) => s.startAdding);

  const handleAdd = (type: 'file' | 'folder') => {
    let parentId: string | null = null;
    if (selectedNodeId) {
      const findNode = (nodes: typeof treeData): boolean => {
        for (const n of nodes) {
          if (n.id === selectedNodeId && n.type === 'folder') return true;
          if (n.children && findNode(n.children)) return true;
        }
        return false;
      };
      if (findNode(treeData)) {
        parentId = selectedNodeId;
      }
    }
    startAdding(parentId, type);
  };

  return (
    <div className="flex justify-start gap-2 px-4 pb-4 mb-4 shrink-0">
      <button
        className="rounded border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary transition"
        title="افزودن فایل"
        onClick={() => handleAdd('file')}
      >
        <FilePlus size={16} />
      </button>
      <button
        className="rounded border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary transition"
        title="افزودن پوشه"
        onClick={() => handleAdd('folder')}
      >
        <FolderPlus size={16} />
      </button>
    </div>
  );
}
