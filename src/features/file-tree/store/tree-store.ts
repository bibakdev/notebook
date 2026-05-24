// src/features/file-tree/store/tree-store.ts
import { create } from 'zustand';
import type { TreeNode } from '../types';
import {
  isDescendant,
  findNodeById,
  removeNodeById,
  insertNode
} from '../lib/tree-utils';

interface TreeState {
  treeData: TreeNode[];
  expandedFolders: Record<string, boolean>;
  selectedNodeId: string | null;
  addingType: 'file' | 'folder' | null;
  addingParentId: string | null;
  renamingNodeId: string | null; // <-- جدید

  toggleFolder: (id: string) => void;
  selectNode: (id: string) => void;
  startAdding: (parentId: string | null, type: 'file' | 'folder') => void;
  cancelAdding: () => void;
  confirmAdding: (name: string) => void;
  moveNode: (nodeId: string, targetParentId: string | null) => void;

  // Rename & Delete actions
  startRenaming: (nodeId: string) => void; // <-- جدید
  cancelRenaming: () => void; // <-- جدید
  confirmRenaming: (newName: string) => void; // <-- جدید
  deleteNode: (nodeId: string) => void; // <-- جدید
}

let nextId = 100;

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
  renamingNodeId: null, // <-- initial

  toggleFolder: (id) =>
    set((state) => ({
      expandedFolders: {
        ...state.expandedFolders,
        [id]: !state.expandedFolders[id]
      }
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  startAdding: (parentId, type) => {
    const state = get();
    const newExpanded = { ...state.expandedFolders };
    if (parentId) {
      newExpanded[parentId] = true;
    }
    set({
      addingType: type,
      addingParentId: parentId,
      expandedFolders: newExpanded
    });
  },

  cancelAdding: () => set({ addingType: null, addingParentId: null }),

  confirmAdding: (name) => {
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
      : [...treeData, newNode];

    set({ treeData: newTree, addingType: null, addingParentId: null });
  },

  moveNode: (nodeId, targetParentId) => {
    const { treeData } = get();

    if (targetParentId !== null) {
      const targetNode = findNodeById(treeData, targetParentId);
      if (!targetNode || targetNode.type !== 'folder') return;
    }

    if (targetParentId && isDescendant(treeData, targetParentId, nodeId))
      return;

    const { newTree, removed } = removeNodeById(treeData, nodeId);
    if (!removed) return;

    const finalTree = insertNode(newTree, targetParentId, removed);
    set({ treeData: finalTree });
  },

  // --- Rename ---
  startRenaming: (nodeId) => set({ renamingNodeId: nodeId }),

  cancelRenaming: () => set({ renamingNodeId: null }),

  confirmRenaming: (newName) => {
    const { renamingNodeId, treeData } = get();
    if (!renamingNodeId || !newName.trim()) {
      set({ renamingNodeId: null });
      return;
    }

    const updateLabel = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) => {
        if (node.id === renamingNodeId) {
          return { ...node, label: newName.trim() };
        }
        return node.children
          ? { ...node, children: updateLabel(node.children) }
          : node;
      });

    set({
      treeData: updateLabel(treeData),
      renamingNodeId: null
    });
  },

  // --- Delete ---
  deleteNode: (nodeId) => {
    const { treeData } = get();
    const { newTree } = removeNodeById(treeData, nodeId);
    set({
      treeData: newTree,
      selectedNodeId: null, // پاک کردن انتخاب اگر گره انتخاب‌شده حذف شود
      renamingNodeId: null // اگر در حال ویرایش بود، لغو کن
    });
  }
}));
