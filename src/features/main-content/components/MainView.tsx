import type { ReactNode } from 'react';
import { HeaderContainer } from './HeaderContainer';

interface MainViewProps {
  children: ReactNode;
}

export function MainView({ children }: MainViewProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      <HeaderContainer />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </main>
  );
}
