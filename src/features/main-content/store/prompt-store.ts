// src/features/main-content/store/prompt-store.ts
import { create } from 'zustand';
import type { BoxData, GroupData, RootItem } from '../types';

let nextId = 200;

// -------- کمکی برای تنظیم شمارنده بعد از بارگذاری --------
function computeMaxId(filesData: Record<string, FileContent>): number {
  let max = 0;
  const regex = /^(box|group)-(\d+)$/;
  for (const file of Object.values(filesData)) {
    for (const key of Object.keys(file.boxes).concat(
      Object.keys(file.groups)
    )) {
      const match = key.match(regex);
      if (match) {
        const num = parseInt(match[2], 10);
        if (num > max) max = num;
      }
    }
  }
  return max;
}
// ------------------------------------------------------

function newBoxData(overrides: Partial<BoxData> = {}): BoxData {
  return {
    id: `box-${nextId++}`,
    title: 'New Card',
    content: '',
    direction: 'ltr',
    ...overrides
  };
}

function newGroupData(overrides: Partial<GroupData> = {}): GroupData {
  return {
    id: `group-${nextId++}`,
    title: 'New Zone',
    collapsed: false,
    boxIds: [],
    ...overrides
  };
}

// ========== per‑file state ==========
export interface FileContent {
  rootOrder: RootItem[];
  boxes: Record<string, BoxData>;
  groups: Record<string, GroupData>;
  selectedBoxIds: string[];
}

function emptyFileContent(): FileContent {
  return {
    rootOrder: [],
    boxes: {},
    groups: {},
    selectedBoxIds: []
  };
}

interface PromptState {
  filesData: Record<string, FileContent>;
  currentFileId: string | null;
  setCurrentFile: (fileId: string | null) => void;

  setFilesData: (data: Record<string, FileContent>) => void;
  removeFiles: (fileIds: string[]) => void;

  // Box actions
  addBox: (parentGroupId?: string) => void;
  addBoxAfter: (afterItemId: string | null) => void;
  updateBoxTitle: (boxId: string, title: string) => void;
  updateBoxContent: (boxId: string, content: string) => void;
  toggleBoxDirection: (boxId: string) => void;
  setBoxMode: (boxId: string, mode: 'text' | 'code') => void;
  deleteBox: (boxId: string) => void;
  copyBox: (boxId: string) => void;
  moveBoxUp: (boxId: string) => void;
  moveBoxDown: (boxId: string) => void;
  toggleBoxSelection: (boxId: string) => void;

  // Group actions
  addGroup: () => void;
  updateGroupTitle: (groupId: string, title: string) => void;
  deleteGroup: (groupId: string) => void;
  moveGroupUp: (groupId: string) => void;
  moveGroupDown: (groupId: string) => void;
  toggleGroupCollapse: (groupId: string) => void;
  addBoxToGroup: (groupId: string) => void;
  groupSelectedBoxes: () => void;
  clearSelection: () => void;

  // Delete confirmation
  pendingDeleteBoxId: string | null;
  pendingDeleteGroupId: string | null;
  requestDeleteBox: (boxId: string) => void;
  requestDeleteGroup: (groupId: string) => void;
  cancelDeletePrompt: () => void;
  confirmDeletePrompt: () => void;
}

