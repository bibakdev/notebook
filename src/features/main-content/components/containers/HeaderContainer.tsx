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
  const selectedBoxIds = usePromptStore((s) => s.selectedBoxIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeLabel = mounted
    ? theme === 'dark'
      ? '🌙 Dark'
      : '☀️ Light'
    : '🌙 Dark';

  const hasSelected = selectedBoxIds.length > 0;

  return (
    <HeaderView onMenuToggle={toggleSidebar}>
      <button
        onClick={addGroup}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10"
      >
        ＋ New Zone
      </button>
      <button
        onClick={groupSelectedBoxes}
        className={cn(
          'rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10',
          !hasSelected && 'hidden'
        )}
        style={hasSelected ? { display: 'inline-block' } : { display: 'none' }}
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
