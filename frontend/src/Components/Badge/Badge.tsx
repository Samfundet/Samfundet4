import classnames from 'classnames';
import type { HTMLAttributes } from 'react';
import styles from './Badge.module.scss';

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  className?: string;
};

export function Badge({ text, className, ...props }: BadgeProps) {
  return (
    <div className={classnames(styles.badge, className)} {...props}>
      {text}
    </div>
  );
}
