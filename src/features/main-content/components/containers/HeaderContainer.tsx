'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useSidebarStore } from '@/features/sidebar/store/sidebar-store';
import { HeaderView } from '../presentational/HeaderView';

export function HeaderContainer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const toggleSidebar = useSidebarStore((s) => s.toggle);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeLabel = mounted
    ? theme === 'dark'
      ? '🌙 Dark'
      : '☀️ Light'
    : '🌙 Dark';

  return (
    <HeaderView onMenuToggle={toggleSidebar}>
      <button className="rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10 dark:hover:border-primary dark:hover:text-primary dark:hover:bg-primary/10">
        ＋ New Zone
      </button>
      <button className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10 dark:hover:border-primary dark:hover:text-primary dark:hover:bg-primary/10">
        ⚡ Group Selected
      </button>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-mono text-foreground backdrop-blur transition hover:border-primary hover:text-primary hover:bg-primary/10 dark:hover:border-primary dark:hover:text-primary dark:hover:bg-primary/10"
        aria-label="تغییر تم"
      >
        {themeLabel}
      </button>
    </HeaderView>
  );
}
