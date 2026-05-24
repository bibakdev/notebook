import { cn } from '@/shared/lib/cn';
import { File, Folder, FolderOpen, ChevronRight } from 'lucide-react';
import type { TreeNode } from '../../types';
import { InlineAddInput } from '../containers/InlineAddInput';

interface TreeItemProps {
  node: TreeNode;
  expanded: boolean;
  selectedNodeId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  addingParentId: string | null;
  addingType: 'file' | 'folder' | null;
  expandedFolders: Record<string, boolean>;
}

export function TreeItem({
  node,
  expanded,
  selectedNodeId,
  onToggle,
  onSelect,
  addingParentId,
  addingType,
  expandedFolders
}: TreeItemProps) {
  const isFolder = node.type === 'folder';
  const isSelected = selectedNodeId === node.id;

  return (
    <li className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 min-w-0 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors',
          isSelected
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-card-foreground hover:bg-muted'
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isFolder) onToggle(node.id);
          onSelect(node.id);
        }}
      >
        {/* فضای ثابت برای آیکون چرخش – هرگز کوچک نشود */}
        <span className="w-3.5 flex-shrink-0 text-muted-foreground transition-transform duration-200">
          {isFolder && (
            <ChevronRight
              size={14}
              style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
            />
          )}
        </span>

        {/* آیکون اصلی فایل یا پوشه – هرگز کوچک نشود */}
        {isFolder ? (
          expanded ? (
            <FolderOpen size={16} className="text-primary flex-shrink-0" />
          ) : (
            <Folder size={16} className="flex-shrink-0" />
          )
        ) : (
          <File size={14} className="flex-shrink-0" />
        )}

        {/* متن نام – در صورت نیاز با ... مخفی شود */}
        <span className="truncate flex-1 min-w-0">{node.label}</span>
      </div>

      {isFolder && expanded && node.children && (
        <ul className="mr-4 mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              expanded={expandedFolders[child.id] || false}
              selectedNodeId={selectedNodeId}
              onToggle={onToggle}
              onSelect={onSelect}
              addingParentId={addingParentId}
              addingType={addingType}
              expandedFolders={expandedFolders}
            />
          ))}
          {addingParentId === node.id && addingType && (
            <li>
              <InlineAddInput />
            </li>
          )}
        </ul>
      )}
    </li>
  );
}
