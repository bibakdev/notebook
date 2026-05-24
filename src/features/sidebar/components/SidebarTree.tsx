import { TreeView } from '@/features/file-tree/components/TreeView';

export function SidebarTree() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <TreeView />
    </div>
  );
}
