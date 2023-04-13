import { Outlet } from 'react-router-dom';
import { Navbar } from '~/Components/Navbar';
import styles from './SamfOutlet.module.scss';

export function SamfOutlet() {
  return (
    <>
      <Navbar />
      <div className={styles.navbar_outlet}>
        <Outlet />
      </div>
    </>
  );
}
