import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';

interface HeaderViewProps {
  onMenuToggle: () => void;
  children?: ReactNode;
}

export function HeaderView({ onMenuToggle, children }: HeaderViewProps) {
  return (
    <header className="flex items-center justify-between border-b border-border p-3 px-4">
      <button
        onClick={onMenuToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:border-primary hover:text-primary hover:bg-primary/10 dark:hover:border-primary dark:hover:text-primary dark:hover:bg-primary/10 lg:hidden transition-colors"
        aria-label="منو"
      >
        <Menu size={20} />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
}
