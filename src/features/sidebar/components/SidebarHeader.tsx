import { X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 pb-4 mb-2 shrink-0">
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
  );
}