function findBoxLocationInFile(
  file: FileContent,
  boxId: string
):
  | { context: 'root'; index: number }
  | { context: 'group'; groupId: string; index: number }
  | null {
  const rootIndex = file.rootOrder.findIndex(
    (item) => item.type === 'box' && item.id === boxId
  );
  if (rootIndex !== -1) return { context: 'root', index: rootIndex };

  for (const [groupId, group] of Object.entries(file.groups)) {
    const idx = group.boxIds.indexOf(boxId);
    if (idx !== -1) return { context: 'group', groupId, index: idx };
  }
  return null;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  filesData: {},
  currentFileId: null,
  pendingDeleteBoxId: null,
  pendingDeleteGroupId: null,

  setFilesData: (data) => {
    const maxId = computeMaxId(data);
    if (maxId >= nextId) {
      nextId = maxId + 1;
    }
    set({ filesData: data });
  },

  removeFiles: (fileIds) =>
    set((state) => {
      const newFiles = { ...state.filesData };
      for (const id of fileIds) {
        delete newFiles[id];
      }
      return { filesData: newFiles };
    }),

  setCurrentFile: (fileId) => {
    if (fileId) {
      set((state) => {
        const newFiles = { ...state.filesData };
        if (!newFiles[fileId]) {
          newFiles[fileId] = emptyFileContent();
        }
        return {
          filesData: newFiles,
          currentFileId: fileId,
          pendingDeleteBoxId: null,
          pendingDeleteGroupId: null
        };
      });
    } else {
      set({ currentFileId: null });
    }
  },

  // --- Box Actions ---
  addBox: (parentGroupId) => {
    const box = newBoxData();
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = { ...files[fileId] };
      if (parentGroupId && file.groups[parentGroupId]) {
        file.boxes = { ...file.boxes, [box.id]: box };
        file.groups = {
          ...file.groups,
          [parentGroupId]: {
            ...file.groups[parentGroupId],
            boxIds: [...file.groups[parentGroupId].boxIds, box.id]
          }
        };
      } else {
        file.boxes = { ...file.boxes, [box.id]: box };
        file.rootOrder = [...file.rootOrder, { type: 'box', id: box.id }];
      }
      files[fileId] = file;
      return { filesData: files };
    });
  },

  addBoxAfter: (afterItemId) => {
    const box = newBoxData();
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = { ...files[fileId] };
      file.boxes = { ...file.boxes, [box.id]: box };

      if (afterItemId === null) {
        file.rootOrder = [{ type: 'box', id: box.id }, ...file.rootOrder];
      } else {
        const idx = file.rootOrder.findIndex((item) => item.id === afterItemId);
        const newRoot = [...file.rootOrder];
        newRoot.splice(idx === -1 ? newRoot.length : idx + 1, 0, {
          type: 'box',
          id: box.id
        });
        file.rootOrder = newRoot;
      }
      files[fileId] = file;
      return { filesData: files };
    });
  },

  updateBoxTitle: (boxId, title) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      if (!file.boxes[boxId]) return {};
      files[fileId] = {
        ...file,
        boxes: {
          ...file.boxes,
          [boxId]: { ...file.boxes[boxId], title }
        }
      };
      return { filesData: files };
    }),

  updateBoxContent: (boxId, content) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      if (!file.boxes[boxId]) return {};
      files[fileId] = {
        ...file,
        boxes: {
          ...file.boxes,
          [boxId]: { ...file.boxes[boxId], content }
        }
      };
      return { filesData: files };
    }),

  toggleBoxDirection: (boxId) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const box = file.boxes[boxId];
      if (!box) return {};
      files[fileId] = {
        ...file,
        boxes: {
          ...file.boxes,
          [boxId]: {
            ...box,
            direction: box.direction === 'rtl' ? 'ltr' : 'rtl'
          }
        }
      };
      return { filesData: files };
    }),

  setBoxMode: (boxId, mode) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const box = file.boxes[boxId];
      if (!box) return {};
      files[fileId] = {
        ...file,
        boxes: {
          ...file.boxes,
          [boxId]: { ...box, mode }
        }
      };
      return { filesData: files };
    }),

  deleteBox: (boxId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const loc = findBoxLocationInFile(file, boxId);
      if (!loc) return {};

      const newBoxes = { ...file.boxes };
      delete newBoxes[boxId];

      let newRoot = [...file.rootOrder];
      let newGroups = { ...file.groups };

      if (loc.context === 'root') {
        newRoot = newRoot.filter((item) => item.id !== boxId);
      } else {
        const group = newGroups[loc.groupId];
        newGroups = {
          ...newGroups,
          [loc.groupId]: {
            ...group,
            boxIds: group.boxIds.filter((id) => id !== boxId)
          }
        };
      }

      files[fileId] = {
        ...file,
        rootOrder: newRoot,
        boxes: newBoxes,
        groups: newGroups,
        selectedBoxIds: file.selectedBoxIds.filter((id) => id !== boxId)
      };
      return { filesData: files };
    });
  },

  copyBox: (boxId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const original = file.boxes[boxId];
      if (!original) return {};

      const copy = newBoxData({
        title: `${original.title} (copy)`,
        content: original.content,
        direction: original.direction,
        mode: original.mode
      });

      const loc = findBoxLocationInFile(file, boxId);
      const newRoot = [...file.rootOrder];

      if (loc?.context === 'group') {
        const group = file.groups[loc.groupId];
        const newBoxIds = [...group.boxIds];
        newBoxIds.splice(loc.index + 1, 0, copy.id);
        files[fileId] = {
          ...file,
          boxes: { ...file.boxes, [copy.id]: copy },
          groups: {
            ...file.groups,
            [loc.groupId]: { ...group, boxIds: newBoxIds }
          }
        };
      } else {
        const idx = loc?.context === 'root' ? loc.index : newRoot.length - 1;
        newRoot.splice(idx + 1, 0, { type: 'box', id: copy.id });
        files[fileId] = {
          ...file,
          rootOrder: newRoot,
          boxes: { ...file.boxes, [copy.id]: copy }
        };
      }
      return { filesData: files };
    });
  },

  moveBoxUp: (boxId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const loc = findBoxLocationInFile(file, boxId);
      if (!loc || loc.index === 0) return {};

      if (loc.context === 'root') {
        const newRoot = [...file.rootOrder];
        [newRoot[loc.index - 1], newRoot[loc.index]] = [
          newRoot[loc.index],
          newRoot[loc.index - 1]
        ];
        files[fileId] = { ...file, rootOrder: newRoot };
      } else {
        const group = file.groups[loc.groupId];
        const newBoxIds = [...group.boxIds];
        [newBoxIds[loc.index - 1], newBoxIds[loc.index]] = [
          newBoxIds[loc.index],
          newBoxIds[loc.index - 1]
        ];
        files[fileId] = {
          ...file,
          groups: {
            ...file.groups,
            [loc.groupId]: { ...group, boxIds: newBoxIds }
          }
        };
      }
      return { filesData: files };
    });
  },

  moveBoxDown: (boxId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const loc = findBoxLocationInFile(file, boxId);
      if (!loc) return {};

      if (loc.context === 'root') {
        if (loc.index >= file.rootOrder.length - 1) return {};
        const newRoot = [...file.rootOrder];
        [newRoot[loc.index], newRoot[loc.index + 1]] = [
          newRoot[loc.index + 1],
          newRoot[loc.index]
        ];
        files[fileId] = { ...file, rootOrder: newRoot };
      } else {
        const group = file.groups[loc.groupId];
        if (loc.index >= group.boxIds.length - 1) return {};
        const newBoxIds = [...group.boxIds];
        [newBoxIds[loc.index], newBoxIds[loc.index + 1]] = [
          newBoxIds[loc.index + 1],
          newBoxIds[loc.index]
        ];
        files[fileId] = {
          ...file,
          groups: {
            ...file.groups,
            [loc.groupId]: { ...group, boxIds: newBoxIds }
          }
        };
      }
      return { filesData: files };
    });
  },

  toggleBoxSelection: (boxId) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      files[fileId] = {
        ...file,
        selectedBoxIds: file.selectedBoxIds.includes(boxId)
          ? file.selectedBoxIds.filter((id) => id !== boxId)
          : [...file.selectedBoxIds, boxId]
      };
      return { filesData: files };
    }),

  // --- Group Actions ---
  addGroup: () => {
    const group = newGroupData();
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      files[fileId] = {
        ...file,
        groups: { ...file.groups, [group.id]: group },
        rootOrder: [...file.rootOrder, { type: 'group', id: group.id }]
      };
      return { filesData: files };
    });
  },

  updateGroupTitle: (groupId, title) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      if (!file.groups[groupId]) return {};
      files[fileId] = {
        ...file,
        groups: {
          ...file.groups,
          [groupId]: { ...file.groups[groupId], title }
        }
      };
      return { filesData: files };
    }),

  deleteGroup: (groupId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const group = file.groups[groupId];
      if (!group) return {};

      const newBoxes = { ...file.boxes };
      for (const boxId of group.boxIds) delete newBoxes[boxId];

      const newGroups = { ...file.groups };
      delete newGroups[groupId];

      const newRoot = file.rootOrder.filter((item) => item.id !== groupId);

      files[fileId] = {
        ...file,
        boxes: newBoxes,
        groups: newGroups,
        rootOrder: newRoot,
        selectedBoxIds: file.selectedBoxIds.filter(
          (id) => !group.boxIds.includes(id)
        )
      };
      return { filesData: files };
    });
  },

  moveGroupUp: (groupId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const idx = file.rootOrder.findIndex(
        (item) => item.type === 'group' && item.id === groupId
      );
      if (idx <= 0) return {};
      const newRoot = [...file.rootOrder];
      [newRoot[idx - 1], newRoot[idx]] = [newRoot[idx], newRoot[idx - 1]];
      files[fileId] = { ...file, rootOrder: newRoot };
      return { filesData: files };
    });
  },

  moveGroupDown: (groupId) => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      const idx = file.rootOrder.findIndex(
        (item) => item.type === 'group' && item.id === groupId
      );
      if (idx === -1 || idx >= file.rootOrder.length - 1) return {};
      const newRoot = [...file.rootOrder];
      [newRoot[idx], newRoot[idx + 1]] = [newRoot[idx + 1], newRoot[idx]];
      files[fileId] = { ...file, rootOrder: newRoot };
      return { filesData: files };
    });
  },

  toggleGroupCollapse: (groupId) =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      if (!file.groups[groupId]) return {};
      files[fileId] = {
        ...file,
        groups: {
          ...file.groups,
          [groupId]: {
            ...file.groups[groupId],
            collapsed: !file.groups[groupId].collapsed
          }
        }
      };
      return { filesData: files };
    }),

  addBoxToGroup: (groupId) => {
    const box = newBoxData();
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      files[fileId] = {
        ...file,
        boxes: { ...file.boxes, [box.id]: box },
        groups: {
          ...file.groups,
          [groupId]: {
            ...file.groups[groupId],
            boxIds: [...file.groups[groupId].boxIds, box.id]
          }
        }
      };
      return { filesData: files };
    });
  },

  groupSelectedBoxes: () => {
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      if (file.selectedBoxIds.length === 0) return {};

      const group = newGroupData({ title: 'Selected Zone' });

      let newRoot = [...file.rootOrder];
      const groupBoxIds: string[] = [];

      for (const boxId of file.selectedBoxIds) {
        const loc = findBoxLocationInFile(file, boxId);
        if (loc?.context === 'root') {
          newRoot = newRoot.filter((item) => item.id !== boxId);
          groupBoxIds.push(boxId);
        }
      }

      if (groupBoxIds.length === 0) return {};

      group.boxIds = groupBoxIds;

      const firstBoxId = groupBoxIds[0];
      const firstIdx = file.rootOrder.findIndex(
        (item) => item.type === 'box' && item.id === firstBoxId
      );
      const insertIdx = firstIdx >= 0 ? firstIdx : newRoot.length;
      newRoot.splice(insertIdx, 0, { type: 'group', id: group.id });

      files[fileId] = {
        ...file,
        rootOrder: newRoot,
        groups: { ...file.groups, [group.id]: group },
        selectedBoxIds: []
      };
      return { filesData: files };
    });
  },

  clearSelection: () =>
    set((state) => {
      const fileId = state.currentFileId;
      if (!fileId) return {};
      const files = { ...state.filesData };
      const file = files[fileId];
      files[fileId] = { ...file, selectedBoxIds: [] };
      return { filesData: files };
    }),

  // --- Delete modal ---
  requestDeleteBox: (boxId) => set({ pendingDeleteBoxId: boxId }),
  requestDeleteGroup: (groupId) => set({ pendingDeleteGroupId: groupId }),

  cancelDeletePrompt: () =>
    set({ pendingDeleteBoxId: null, pendingDeleteGroupId: null }),

  confirmDeletePrompt: () => {
    const { pendingDeleteBoxId, pendingDeleteGroupId } = get();
    if (pendingDeleteBoxId) {
      get().deleteBox(pendingDeleteBoxId);
    } else if (pendingDeleteGroupId) {
      get().deleteGroup(pendingDeleteGroupId);
    }
    set({ pendingDeleteBoxId: null, pendingDeleteGroupId: null });
  }
}));
