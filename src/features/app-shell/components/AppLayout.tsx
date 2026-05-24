import { SidebarContainer } from '@/features/sidebar/components/SidebarContainer';
import { MainContainer } from '@/features/main-content/components/MainContainer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarContainer />
      <MainContainer>{children}</MainContainer>
    </div>
  );
}
