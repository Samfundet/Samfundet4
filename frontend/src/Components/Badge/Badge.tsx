import classnames from 'classnames';
import type { BadgeType } from '~/types';
import styles from './Badge.module.scss';

type BadgeProps = {
  text?: string;
  className?: string;
  type?: BadgeType;
};

export function Badge({ text, className, type = 'default', ...props }: BadgeProps) {
  return <div className={classnames(styles.badge, styles[type], className)} {...props} />;
}
