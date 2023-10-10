import { Children } from '~/types';
import styles from './LycheFrame.module.scss';

type LycheFrameProps = {
  children?: Children;
};

export function LycheFrame({ children }: LycheFrameProps) {
  return (
    <div className={styles.lyche_menu}>
      <div className={styles.lyche_header_border_top}>
        <div className={styles.corner_left}></div>
        <div className={styles.middle}>
          <div className={styles.dot}> </div>
          <div className={styles.dot}> </div>
        </div>
        <div className={styles.corner_right}></div>
      </div>

      <div className={styles.lyche_menu_border}>
        <div className={styles.lyche_menu_inner_border}>{children}</div>
      </div>

      <div className={styles.lyche_header_border_bottom}>
        <div className={styles.corner_left}></div>
        <div className={styles.middle}>
          <div className={styles.dot}> </div>
          <div className={styles.dot}> </div>
        </div>
        <div className={styles.corner_right}></div>
      </div>
    </div>
  );
}
