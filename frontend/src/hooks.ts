import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Make typescript happy.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goatcounter: any;
  }
}

/**
 * Hook to track all url changes.
 * https://tebza.dev/how-to-add-privacy-friendly-analytics-to-nextts
 */
export function useGoatCounter(): void {
  const location = useLocation();

  useEffect(() => {
    if (window.goatcounter === undefined) return;
    const path = location.pathname + location.search + location.hash;
    window.goatcounter.count({
      path: path,
    });
    console.log(`GoatCounter tracked path: ${path}`);
  }, [location]);
}
