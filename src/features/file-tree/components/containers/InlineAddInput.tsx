'use client';

import { useRef, useEffect } from 'react';
import { useTreeStore } from '../../store/tree-store';
import { FilePlus, FolderPlus } from 'lucide-react';

export function InlineAddInput() {
  const addingType = useTreeStore((s) => s.addingType);
  const cancelAdding = useTreeStore((s) => s.cancelAdding);
  const confirmAdding = useTreeStore((s) => s.confirmAdding);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmAdding(inputRef.current?.value || '');
    } else if (e.key === 'Escape') {
      cancelAdding();
    }
  };

  const handleBlur = () => {
    confirmAdding(inputRef.current?.value || '');
  };

  return (
    <div className="flex items-center gap-2 py-1 px-2 text-sm">
      {addingType === 'file' ? (
        <FilePlus size={14} className="text-muted-foreground" />
      ) : (
        <FolderPlus size={14} className="text-muted-foreground" />
      )}
      <input
        ref={inputRef}
        className="flex-1 border border-border rounded px-1.5 py-0.5 text-sm bg-transparent focus:outline-none focus:border-primary"
        placeholder={addingType === 'file' ? 'نام فایل...' : 'نام پوشه...'}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </div>
  );
}
