import { create } from 'zustand';
import type { TreeNode } from '../types';

interface TreeState {
  expandedFolders: Record<string, boolean>;
  selectedNodeId: string | null;
  toggleFolder: (id: string) => void;
  selectNode: (id: string) => void;
}

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

export const useTreeStore = create<TreeState>((set) => ({
  expandedFolders: { impl: true },
  selectedNodeId: null,
  toggleFolder: (id) =>
    set((state) => ({
      expandedFolders: {
        ...state.expandedFolders,
        [id]: !state.expandedFolders[id]
      }
    })),
  selectNode: (id) => set({ selectedNodeId: id })
}));

// export tree data for presentational components
export { initialTreeData };
