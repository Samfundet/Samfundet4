import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop(): void {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: working as intended: we want to scroll up when path changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
