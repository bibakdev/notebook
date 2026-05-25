import { create } from 'zustand';
import type { BoxData, GroupData, RootItem } from '../types';

let nextId = 200;

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

interface PromptState {
  rootOrder: RootItem[];
  boxes: Record<string, BoxData>;
  groups: Record<string, GroupData>;
  selectedBoxIds: string[];

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
}

function findBoxLocation(
  state: Pick<PromptState, 'rootOrder' | 'groups'>
): (
  boxId: string
) =>
  | { context: 'root'; index: number }
  | { context: 'group'; groupId: string; index: number }
  | null {
  return (boxId: string) => {
    const rootIndex = state.rootOrder.findIndex(
      (item) => item.type === 'box' && item.id === boxId
    );
    if (rootIndex !== -1) return { context: 'root', index: rootIndex };

    for (const [groupId, group] of Object.entries(state.groups)) {
      const idx = group.boxIds.indexOf(boxId);
      if (idx !== -1) return { context: 'group', groupId, index: idx };
    }
    return null;
  };
}

function removeItemFromRoot(rootOrder: RootItem[], itemId: string): RootItem[] {
  return rootOrder.filter((item) => item.id !== itemId);
}

export const usePromptStore = create<PromptState>((set, get) => ({
  // ====== Initial State ======
  rootOrder: [], // خالی – بدون باکس یا گروه پیش‌فرض
  boxes: {}, // هیچ باکسی وجود ندارد
  groups: {}, // هیچ گروهی وجود ندارد
  selectedBoxIds: [],

  // ---- Box Actions ----
  addBox: (parentGroupId) => {
    const box = newBoxData();
    set((state) => {
      if (parentGroupId && state.groups[parentGroupId]) {
        return {
          boxes: { ...state.boxes, [box.id]: box },
          groups: {
            ...state.groups,
            [parentGroupId]: {
              ...state.groups[parentGroupId],
              boxIds: [...state.groups[parentGroupId].boxIds, box.id]
            }
          }
        };
      }
      return {
        boxes: { ...state.boxes, [box.id]: box },
        rootOrder: [...state.rootOrder, { type: 'box', id: box.id }]
      };
    });
  },

  addBoxAfter: (afterItemId) => {
    const box = newBoxData();
    set((state) => {
      if (afterItemId === null) {
        return {
          boxes: { ...state.boxes, [box.id]: box },
          rootOrder: [{ type: 'box', id: box.id }, ...state.rootOrder]
        };
      }

      const idx = state.rootOrder.findIndex((item) => item.id === afterItemId);
      if (idx === -1) {
        return {
          boxes: { ...state.boxes, [box.id]: box },
          rootOrder: [...state.rootOrder, { type: 'box', id: box.id }]
        };
      }

      const newRoot = [...state.rootOrder];
      newRoot.splice(idx + 1, 0, { type: 'box', id: box.id });
      return {
        boxes: { ...state.boxes, [box.id]: box },
        rootOrder: newRoot
      };
    });
  },

  updateBoxTitle: (boxId, title) =>
    set((state) => ({
      boxes: {
        ...state.boxes,
        [boxId]: { ...state.boxes[boxId], title }
      }
    })),

  updateBoxContent: (boxId, content) =>
    set((state) => ({
      boxes: {
        ...state.boxes,
        [boxId]: { ...state.boxes[boxId], content }
      }
    })),

  toggleBoxDirection: (boxId) =>
    set((state) => ({
      boxes: {
        ...state.boxes,
        [boxId]: {
          ...state.boxes[boxId],
          direction: state.boxes[boxId].direction === 'rtl' ? 'ltr' : 'rtl'
        }
      }
    })),

  setBoxMode: (boxId, mode) =>
    set((state) => ({
      boxes: {
        ...state.boxes,
        [boxId]: { ...state.boxes[boxId], mode }
      }
    })),

  deleteBox: (boxId) => {
    const state = get();
    const loc = findBoxLocation(state)(boxId);
    if (!loc) return;

    const newBoxes = { ...state.boxes };
    delete newBoxes[boxId];

    if (loc.context === 'root') {
      set({
        boxes: newBoxes,
        rootOrder: removeItemFromRoot(state.rootOrder, boxId),
        selectedBoxIds: state.selectedBoxIds.filter((id) => id !== boxId)
      });
    } else {
      set({
        boxes: newBoxes,
        groups: {
          ...state.groups,
          [loc.groupId]: {
            ...state.groups[loc.groupId],
            boxIds: state.groups[loc.groupId].boxIds.filter(
              (id) => id !== boxId
            )
          }
        },
        selectedBoxIds: state.selectedBoxIds.filter((id) => id !== boxId)
      });
    }
  },

  copyBox: (boxId) => {
    const state = get();
    const original = state.boxes[boxId];
    if (!original) return;
    const copy = newBoxData({
      title: `${original.title} (copy)`,
      content: original.content,
      direction: original.direction,
      mode: original.mode
    });

    const loc = findBoxLocation(state)(boxId);
    set((s) => {
      if (loc?.context === 'group') {
        const group = s.groups[loc.groupId];
        const newBoxIds = [...group.boxIds];
        newBoxIds.splice(loc.index + 1, 0, copy.id);
        return {
          boxes: { ...s.boxes, [copy.id]: copy },
          groups: {
            ...s.groups,
            [loc.groupId]: { ...group, boxIds: newBoxIds }
          }
        };
      }
      const idx = loc?.context === 'root' ? loc.index : s.rootOrder.length;
      const newRoot = [...s.rootOrder];
      newRoot.splice(idx + 1, 0, { type: 'box', id: copy.id });
      return {
        boxes: { ...s.boxes, [copy.id]: copy },
        rootOrder: newRoot
      };
    });
  },

  moveBoxUp: (boxId) => {
    const state = get();
    const loc = findBoxLocation(state)(boxId);
    if (!loc || loc.index === 0) return;

    if (loc.context === 'root') {
      const newRoot = [...state.rootOrder];
      [newRoot[loc.index - 1], newRoot[loc.index]] = [
        newRoot[loc.index],
        newRoot[loc.index - 1]
      ];
      set({ rootOrder: newRoot });
    } else {
      const group = state.groups[loc.groupId];
      const newBoxIds = [...group.boxIds];
      [newBoxIds[loc.index - 1], newBoxIds[loc.index]] = [
        newBoxIds[loc.index],
        newBoxIds[loc.index - 1]
      ];
      set({
        groups: {
          ...state.groups,
          [loc.groupId]: { ...group, boxIds: newBoxIds }
        }
      });
    }
  },

  moveBoxDown: (boxId) => {
    const state = get();
    const loc = findBoxLocation(state)(boxId);
    if (!loc) return;

    if (loc.context === 'root') {
      if (loc.index >= state.rootOrder.length - 1) return;
      const newRoot = [...state.rootOrder];
      [newRoot[loc.index], newRoot[loc.index + 1]] = [
        newRoot[loc.index + 1],
        newRoot[loc.index]
      ];
      set({ rootOrder: newRoot });
    } else {
      const group = state.groups[loc.groupId];
      if (loc.index >= group.boxIds.length - 1) return;
      const newBoxIds = [...group.boxIds];
      [newBoxIds[loc.index], newBoxIds[loc.index + 1]] = [
        newBoxIds[loc.index + 1],
        newBoxIds[loc.index]
      ];
      set({
        groups: {
          ...state.groups,
          [loc.groupId]: { ...group, boxIds: newBoxIds }
        }
      });
    }
  },

  toggleBoxSelection: (boxId) =>
    set((state) => ({
      selectedBoxIds: state.selectedBoxIds.includes(boxId)
        ? state.selectedBoxIds.filter((id) => id !== boxId)
        : [...state.selectedBoxIds, boxId]
    })),

  // ---- Group Actions ----
  addGroup: () => {
    const group = newGroupData();
    set((state) => ({
      groups: { ...state.groups, [group.id]: group },
      rootOrder: [...state.rootOrder, { type: 'group', id: group.id }]
    }));
  },

  updateGroupTitle: (groupId, title) =>
    set((state) => ({
      groups: {
        ...state.groups,
        [groupId]: { ...state.groups[groupId], title }
      }
    })),

  deleteGroup: (groupId) => {
    const state = get();
    const group = state.groups[groupId];
    if (!group) return;

    const newBoxes = { ...state.boxes };
    for (const boxId of group.boxIds) {
      delete newBoxes[boxId];
    }

    const newGroups = { ...state.groups };
    delete newGroups[groupId];

    const newRoot = removeItemFromRoot(state.rootOrder, groupId);

    set({
      boxes: newBoxes,
      groups: newGroups,
      rootOrder: newRoot,
      selectedBoxIds: state.selectedBoxIds.filter(
        (id) => !group.boxIds.includes(id)
      )
    });
  },

  moveGroupUp: (groupId) => {
    const state = get();
    const idx = state.rootOrder.findIndex(
      (item) => item.type === 'group' && item.id === groupId
    );
    if (idx <= 0) return;
    const newRoot = [...state.rootOrder];
    [newRoot[idx - 1], newRoot[idx]] = [newRoot[idx], newRoot[idx - 1]];
    set({ rootOrder: newRoot });
  },

  moveGroupDown: (groupId) => {
    const state = get();
    const idx = state.rootOrder.findIndex(
      (item) => item.type === 'group' && item.id === groupId
    );
    if (idx === -1 || idx >= state.rootOrder.length - 1) return;
    const newRoot = [...state.rootOrder];
    [newRoot[idx], newRoot[idx + 1]] = [newRoot[idx + 1], newRoot[idx]];
    set({ rootOrder: newRoot });
  },

  toggleGroupCollapse: (groupId) =>
    set((state) => ({
      groups: {
        ...state.groups,
        [groupId]: {
          ...state.groups[groupId],
          collapsed: !state.groups[groupId].collapsed
        }
      }
    })),

  addBoxToGroup: (groupId) => {
    const box = newBoxData();
    set((state) => ({
      boxes: { ...state.boxes, [box.id]: box },
      groups: {
        ...state.groups,
        [groupId]: {
          ...state.groups[groupId],
          boxIds: [...state.groups[groupId].boxIds, box.id]
        }
      }
    }));
  },

  groupSelectedBoxes: () => {
    const state = get();
    if (state.selectedBoxIds.length === 0) return;

    const group = newGroupData({ title: 'Selected Zone' });

    let newRoot = [...state.rootOrder];
    const groupBoxIds: string[] = [];

    for (const boxId of state.selectedBoxIds) {
      const loc = findBoxLocation(state)(boxId);
      if (loc?.context === 'root') {
        newRoot = removeItemFromRoot(newRoot, boxId);
        groupBoxIds.push(boxId);
      }
    }

    if (groupBoxIds.length === 0) return;

    group.boxIds = groupBoxIds;

    const firstBoxId = groupBoxIds[0];
    const firstIdx = state.rootOrder.findIndex(
      (item) => item.type === 'box' && item.id === firstBoxId
    );
    const insertIdx = firstIdx >= 0 ? firstIdx : newRoot.length;
    newRoot.splice(insertIdx, 0, { type: 'group', id: group.id });

    set({
      rootOrder: newRoot,
      groups: { ...state.groups, [group.id]: group },
      selectedBoxIds: []
    });
  },

  clearSelection: () => set({ selectedBoxIds: [] })
}));
