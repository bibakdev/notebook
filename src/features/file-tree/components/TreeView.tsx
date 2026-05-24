'use client';

import { useTreeStore, initialTreeData } from '../store/tree-store';
import { TreeItem } from './TreeItem';

export function TreeView() {
  const expandedFolders = useTreeStore((s) => s.expandedFolders);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const toggleFolder = useTreeStore((s) => s.toggleFolder);
  const selectNode = useTreeStore((s) => s.selectNode);

  return (
    <ul className="space-y-0.5">
      {initialTreeData.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          expanded={expandedFolders[node.id] || false}
          selectedNodeId={selectedNodeId}
          onToggle={toggleFolder}
          onSelect={selectNode}
        />
      ))}
    </ul>
  );
}
