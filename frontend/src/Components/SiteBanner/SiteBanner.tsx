import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect, useRef } from 'react';
import { getActiveSiteBanner } from '~/api';
import { useScrollY } from '~/hooks';
import { siteBannerKeys } from '~/queryKeys';
import { dbT } from '~/utils';
import styles from './SiteBanner.module.scss';

type Props = {
  hideAfterPx?: number;
};

export function SiteBanner({ hideAfterPx = 1000 }: Props): JSX.Element | null {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollY = useScrollY();
  const isCoveredByNavbar = scrollY > hideAfterPx;

  const { data: visibleBanner } = useQuery({
    queryKey: siteBannerKeys.active(),
    queryFn: getActiveSiteBanner,
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const setOffset = (px: number) => root.style.setProperty('--site-banner-offset', `${px}px`);
    const el = ref.current;

    if (!visibleBanner || !el) {
      setOffset(0);
      return;
    }

    const updateOffset = () => {
      setOffset(el.offsetHeight);
    };

    updateOffset();

    const observer = new ResizeObserver(updateOffset);
    observer.observe(el);
    window.addEventListener('resize', updateOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateOffset);
      setOffset(0);
    };
  }, [visibleBanner]);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('site-banner-covered', isCoveredByNavbar);

    return () => {
      document.documentElement.classList.remove('site-banner-covered');
    };
  }, [isCoveredByNavbar]);

  if (!visibleBanner) return null;

  const content = <span className={styles.text}>{dbT(visibleBanner, 'text')}</span>;

  return (
    <div ref={ref} className={styles.banner} role="status" aria-live="polite">
      <div className={styles.content}>
        {visibleBanner.url ? (
          <a
            className={styles.link}
            href={visibleBanner.url}
            target={visibleBanner.new_tab ? '_blank' : undefined}
            rel={visibleBanner.new_tab ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
