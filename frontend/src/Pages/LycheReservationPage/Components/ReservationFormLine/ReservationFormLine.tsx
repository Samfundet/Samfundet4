import classnames from 'classnames';
import type { Children } from '~/types';
import styles from './ReservationFormLine.module.scss';

type ReservationFormLineProps = {
  label: string;
  help_text?: string;
  children: Children;
  underline?: boolean;
};

export function ReservationFormLine({ label, children, help_text, underline }: ReservationFormLineProps) {
  return (
    <div className={classnames(styles.container, underline && styles.underline)}>
      <div className={styles.row}>
        <div className={styles.block}>
          <p className={styles.label}>{label}</p>
        </div>
        <div className={styles.block}>{children}</div>
      </div>
      {help_text && <small className={styles.help_text}>{help_text}</small>}
    </div>
  );
}
