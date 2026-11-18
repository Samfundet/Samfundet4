import { THEME } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';

export function useIsLightTheme(): boolean {
  const { theme } = useGlobalContext();
  return theme === THEME.LIGHT;
}
