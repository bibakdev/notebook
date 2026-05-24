import { cn } from '@/shared/lib/cn';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">📓</span>
            <span className="text-lg font-semibold text-foreground">
              Notebook
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted lg:hidden"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Placeholder content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground">محتوای سایدبار...</p>
        </div>
      </aside>
    </>
  );
}
