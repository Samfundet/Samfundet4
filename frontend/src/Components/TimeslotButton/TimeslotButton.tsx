import classNames from 'classnames';
import type React from 'react';
import styles from './TimeslotButton.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  readOnly?: boolean;
}

export function TimeslotButton({ active, children, readOnly, ...props }: Props) {
  return (
    <button
      className={classNames(styles.timeslot, {
        [styles.timeslot_active]: active,
        [styles.timeslot_read_only]: readOnly,
      })}
      type="button"
      {...props}
    >
      <div className={styles.dot} />
      <span>{children}</span>
    </button>
  );
}
