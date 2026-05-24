import type { ReactNode } from 'react';
import { useTreeStore } from '@/features/file-tree/store/tree-store';
import { cn } from '@/shared/lib/cn';

interface SidebarTreeProps {
  children: ReactNode;
}

export function SidebarTree({ children }: SidebarTreeProps) {
  const selectNode = useTreeStore((s) => s.selectNode);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const isRootSelected = selectedNodeId === null; // ریشه انتخاب شده است؟

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto px-4 pb-4 rounded-lg transition-colors',
        isRootSelected && 'ring-2 ring-primary/50 bg-muted/30'
      )}
      onClick={() => selectNode(null)}
    >
      {children}
    </div>
  );
}
