import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { Button } from '../Button';
import styles from './NotificationBadge.module.scss';

type NotificationBadgeProps = {
  number?: number;
  className?: string;
  onClick?: () => void;
};

export function NotificationBadge({ number, className, onClick }: NotificationBadgeProps) {
  return (
    <Button className={classNames(className, styles.wrapper)} theme="pure" onClick={onClick}>
      <Icon className={styles.icon} height={21} icon="clarity:notification-line" />
      {number !== undefined && <span className={styles.badge}>{number}</span>}
    </Button>
  );
}
