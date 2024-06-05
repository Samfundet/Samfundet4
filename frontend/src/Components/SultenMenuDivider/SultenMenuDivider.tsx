import styles from './SultenMenuDivider.module.scss';

type SultenMenuDividerProps = {
  title: string;
};

export function SultenMenuDivider({ title }: SultenMenuDividerProps) {
  return (
    <div className={styles.sulten_menu_divider}>
      <div className={styles.sulten_menu_divider_left}></div>
      <div className={styles.sulten_menu_divider_title}> {title}</div>
      <div className={styles.sulten_menu_divider_right}></div>
    </div>
  );
}
