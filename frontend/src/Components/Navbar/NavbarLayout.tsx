import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import styles from './Navbar.module.scss';

export function NavbarLayout() {
  return (
    <div className={styles.navbar_layout_outer}>
      <Navbar />
      <div className={styles.navbar_layout_inner}>
        <Outlet />
      </div>
    </div>
  );
}
