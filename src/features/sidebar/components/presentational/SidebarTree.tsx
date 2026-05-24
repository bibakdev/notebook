import type { ReactNode } from 'react';

interface SidebarTreeProps {
  children: ReactNode;
}

export function SidebarTree({ children }: SidebarTreeProps) {
  return <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>;
}
