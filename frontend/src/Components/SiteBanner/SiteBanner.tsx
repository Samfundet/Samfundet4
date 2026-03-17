import classNames from 'classnames';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BACKEND_DOMAIN } from '~/constants/constants';
import { useScrollY } from '~/hooks';
import styles from './SiteBanner.module.scss';

export type SiteBannerDto = {
  id: string;
  version: number;
  text_nb: string;
  text_en: string;
  url: string | null;
  new_tab?: boolean;
  is_active: boolean;
  start_at: string | null;
  end_at: string | null;
};

type Props = {
  hideAfterPx?: number;
};

function pickFirstBanner(list: SiteBannerDto[] | null): SiteBannerDto | null {
  if (!list || list.length === 0) return null;
  return list[0];
}

export function SiteBanner({ hideAfterPx = 1000 }: Props): JSX.Element | null {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollY = useScrollY();
  const isHiddenByScroll = scrollY > hideAfterPx;

  const [banners, setBanners] = useState<SiteBannerDto[] | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    const url = `${BACKEND_DOMAIN}/api/site-banners/active/`;

    fetch(url, { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load banners: ${r.status}`);
        return (await r.json()) as SiteBannerDto[];
      })
      .then(setBanners)
      .catch((e) => {
        if (e?.name !== 'AbortError') setBanners([]);
      });

    return () => ac.abort();
  }, []);

  const visibleBanner = useMemo(() => pickFirstBanner(banners), [banners]);

  const isNorwegian = useMemo(() => {
    const lang = (i18n.resolvedLanguage ?? i18n.language ?? '').toLowerCase();
    return lang.startsWith('nb') || lang.startsWith('nn') || lang.startsWith('no');
  }, [i18n.language, i18n.resolvedLanguage]);

  const text = useMemo(() => {
    if (!visibleBanner) return '';
    return isNorwegian ? visibleBanner.text_nb : visibleBanner.text_en;
  }, [visibleBanner, isNorwegian]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const setOffset = (px: number) => root.style.setProperty('--site-banner-offset', `${px}px`);
    const el = ref.current;

    if (!visibleBanner || !el || isHiddenByScroll) {
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
  }, [visibleBanner, isHiddenByScroll]);

  if (!visibleBanner) return null;

  const content = <span className={styles.text}>{text}</span>;

  return (
    <div
      ref={ref}
      className={classNames(styles.banner, isHiddenByScroll && styles.hidden)}
      role="status"
      aria-live="polite"
    >
      <div className={styles.content}>
        {visibleBanner.url ? (
          <a
            className={styles.link}
            href={visibleBanner.url}
            target={visibleBanner.new_tab ? '_blank' : undefined}
            rel={visibleBanner.new_tab ? 'noreferrer' : undefined}
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
