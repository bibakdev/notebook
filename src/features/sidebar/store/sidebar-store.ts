import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  width: number;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setWidth: (width: number) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  width: 280,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setWidth: (width) => set({ width })
}));
