import { THEME } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';

export function useIsDarkTheme(): boolean {
  const { theme } = useGlobalContext();
  return theme === THEME.DARK;
}
