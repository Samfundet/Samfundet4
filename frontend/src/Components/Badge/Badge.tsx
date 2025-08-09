import classnames from 'classnames';
import type { HTMLAttributes } from 'react';
import styles from './Badge.module.scss';

export type BadgeType = 'information' | 'success' | 'warning' | 'error';

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  className?: string;
  type?: BadgeType;
  animated?: boolean;
};

export function Badge({ text, className, type, animated = false, ...props }: BadgeProps) {
  return (
    <div className={classnames(styles.badge, type && styles[type], animated && styles.animated, className)} {...props}>
      {text}
    </div>
  );
}
