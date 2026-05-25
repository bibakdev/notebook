// src/features/main-content/components/containers/HeaderContainer.tsx
'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useSidebarStore } from '@/features/sidebar/store/sidebar-store';
import { usePromptStore } from '@/features/main-content/store/prompt-store';
import { HeaderView } from '../presentational/HeaderView';
import { cn } from '@/shared/lib/cn';

export function HeaderContainer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const toggleSidebar = useSidebarStore((s) => s.toggle);
  const addGroup = usePromptStore((s) => s.addGroup);
  const groupSelectedBoxes = usePromptStore((s) => s.groupSelectedBoxes);
  const addBox = usePromptStore((s) => s.addBox);
  const currentFileId = usePromptStore((s) => s.currentFileId);
  const selectedCount = usePromptStore((s) => {
    const fileId = s.currentFileId;
    return fileId ? (s.filesData[fileId]?.selectedBoxIds.length ?? 0) : 0;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeLabel = mounted
    ? theme === 'dark'
      ? '🌙 Dark'
      : '☀️ Light'
    : '🌙 Dark';

  const hasSelected = selectedCount > 0;
  const fileSelected = !!currentFileId;

  return (
    <HeaderView onMenuToggle={toggleSidebar}>
      <button
        onClick={() => addBox()}
        disabled={!fileSelected}
        className={cn(
          'rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10',
          !fileSelected && 'opacity-40 cursor-not-allowed'
        )}
        title={fileSelected ? '' : 'ابتدا یک فایل انتخاب کنید'}
      >
        ＋ Card
      </button>
      <button
        onClick={addGroup}
        disabled={!fileSelected}
        className={cn(
          'rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10',
          !fileSelected && 'opacity-40 cursor-not-allowed'
        )}
        title={fileSelected ? '' : 'ابتدا یک فایل انتخاب کنید'}
      >
        ＋ New Group
      </button>
      <button
        onClick={groupSelectedBoxes}
        disabled={!hasSelected}
        className={cn(
          'rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10',
          !hasSelected && 'opacity-40 cursor-not-allowed'
        )}
      >
        ⚡ Group Selected
      </button>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10"
        aria-label="تغییر تم"
      >
        {themeLabel}
      </button>
    </HeaderView>
  );
}
