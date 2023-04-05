import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import styles from './Navbar.module.scss';

export function NavbarLayout() {
  return (
    <>
      <Navbar />
      <div className={styles.navbar_outlet}>
        <Outlet />
      </div>
    </>
  );
}
