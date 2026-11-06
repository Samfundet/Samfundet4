import { useEffect } from 'react';

export function useTitle(title: string, suffix = 'Samfundet'): void {
  const initialTitle = document.title;
  // biome-ignore lint/correctness/useExhaustiveDependencies: initialTitle does not need to be in deplist
  useEffect(() => {
    const delimitedSuffix = suffix ? ` - ${suffix}` : '';
    document.title = title ? title + delimitedSuffix : suffix;

    return () => {
      document.title = initialTitle;
    };
  }, [title, suffix]);
}
