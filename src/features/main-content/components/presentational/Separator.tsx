'use client';

import { cn } from '@/shared/lib/cn';

interface SeparatorProps {
  prevBoxId: string;
  nextBoxId: string;
  onAddClick?: () => void;
}

export function Separator({
  prevBoxId,
  nextBoxId,
  onAddClick
}: SeparatorProps) {
  return (
    <div
      className={cn(
        'separator flex items-center justify-center h-10 my-3 relative w-full opacity-20 transition-opacity duration-200',
        'hover:opacity-100'
      )}
    >
      <div className="flex-grow border-t border-dashed border-muted-foreground/30" />
      <div className="bg-card px-2 py-0.5 rounded-md border border-border shadow-sm z-10 flex-shrink-0">
        <button
          className="text-xs font-mono text-muted-foreground bg-transparent border-0 px-2 py-1 rounded hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="افزودن کارت جدید"
          onClick={onAddClick}
        >
          + Editor
        </button>
      </div>
      <div className="flex-grow border-t border-dashed border-muted-foreground/30" />
    </div>
  );
}
