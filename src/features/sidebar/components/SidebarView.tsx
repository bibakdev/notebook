import { cn } from '@/shared/lib/cn';
import { X, FilePlus, FolderPlus } from 'lucide-react';
import { TreeView } from '@/features/file-tree/components/TreeView';

interface SidebarViewProps {
  isOpen: boolean;
  onClose: () => void;
  onFileClick?: () => void;
  onFolderClick?: () => void;
}

export function SidebarView({
  isOpen,
  onClose,
  onFileClick,
  onFolderClick
}: SidebarViewProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col border-l border-border bg-card text-card-foreground transition-transform duration-300',
          'lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header: Logo */}
        <div className="flex items-center justify-between p-4 pb-4 mb-2">
          <div className="font-mono text-2xl font-bold text-primary">
            <span className="rounded bg-primary px-1.5 py-0.5 text-sm text-primary-foreground">
              JS
            </span>
            DevFlow
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="بستن منو"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex justify-start gap-2 px-4 pb-4 mb-4">
          <button
            className="rounded border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary transition"
            title="افزودن فایل"
            onClick={onFileClick}
          >
            <FilePlus size={16} />
          </button>
          <button
            className="rounded border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary transition"
            title="افزودن پوشه"
            onClick={onFolderClick}
          >
            <FolderPlus size={16} />
          </button>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TreeView />
        </div>
      </aside>
    </>
  );
}
