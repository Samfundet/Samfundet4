import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import styles from './FormBox.module.scss';

type Props = {
  label?: string;
} & HTMLAttributes<HTMLDivElement>;

export function FormBox({ className, label, children, ...props }: Props) {
  return (
    <div>
      {label && <span className={styles.box_label}>{label}</span>}
      <div className={classNames(styles.box, className)} {...props}>
        {children}
      </div>
    </div>
  );
}
