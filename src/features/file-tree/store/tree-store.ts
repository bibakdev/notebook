// src/features/file-tree/store/tree-store.ts
import { create } from 'zustand';
import type { TreeNode } from '../types';
import {
  isDescendant,
  findNodeById,
  removeNodeById,
  insertNode
} from '../lib/tree-utils';
import { usePromptStore } from '@/features/main-content/store/prompt-store';

interface TreeState {
  treeData: TreeNode[];
  expandedFolders: Record<string, boolean>;
  selectedNodeId: string | null;
  addingType: 'file' | 'folder' | null;
  addingParentId: string | null;
  renamingNodeId: string | null;

  hydrate: (payload: {
    treeData: TreeNode[];
    expandedFolders: Record<string, boolean>;
    selectedNodeId: string | null;
  }) => void;

  pendingDeleteNodeId: string | null;
  requestDeleteNode: (nodeId: string) => void;
  cancelDeleteNode: () => void;
  confirmDeleteNode: () => void;

  toggleFolder: (id: string) => void;
  selectNode: (id: string | null) => void;
  startAdding: (parentId: string | null, type: 'file' | 'folder') => void;
  cancelAdding: () => void;
  confirmAdding: (name: string) => void;
  moveNode: (nodeId: string, targetParentId: string | null) => void;

  startRenaming: (nodeId: string) => void;
  cancelRenaming: () => void;
  confirmRenaming: (newName: string) => void;
  deleteNode: (nodeId: string) => void;
}

let nextId = 100;

function computeMaxNodeId(treeData: TreeNode[]): number {
  let max = 0;
  const walk = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      const match = node.id.match(/^node-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
      if (node.children) walk(node.children);
    }
  };
  walk(treeData);
  return max;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  treeData: [],
  expandedFolders: {},
  selectedNodeId: null,
  addingType: null,
  addingParentId: null,
  renamingNodeId: null,
  pendingDeleteNodeId: null,

  hydrate: (payload) => {
    const maxId = computeMaxNodeId(payload.treeData);
    if (maxId >= nextId) {
      nextId = maxId + 1;
    }
    set(payload);
  },

  requestDeleteNode: (nodeId) => set({ pendingDeleteNodeId: nodeId }),
  cancelDeleteNode: () => set({ pendingDeleteNodeId: null }),
  confirmDeleteNode: () => {
    const { pendingDeleteNodeId } = get();
    if (pendingDeleteNodeId) {
      get().deleteNode(pendingDeleteNodeId);
      set({ pendingDeleteNodeId: null });
    }
  },

  toggleFolder: (id) =>
    set((state) => ({
      expandedFolders: {
        ...state.expandedFolders,
        [id]: !state.expandedFolders[id]
      }
    })),

  selectNode: (id: string | null) => set({ selectedNodeId: id }),

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

    const newTree = insertNode(treeData, addingParentId, newNode);

    set({ treeData: newTree, addingType: null, addingParentId: null });
  },

  moveNode: (nodeId, targetParentId) => {
    const { treeData } = get();

    if (targetParentId !== null) {
      const targetNode = findNodeById(treeData, targetParentId);
      if (!targetNode || targetNode.type !== 'folder') return;
    }

    if (targetParentId && isDescendant(treeData, nodeId, targetParentId)) {
      return;
    }

    const { newTree, removed } = removeNodeById(treeData, nodeId);
    if (!removed) return;

    const finalTree = insertNode(newTree, targetParentId, removed);
    set({ treeData: finalTree });
  },

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

  deleteNode: (nodeId) => {
    const { treeData } = get();
    const node = findNodeById(treeData, nodeId);
    const { newTree } = removeNodeById(treeData, nodeId);
    set({
      treeData: newTree,
      selectedNodeId: null,
      renamingNodeId: null
    });
    if (node?.type === 'file') {
      const promptStore = usePromptStore.getState();
      promptStore.removeFiles([nodeId]);
    }
  }
}));
