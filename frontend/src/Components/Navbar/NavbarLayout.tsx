import { Outlet } from 'react-router-dom';
import { ToastManager } from '../ToastManager/ToastManager';
import { Navbar } from './Navbar';
import styles from './Navbar.module.scss';

export function NavbarLayout() {
  return (
    <div className={styles.navbar_layout_outer}>
      <Navbar />
      <div className={styles.navbar_layout_inner}>
        <ToastManager>
          <Outlet />
        </ToastManager>
      </div>
    </div>
  );
}
