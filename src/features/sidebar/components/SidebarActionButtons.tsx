import { FilePlus, FolderPlus } from 'lucide-react';

interface SidebarActionButtonsProps {
  onFileClick?: () => void;
  onFolderClick?: () => void;
}

export function SidebarActionButtons({
  onFileClick,
  onFolderClick
}: SidebarActionButtonsProps) {
  return (
    <div className="flex justify-start gap-2 px-4 pb-4 mb-4 shrink-0">
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
  );
}
