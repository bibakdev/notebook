import { cn } from '@/shared/lib/cn';
import { File, Folder, FolderOpen, ChevronRight } from 'lucide-react';
import type { TreeNode } from '../types';

interface TreeItemProps {
  node: TreeNode;
  expanded: boolean;
  selectedNodeId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

export function TreeItem({
  node,
  expanded,
  selectedNodeId,
  onToggle,
  onSelect
}: TreeItemProps) {
  const isFolder = node.type === 'folder';
  const isSelected = selectedNodeId === node.id;

  return (
    <li className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors',
          isSelected
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-card-foreground hover:bg-muted'
        )}
        onClick={() => {
          if (isFolder) onToggle(node.id);
          onSelect(node.id);
        }}
      >
        {isFolder && (
          <span className="text-muted-foreground transition-transform duration-200 flex-shrink-0">
            <ChevronRight
              size={14}
              style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
            />
          </span>
        )}
        {isFolder ? (
          expanded ? (
            <FolderOpen size={16} className="text-primary" />
          ) : (
            <Folder size={16} />
          )
        ) : (
          <File size={14} />
        )}
        <span>{node.label}</span>
      </div>
      {isFolder && expanded && node.children && (
        <ul className="mr-4 mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              expanded={false}
              selectedNodeId={selectedNodeId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
