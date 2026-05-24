'use client';

import { useTreeStore } from '../../store/tree-store';
import { TreeItem } from '../presentational/TreeItem';
import { InlineAddInput } from './InlineAddInput';

export function TreeView() {
  const treeData = useTreeStore((s) => s.treeData);
  const expandedFolders = useTreeStore((s) => s.expandedFolders);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const toggleFolder = useTreeStore((s) => s.toggleFolder);
  const selectNode = useTreeStore((s) => s.selectNode);
  const addingParentId = useTreeStore((s) => s.addingParentId);
  const addingType = useTreeStore((s) => s.addingType);

  return (
    <ul className="space-y-0.5">
      {treeData.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          expanded={expandedFolders[node.id] || false}
          selectedNodeId={selectedNodeId}
          onToggle={toggleFolder}
          onSelect={selectNode}
          addingParentId={addingParentId}
          addingType={addingType}
          expandedFolders={expandedFolders}
        />
      ))}
      {addingParentId === null && addingType && (
        <li>
          <InlineAddInput />
        </li>
      )}
    </ul>
  );
}
