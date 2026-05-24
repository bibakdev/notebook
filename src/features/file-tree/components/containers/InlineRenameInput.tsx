'use client';

import { useRef, useEffect } from 'react';
import { useTreeStore } from '../../store/tree-store';

export function InlineRenameInput({ initialValue }: { initialValue: string }) {
  const confirmRenaming = useTreeStore((s) => s.confirmRenaming);
  const cancelRenaming = useTreeStore((s) => s.cancelRenaming);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select(); // انتخاب کل متن برای ویرایش سریع
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmRenaming(inputRef.current?.value || '');
    } else if (e.key === 'Escape') {
      cancelRenaming();
    }
  };

  const handleBlur = () => {
    // blur هم تغییر را اعمال می‌کند (حتی اگر خالی باشد، در store بررسی می‌شود)
    confirmRenaming(inputRef.current?.value || '');
  };

  return (
    <input
      ref={inputRef}
      className="flex-1 border border-border rounded px-1.5 py-0.5 text-sm bg-transparent focus:outline-none focus:border-primary"
      defaultValue={initialValue}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
}
