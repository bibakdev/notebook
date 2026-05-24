'use client';

import { useSidebarStore } from '@/features/sidebar/store/sidebar-store';
import { SidebarView } from './SidebarView';

export function SidebarContainer() {
  const { isOpen, width, toggle, setOpen, setWidth } = useSidebarStore();

  const handleFileClick = () => {
    console.log('Add file clicked');
  };

  const handleFolderClick = () => {
    console.log('Add folder clicked');
  };

  return (
    <SidebarView
      isOpen={isOpen}
      width={width}
      onClose={() => setOpen(false)}
      onFileClick={handleFileClick}
      onFolderClick={handleFolderClick}
      onResize={(newWidth) => setWidth(newWidth)}
    />
  );
}
