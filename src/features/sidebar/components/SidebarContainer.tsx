'use client';

import { useSidebarStore } from '@/features/sidebar/store/sidebar-store';
import { SidebarView } from './SidebarView';

export function SidebarContainer() {
  const { isOpen, toggle, setOpen } = useSidebarStore();

  const handleFileClick = () => {
    // Later: dispatch action to add file in tree store
    console.log('Add file clicked');
  };

  const handleFolderClick = () => {
    // Later: dispatch action to add folder in tree store
    console.log('Add folder clicked');
  };

  return (
    <SidebarView
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      onFileClick={handleFileClick}
      onFolderClick={handleFolderClick}
    />
  );
}
