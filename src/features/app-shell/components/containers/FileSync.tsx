// src/features/app-shell/components/containers/FileSync.tsx
'use client';

import { useEffect } from 'react';
import { useTreeStore } from '@/features/file-tree/store/tree-store';
import { findNodeById } from '@/features/file-tree/lib/tree-utils';
import { usePromptStore } from '@/features/main-content/store/prompt-store';

export function FileSync() {
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const treeData = useTreeStore((s) => s.treeData);
  const setCurrentFile = usePromptStore((s) => s.setCurrentFile);

  useEffect(() => {
    if (!selectedNodeId) {
      setCurrentFile(null);
      return;
    }
    const node = findNodeById(treeData, selectedNodeId);
    if (node && node.type === 'file') {
      setCurrentFile(node.id);
    } else {
      setCurrentFile(null);
    }
  }, [selectedNodeId, treeData, setCurrentFile]);

  return null;
}
