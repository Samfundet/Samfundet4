import styles from './LycheMenuDivider.module.scss';

export function LycheMenuDivider() {
  return (
    <div className={styles.lyche_menu_divider}>
      <div className={styles.lyche_menu_divider_left}></div>
      <div className={styles.lyche_menu_divider_title}>Menu category</div>
      <div className={styles.lyche_menu_divider_right}></div>
    </div>
  );
}
