import { useEffect, useState } from 'react';
import { desktopBpLower } from '~/constants';

/**
 * Return true while on desktop width, false otherwise
 */
export function useDesktop(): boolean {
  const [width, setWidth] = useState(window.innerWidth);
  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  return width > desktopBpLower;
}
