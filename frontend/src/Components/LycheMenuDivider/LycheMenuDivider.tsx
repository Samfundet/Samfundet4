import styles from './LycheMenuDivider.module.scss';

interface MenuCategory {
  title: string;
}

export function LycheMenuDivider({ title }: MenuCategory) {
  return (
    <div className={styles.lyche_menu_divider}>
      <div className={styles.lyche_menu_divider_left}></div>
      <div className={styles.lyche_menu_divider_title}>{title}</div>
      <div className={styles.lyche_menu_divider_right}></div>
    </div>
  );
}
