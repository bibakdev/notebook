import type { ReactNode } from 'react';

interface MainViewProps {
  header: ReactNode;
  children: ReactNode;
}

export function MainView({ header, children }: MainViewProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      {header}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </main>
  );
}
