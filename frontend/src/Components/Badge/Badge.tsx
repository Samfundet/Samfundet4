import classnames from 'classnames';
import type { HTMLAttributes } from 'react';
import styles from './Badge.module.scss';

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  className?: string;
  type?: 'information' | 'success' | 'warning' | 'error';
};

export function Badge({ text, className, type, ...props }: BadgeProps) {
  return (
    <div className={classnames(styles.badge, type && styles[type], className)} {...props}>
      {text}
    </div>
  );
}
