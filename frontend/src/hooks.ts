import { i18n } from 'i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTextItem } from '~/api';
import { desktopBpLower, mobileBpUpper } from './constants';
import { TextItemDto } from './dto';

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

// ------------------------------

// Return true while on desktop width, false otherwise
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

// ------------------------------

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

// ------------------------------

// Hook that returns the correct translation for given key
export function useTextItem(key: string, i18n: i18n): string | undefined {
  const [textItem, setTextItem] = useState<TextItemDto>();
  const isNorwegian = i18n.language === 'nb';
  useEffect(() => {
    getTextItem(key).then((data) => {
      setTextItem(data);
    });
  }, [key, i18n]);

  return isNorwegian ? textItem?.text_nb : textItem?.text_en;
}

// ------------------------------

// Scroll detection
export function useScrollY(): number {
  const [scrollY, setScrollY] = useState(window.scrollY);
  useEffect(() => {
    function handleNavigation(e: Event) {
      const window = e.currentTarget;
      if (window != null) {
        setScrollY(window.scrollY);
      }
    }
    window.addEventListener('scroll', handleNavigation);
    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, []);
  return scrollY;
}
