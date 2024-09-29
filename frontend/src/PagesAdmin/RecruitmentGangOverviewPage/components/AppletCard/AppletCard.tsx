import { Icon } from '@iconify/react';
import { Link } from '~/Components';
import styles from './AppletCard.module.scss';

type Status = 'success' | 'warning' | 'error';

type Props = {
  title: string;
  description?: string;
  url: string;
  status?: Status;
  disabled?: boolean;
};

export function AppletCard({ title, description, url, disabled }: Props) {
  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <Link url={url} className={styles.card}>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          {description && <div className={styles.description}>{description}</div>}
          <Icon icon="ion:arrow-forward-outline" width={16} className={styles.arrow_icon} />
        </div>
      </Link>
    </div>
  );
}
