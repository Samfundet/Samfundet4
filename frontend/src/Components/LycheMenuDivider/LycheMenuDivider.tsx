import styles from './LycheMenuDivider.module.scss';

type LycheMenuDividerProps = {
  title: string;
};

export function LycheMenuDivider({ title }: LycheMenuDividerProps) {
  return (
    <div className={styles.lyche_menu_divider}>
      <div className={styles.lyche_menu_divider_left}></div>
      <div className={styles.lyche_menu_divider_title}> {title}</div>
      <div className={styles.lyche_menu_divider_right}></div>
    </div>
  );
}
