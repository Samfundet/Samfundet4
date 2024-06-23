import classNames from 'classnames';
import styles from './TimeslotButton.module.scss';
import type React from 'react';
import type { ReactNode } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children?: ReactNode;
  showDot?: boolean;
}

export function TimeslotButton({ active, children, showDot = true, ...props }: Props) {
  return (
    <button
      className={classNames(styles.timeslot, {
        [styles.timeslot_active]: active,
      })}
      type="button"
      {...props}
    >
      {showDot && <div className={styles.dot}></div>}
      <span>{children}</span>
    </button>
  );
}
