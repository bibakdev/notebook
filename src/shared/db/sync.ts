// src/shared/db/sync.ts
import { db } from './database';
import type { TreeNode } from '@/features/file-tree/types';
import type { FileContent } from '@/features/main-content/store/prompt-store';
import { useTreeStore } from '@/features/file-tree/store/tree-store';
import { usePromptStore } from '@/features/main-content/store/prompt-store';

function getDefaultTreeData(): TreeNode[] {
  return [
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
}

function collectFileIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (n.type === 'file') ids.push(n.id);
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return ids;
}

export async function loadDataFromDB() {
  const settings = await db.settings.get('app');
  const treeStore = useTreeStore.getState();
  const promptStore = usePromptStore.getState();

  let treeData: TreeNode[] = [];
  let expandedFolders: Record<string, boolean> = {};
  let selectedNodeId: string | null = null;

  if (settings) {
    treeData = settings.treeData || [];
    expandedFolders = settings.expandedFolders || {};
    selectedNodeId = settings.selectedNodeId ?? null;
  } else {
    treeData = getDefaultTreeData();
    expandedFolders = { impl: true };
    selectedNodeId = null;

    await db.settings.put({
      id: 'app',
      treeData,
      expandedFolders,
      selectedNodeId
    });
  }

  treeStore.hydrate({ treeData, expandedFolders, selectedNodeId });

  const allFileContents = await db.fileContent.toArray();
  const filesData: Record<string, FileContent> = {};
  for (const record of allFileContents) {
    const { fileId, ...content } = record;
    filesData[fileId] = content as FileContent;
  }
  promptStore.setFilesData(filesData);
}

export function subscribeStoresToDB() {
  // ---------- tree store ----------
  let prevTreeData: TreeNode[] = useTreeStore.getState().treeData;
  let prevExpanded: Record<string, boolean> =
    useTreeStore.getState().expandedFolders;
  let prevSelected: string | null = useTreeStore.getState().selectedNodeId;

  useTreeStore.subscribe((state) => {
    const newTree = state.treeData;
    const newExpanded = state.expandedFolders;
    const newSelected = state.selectedNodeId;

    if (
      newTree !== prevTreeData ||
      newExpanded !== prevExpanded ||
      newSelected !== prevSelected
    ) {
      db.settings.put({
        id: 'app',
        treeData: newTree,
        expandedFolders: newExpanded,
        selectedNodeId: newSelected
      });

      const prevFileIds = collectFileIds(prevTreeData);
      const newFileIds = collectFileIds(newTree);
      const deletedFileIds = prevFileIds.filter(
        (id) => !newFileIds.includes(id)
      );
      if (deletedFileIds.length > 0) {
        db.fileContent.bulkDelete(deletedFileIds);
        const promptStore = usePromptStore.getState();
        promptStore.removeFiles(deletedFileIds);
      }

      prevTreeData = newTree;
      prevExpanded = newExpanded;
      prevSelected = newSelected;
    }
  });

  // ---------- prompt store (filesData) ----------
  let prevFilesData: Record<string, FileContent> =
    usePromptStore.getState().filesData;

  usePromptStore.subscribe((state) => {
    const newFiles = state.filesData;

    if (newFiles !== prevFilesData) {
      const prevFileIds = Object.keys(prevFilesData);
      const newFileIds = Object.keys(newFiles);
      const deleted = prevFileIds.filter((id) => !newFileIds.includes(id));
      if (deleted.length > 0) {
        db.fileContent.bulkDelete(deleted);
      }

      for (const fileId of newFileIds) {
        const content = newFiles[fileId];
        if (
          !prevFilesData[fileId] ||
          JSON.stringify(prevFilesData[fileId]) !== JSON.stringify(content)
        ) {
          db.fileContent.put({ fileId, ...content });
        }
      }

      prevFilesData = newFiles;
    }
  });
}
