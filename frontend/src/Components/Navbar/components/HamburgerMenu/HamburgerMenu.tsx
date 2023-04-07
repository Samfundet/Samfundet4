import classNames from 'classnames';
import { useGlobalContext } from '~/GlobalContextProvider';
import styles from './HamburgerMenu.module.scss';

type HamburgerMenuProps = {
  className?: string;
};
export function HamburgerMenu({ className }: HamburgerMenuProps) {
  const { isMobileNavigation, setIsMobileNavigation } = useGlobalContext();
  return (
    <div
      id={styles.navbar_hamburger}
      onClick={() => setIsMobileNavigation(!isMobileNavigation)}
      className={classNames(className, isMobileNavigation ? styles.open : styles.closed)}
    >
      <div className={classNames(styles.navbar_hamburger_line, styles.top)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.middle)} />
      <div className={classNames(styles.navbar_hamburger_line, styles.bottom)} />
    </div>
  );
}
