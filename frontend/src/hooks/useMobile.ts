import { useEffect, useState } from 'react';
import { mobileBpUpper } from '~/constants';

/**
 * @returns true if mobile, false otherwise
 */
export function useMobile(): boolean {
  const [width, setWidth] = useState(window.innerWidth);
  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  return width < mobileBpUpper;
}
