import { SidebarContainer } from '@/features/sidebar/components/containers/SidebarContainer';
import { MainContainer } from '@/features/main-content/components/containers/MainContainer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarContainer />
      <MainContainer>{children}</MainContainer>
    </div>
  );
}
