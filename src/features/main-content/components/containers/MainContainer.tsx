import { MainView } from '../presentational/MainView';
import { HeaderContainer } from './HeaderContainer';

interface MainContainerProps {
  children: React.ReactNode;
}

export function MainContainer({ children }: MainContainerProps) {
  return <MainView header={<HeaderContainer />}>{children}</MainView>;
}
