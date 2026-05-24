'use client';

import { useCallback } from 'react';
import { cn } from '@/shared/lib/cn';
import { Resizable, type ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { SidebarHeader } from './SidebarHeader';
import { SidebarActionButtons } from './SidebarActionButtons';
import { SidebarTree } from './SidebarTree';

interface SidebarViewProps {
  isOpen: boolean;
  width: number;
  onClose: () => void;
  onFileClick?: () => void;
  onFolderClick?: () => void;
  onResize: (width: number) => void;
}

export function SidebarView({
  isOpen,
  width,
  onClose,
  onFileClick,
  onFolderClick,
  onResize
}: SidebarViewProps) {
  const handleResize = useCallback(
    (_event: React.SyntheticEvent, data: ResizeCallbackData) => {
      onResize(data.size.width);
    },
    [onResize]
  );

  const sidebarPanel = (
    <aside
      className={cn(
        'flex h-full flex-col border-l border-border bg-card text-card-foreground',
        'lg:relative lg:translate-x-0 lg:transition-none',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{ width: `${width}px` }}
    >
      <SidebarHeader onClose={onClose} />
      <SidebarActionButtons
        onFileClick={onFileClick}
        onFolderClick={onFolderClick}
      />
      <SidebarTree />
    </aside>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 h-full transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          'lg:hidden'
        )}
      >
        {sidebarPanel}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block h-Screen">
        <Resizable
          className="sidebar-resizable h-full"
          width={width}
          height={0}
          axis="x"
          resizeHandles={['w']}
          minConstraints={[200, 0]}
          maxConstraints={[500, 0]}
          onResize={handleResize}
          handle={
            <div className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/20 transition-colors z-10" />
          }
        >
          {sidebarPanel}
        </Resizable>
      </div>
    </>
  );
}
