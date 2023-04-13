import classNames from 'classnames';
import { useGlobalContext } from '~/GlobalContextProvider';
import styles from './HamburgerMenu.module.scss';

type HamburgerMenuProps = {
  transparentBackground?: boolean;
  className?: string;
};
export function HamburgerMenu({ transparentBackground, className }: HamburgerMenuProps) {
  const { isMobileNavigation, setIsMobileNavigation } = useGlobalContext();
  return (
    <div
      id={styles.navbar_hamburger}
      onClick={() => setIsMobileNavigation(!isMobileNavigation)}
      className={classNames(
        className,
        isMobileNavigation ? styles.open : styles.closed,
        transparentBackground && styles.transparent_background,
      )}
    >
      <div className={classNames(styles.navbar_hamburger_line, styles.top)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.middle)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.bottom)} />
    </div>
  );
}
