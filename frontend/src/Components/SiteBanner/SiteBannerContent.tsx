import { Icon } from '@iconify/react';
import styles from './SiteBanner.module.scss';

type SiteBannerContentProps = {
  text: string;
  url?: string | null;
  newTab?: boolean;
};

export function SiteBannerContent({ text, url, newTab }: SiteBannerContentProps) {
  const content = <span className={styles.text}>{text}</span>;

  return (
    <div className={styles.surface}>
      <div className={styles.content}>
        {url ? (
          <a
            className={styles.link}
            href={url}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
          >
            {content}
            {newTab && <Icon icon="lucide:external-link" className={styles.external_icon} aria-hidden="true" />}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
