// src/features/file-tree/store/tree-store.ts
import { create } from 'zustand';
import type { TreeNode } from '../types';

interface TreeState {
  treeData: TreeNode[];
  expandedFolders: Record<string, boolean>;
  selectedNodeId: string | null;
  addingType: 'file' | 'folder' | null;
  addingParentId: string | null;

  toggleFolder: (id: string) => void;
  selectNode: (id: string) => void;
  startAdding: (parentId: string | null, type: 'file' | 'folder') => void;
  cancelAdding: () => void;
  confirmAdding: (name: string) => void;
}

let nextId = 100; // simple id counter

const initialTreeData: TreeNode[] = [
  {
    id: 'impl',
    label: 'Implementation',
    type: 'folder',
    defaultOpen: true,
    children: [
      { id: 'scaffold', label: 'scaffold', type: 'file' },
      { id: 'prompts', label: 'prompts', type: 'file' }
    ]
  },
  {
    id: 'front-workflow',
    label: 'front-workflow',
    type: 'folder',
    children: []
  },
  {
    id: 'component-tree',
    label: 'component-tree',
    type: 'folder',
    children: []
  },
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    type: 'folder',
    children: []
  }
];

export const useTreeStore = create<TreeState>((set, get) => ({
  treeData: initialTreeData,
  expandedFolders: { impl: true },
  selectedNodeId: null,
  addingType: null,
  addingParentId: null,

  toggleFolder: (id) =>
    set((state) => ({
      expandedFolders: {
        ...state.expandedFolders,
        [id]: !state.expandedFolders[id]
      }
    })),
  selectNode: (id) => set({ selectedNodeId: id }),

  startAdding: (parentId, type) => {
    // Ensure parent is expanded
    const state = get();
    const newExpanded = { ...state.expandedFolders };
    if (parentId) {
      newExpanded[parentId] = true; // expand the target folder
    }
    set({
      addingType: type,
      addingParentId: parentId,
      expandedFolders: newExpanded
    });
  },
  cancelAdding: () => set({ addingType: null, addingParentId: null }),
  confirmAdding: (name) => {
    console.log(
      'confirmAdding called',
      name,
      get().addingType,
      get().addingParentId
    );

    const { addingParentId, addingType, treeData } = get();
    if (!addingType || !name.trim()) {
      set({ addingType: null, addingParentId: null });
      return;
    }

    const newNode: TreeNode = {
      id: `node-${nextId++}`,
      label: name.trim(),
      type: addingType,
      children: addingType === 'folder' ? [] : undefined
    };

    const updateChildren = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) => {
        if (node.id === addingParentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        }
        if (node.children) {
          return { ...node, children: updateChildren(node.children) };
        }
        return node;
      });

    const newTree = addingParentId
      ? updateChildren(treeData)
      : [...treeData, newNode]; // root level

    set({ treeData: newTree, addingType: null, addingParentId: null });
  }
}));

export { initialTreeData };
