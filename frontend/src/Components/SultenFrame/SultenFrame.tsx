import { Children } from '~/types';
import styles from './SultenFrame.module.scss';

type SultenFrameProps = {
  children?: Children;
};

export function SultenFrame({ children }: SultenFrameProps) {
  return (
    <div className={styles.sulten_menu}>
      <div className={styles.sulten_header_border_top}>
        <div className={styles.corner_left_top}></div>
        <div className={styles.middle_top}>
          <div className={styles.dot}> </div>
          <div className={styles.dot}> </div>
        </div>
        <div className={styles.corner_right_top}></div>
      </div>

      <div className={styles.sulten_menu_border}>
        <div className={styles.sulten_menu_inner_border}>{children}</div>
      </div>

      <div className={styles.sulten_header_border_bottom}>
        <div className={styles.corner_left_bottom}></div>
        <div className={styles.middle_bottom}>
          <div className={styles.dot}> </div>
          <div className={styles.dot}> </div>
        </div>
        <div className={styles.corner_right_bottom}></div>
      </div>
    </div>
  );
}
