import { MainView } from './MainView';

interface MainContainerProps {
  children: React.ReactNode;
}

export function MainContainer({ children }: MainContainerProps) {
  // This container can hold future state/logic for the main area
  return <MainView>{children}</MainView>;
}
