'use client';

import { useSidebarStore } from '../../store/sidebar-store';
import { SidebarView } from '../presentational/SidebarView';
import { SidebarHeader } from '../presentational/SidebarHeader';
import { SidebarActionButtons } from './SidebarActionButtons';
import { SidebarTree } from '../presentational/SidebarTree';
import { TreeView } from '@/features/file-tree/components/containers/TreeView';
import { DeleteConfirmationModal } from '@/features/file-tree/components/containers/DeleteConfirmationModal';

export function SidebarContainer() {
  const { isOpen, width, toggle, setOpen, setWidth } = useSidebarStore();

  return (
    <>
      <SidebarView
        isOpen={isOpen}
        width={width}
        onClose={() => setOpen(false)}
        onResize={(newWidth) => setWidth(newWidth)}
        header={<SidebarHeader onClose={() => setOpen(false)} />}
        actionButtons={<SidebarActionButtons />}
        tree={
          <SidebarTree>
            <TreeView />
          </SidebarTree>
        }
      />
      <DeleteConfirmationModal />
    </>
  );
}
