import classNames from 'classnames';
import styles from './TimeslotButton.module.scss';
import { ReactNode } from 'react';

type Props = {
  onClick?: () => void;
  active: boolean;
  children?: ReactNode;
  showDot?: boolean;
};

export function TimeslotButton({ active, onClick, children, showDot = true }: Props) {
  return (
    <button
      className={classNames(styles.timeslot, {
        [styles.timeslot_active]: active,
      })}
      onClick={() => onClick?.()}
      type="button"
    >
      {showDot && <div className={styles.dot}></div>}
      <span>{children}</span>
    </button>
  );
}
