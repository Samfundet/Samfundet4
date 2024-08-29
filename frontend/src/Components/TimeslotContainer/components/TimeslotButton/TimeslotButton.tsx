import classNames from 'classnames';
import styles from './TimeslotButton.module.scss';
import React, { ReactNode } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  disabled: boolean;
  onlyOneValid?: boolean;
  children?: ReactNode;
  showDot?: boolean;
}

export function TimeslotButton({ active, disabled, onlyOneValid, children, showDot = true, ...props }: Props) {
  return (
    <button
      className={classNames(styles.timeslot, {
        [styles.timeslot_active]: active,
        [styles.timeslot_disabled]: disabled,
        [styles.timeslot_only_one_valid]: onlyOneValid,
      })}
      type="button"
      {...props}
    >
      {showDot && <div className={styles.dot}></div>}
      <span>{children}</span>
    </button>
  );
}
