import { useEffect } from 'react';

export function UseTitle(title: string) {
  useEffect(() => {
    document.title = `Samfundet | ${title}`;
  }, [title]);
}
