import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { Link } from '~/Components';
import styles from './AppletCard.module.scss';

type Props = {
  title: string;
  description?: string;
  url: string;
  disabled?: boolean;
};

export function AppletCard({ title, description, url, disabled }: Props) {
  return (
    <Link url={url} className={classNames(styles.card, { [styles.disabled]: disabled })}>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {description && <div className={styles.description}>{description}</div>}
        <Icon icon="ion:arrow-forward-outline" width={16} className={styles.arrow_icon} />
      </div>
    </Link>
  );
}
