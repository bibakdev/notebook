// src/features/app-shell/components/containers/AppLayout.tsx
import { SidebarContainer } from '@/features/sidebar/components/containers/SidebarContainer';
import { MainContainer } from '@/features/main-content/components/containers/MainContainer';
import { PromptDeleteConfirmationModal } from '@/features/main-content/components/containers/PromptDeleteConfirmationModal';
import { FileSync } from './FileSync';
import { DatabaseSync } from './DatabaseSync';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DatabaseSync />
      <FileSync />
      <SidebarContainer />
      <MainContainer>{children}</MainContainer>
      <PromptDeleteConfirmationModal />
    </div>
  );
}
