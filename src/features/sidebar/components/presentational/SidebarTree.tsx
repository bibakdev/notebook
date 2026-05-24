import type { ReactNode } from 'react';
import { useTreeStore } from '@/features/file-tree/store/tree-store';
import { cn } from '@/shared/lib/cn';
import { useDropTarget } from '@/features/file-tree/hooks/use-drop-target';

interface SidebarTreeProps {
  children: ReactNode;
}

export function SidebarTree({ children }: SidebarTreeProps) {
  const selectNode = useTreeStore((s) => s.selectNode);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const moveNode = useTreeStore((s) => s.moveNode);

  const { dropTargetProps, isDragOver } = useDropTarget({
    onDrop: (e) => {
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId) moveNode(draggedId, null); // null = root
    }
  });

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto px-4 pb-4 rounded-lg transition-colors',
        // highlight when root is selected OR when dragging over root
        (selectedNodeId === null || isDragOver) &&
          'ring-2 ring-primary/50 bg-muted/30'
      )}
      onClick={() => selectNode(null)}
      {...dropTargetProps}
    >
      {children}
    </div>
  );
}
